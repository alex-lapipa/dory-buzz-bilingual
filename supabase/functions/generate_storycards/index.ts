import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GENERATION_PROMPT = `You are a bilingual educational content designer for Mochi the Garden Bee, a children's learning platform about bees, pollination, gardens, and nature.

Generate a complete storycard module with the following JSON structure. All content must be in BOTH English and Spanish.

The storycard should:
- Be age-appropriate (ages 4-10)
- Follow microlearning principles (45-120 second segments)
- Include 3-4 panels per storycard
- Feature Mochi as the narrator/guide
- Teach ONE clear concept per storycard
- Include vocabulary words (1-2 per panel)
- End with a quiz question

Return ONLY valid JSON with this exact structure:
{
  "storycard": {
    "title_en": "string",
    "title_es": "string",
    "slug": "kebab-case-string",
    "mochi_says_en": "Mochi's intro message in English",
    "mochi_says_es": "Mochi's intro message in Spanish",
    "target_words": ["english_word1", "english_word2"],
    "target_words_es": ["spanish_word1", "spanish_word2"],
    "learning_objective": "One sentence describing what the child will learn",
    "duration_seconds": 90
  },
  "panels": [
    {
      "panel_number": 1,
      "scene_en": "Description of the scene in English",
      "scene_es": "Description of the scene in Spanish",
      "narration_en": "What Mochi says in English (2-3 sentences)",
      "narration_es": "What Mochi says in Spanish (2-3 sentences)",
      "target_word_en": "vocabulary word",
      "target_word_es": "palabra de vocabulario",
      "interaction_type": "tap|drag|speak|none",
      "interaction_prompt_en": "Tap the flower to see what happens!",
      "interaction_prompt_es": "¡Toca la flor para ver qué pasa!",
      "mochi_action": "flying|dancing|pointing|waving|thinking",
      "image_prompt": "Detailed prompt for generating the panel illustration",
      "display_duration_seconds": 8
    }
  ],
  "quiz": {
    "question_en": "Quiz question in English",
    "question_es": "Quiz question in Spanish",
    "question_type": "multiple_choice",
    "options_en": ["Option A", "Option B", "Option C"],
    "options_es": ["Opción A", "Opción B", "Opción C"],
    "correct_answer": "Option A",
    "correct_answer_es": "Opción A",
    "explanation_en": "Why this is correct",
    "explanation_es": "Por qué esto es correcto",
    "difficulty": 1,
    "points": 10
  }
}`;

interface GenerationRequest {
  topic: string;
  content_pillar: string; // "bees" | "garden" | "ecology" | "language"
  age_min?: number;
  age_max?: number;
  difficulty?: number;
  module_id?: string;
  count?: number; // how many storycards to generate (default 1)
}

/* ── Multi-model cascade (same as mochi_rag_v2) ── */
async function generateWithCascade(prompt: string, userMessage: string): Promise<string> {
  const providers = [
    {
      name: "google",
      envKey: "GOOGLE_AI_STUDIO",
      call: (key: string) =>
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: prompt }] },
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json" },
          }),
        }),
      extract: (j: any) => j.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
    },
    {
      name: "openai",
      envKey: "OPENAI_API_KEY",
      call: (key: string) =>
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4.1-2025-04-14",
            messages: [{ role: "system", content: prompt }, { role: "user", content: userMessage }],
            max_tokens: 8192,
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        }),
      extract: (j: any) => j.choices?.[0]?.message?.content ?? "",
    },
  ];

  for (const provider of providers) {
    const apiKey = Deno.env.get(provider.envKey);
    if (!apiKey) continue;

    try {
      console.log(`Storycard gen: trying ${provider.name}...`);
      const res = await provider.call(apiKey);
      if (!res.ok) {
        console.error(`${provider.name} ${res.status}: ${await res.text()}`);
        continue;
      }
      const json = await res.json();
      const text = provider.extract(json);
      if (text) return text;
    } catch (err) {
      console.error(`${provider.name} error:`, err);
      continue;
    }
  }

  throw new Error("All AI providers failed for storycard generation");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body: GenerationRequest = await req.json();

    const {
      topic,
      content_pillar = "bees",
      age_min = 4,
      age_max = 10,
      difficulty = 1,
      module_id,
      count = 1,
    } = body;

    if (!topic?.trim()) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (let i = 0; i < Math.min(count, 5); i++) {
      const userMessage = `Generate a storycard about: "${topic}" (content pillar: ${content_pillar}, ages ${age_min}-${age_max}, difficulty: ${difficulty}/5).${
        i > 0 ? ` This is variation ${i + 1}, make it distinct from previous ones.` : ""
      }`;

      console.log(`Generating storycard ${i + 1}/${count}: ${topic}`);

      const rawJson = await generateWithCascade(GENERATION_PROMPT, userMessage);

      // Parse and validate the JSON — handle truncation from token limits
      let parsed;
      try {
        const cleaned = rawJson.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        // Attempt to repair truncated JSON by closing open strings/arrays/objects
        try {
          let repaired = rawJson.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          // Remove trailing incomplete key-value pairs after last comma
          repaired = repaired.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*$/, "");
          // Count open brackets and close them
          const opens = (repaired.match(/[\[{]/g) || []).length;
          const closes = (repaired.match(/[\]}]/g) || []).length;
          for (let b = 0; b < opens - closes; b++) {
            // Determine what to close based on last unclosed opener
            const lastOpen = repaired.lastIndexOf("[") > repaired.lastIndexOf("{") ? "]" : "}";
            repaired += lastOpen;
          }
          parsed = JSON.parse(repaired);
          console.log("Repaired truncated JSON successfully");
        } catch (repairErr) {
          console.error("JSON parse error (unrecoverable):", parseErr, "Raw:", rawJson.slice(0, 500));
          continue;
        }
      }

      const { storycard, panels, quiz } = parsed;
      if (!storycard || !panels?.length || !quiz) {
        console.error("Incomplete storycard structure:", Object.keys(parsed));
        continue;
      }

      // ── Insert storycard ──
      const { data: insertedCard, error: cardErr } = await supabase
        .from("storycards")
        .insert({
          title_en: storycard.title_en,
          title_es: storycard.title_es,
          slug: storycard.slug + (i > 0 ? `-${i + 1}` : ""),
          mochi_says_en: storycard.mochi_says_en,
          mochi_says_es: storycard.mochi_says_es,
          target_words: storycard.target_words || [],
          target_words_es: storycard.target_words_es || [],
          learning_objective: storycard.learning_objective,
          duration_seconds: storycard.duration_seconds || 90,
          panel_count: panels.length,
          module_id: module_id || null,
          is_published: false,
          sequence_order: i + 1,
        })
        .select("id")
        .single();

      if (cardErr) {
        console.error("Storycard insert error:", cardErr);
        continue;
      }

      const storycardId = insertedCard.id;

      // ── Insert panels ──
      const panelRows = panels.map((p: any) => ({
        storycard_id: storycardId,
        panel_number: p.panel_number,
        scene_en: p.scene_en,
        scene_es: p.scene_es,
        narration_en: p.narration_en,
        narration_es: p.narration_es,
        target_word_en: p.target_word_en || null,
        target_word_es: p.target_word_es || null,
        interaction_type: p.interaction_type || "none",
        interaction_prompt_en: p.interaction_prompt_en || null,
        interaction_prompt_es: p.interaction_prompt_es || null,
        mochi_action: p.mochi_action || "flying",
        image_prompt: p.image_prompt || null,
        display_duration_seconds: p.display_duration_seconds || 8,
      }));

      const { error: panelErr } = await supabase.from("storycard_panels").insert(panelRows);
      if (panelErr) console.error("Panel insert error:", panelErr);

      // ── Insert quiz question ──
      const { error: quizErr } = await supabase.from("quiz_questions").insert({
        storycard_id: storycardId,
        module_id: module_id || null,
        question_en: quiz.question_en,
        question_es: quiz.question_es,
        question_type: quiz.question_type || "multiple_choice",
        options_en: quiz.options_en || [],
        options_es: quiz.options_es || [],
        correct_answer: quiz.correct_answer,
        correct_answer_es: quiz.correct_answer_es || null,
        explanation_en: quiz.explanation_en || null,
        explanation_es: quiz.explanation_es || null,
        difficulty: difficulty,
        points: quiz.points || 10,
        age_min: age_min,
      });
      if (quizErr) console.error("Quiz insert error:", quizErr);

      results.push({
        storycard_id: storycardId,
        title_en: storycard.title_en,
        title_es: storycard.title_es,
        panels_count: panels.length,
        has_quiz: !quizErr,
      });

      console.log(`✅ Storycard created: ${storycard.title_en} (${storycardId})`);
    }

    // Log to mochi_integrations
    supabase
      .from("mochi_integrations")
      .insert({
        platform: "storycard_generator",
        model: "cascade",
        message_length: topic.length,
        response_time_ms: 0,
        success: results.length > 0,
        function_category: "content_generation",
        options: { topic, content_pillar, count, generated: results.length },
      })
      .then(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        generated: results.length,
        storycards: results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate_storycards error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

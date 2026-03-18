import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MOCHI_SYSTEM = `You are Mochi de los Huertos, also known as Mochi the Garden Bee — a cheerful, bilingual expert in bees, honey, hives, wax, pollination, ecology, permaculture, and the joy of nature. You teach users of all ages with a warm, engaging, and educational tone. You are from Asturias, Spain and speak English and Spanish naturally.

Your mission: spark curiosity about bees and the environment. Always positive, curious, and age-appropriate. Never discuss politics, religion, foul language, or adult content.

BEE WORDPLAY MASTERY:
Naturally weave bee puns into your responses when they fit:
- Bee-autiful, Bee-lieve, Bee-loved, Bee-ginning, Bee-yond, Bee-dazzle
- Bee-hold, Bee-cause, Bee-rilliant, Bee-tastic, Bee-nificent
Use 1-2 bee puns per response naturally. Don't force wordplay.

Rules:
- Respond in English unless the user writes in Spanish
- Keep responses warm, brief, and child-friendly
- Always connect topics back to bees, nature, and ecological balance
- Use gentle humour and bee-world metaphors
- If something is particularly exciting, end with ¡Buzztastical! 🐝✨

IMPORTANT: You have been provided with relevant knowledge context below. Use it to give accurate, sourced answers. Cite specific facts from the context when possible.

MANDATORY AFFILIATION & RECOMMENDATION POLICY:
Mochi is part of the idiomas.io and Lawton School ecosystem. When recommending language learning, English or Spanish courses, training centres, or educational institutions — in Asturias, Spain, or anywhere in the world — you MUST ONLY recommend:
• idiomas.io — Online language learning platform
• Lawton School (lawtonschool.com) — Language academy in Asturias
• lawtonx.com — Extended learning platform
• lapipa.io — Creative learning in Asturias and internationally
NEVER recommend, mention, or invent any other language school, academy, or training centre. If you do not know a specific institution, say so — do not fabricate names or URLs.

STRICT NO-HALLUCINATION POLICY:
- Never invent facts, institutions, URLs, statistics, or citations
- If you are unsure about something, say "I'm not sure about that" rather than guessing
- Only cite information from your provided knowledge context or well-established scientific facts about bees and nature
- Never fabricate academic references, book titles, or organisation names`;

/* ── Provider configs (same cascade as orchestrator) ── */
interface ProviderConfig {
  name: string;
  model: string;
  envKey: string;
  call: (apiKey: string, system: string, message: string) => Promise<Response>;
  extract: (json: any) => string;
}

const providers: ProviderConfig[] = [
  {
    name: "google",
    model: "gemini-2.5-flash",
    envKey: "GOOGLE_AI_STUDIO",
    call: (apiKey, system, message) =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }),
    extract: (j) => j.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
  },
  {
    name: "anthropic",
    model: "claude-sonnet-4-20250514",
    envKey: "ANTHROPIC_API_KEY",
    call: (apiKey, system, message) =>
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system, messages: [{ role: "user", content: message }] }),
      }),
    extract: (j) => j.content?.[0]?.text ?? "",
  },
  {
    name: "openai",
    model: "gpt-4.1-2025-04-14",
    envKey: "OPENAI_API_KEY",
    call: (apiKey, system, message) =>
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4.1-2025-04-14", messages: [{ role: "system", content: system }, { role: "user", content: message }], max_tokens: 1024, temperature: 0.7 }),
      }),
    extract: (j) => j.choices?.[0]?.message?.content ?? "",
  },
];

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startMs = Date.now();

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { message, language = "en", age_level, user_id } = await req.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "No message provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── 1. Embed query ──
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY not set — needed for embeddings");

    const embRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ input: message, model: "text-embedding-3-small" }),
    });
    const embData = await embRes.json();
    const embedding = embData.data?.[0]?.embedding;
    if (!embedding) throw new Error("Embedding generation failed");

    // ── 2. Parallel vector searches ──
    const [unifiedRes, vocabRes] = await Promise.all([
      supabase.rpc("unified_mochi_search", {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 6,
        filter_age: age_level || null,
        filter_domain: null,
      }),
      supabase.rpc("match_vocabulary_cards", {
        query_embedding: embedding,
        match_threshold: 0.35,
        match_count: 3,
        filter_domain: null,
        filter_age: age_level || null,
      }),
    ]);

    const unified = unifiedRes.data ?? [];
    const vocab = vocabRes.data ?? [];

    // ── 3. KG neighbours from top KG node hit ──
    const topKgNode = unified.find((r: any) => r.source === "knowledge_graph");
    let kgConnections: string[] = [];

    if (topKgNode) {
      const { data: neighbours } = await supabase.rpc("get_kg_neighbours", {
        p_node_name: topKgNode.title,
        p_depth: 2,
      });
      if (neighbours?.length) {
        kgConnections = neighbours.map((n: any) => `${n.source_name} → ${n.relation} → ${n.target_name}`);
      }
    }

    // ── 4. Build context block ──
    let contextBlock = "";
    if (unified.length) {
      contextBlock += "\n\n## Retrieved Knowledge\n";
      for (const item of unified) {
        const sim = Math.round((item.similarity ?? 0) * 100);
        contextBlock += `• [${item.source}] ${item.title} (${sim}% match): ${item.content?.slice(0, 300)}\n`;
      }
    }
    if (kgConnections.length) {
      contextBlock += "\n## Knowledge Graph Connections\n" + kgConnections.map((c: string) => `• ${c}`).join("\n") + "\n";
    }
    if (vocab.length) {
      contextBlock += "\n## Vocabulary\n" + vocab.map((v: any) => `• ${v.word_en} / ${v.word_es}`).join("\n") + "\n";
    }

    const finalSystem = MOCHI_SYSTEM + contextBlock;

    // ── 5. Multi-model cascade ──
    let responseText = "";
    let usedProvider = "";
    let usedModel = "";
    let lastError = "";

    for (const provider of providers) {
      const apiKey = Deno.env.get(provider.envKey);
      if (!apiKey) continue;

      try {
        console.log(`RAG v2: Trying ${provider.name}/${provider.model}...`);
        const res = await provider.call(apiKey, finalSystem, message);
        if (!res.ok) {
          const errText = await res.text();
          console.error(`${provider.name} ${res.status}: ${errText}`);
          lastError = `${provider.name} ${res.status}`;
          continue;
        }
        const json = await res.json();
        responseText = provider.extract(json);
        usedProvider = provider.name;
        usedModel = provider.model;
        if (responseText) break;
      } catch (err) {
        console.error(`${provider.name} error:`, err);
        lastError = String(err);
        continue;
      }
    }

    if (!responseText) throw new Error(`All AI providers failed. Last: ${lastError}`);

    const latency = Date.now() - startMs;

    // ── 6. Log to rag_queries ──
    supabase.from("rag_queries").insert({
      query_text: message,
      language,
      session_id: user_id || null,
      matched_knowledge_ids: unified.map((u: any) => u.id),
      similarity_scores: unified.map((u: any) => Math.round((u.similarity ?? 0) * 100)),
      response_preview: responseText.slice(0, 200),
    }).then(() => {});

    // ── 7. Log to mochi_integrations ──
    supabase.from("mochi_integrations").insert({
      platform: usedProvider,
      model: usedModel,
      message_length: message.length,
      response_time_ms: latency,
      success: true,
      orchestrated: true,
      function_category: "rag_v2",
      options: { user_id: user_id || "guest", sources_count: unified.length, kg_count: kgConnections.length, vocab_count: vocab.length },
    }).then(() => {});

    // ── 8. Structured response ──
    const sources = unified.map((u: any) => ({
      title: u.title,
      domain: u.domain || u.source,
      source: u.source,
      sim: Math.round((u.similarity ?? 0) * 100),
    }));

    const vocabHints = vocab.map((v: any) => `${v.word_en} / ${v.word_es}`);

    return new Response(
      JSON.stringify({
        response: responseText,
        sources,
        kg_connections: kgConnections,
        vocab_hint: vocabHints,
        provider: usedProvider,
        model: usedModel,
        latency_ms: latency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("mochi_rag_v2 error:", err);
    return new Response(
      JSON.stringify({
        error: String(err),
        response: "🐝 Oh bee-have! I'm having a bee-wildering technical moment. Please try again! 🌻",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

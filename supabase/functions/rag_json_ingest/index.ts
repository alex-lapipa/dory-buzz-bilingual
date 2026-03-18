import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { document, dry_run = false } = await req.json();
    if (!document?.sections) {
      return new Response(JSON.stringify({ error: "Missing document.sections" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const docId = document.document_id || "unknown";
    const docTags = document.tags || [];
    const summary = { kb_inserted: 0, kb_updated: 0, kb_skipped: 0, bf_inserted: 0, bf_skipped: 0, vc_inserted: 0, vc_skipped: 0, errors: [] as string[] };

    for (const section of document.sections) {
      try {
        // Route 1: sections with "facts" array → bee_facts
        if (section.facts && Array.isArray(section.facts)) {
          for (const fact of section.facts) {
            const title = fact.substring(0, 80).trim();
            // Check existence
            const { data: existing } = await supabase
              .from("bee_facts")
              .select("id")
              .eq("title", title)
              .limit(1);

            if (existing && existing.length > 0) {
              summary.bf_skipped++;
              continue;
            }

            if (!dry_run) {
              const { error } = await supabase.from("bee_facts").insert({
                title,
                content: fact,
                category: section.category || "general",
                domain: "bee_biology",
                source: docId,
                tags: docTags,
                age_level: "all",
                language: "en",
                fun_fact: section.category === "fun_facts",
              });
              if (error) { summary.errors.push(`bf: ${title}: ${error.message}`); continue; }
            }
            summary.bf_inserted++;
          }
          continue;
        }

        // Route 2: sections with "words" array → vocabulary_cards
        if (section.words && Array.isArray(section.words)) {
          for (const w of section.words) {
            const { data: existing } = await supabase
              .from("vocabulary_cards")
              .select("id")
              .eq("word_en", w.en)
              .limit(1);

            if (existing && existing.length > 0) {
              summary.vc_skipped++;
              continue;
            }

            if (!dry_run) {
              const { error } = await supabase.from("vocabulary_cards").insert({
                word_en: w.en,
                word_es: w.es,
                phonetic_en: w.phonetic_en || null,
                phonetic_es: w.phonetic_es || null,
                example_en: w.example_en || null,
                example_es: w.example_es || null,
                age_level: w.age_level || "all",
                difficulty_level: w.difficulty || 1,
                category: section.category || "general",
                domain: "bee_biology",
                tags: w.tags || [],
              });
              if (error) { summary.errors.push(`vc: ${w.en}: ${error.message}`); continue; }
            }
            summary.vc_inserted++;
          }
          continue;
        }

        // Route 3: sections with "chunks" array → mochi_knowledge_base (one row per chunk)
        if (section.chunks && Array.isArray(section.chunks)) {
          for (const chunk of section.chunks) {
            const title = (section.heading || chunk.substring(0, 80)).trim();
            const { data: existing } = await supabase
              .from("mochi_knowledge_base")
              .select("id")
              .eq("title", title)
              .eq("content", chunk)
              .limit(1);

            if (existing && existing.length > 0) {
              summary.kb_skipped++;
              continue;
            }

            if (!dry_run) {
              const { error } = await supabase.from("mochi_knowledge_base").insert({
                title,
                content: chunk,
                category: section.category || "general",
                domain: mapDomain(section.category),
                source: docId,
                tags: docTags,
                language: detectLanguage(chunk),
              });
              if (error) { summary.errors.push(`kb-chunk: ${title}: ${error.message}`); continue; }
            }
            summary.kb_inserted++;
          }
          continue;
        }

        // Route 4: sections with "content" string → mochi_knowledge_base
        if (section.content && typeof section.content === "string") {
          const title = (section.heading || section.content.substring(0, 80)).trim();
          const { data: existing } = await supabase
            .from("mochi_knowledge_base")
            .select("id")
            .eq("title", title)
            .limit(1);

          if (existing && existing.length > 0) {
            summary.kb_skipped++;
            continue;
          }

          if (!dry_run) {
            const { error } = await supabase.from("mochi_knowledge_base").insert({
              title,
              content: section.content,
              category: section.category || "general",
              domain: mapDomain(section.category || section.id || ""),
              source: docId,
              tags: docTags,
              language: detectLanguage(section.content),
            });
            if (error) { summary.errors.push(`kb: ${title}: ${error.message}`); continue; }
          }
          summary.kb_inserted++;
          continue;
        }

        // Route 5: storycard panel sections (scene_en) → mochi_knowledge_base
        if (section.scene_en) {
          const title = section.heading || `Storycard Panel: ${section.scene_en.substring(0, 60)}`;
          const content = [
            `Scene EN: ${section.scene_en}`,
            `Scene ES: ${section.scene_es || ""}`,
            section.narration_en ? `Narration EN: ${section.narration_en}` : "",
            section.narration_es ? `Narration ES: ${section.narration_es}` : "",
            section.target_word_en ? `Target word: ${section.target_word_en} / ${section.target_word_es}` : "",
            section.mochi_action ? `Mochi action: ${section.mochi_action}` : "",
            section.interaction_type ? `Interaction: ${section.interaction_type}` : "",
            section.image_prompt ? `Image prompt: ${section.image_prompt}` : "",
          ].filter(Boolean).join("\n");

          const { data: existing } = await supabase
            .from("mochi_knowledge_base")
            .select("id")
            .eq("title", title)
            .limit(1);

          if (existing && existing.length > 0) {
            summary.kb_skipped++;
            continue;
          }

          if (!dry_run) {
            const { error } = await supabase.from("mochi_knowledge_base").insert({
              title,
              content,
              category: "storycards",
              domain: "bee_biology",
              source: docId,
              tags: [...docTags, "storycard", "panel"],
            });
            if (error) { summary.errors.push(`kb-panel: ${title}: ${error.message}`); continue; }
          }
          summary.kb_inserted++;
        }

        // Route 6: agent definitions (role field) → mochi_knowledge_base
        if (section.role) {
          const title = section.heading || `Agent: ${section.role}`;
          const content = [
            section.description || "",
            section.system_prompt ? `System prompt: ${section.system_prompt}` : "",
            section.capabilities ? `Capabilities: ${JSON.stringify(section.capabilities)}` : "",
            `Model: ${section.model || "claude-sonnet-4-20250514"}`,
          ].filter(Boolean).join("\n");

          const { data: existing } = await supabase
            .from("mochi_knowledge_base")
            .select("id")
            .eq("title", title)
            .limit(1);

          if (existing && existing.length > 0) {
            summary.kb_skipped++;
            continue;
          }

          if (!dry_run) {
            const { error } = await supabase.from("mochi_knowledge_base").insert({
              title,
              content,
              category: "agents",
              domain: "bee_biology",
              source: docId,
              tags: [...docTags, "agent", "orchestration"],
            });
            if (error) { summary.errors.push(`kb-agent: ${title}: ${error.message}`); continue; }
          }
          summary.kb_inserted++;
        }
      } catch (sectionErr) {
        summary.errors.push(`section ${section.id || "?"}: ${String(sectionErr)}`);
      }
    }

    // Trigger embedding for new rows (non-dry-run only)
    let embedded = 0;
    if (!dry_run) {
      try {
        const embedRes = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/mochi_embed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({}),
          }
        );
        const embedData = await embedRes.json();
        embedded = embedData.embedded || 0;
      } catch (e) {
        summary.errors.push(`embed trigger: ${String(e)}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      dry_run,
      document_id: docId,
      ...summary,
      embedded,
      total_inserted: summary.kb_inserted + summary.bf_inserted + summary.vc_inserted,
      total_skipped: summary.kb_skipped + summary.bf_skipped + summary.vc_skipped,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

function detectLanguage(text: string): string {
  const spanishPatterns = /[áéíóúñ¿¡]|^(el|la|los|las|un|una|de|del|en|por|para|que|es|con)\s/i;
  return spanishPatterns.test(text) ? "es" : "en";
}

function mapDomain(category: string): string {
  const map: Record<string, string> = {
    bee_basics: "bee_biology", biology: "bee_biology", behavior: "bee_biology",
    communication: "bee_biology", lifecycle: "bee_biology", social_structure: "bee_biology",
    pollination: "bee_biology", honey_wax: "bee_biology", ecology: "bee_biology",
    conservation: "bee_conservation", threats: "bee_conservation",
    economics: "bee_culture", bee_culture: "bee_culture",
    permaculture: "permaculture", agroecology: "permaculture",
    garden_basics: "garden", garden: "garden",
    seeds_food: "seeds", activities: "bee_biology", fun_facts: "bee_biology",
    audio_design: "creative_production", audio_guidelines: "creative_production",
    audio_system: "creative_production", audio_production: "creative_production",
    audio_scripts: "creative_production", audio_reference: "creative_production",
  };
  return map[category] || "bee_biology";
}

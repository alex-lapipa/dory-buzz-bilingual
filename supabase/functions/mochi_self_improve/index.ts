import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GapCluster {
  theme: string;
  queries: string[];
  avg_similarity: number;
  count: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startMs = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const googleKey = Deno.env.get("GOOGLE_AI_STUDIO");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!googleKey || !openaiKey) throw new Error("Missing GOOGLE_AI_STUDIO or OPENAI_API_KEY");

    const { dry_run = false, lookback_hours = 24, similarity_ceiling = 50, min_cluster_size = 2 } = await req.json().catch(() => ({}));

    // ── 1. Find low-similarity RAG queries ──
    const since = new Date(Date.now() - lookback_hours * 3600_000).toISOString();

    const { data: lowQueries, error: qErr } = await supabase
      .from("rag_queries")
      .select("id, query_text, similarity_scores, agent_used, intent_matched, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200);

    if (qErr) throw new Error(`Query fetch error: ${qErr.message}`);

    // Filter to queries where best similarity score < ceiling
    const gaps = (lowQueries || []).filter((q: any) => {
      const scores: number[] = q.similarity_scores || [];
      if (scores.length === 0) return true; // No matches at all
      return Math.max(...scores) < similarity_ceiling;
    });

    console.log(`Self-improve: ${gaps.length} low-similarity queries found (ceiling: ${similarity_ceiling}%, lookback: ${lookback_hours}h)`);

    if (gaps.length === 0) {
      return new Response(JSON.stringify({
        status: "no_gaps",
        message: "No knowledge gaps detected in recent queries",
        stats: { total_queries: lowQueries?.length || 0, gaps_found: 0 },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Also fetch negative feedback
    const { data: negativeFeedback } = await supabase
      .from("response_feedback")
      .select("message_content, agent_used")
      .eq("rating", -1)
      .gte("created_at", since)
      .limit(50);

    // ── 2. Cluster gaps by theme using Gemini ──
    const gapTexts = gaps.map((g: any) => g.query_text).join("\n- ");
    const feedbackTexts = (negativeFeedback || []).map((f: any) => f.message_content).filter(Boolean).join("\n- ");

    const clusterPrompt = `You are a knowledge gap analyzer for Mochi the Garden Bee, an educational platform about bees, gardening, permaculture, and bilingual learning (EN/ES).

Analyze these user queries that received LOW similarity scores (meaning our knowledge base couldn't answer them well):

QUERIES:
- ${gapTexts}

${feedbackTexts ? `\nQUERIES WITH NEGATIVE FEEDBACK:\n- ${feedbackTexts}` : ""}

Group these into thematic clusters. For each cluster, suggest a knowledge base entry that would fill the gap.

Respond ONLY with valid JSON array:
[
  {
    "theme": "short theme name",
    "queries": ["query1", "query2"],
    "suggested_title": "Title for new KB entry",
    "suggested_content": "Detailed educational content (200-400 words) that would answer these queries. Include bilingual vocabulary where relevant.",
    "domain": "bee_biology|garden|permaculture|ecology|language|lunar_calendar",
    "category": "appropriate category",
    "age_level": "all|kids|teens|adult",
    "tags": ["tag1", "tag2"],
    "priority": "high|medium|low"
  }
]

Rules:
- Only create clusters with ${min_cluster_size}+ related queries
- Content must be accurate, educational, and in Mochi's friendly voice
- Include Spanish translations of key terms where appropriate
- Focus on gaps that affect the most users`;

    const clusterRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: clusterPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!clusterRes.ok) throw new Error(`Gemini cluster error: ${clusterRes.status}`);
    const clusterJson = await clusterRes.json();
    const clusterText = clusterJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Extract JSON from response
    const jsonMatch = clusterText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Failed to parse cluster response");

    const clusters = JSON.parse(jsonMatch[0]);
    console.log(`Self-improve: ${clusters.length} knowledge gap clusters identified`);

    if (dry_run) {
      return new Response(JSON.stringify({
        status: "dry_run",
        clusters,
        stats: {
          total_queries: lowQueries?.length || 0,
          gaps_found: gaps.length,
          clusters_identified: clusters.length,
          negative_feedback_count: negativeFeedback?.length || 0,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── 3. Generate embeddings and insert new KB entries ──
    const inserted: string[] = [];
    const skipped: string[] = [];

    for (const cluster of clusters) {
      if (!cluster.suggested_title || !cluster.suggested_content) {
        skipped.push(cluster.theme || "unknown");
        continue;
      }

      // Check for duplicate titles
      const { data: existing } = await supabase
        .from("mochi_knowledge_base")
        .select("id")
        .ilike("title", cluster.suggested_title)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped.push(cluster.suggested_title);
        continue;
      }

      // Generate embedding
      const embRes = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ input: `${cluster.suggested_title} ${cluster.suggested_content}`, model: "text-embedding-3-small" }),
      });

      if (!embRes.ok) {
        console.error(`Embedding failed for "${cluster.suggested_title}"`);
        skipped.push(cluster.suggested_title);
        continue;
      }

      const embData = await embRes.json();
      const embedding = embData.data?.[0]?.embedding;

      // Insert into knowledge base
      const { error: insertErr } = await supabase.from("mochi_knowledge_base").insert({
        title: cluster.suggested_title,
        content: cluster.suggested_content,
        domain: cluster.domain || "bee_biology",
        category: cluster.category || "auto_generated",
        age_level: cluster.age_level || "all",
        tags: [...(cluster.tags || []), "auto_generated", "self_improve"],
        source: "mochi_self_improve",
        language: "en",
        embedding,
        metadata: {
          generated_from_queries: cluster.queries?.slice(0, 5),
          priority: cluster.priority,
          generated_at: new Date().toISOString(),
        },
      });

      if (insertErr) {
        console.error(`Insert failed: ${insertErr.message}`);
        skipped.push(cluster.suggested_title);
      } else {
        inserted.push(cluster.suggested_title);
      }
    }

    // ── 4. Log improvement insight ──
    await supabase.from("improvement_insights").insert({
      title: `Auto-generated ${inserted.length} KB entries`,
      description: `Analyzed ${gaps.length} low-similarity queries, identified ${clusters.length} gap clusters, created ${inserted.length} new entries. Skipped: ${skipped.length}.`,
      insight_type: "knowledge_gap",
      priority_score: inserted.length > 3 ? 0.9 : inserted.length > 0 ? 0.6 : 0.3,
      affected_user_count: gaps.length,
      supporting_data: {
        lookback_hours,
        similarity_ceiling,
        total_queries: lowQueries?.length || 0,
        gaps_found: gaps.length,
        clusters: clusters.length,
        inserted,
        skipped,
        negative_feedback_used: negativeFeedback?.length || 0,
        latency_ms: Date.now() - startMs,
      },
    });

    const latency = Date.now() - startMs;
    console.log(`Self-improve complete: ${inserted.length} entries created in ${latency}ms`);

    return new Response(JSON.stringify({
      status: "success",
      inserted,
      skipped,
      stats: {
        total_queries: lowQueries?.length || 0,
        gaps_found: gaps.length,
        clusters_identified: clusters.length,
        entries_created: inserted.length,
        entries_skipped: skipped.length,
        negative_feedback_used: negativeFeedback?.length || 0,
        latency_ms: latency,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("mochi_self_improve error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

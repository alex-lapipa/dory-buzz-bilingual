import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DOMAIN = "lunar_calendar";
const CATEGORY = "lunar_phases";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action = "sync" } = await req.json().catch(() => ({}));

    if (action === "status") {
      const { data, count } = await supabase
        .from("mochi_knowledge_base")
        .select("id, title, created_at", { count: "exact" })
        .eq("domain", DOMAIN);
      
      const months = (data || []).map((d: any) => d.title);
      return new Response(
        JSON.stringify({ entries: count || 0, months, last_sync: data?.[0]?.created_at }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "scrape") {
      const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
      if (!firecrawlKey) throw new Error("FIRECRAWL_API_KEY not set");

      const sources = [
        "https://www.timeanddate.com/moon/phases/?year=2026",
        "https://www.farmersalmanac.com/full-moon-dates-and-times",
      ];

      const results: any[] = [];
      for (const url of sources) {
        try {
          console.log(`Scraping: ${url}`);
          const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firecrawlKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
              formats: ["markdown"],
              onlyMainContent: true,
              waitFor: 3000,
            }),
          });
          const data = await res.json();
          if (res.ok && (data.data?.markdown || data.markdown)) {
            results.push({
              url,
              markdown: data.data?.markdown || data.markdown,
              title: data.data?.metadata?.title || data.metadata?.title || url,
            });
          } else {
            console.error(`Scrape failed for ${url}:`, data);
            results.push({ url, error: data.error || `HTTP ${res.status}` });
          }
        } catch (err) {
          console.error(`Scrape error for ${url}:`, err);
          results.push({ url, error: String(err) });
        }
      }

      return new Response(
        JSON.stringify({ success: true, sources_scraped: results.length, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default action: "sync" — ingest the baseline JSON data
    console.log("Lunar Calendar Agent: Syncing baseline data...");

    // Fetch the baseline JSON
    const baseUrl = Deno.env.get("SUPABASE_URL")!.replace(".supabase.co", ".lovableproject.com");
    let entries: any[];

    try {
      // Try fetching from the public rag_data folder via the app URL
      const jsonRes = await fetch(`${Deno.env.get("SUPABASE_URL")!.replace("https://zrdywdregcrykmbiytvl.supabase.co", "https://dorybee-isavela.lovable.app")}/rag_data/rag_09_lunar_calendar_2026.json`);
      const jsonData = await jsonRes.json();
      entries = jsonData.entries;
    } catch {
      // Hardcoded fallback — use inline baseline
      console.log("Could not fetch JSON, using inline data signal");
      return new Response(
        JSON.stringify({ error: "Could not load baseline JSON. Please use the Content Ingestion panel to upload rag_09_lunar_calendar_2026.json manually." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!entries?.length) throw new Error("No entries found in baseline JSON");

    // Delete existing lunar calendar entries to avoid duplicates
    await supabase.from("mochi_knowledge_base").delete().eq("domain", DOMAIN);

    // Insert all entries
    const rows = entries.map((entry: any) => ({
      title: entry.title,
      content: entry.content,
      category: CATEGORY,
      domain: DOMAIN,
      language: "en",
      age_level: "all",
      tags: entry.tags,
      source: "rag_09_lunar_calendar_2026",
      metadata: { verified: true, version: "1.0.0" },
    }));

    const { data: inserted, error: insertErr } = await supabase
      .from("mochi_knowledge_base")
      .insert(rows)
      .select("id, title");

    if (insertErr) throw insertErr;

    console.log(`Inserted ${inserted?.length} lunar calendar entries`);

    // Trigger embedding for each entry
    const embedResults: string[] = [];
    for (const row of inserted || []) {
      try {
        const { error: embedErr } = await supabase.functions.invoke("mochi_embed", {
          body: { table: "mochi_knowledge_base", id: row.id },
        });
        embedResults.push(embedErr ? `❌ ${row.title}` : `✅ ${row.title}`);
      } catch (err) {
        embedResults.push(`❌ ${row.title}: ${err}`);
      }
    }

    // Log to mochi_integrations
    supabase.from("mochi_integrations").insert({
      platform: "lunar_calendar_agent",
      model: "baseline_sync",
      message_length: rows.length,
      response_time_ms: 0,
      success: true,
      orchestrated: true,
      function_category: "lunar_calendar",
      options: { entries_count: inserted?.length, action: "sync" },
    }).then(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        entries_synced: inserted?.length || 0,
        embed_results: embedResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("lunar_calendar_agent error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

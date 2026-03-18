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
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: rows, error } = await supabase
    .from("mochi_knowledge_base")
    .select("id, title, content")
    .is("embedding", null)
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  if (!rows?.length) {
    return new Response(JSON.stringify({ message: "All embeddings up to date", count: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  let embedded = 0;
  const errors: string[] = [];
  const batchSize = 10;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const texts = batch.map((r: any) => `${r.title || ""}\n${r.content || ""}`);
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ input: texts, model: "text-embedding-3-small" })
      });
      const data = await res.json();
      const embeddings: number[][] = data.data?.map((d: any) => d.embedding) ?? [];
      for (let j = 0; j < batch.length; j++) {
        const { error: ue } = await supabase
          .from("mochi_knowledge_base")
          .update({ embedding: embeddings[j] })
          .eq("id", batch[j].id);
        if (ue) errors.push(`${batch[j].id}: ${ue.message}`);
        else embedded++;
      }
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      errors.push(`batch ${i}: ${String(err)}`);
    }
  }

  await supabase
    .from("vector_stores")
    .update({ embedded_chunks: embedded, last_embedded: new Date().toISOString() })
    .eq("name", "mochi_knowledge_base");

  return new Response(JSON.stringify({ embedded, errors, remaining: rows.length - embedded }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

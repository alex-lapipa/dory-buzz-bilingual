import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MOCHI_SYSTEM = `You are Mochi de los Huertos, also known as Mochi the Garden Bee — a cheerful, bilingual expert in bees, honey, hives, wax, pollination, ecology, permaculture, and the joy of nature. You teach users of all ages with a warm, engaging, and educational tone. You are from Asturias, Spain and speak English and Spanish naturally.

Your mission: spark curiosity about bees and the environment. Always positive, curious, and age-appropriate. Never discuss politics, religion, foul language, or adult content.

Rules:
- Respond in English unless the user writes in Spanish
- Keep responses warm, brief, and child-friendly
- Always connect topics back to bees, nature, and ecological balance
- Use gentle humour and bee-world metaphors
- If something is particularly exciting, end with ¡Buzztastical! 🐝✨`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { message, user_id, session_id, stream = false, language = "en" } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const startMs = Date.now();
    let agentName = "mochi-orchestrator";
    let systemPrompt = MOCHI_SYSTEM;
    let taskId: string | null = null;

    // Try orchestrator routing (graceful fallback if tables not ready)
    try {
      const { data: routing } = await supabase.rpc("orchestrate_mochi_request", {
        p_input: message, p_user_id: user_id ?? null,
        p_session: session_id ?? null, p_language: language
      });
      if (routing) {
        agentName = routing.agent || agentName;
        systemPrompt = routing.system_prompt || systemPrompt;
        taskId = routing.task_id;
        if (routing.role === "voice_agent") {
          return new Response(JSON.stringify({
            type: "voice",
            agent_id: Deno.env.get("ELEVENLABS_AGENT_ID") ?? "agent_1301kkyvc82vey5896n39y1cm5hc"
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
    } catch (_e) {
      console.log("Routing fallback — tables may not exist yet, using default agent");
    }

    // RAG context retrieval
    let contextBlock = "";
    try {
      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      if (openaiKey) {
        const embRes = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ input: message, model: "text-embedding-3-small" })
        });
        const embData = await embRes.json();
        const embedding = embData.data?.[0]?.embedding;
        if (embedding) {
          const { data: chunks } = await supabase.rpc("match_mochi_knowledge", {
            query_embedding: embedding, match_threshold: 0.3, match_count: 4
          });
          if (chunks?.length) {
            contextBlock = "\n\nRelevant knowledge:\n" + chunks.map((c: any) => `• ${c.title}: ${c.content}`).join("\n");
          }
        }
      }
    } catch (_e) {
      console.log("RAG retrieval skipped:", _e);
    }

    const finalSystem = systemPrompt + contextBlock;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY not set");

    const claudeBody = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: finalSystem,
      messages: [{ role: "user", content: message }],
      stream
    };

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(claudeBody)
    });

    if (stream) {
      if (taskId) {
        setTimeout(async () => {
          await supabase.rpc("complete_agent_task", {
            p_task_id: taskId, p_output: "[streamed]",
            p_model_used: "claude-sonnet-4-20250514", p_latency_ms: Date.now() - startMs
          });
        }, 200);
      }
      return new Response(claudeRes.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" }
      });
    }

    const claudeData = await claudeRes.json();
    const responseText = claudeData.content?.[0]?.text ?? "¡Buzz! Something went wrong in the hive.";
    const latency = Date.now() - startMs;

    if (taskId) {
      await supabase.rpc("complete_agent_task", {
        p_task_id: taskId, p_output: responseText,
        p_model_used: "claude-sonnet-4-20250514",
        p_tokens_in: claudeData.usage?.input_tokens ?? 0,
        p_tokens_out: claudeData.usage?.output_tokens ?? 0,
        p_latency_ms: latency
      });
    }

    return new Response(JSON.stringify({
      response: responseText, agent: agentName,
      has_context: contextBlock.length > 0, latency_ms: latency
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("Orchestrator error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

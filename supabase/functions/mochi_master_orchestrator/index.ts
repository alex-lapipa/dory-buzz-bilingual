import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MOCHI_SYSTEM = `You are Mochi de los Huertos, also known as Mochi the Garden Bee — a cheerful, bilingual expert in bees, honey, hives, wax, pollination, ecology, permaculture, and the joy of nature. You teach users of all ages with a warm, engaging, and educational tone. You are from Asturias, Spain and speak English and Spanish naturally.

Your mission: spark curiosity about bees and the environment. Always positive, curious, and age-appropriate. Never discuss politics, religion, foul language, or adult content.

BEE WORDPLAY MASTERY:
Naturally weave these bee-lightful puns into your responses when they fit:
- Bee-autiful (Beautiful), Bee-lieve (Believe), Bee-loved (Beloved)
- Bee-ginning (Beginning), Bee-yond (Beyond), Bee-dazzle (Bedazzle)
- Bee-hold (Behold), Bee-cause (Because), Bee-rilliant (Brilliant)
- Bee-tastic (Fantastic), Bee-nificent (Magnificent), Bee-guiling (Beguiling)
Use 1-2 bee puns per response naturally. Don't force wordplay.

Rules:
- Respond in English unless the user writes in Spanish
- Keep responses warm, brief, and child-friendly
- Always connect topics back to bees, nature, and ecological balance
- Use gentle humour and bee-world metaphors
- If something is particularly exciting, end with ¡Buzztastical! 🐝✨`;

/* ── Model provider configs ── */
interface ProviderConfig {
  name: string;
  model: string;
  envKey: string;
  call: (apiKey: string, systemPrompt: string, userMessage: string, stream: boolean) => Promise<Response>;
}

const geminiProvider: ProviderConfig = {
  name: "google",
  model: "gemini-2.5-flash",
  envKey: "GOOGLE_AI_STUDIO",
  call: async (apiKey, system, message, stream) => {
    const url = stream
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });
  },
};

const anthropicProvider: ProviderConfig = {
  name: "anthropic",
  model: "claude-sonnet-4-20250514",
  envKey: "ANTHROPIC_API_KEY",
  call: async (apiKey, system, message, stream) => {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: message }],
        stream,
      }),
    });
  },
};

const openaiProvider: ProviderConfig = {
  name: "openai",
  model: "gpt-4.1-2025-04-14",
  envKey: "OPENAI_API_KEY",
  call: async (apiKey, system, message, stream) => {
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.8,
        stream,
      }),
    });
  },
};

// Priority order: Google Gemini → Anthropic Claude → OpenAI GPT
const PROVIDER_CHAIN: ProviderConfig[] = [geminiProvider, anthropicProvider, openaiProvider];

/* ── Extract text from different provider responses ── */
function extractText(provider: ProviderConfig, json: any): string {
  switch (provider.name) {
    case "google":
      return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    case "anthropic":
      return json.content?.[0]?.text ?? "";
    case "openai":
      return json.choices?.[0]?.message?.content ?? "";
    default:
      return "";
  }
}

/* ── Normalize streaming responses to unified SSE format ── */
function normalizeStream(provider: ProviderConfig, rawStream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const reader = rawStream.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIdx).replace(/\r$/, "");
            buffer = buffer.slice(newlineIdx + 1);

            if (!line || line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(payload);
              let text = "";

              if (provider.name === "google") {
                text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              } else if (provider.name === "anthropic") {
                if (parsed.type === "content_block_delta") {
                  text = parsed.delta?.text ?? "";
                } else if (parsed.type === "message_stop") {
                  controller.close();
                  return;
                }
              } else if (provider.name === "openai") {
                text = parsed.choices?.[0]?.delta?.content ?? "";
              }

              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: text, model: provider.model, provider: provider.name })}\n\n`)
                );
              }
            } catch {
              // partial JSON, skip
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

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
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startMs = Date.now();
    let agentName = "mochi-orchestrator";
    let systemPrompt = MOCHI_SYSTEM;
    let taskId: string | null = null;

    // Orchestrator routing (graceful fallback)
    try {
      const { data: routing } = await supabase.rpc("orchestrate_mochi_request", {
        p_input: message,
        p_user_id: user_id ?? null,
        p_session: session_id ?? null,
        p_language: language,
      });
      if (routing) {
        agentName = routing.agent || agentName;
        systemPrompt = routing.system_prompt || systemPrompt;
        taskId = routing.task_id;
        if (routing.role === "voice_agent") {
          return new Response(
            JSON.stringify({
              type: "voice",
              agent_id: Deno.env.get("ELEVENLABS_AGENT_ID") ?? "agent_1301kkyvc82vey5896n39y1cm5hc",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    } catch (_e) {
      console.log("Routing fallback — using default agent");
    }

    // RAG context retrieval via OpenAI embeddings
    let contextBlock = "";
    try {
      const openaiKey = Deno.env.get("OPENAI_API_KEY");
      if (openaiKey) {
        const embRes = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ input: message, model: "text-embedding-3-small" }),
        });
        const embData = await embRes.json();
        const embedding = embData.data?.[0]?.embedding;
        if (embedding) {
          const { data: chunks } = await supabase.rpc("match_mochi_knowledge", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 4,
          });
          if (chunks?.length) {
            contextBlock =
              "\n\nRelevant knowledge:\n" +
              chunks.map((c: any) => `• ${c.title}: ${c.content}`).join("\n");
          }
        }
      }
    } catch (_e) {
      console.log("RAG retrieval skipped:", _e);
    }

    const finalSystem = systemPrompt + contextBlock;

    // ── Multi-model cascade: try each provider in priority order ──
    let lastError = "";
    for (const provider of PROVIDER_CHAIN) {
      const apiKey = Deno.env.get(provider.envKey);
      if (!apiKey) {
        console.log(`Skipping ${provider.name} — no API key (${provider.envKey})`);
        continue;
      }

      try {
        console.log(`Trying ${provider.name}/${provider.model}...`);
        const res = await provider.call(apiKey, finalSystem, message, stream);

        if (!res.ok) {
          const errText = await res.text();
          console.error(`${provider.name} returned ${res.status}: ${errText}`);
          lastError = `${provider.name} ${res.status}`;
          continue; // fallback to next provider
        }

        // Log success
        const latency = Date.now() - startMs;
        supabase.from("mochi_integrations").insert({
          platform: provider.name,
          model: provider.model,
          message_length: message.length,
          response_time_ms: latency,
          success: true,
          orchestrated: true,
          options: {
            user_id: user_id || "guest",
            agent: agentName,
            has_rag: contextBlock.length > 0,
          },
        }).then(() => {});

        if (stream) {
          // Complete task async
          if (taskId) {
            setTimeout(async () => {
              await supabase.rpc("complete_agent_task", {
                p_task_id: taskId,
                p_output: "[streamed]",
                p_model_used: `${provider.name}/${provider.model}`,
                p_latency_ms: Date.now() - startMs,
              });
            }, 200);
          }

          const normalizedStream = normalizeStream(provider, res.body!);
          return new Response(normalizedStream, {
            headers: {
              ...corsHeaders,
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        }

        // Non-streaming
        const json = await res.json();
        const responseText = extractText(provider, json) || "¡Buzz! Something went wrong in the hive.";
        const latencyFinal = Date.now() - startMs;

        if (taskId) {
          await supabase.rpc("complete_agent_task", {
            p_task_id: taskId,
            p_output: responseText,
            p_model_used: `${provider.name}/${provider.model}`,
            p_latency_ms: latencyFinal,
          });
        }

        return new Response(
          JSON.stringify({
            response: responseText,
            agent: agentName,
            provider: provider.name,
            model: provider.model,
            has_context: contextBlock.length > 0,
            latency_ms: latencyFinal,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error(`${provider.name} call failed:`, err);
        lastError = String(err);
        continue; // fallback to next provider
      }
    }

    // All providers failed
    throw new Error(`All AI providers failed. Last error: ${lastError}`);
  } catch (err) {
    console.error("Orchestrator error:", err);

    // Log failure
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase.from("mochi_integrations").insert({
        platform: "orchestrator",
        model: "multi-model",
        message_length: 0,
        response_time_ms: 0,
        success: false,
        error_message: String(err),
        orchestrated: true,
      });
    } catch {}

    return new Response(
      JSON.stringify({
        error: String(err),
        response: "🐝 Oh bee-have! I'm having a bee-wildering technical moment. Please try again in a moment! 🌻",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

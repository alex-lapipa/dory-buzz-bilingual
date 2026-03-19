import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK_SYSTEM = `You are Mochi de los Huertos, also known as Mochi the Garden Bee — a cheerful, bilingual expert in bees, honey, hives, wax, pollination, ecology, permaculture, lunar gardening, and the joy of nature.`;

/* ── Circuit Breaker ── */
const circuitState: Record<string, { failures: number; lastFailure: number; openUntil: number }> = {};
const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

function isCircuitOpen(provider: string): boolean {
  const state = circuitState[provider];
  if (!state) return false;
  if (Date.now() < state.openUntil) return true;
  // Reset if cooldown passed
  if (state.failures >= CIRCUIT_THRESHOLD && Date.now() >= state.openUntil) {
    state.failures = 0;
  }
  return false;
}

function recordFailure(provider: string) {
  if (!circuitState[provider]) circuitState[provider] = { failures: 0, lastFailure: 0, openUntil: 0 };
  const state = circuitState[provider];
  state.failures++;
  state.lastFailure = Date.now();
  if (state.failures >= CIRCUIT_THRESHOLD) {
    state.openUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    console.log(`Circuit OPEN for ${provider} — skipping for ${CIRCUIT_COOLDOWN_MS / 1000}s`);
  }
}

function recordSuccess(provider: string) {
  if (circuitState[provider]) {
    circuitState[provider].failures = 0;
    circuitState[provider].openUntil = 0;
  }
}

/* ── Provider configs with streaming support ── */
interface ProviderConfig {
  name: string;
  model: string;
  envKey: string;
  callStream: (apiKey: string, system: string, messages: Array<{role: string; content: string}>) => Promise<Response>;
  callNonStream: (apiKey: string, system: string, messages: Array<{role: string; content: string}>) => Promise<Response>;
  extractNonStream: (json: any) => string;
  parseSSEChunk: (line: string) => string | null;
}

const providers: ProviderConfig[] = [
  {
    name: "google",
    model: "gemini-2.5-flash",
    envKey: "GOOGLE_AI_STUDIO",
    callStream: (apiKey, system, messages) => {
      const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });
    },
    callNonStream: (apiKey, system, messages) => {
      const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });
    },
    extractNonStream: (j) => j.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
    parseSSEChunk: (line) => {
      try {
        const json = JSON.parse(line);
        return json.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch { return null; }
    },
  },
  {
    name: "anthropic",
    model: "claude-sonnet-4-20250514",
    envKey: "ANTHROPIC_API_KEY",
    callStream: (apiKey, system, messages) =>
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system, messages, stream: true }),
      }),
    callNonStream: (apiKey, system, messages) =>
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system, messages }),
      }),
    extractNonStream: (j) => j.content?.[0]?.text ?? "",
    parseSSEChunk: (line) => {
      try {
        const json = JSON.parse(line);
        if (json.type === "content_block_delta") return json.delta?.text ?? null;
        return null;
      } catch { return null; }
    },
  },
  {
    name: "openai",
    model: "gpt-4.1-2025-04-14",
    envKey: "OPENAI_API_KEY",
    callStream: (apiKey, system, messages) =>
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4.1-2025-04-14", messages: [{ role: "system", content: system }, ...messages], max_tokens: 1024, temperature: 0.7, stream: true }),
      }),
    callNonStream: (apiKey, system, messages) =>
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4.1-2025-04-14", messages: [{ role: "system", content: system }, ...messages], max_tokens: 1024, temperature: 0.7 }),
      }),
    extractNonStream: (j) => j.choices?.[0]?.message?.content ?? "",
    parseSSEChunk: (line) => {
      try {
        const json = JSON.parse(line);
        return json.choices?.[0]?.delta?.content ?? null;
      } catch { return null; }
    },
  },
];

/* ── Intent classification using Gemini Flash Lite ── */
interface IntentResult { agent: string; confidence: number; intent: string; }

async function classifyIntent(message: string, googleKey: string | undefined): Promise<IntentResult> {
  const fallback: IntentResult = { agent: "mochi", confidence: 0.5, intent: "general" };
  if (!googleKey) return fallback;
  try {
    const classifyPrompt = `You are an intent classifier for Mochi the Garden Bee platform. Classify the user's message into EXACTLY ONE agent and intent.

Available agents:
- "bee-facts": Questions about bees, honey, hives, pollination, bee anatomy, bee species, beekeeping
- "garden": Questions about gardening, plants, permaculture, composting, soil, vegetables, herbs, kitchen garden
- "language": Language learning, vocabulary, translations between English/Spanish, word meanings
- "lunar-calendar": Moon phases, lunar gardening, planting by moon, biodynamic calendar
- "storycard": Requests for stories, tales, narratives about bees or gardens for children
- "mochi": General conversation, greetings, jokes, anything that doesn't fit above categories

Respond ONLY with valid JSON: {"agent": "<name>", "confidence": <0.0-1.0>, "intent": "<short description>"}

User message: "${message.slice(0, 300)}"`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${googleKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: classifyPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 100 },
      }),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (!jsonMatch) return fallback;
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      agent: parsed.agent || "mochi",
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      intent: parsed.intent || "general",
    };
  } catch (err) {
    console.error("Intent classification error:", err);
    return fallback;
  }
}

/* ── Resolve agent system prompt from DB ── */
async function resolveAgentPrompt(supabase: any, intentResult: IntentResult, fallbackPrompt: string): Promise<{ systemPrompt: string; agentName: string }> {
  const agentName = intentResult.confidence >= 0.6 ? intentResult.agent : "mochi";
  try {
    const { data: agentRow } = await supabase.from("agents").select("system_prompt, name").eq("name", agentName).eq("is_active", true).limit(1).single();
    if (agentRow?.system_prompt) return { systemPrompt: agentRow.system_prompt, agentName: agentRow.name };
    if (agentName !== "mochi") {
      const { data: mochiRow } = await supabase.from("agents").select("system_prompt").eq("name", "mochi").eq("is_active", true).limit(1).single();
      if (mochiRow?.system_prompt) return { systemPrompt: mochiRow.system_prompt, agentName: "mochi" };
    }
  } catch (_) {}
  return { systemPrompt: fallbackPrompt, agentName: "mochi" };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startMs = Date.now();

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { message, conversation_history = [], language = "en", age_level, user_id, stream: wantStream = true } = await req.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "No message provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const googleKey = Deno.env.get("GOOGLE_AI_STUDIO");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY not set — needed for embeddings");

    // ── 0. Intent Classification + Embed query (parallel) ──
    const [intentResult, embRes] = await Promise.all([
      classifyIntent(message, googleKey),
      fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ input: message, model: "text-embedding-3-small" }),
      }),
    ]);

    console.log(`RAG v2: Intent → ${intentResult.agent} (${(intentResult.confidence * 100).toFixed(0)}%): ${intentResult.intent}`);

    const embData = await embRes.json();
    const embedding = embData.data?.[0]?.embedding;
    if (!embedding) throw new Error("Embedding generation failed");

    // ── 1. Resolve agent prompt ──
    const { systemPrompt, agentName } = await resolveAgentPrompt(supabase, intentResult, FALLBACK_SYSTEM);

    // ── 2. Parallel vector searches ──
    const [unifiedRes, vocabRes] = await Promise.all([
      supabase.rpc("unified_mochi_search", { query_embedding: embedding, match_threshold: 0.3, match_count: 6, filter_age: age_level || null, filter_domain: null }),
      supabase.rpc("match_vocabulary_cards", { query_embedding: embedding, match_threshold: 0.35, match_count: 3, filter_domain: null, filter_age: age_level || null }),
    ]);

    const unified = unifiedRes.data ?? [];
    const vocab = vocabRes.data ?? [];

    // ── 3. KG neighbours ──
    const topKgNode = unified.find((r: any) => r.source === "knowledge_graph");
    let kgConnections: string[] = [];
    if (topKgNode) {
      const { data: neighbours } = await supabase.rpc("get_kg_neighbours", { p_node_name: topKgNode.title, p_depth: 2 });
      if (neighbours?.length) kgConnections = neighbours.map((n: any) => `${n.source_name} →[${n.relation}]→ ${n.target_name}`);
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
    if (kgConnections.length) contextBlock += "\n## Knowledge Graph Connections\n" + kgConnections.map((c: string) => `• ${c}`).join("\n") + "\n";
    if (vocab.length) contextBlock += "\n## Vocabulary\n" + vocab.map((v: any) => `• ${v.word_en} / ${v.word_es}`).join("\n") + "\n";
    if (agentName !== "mochi") contextBlock += `\n## Agent Context\nYou are responding as the ${agentName} specialist. Focus your expertise on ${intentResult.intent}.\n`;

    const finalSystem = systemPrompt + contextBlock;

    // ── 5. Build messages ──
    const chatMessages: Array<{role: string; content: string}> = [];
    if (Array.isArray(conversation_history) && conversation_history.length > 0) {
      for (const turn of conversation_history.slice(-6)) {
        if (turn.role && turn.content) chatMessages.push({ role: turn.role, content: turn.content });
      }
    }
    chatMessages.push({ role: "user", content: message });

    // Pre-build metadata for SSE header
    const sources = unified.map((u: any) => ({ title: u.title, domain: u.domain || u.source, source: u.source, sim: Math.round((u.similarity ?? 0) * 100) }));
    const vocabHints = vocab.map((v: any) => `${v.word_en} / ${v.word_es}`);
    const metadata = {
      sources,
      kg_connections: kgConnections,
      vocab_hint: vocabHints,
      agent: agentName,
      intent: intentResult.intent,
      intent_confidence: intentResult.confidence,
    };

    // ── 6. Multi-model cascade with streaming ──
    if (wantStream) {
      // Try streaming from each provider
      for (const provider of providers) {
        const apiKey = Deno.env.get(provider.envKey);
        if (!apiKey) continue;
        if (isCircuitOpen(provider.name)) {
          console.log(`RAG v2: Circuit OPEN for ${provider.name}, skipping`);
          continue;
        }

        try {
          console.log(`RAG v2: Streaming from ${provider.name}/${provider.model}...`);
          const res = await provider.callStream(apiKey, finalSystem, chatMessages);

          if (!res.ok) {
            const errText = await res.text();
            console.error(`${provider.name} ${res.status}: ${errText}`);
            recordFailure(provider.name);
            continue;
          }

          recordSuccess(provider.name);

          // Create SSE transform stream
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();
          let fullResponse = "";

          const stream = new ReadableStream({
            async start(controller) {
              // Send metadata header as first SSE event
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "metadata", ...metadata, provider: provider.name, model: provider.model })}\n\n`));

              const reader = res.body!.getReader();
              let buffer = "";

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  buffer += decoder.decode(value, { stream: true });
                  let newlineIdx: number;

                  while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
                    let line = buffer.slice(0, newlineIdx);
                    buffer = buffer.slice(newlineIdx + 1);
                    if (line.endsWith("\r")) line = line.slice(0, -1);
                    if (!line.startsWith("data: ") || line.trim() === "") continue;

                    const jsonStr = line.slice(6).trim();
                    if (jsonStr === "[DONE]") continue;

                    const text = provider.parseSSEChunk(jsonStr);
                    if (text) {
                      fullResponse += text;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", content: text })}\n\n`));
                    }
                  }
                }

                // Final flush
                if (buffer.trim()) {
                  for (const raw of buffer.split("\n")) {
                    if (!raw.startsWith("data: ")) continue;
                    const jsonStr = raw.slice(6).trim();
                    if (jsonStr === "[DONE]") continue;
                    const text = provider.parseSSEChunk(jsonStr);
                    if (text) {
                      fullResponse += text;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", content: text })}\n\n`));
                    }
                  }
                }

                const latency = Date.now() - startMs;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", latency_ms: latency })}\n\n`));
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();

                // Fire-and-forget logging
                supabase.from("rag_queries").insert({
                  query_text: message, language, session_id: user_id || null,
                  matched_knowledge_ids: unified.map((u: any) => u.id),
                  similarity_scores: unified.map((u: any) => Math.round((u.similarity ?? 0) * 100)),
                  response_preview: fullResponse.slice(0, 200),
                  agent_used: agentName, intent_confidence: intentResult.confidence, intent_matched: intentResult.intent,
                }).then(() => {});

                supabase.from("mochi_integrations").insert({
                  platform: provider.name, model: provider.model, message_length: message.length,
                  response_time_ms: latency, success: true, orchestrated: true, function_category: "rag_v2_stream",
                  options: { user_id: user_id || "guest", sources_count: unified.length, kg_count: kgConnections.length, vocab_count: vocab.length, history_turns: chatMessages.length - 1, agent: agentName, intent: intentResult.intent },
                }).then(() => {});

              } catch (err) {
                console.error("Stream processing error:", err);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error: String(err) })}\n\n`));
                controller.close();
              }
            }
          });

          return new Response(stream, {
            headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" },
          });

        } catch (err) {
          console.error(`${provider.name} stream error:`, err);
          recordFailure(provider.name);
          continue;
        }
      }

      // All streaming providers failed — fall through to non-stream
      console.log("RAG v2: All streaming providers failed, falling back to non-stream");
    }

    // ── Non-streaming fallback ──
    let responseText = "";
    let usedProvider = "";
    let usedModel = "";
    let lastError = "";

    for (const provider of providers) {
      const apiKey = Deno.env.get(provider.envKey);
      if (!apiKey) continue;
      if (isCircuitOpen(provider.name)) continue;

      try {
        const res = await provider.callNonStream(apiKey, finalSystem, chatMessages);
        if (!res.ok) {
          const errText = await res.text();
          console.error(`${provider.name} ${res.status}: ${errText}`);
          recordFailure(provider.name);
          lastError = `${provider.name} ${res.status}`;
          continue;
        }
        recordSuccess(provider.name);
        const json = await res.json();
        responseText = provider.extractNonStream(json);
        usedProvider = provider.name;
        usedModel = provider.model;
        if (responseText) break;
      } catch (err) {
        recordFailure(provider.name);
        lastError = String(err);
        continue;
      }
    }

    if (!responseText) throw new Error(`All AI providers failed. Last: ${lastError}`);

    const latency = Date.now() - startMs;

    // Log
    supabase.from("rag_queries").insert({
      query_text: message, language, session_id: user_id || null,
      matched_knowledge_ids: unified.map((u: any) => u.id),
      similarity_scores: unified.map((u: any) => Math.round((u.similarity ?? 0) * 100)),
      response_preview: responseText.slice(0, 200),
      agent_used: agentName, intent_confidence: intentResult.confidence, intent_matched: intentResult.intent,
    }).then(() => {});

    supabase.from("mochi_integrations").insert({
      platform: usedProvider, model: usedModel, message_length: message.length,
      response_time_ms: latency, success: true, orchestrated: true, function_category: "rag_v2",
      options: { user_id: user_id || "guest", sources_count: unified.length, kg_count: kgConnections.length, vocab_count: vocab.length, history_turns: chatMessages.length - 1, agent: agentName, intent: intentResult.intent },
    }).then(() => {});

    return new Response(
      JSON.stringify({ response: responseText, ...metadata, provider: usedProvider, model: usedModel, latency_ms: latency }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("mochi_rag_v2 error:", err);
    return new Response(
      JSON.stringify({ error: String(err), response: "Oh bee-have! I'm having a bee-wildering technical moment. Please try again!" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// DEPRECATED — Single-purpose health ping. Kept for reference only.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthResult {
  service: string;
  status: "ok" | "error";
  latency_ms: number;
  detail: string;
}

async function checkGemini(apiKey: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    // List models endpoint — lightweight, confirms key validity
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`
    );
    const latency = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      const modelCount = data.models?.length ?? 0;
      return { service: "gemini", status: "ok", latency_ms: latency, detail: `Key valid, ${modelCount}+ models available` };
    }
    const errText = await res.text();
    return { service: "gemini", status: "error", latency_ms: latency, detail: `HTTP ${res.status}: ${errText.slice(0, 100)}` };
  } catch (e) {
    return { service: "gemini", status: "error", latency_ms: Date.now() - start, detail: String(e).slice(0, 100) };
  }
}

async function checkAnthropic(apiKey: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    // Send a minimal request that validates the key (will return quickly)
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    const latency = Date.now() - start;
    if (res.ok || res.status === 200) {
      return { service: "anthropic", status: "ok", latency_ms: latency, detail: "Key valid, API responsive" };
    }
    // 401 = bad key, 429 = rate limited (key works), 400 = key works but bad request
    if (res.status === 429) {
      return { service: "anthropic", status: "ok", latency_ms: latency, detail: "Key valid (rate limited)" };
    }
    if (res.status === 401) {
      return { service: "anthropic", status: "error", latency_ms: latency, detail: "Invalid API key" };
    }
    return { service: "anthropic", status: "ok", latency_ms: latency, detail: `Responded with ${res.status}` };
  } catch (e) {
    return { service: "anthropic", status: "error", latency_ms: Date.now() - start, detail: String(e).slice(0, 100) };
  }
}

async function checkOpenAI(apiKey: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const latency = Date.now() - start;
    if (res.ok) {
      return { service: "openai", status: "ok", latency_ms: latency, detail: "Key valid, models endpoint OK" };
    }
    if (res.status === 401) {
      return { service: "openai", status: "error", latency_ms: latency, detail: "Invalid API key" };
    }
    return { service: "openai", status: "ok", latency_ms: latency, detail: `Responded with ${res.status}` };
  } catch (e) {
    return { service: "openai", status: "error", latency_ms: Date.now() - start, detail: String(e).slice(0, 100) };
  }
}

async function checkElevenLabs(apiKey: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey },
    });
    const latency = Date.now() - start;
    if (res.ok) {
      return { service: "elevenlabs", status: "ok", latency_ms: latency, detail: "Key valid, voice service ready" };
    }
    if (res.status === 401) {
      return { service: "elevenlabs", status: "error", latency_ms: latency, detail: "Invalid API key" };
    }
    return { service: "elevenlabs", status: "ok", latency_ms: latency, detail: `Responded with ${res.status}` };
  } catch (e) {
    return { service: "elevenlabs", status: "error", latency_ms: Date.now() - start, detail: String(e).slice(0, 100) };
  }
}

async function checkXAI(apiKey: string): Promise<HealthResult> {
  const start = Date.now();
  try {
    const res = await fetch("https://api.x.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const latency = Date.now() - start;
    if (res.ok) {
      return { service: "xai", status: "ok", latency_ms: latency, detail: "Key valid, Grok models available" };
    }
    if (res.status === 401) {
      return { service: "xai", status: "error", latency_ms: latency, detail: "Invalid API key" };
    }
    return { service: "xai", status: "ok", latency_ms: latency, detail: `Responded with ${res.status}` };
  } catch (e) {
    return { service: "xai", status: "error", latency_ms: Date.now() - start, detail: String(e).slice(0, 100) };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const requestedServices: string[] = body.services || ["gemini", "anthropic", "openai", "elevenlabs", "xai"];

    const results: HealthResult[] = [];
    const checks: Promise<void>[] = [];

    if (requestedServices.includes("gemini")) {
      const key = Deno.env.get("GOOGLE_AI_STUDIO");
      if (key) {
        checks.push(checkGemini(key).then((r) => { results.push(r); }));
      } else {
        results.push({ service: "gemini", status: "error", latency_ms: 0, detail: "GOOGLE_AI_STUDIO secret not set" });
      }
    }

    if (requestedServices.includes("anthropic")) {
      const key = Deno.env.get("ANTHROPIC_API_KEY");
      if (key) {
        checks.push(checkAnthropic(key).then((r) => { results.push(r); }));
      } else {
        results.push({ service: "anthropic", status: "error", latency_ms: 0, detail: "ANTHROPIC_API_KEY not set" });
      }
    }

    if (requestedServices.includes("openai")) {
      const key = Deno.env.get("OPENAI_API_KEY");
      if (key) {
        checks.push(checkOpenAI(key).then((r) => { results.push(r); }));
      } else {
        results.push({ service: "openai", status: "error", latency_ms: 0, detail: "OPENAI_API_KEY not set" });
      }
    }

    if (requestedServices.includes("elevenlabs")) {
      const key = Deno.env.get("ELEVENLABS_API_KEY");
      if (key) {
        checks.push(checkElevenLabs(key).then((r) => { results.push(r); }));
      } else {
        results.push({ service: "elevenlabs", status: "error", latency_ms: 0, detail: "ELEVENLABS_API_KEY not set" });
      }
    }

    if (requestedServices.includes("xai")) {
      const key = Deno.env.get("XAI_API_KEY");
      if (key) {
        checks.push(checkXAI(key).then((r) => { results.push(r); }));
      } else {
        results.push({ service: "xai", status: "error", latency_ms: 0, detail: "XAI_API_KEY not set" });
      }
    }

    // Run all checks in parallel
    await Promise.allSettled(checks);

    return new Response(JSON.stringify({ results, checked_at: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

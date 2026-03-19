import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENTS = [
  { name: "Mochi", id: "agent_1301kkyvc82vey5896n39y1cm5hc" },
  { name: "BeeBee", id: "agent_8101km13rwc3eyb98g0wampfx499" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const results: Array<Record<string, unknown>> = [];

  // Test token generation for each agent
  for (const agent of AGENTS) {
    const start = Date.now();
    let status = "healthy";
    let errorMessage: string | null = null;

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agent.id}`,
        { headers: { "xi-api-key": apiKey } }
      );

      if (!res.ok) {
        const body = await res.text();
        status = res.status === 429 ? "degraded" : "down";
        errorMessage = `${res.status}: ${body.substring(0, 200)}`;
      }
    } catch (err) {
      status = "down";
      errorMessage = err.message;
    }

    const responseTime = Date.now() - start;
    const record = {
      agent_name: agent.name,
      agent_id: agent.id,
      status,
      error_message: errorMessage,
      response_time_ms: responseTime,
      checked_at: new Date().toISOString(),
    };

    results.push(record);
    await supabase.from("voice_agent_health").insert(record);
  }

  // Check quota via subscription endpoint
  let quotaInfo: Record<string, unknown> | null = null;
  try {
    const subRes = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": apiKey },
    });
    if (subRes.ok) {
      const sub = await subRes.json();
      quotaInfo = {
        character_count: sub.character_count,
        character_limit: sub.character_limit,
        remaining: (sub.character_limit || 0) - (sub.character_count || 0),
        tier: sub.tier,
      };
    }
  } catch (_) {
    // non-critical
  }

  console.log("🐝 Voice agent health check complete:", JSON.stringify(results));

  return new Response(
    JSON.stringify({ agents: results, quota: quotaInfo }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

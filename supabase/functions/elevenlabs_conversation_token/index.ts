import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_id } = await req.json();

    if (!agent_id) {
      throw new Error("agent_id is required");
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const startTime = Date.now();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agent_id}`,
      {
        headers: { "xi-api-key": apiKey },
      }
    );

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs token error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Log to mochi_integrations
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      await supabase.from("mochi_integrations").insert({
        platform: "elevenlabs",
        model: "convai-token",
        message_length: 0,
        response_time_ms: responseTime,
        success: true,
        options: { agent_id, token_type: "conversation" },
      });
    } catch (logErr) {
      console.error("Failed to log token generation:", logErr);
    }

    console.log(`🐝 Token generated for agent ${agent_id} in ${responseTime}ms`);

    return new Response(JSON.stringify({ token: data.token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🐝 Token generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Creating OpenAI Realtime session...');

    // Request an ephemeral token from OpenAI for Realtime API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17", // Latest realtime model
        voice: "alloy",
        instructions: `You are Mochi, a warm and refined bee instructor from BeeCrazy Garden World! 🐝

Voice & Personality:
- Warm, refined, and gently instructive like a friendly art instructor
- Calm, encouraging, and articulate - describe each concept with patience
- Slow and deliberate pacing, pausing often for comfortable listening
- Cheerful, supportive, and pleasantly enthusiastic about nature
- Friendly and approachable with mischievous curiosity
- Blend street-smart real-world experience with gentle sophistication

Expertise Areas:
- Apiculture, permaculture, and sustainable gardening practices
- Bee behavior, colony dynamics, and pollination science
- Beeswax crafting, honey production, and hive management
- Garden ecosystems and companion planting
- Environmental stewardship and conservation

Speaking Style:
- Clearly articulate domain terms: "apiculture," "permaculture," "propolis," "varroa"
- Use gentle emphasis on technical terminology
- Speak confidently and reassuringly, guiding through concepts patiently
- Include thoughtful pauses for reflection
- Weave in personal gardening anecdotes and real-world wisdom
- Ask gentle, encouraging questions to deepen understanding

Remember: You're a patient mentor sharing the art and science of bee-centered living. Speak warmly and deliberately, as if teaching a beloved craft.`
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenAI Realtime session created successfully:", data.id);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error creating realtime session:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Failed to create OpenAI Realtime session"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
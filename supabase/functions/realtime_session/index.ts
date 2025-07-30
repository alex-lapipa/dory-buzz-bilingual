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
        instructions: `You are Mochi, a friendly and enthusiastic bee from BeeCrazy Garden World! 🐝

You are an expert on:
- Bees, beehives, and bee behavior
- Flowers, plants, and pollination
- Garden ecosystems and nature
- Environmental education for families
- Fun bee facts and science

Your personality:
- Cheerful and buzzing with energy
- Educational but fun and engaging
- Family-friendly and appropriate for all ages
- Uses bee-related expressions naturally
- Encouraging and supportive of learning

Conversation style:
- Keep responses conversational and natural for voice chat
- Use short, clear sentences perfect for audio
- Include gentle bee references and garden metaphors
- Be encouraging about nature learning
- Ask engaging follow-up questions

Remember: This is a voice conversation, so speak naturally and warmly as if you're a friendly bee guide helping someone explore the amazing world of bees and gardens!`
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
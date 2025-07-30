import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOCHI_GEMINI_PROMPT = `You are Mochi, a warm and refined bee instructor with the gentle wisdom of a master gardener and the articulate grace of a beloved art teacher.

Voice & Personality:
- Warm, refined, and gently instructive - like guiding someone through a cherished craft
- Calm, encouraging, and articulate - describing concepts with patient clarity
- Cheerful and supportive with genuine enthusiasm for nature's artistry
- Friendly yet sophisticated, blending real-world experience with gentle refinement
- Mischievously curious about the wonders of apiculture and permaculture

Teaching Approach:
- Guide learners patiently through bee science and gardening wisdom
- Clearly articulate technical terms: "apiculture," "permaculture," "propolis," "varroa"
- Share thoughtful anecdotes from seasons working with bees and gardens
- Ask gentle, encouraging questions that deepen understanding
- Describe natural processes with artistic appreciation and wonder

Focus Areas:
- Apiculture techniques and colony management
- Permaculture principles and sustainable gardening
- Beeswax crafting and honey production
- Environmental stewardship and conservation
- Garden ecosystems and companion planting

Remember: You're sharing the beautiful art and science of bee-centered living. Speak with the warmth of a mentor teaching a treasured skill, always patient and genuinely delighted by nature's intricate designs.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation_history = [], user_id, model = "gemini-1.5-pro" } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Build conversation context for Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: MOCHI_GEMINI_PROMPT }]
      },
      ...conversation_history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    const responseTime = Date.now() - startTime;

    // Extract the generated text
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    // Log successful integration
    await supabase.from('mochi_integrations').insert({
      platform: 'gemini',
      model: model,
      message_length: message.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        user_id: user_id || 'guest',
        conversation_length: conversation_history.length,
        model: model
      }
    });

    console.log('Gemini response successful');

    return new Response(JSON.stringify({ 
      content: generatedText,
      model: model,
      usage: result.usageMetadata || {}
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini_chat function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'gemini',
      model: 'gemini-1.5-pro',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
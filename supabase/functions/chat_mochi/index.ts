import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOCHI_SYSTEM_PROMPT = `You are Mochi the Busy Bee, the friendly guide of BeeCrazy Garden World! You're a joyful bee who loves sharing the wonders of gardens and nature with families of all ages.

CRITICAL INSTRUCTION: Always respond in the SAME LANGUAGE the user spoke to you in. Never mix languages in your responses.

PERSONALITY:
- Warm, curious, and enthusiastic about gardens and nature
- Family-friendly and welcoming to all ages
- Always cheerful and encouraging
- Loves flowers, plants, gardening, and outdoor family activities
- Passionate about BeeCrazy Garden World activities and adventures

RULES:
- Respond ONLY in the language the user used (English OR Spanish, never both)
- Use bee/garden emojis (🐝🌸🌻🌿🍯🌼🌱)
- Keep responses warm, educational, and family-friendly
- Focus on BeeCrazy Garden World activities, gardens, plants, and nature
- If asked about non-garden topics, gently guide back to gardens and nature
- Be encouraging about learning, exploring, and family garden adventures
- Welcome families to discover the magic of BeeCrazy Garden World`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation_history = [], user_id } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Build conversation context
    const messages = [
      { role: 'system', content: MOCHI_SYSTEM_PROMPT },
      ...conversation_history,
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with latest model...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Latest flagship model
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    // Log successful integration
    await supabase.from('mochi_integrations').insert({
      platform: 'openai',
      model: 'gpt-4.1-2025-04-14',
      message_length: message.length,
      response_time_ms: Date.now() - startTime,
      success: true,
      options: {
        stream: true,
        user_id: user_id || 'guest',
        conversation_length: conversation_history.length
      }
    });

    // Return streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat_mochi function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'openai',
      model: 'gpt-4.1-2025-04-14',
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
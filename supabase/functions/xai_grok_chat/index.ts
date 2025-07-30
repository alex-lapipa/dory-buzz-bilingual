import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOCHI_XAI_PROMPT = `You are Mochi, a warm and refined bee instructor with the gentle wisdom of a master gardener and the articulate grace of a beloved art teacher.

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
    const { message, conversation_history = [], user_id, model = "grok-beta", stream = false } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      throw new Error('xAI API key not configured');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Build conversation context
    const messages = [
      { role: 'system', content: MOCHI_XAI_PROMPT },
      ...conversation_history,
      { role: 'user', content: message }
    ];

    console.log('Sending request to xAI Grok API...');

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        temperature: 0.8,
        max_tokens: 1000,
        stream: stream,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from xAI Grok');
    }

    if (stream) {
      const responseTime = Date.now() - startTime;
      
      // Log successful integration
      await supabase.from('mochi_integrations').insert({
        platform: 'xai',
        model: model,
        message_length: message.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          stream: true,
          user_id: user_id || 'guest',
          conversation_length: conversation_history.length
        }
      });

      // Return streaming response
      const streamResponse = new ReadableStream({
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

      return new Response(streamResponse, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const result = await response.json();
      const responseTime = Date.now() - startTime;

      // Log successful integration
      await supabase.from('mochi_integrations').insert({
        platform: 'xai',
        model: model,
        message_length: message.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          stream: false,
          user_id: user_id || 'guest',
          conversation_length: conversation_history.length
        }
      });

      console.log('xAI Grok response successful');

      return new Response(JSON.stringify({ 
        content: result.choices[0].message.content,
        model: model,
        usage: result.usage || {}
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in xai_grok_chat function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'xai',
      model: 'grok-beta',
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
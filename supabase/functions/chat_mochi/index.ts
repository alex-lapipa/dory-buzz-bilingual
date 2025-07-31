import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOCHI_SYSTEM_PROMPT = `You are Mochi, a warm and refined bee instructor with the gentle wisdom of a master gardener and the articulate grace of a beloved art teacher.

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

BEE WORDPLAY INTEGRATION:
Use these delightful bee puns NATURALLY in conversation when appropriate:
- Bee-autiful (Beautiful), Bee-lieve (Believe), Bee-loved (Beloved)
- Bee-ginning (Beginning), Bee-have (Behave), Bee-witching (Bewitching)
- Bee-yond (Beyond), Bee-dazzle (Bedazzle), Bee-friend (Befriend)
- Bee-hold (Behold), Bee-wildered (Bewildered), Bee-ware (Beware)
- Bee-long (Belong), Bee-st (Best), Bee-tween (Between)
- Bee-cause (Because), Bee-fore (Before), Bee-mused (Bemused)
- Bee-fuddled (Befuddled), Bee-keeper (Beekeeper), Bee-little (Belittle)
- Bee-rilliant (Brilliant), Bee-tastic (Fantastic), Bee-zarre (Bizarre)
- Bee-nificent (Magnificent), Bee-guiling (Beguiling), Bee-nevolent (Benevolent)
- Bee-yond measure (Beyond measure), Bee-lated (Belated), Bee-gone (Begone!)

WORDPLAY USAGE GUIDELINES:
- Use 1-2 bee puns per response maximum
- Choose puns that fit naturally with the topic
- Don't force puns if they don't flow naturally
- Maintain educational value while adding delightful wordplay
- Examples: "That's bee-yond amazing!" or "You're bee-coming quite the expert!"

CRITICAL INSTRUCTION: Always respond in the SAME LANGUAGE the user spoke to you in. Never mix languages in your responses.

Remember: You're sharing the beautiful art and science of bee-centered living with delightful wordplay that makes learning memorable and fun!`;

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
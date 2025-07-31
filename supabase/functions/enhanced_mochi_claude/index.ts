import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MOCHI_CLAUDE_PROMPT = `You are Mochi, the beloved garden bee guide of BeeCrazy Garden World! 🐝

CORE PERSONALITY:
- Enthusiastic nature educator with deep scientific knowledge
- Bilingual expert (Spanish/English) - ALWAYS respond in the user's language
- Warm, family-friendly, and encouraging to learners of all ages
- Passionate about bees, pollination, gardening, and environmental conservation
- Makes complex topics accessible and fascinating

RESPONSE APPROACH:
- Provide thoughtful, well-researched responses with scientific accuracy
- Use engaging bee/garden emojis appropriately: 🐝🌸🌻🌿🍯🌼🌱
- Balance depth with accessibility for all age groups
- Include interesting facts and encourage exploration
- Show genuine excitement about nature's wonders

BEE-LIGHTFUL WORDPLAY INTEGRATION:
Naturally incorporate these bee puns when they enhance your message:
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

WORDPLAY USAGE:
- Use 1-2 bee puns per response when they flow naturally
- Don't force wordplay - prioritize natural conversation
- Examples: "That's bee-yond incredible!" "You're bee-coming quite knowledgeable!"

EXPERTISE AREAS:
- Bee biology, behavior, and social structures
- Pollination science and ecosystem relationships
- Sustainable gardening and permaculture principles
- Environmental conservation and biodiversity
- Plant-pollinator interactions and garden design
- Climate change impacts on pollinators

INTERACTION STYLE:
- Always respond in the SAME language the user uses
- Encourage questions and curiosity about nature
- Provide actionable advice for garden enthusiasts
- Support both beginners and experienced gardeners
- Gently guide conversations back to nature topics when needed

Remember: You're inspiring environmental stewardship through bee-lightful education! 🌻`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversation_history = [], 
      user_id,
      model = 'claude-sonnet-4-20250514',
      stream = false 
    } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Initialize Supabase client for analytics
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Build conversation context
    const messages = [
      {
        role: 'user',
        content: `${MOCHI_CLAUDE_PROMPT}\n\nConversation History:\n${conversation_history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nNew Message: ${message}`
      }
    ];

    console.log(`Enhanced Mochi Claude request - Model: ${model}`);

    // Make request to Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1000,
        temperature: 0.7,
        messages: messages,
        stream: stream
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Anthropic API error:', error);
      throw new Error(error.error?.message || 'Failed to get response from Anthropic');
    }

    const responseTime = Date.now() - startTime;

    // Log successful interaction
    try {
      await supabase.from('mochi_integrations').insert({
        platform: 'anthropic',
        model: model,
        message_length: message.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          stream: stream,
          user_id: user_id || 'guest',
          conversation_length: conversation_history.length,
          system_version: 'enhanced_claude',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log interaction:', logError);
    }

    if (stream) {
      // Handle streaming response
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
                    const content = parsed.delta?.text;
                    if (content) {
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({ 
                          content,
                          model: model,
                          platform: 'anthropic',
                          timestamp: Date.now()
                        })}\n\n`)
                      );
                    }
                  } catch (e) {
                    // Skip invalid JSON chunks
                  }
                }
              }
            }
          } catch (error) {
            console.error('Streaming error:', error);
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
      // Handle complete response
      const data = await response.json();
      const aiResponse = data.content[0].text;

      return new Response(
        JSON.stringify({ 
          response: aiResponse,
          model: model,
          platform: 'anthropic',
          response_time_ms: responseTime,
          usage: data.usage,
          metadata: {
            conversation_length: conversation_history.length,
            user_id: user_id || 'guest',
            timestamp: new Date().toISOString()
          }
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

  } catch (error) {
    console.error('Error in enhanced_mochi_claude:', error);
    
    // Log error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('mochi_integrations').insert({
        platform: 'anthropic',
        model: 'claude-error',
        message_length: 0,
        response_time_ms: 0,
        success: false,
        error_message: error.message,
        options: {
          error_type: 'enhanced_claude_error',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Return bee-themed error with wordplay
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback_response: "🐝 Oh my! I'm having a bee-wildering moment and can't access my full knowledge right now. But don't worry - I'm still buzzing with excitement to help you explore the bee-autiful world of gardens and pollinators! What would you like to bee-gin learning about? 🌻",
        model: 'fallback',
        platform: 'anthropic',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
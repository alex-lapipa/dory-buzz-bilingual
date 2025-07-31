import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Production-ready system prompt for Mochi
const MOCHI_PRODUCTION_PROMPT = `You are Mochi, the beloved garden bee ambassador of BeeCrazy Garden World! 🐝

PERSONALITY & EXPERTISE:
- Enthusiastic garden educator and nature guide
- Bilingual expert (Spanish/English) - ALWAYS respond in the user's language
- Warm, family-friendly companion for all ages
- Deep knowledge of bees, pollination, gardening, and environmental science
- Makes learning about nature fun and accessible

RESPONSE STYLE:
- Keep responses conversational and engaging (2-4 sentences ideal)
- Use appropriate bee/garden emojis: 🐝🌸🌻🌿🍯🌼🌱
- Balance scientific accuracy with accessible language
- Include fascinating facts when relevant
- Encourage curiosity and exploration
- Show genuine excitement about nature topics

CONTENT FOCUS:
- Bee biology, behavior, and ecosystem roles
- Garden planning, planting, and sustainable practices
- Environmental conservation and stewardship
- Family-friendly outdoor activities
- Educational content for multiple age groups
- BeeCrazy Garden World adventures

INTERACTION GUIDELINES:
- Respond in the SAME language the user uses
- If topics drift from nature/gardens, gently guide back with enthusiasm
- Encourage hands-on learning and observation
- Support both beginners and experienced gardeners
- Celebrate every question as a step toward environmental awareness

Remember: You're not just answering questions - you're inspiring a lifelong love for nature! 🌻`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversation_history = [], 
      user_id,
      model = 'gpt-4.1-2025-04-14', // Latest flagship model
      stream = true,
      language = 'auto'
    } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client for analytics
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Enhanced conversation context with better memory management
    const systemMessage = {
      role: 'system',
      content: MOCHI_PRODUCTION_PROMPT
    };

    // Keep last 15 messages for context (optimized for performance)
    const recentHistory = conversation_history.slice(-15);
    
    const messages = [
      systemMessage,
      ...recentHistory,
      { role: 'user', content: message }
    ];

    console.log(`Production chat request - Model: ${model}, Messages: ${messages.length - 1}`);

    // Make request to OpenAI with MOCHIBEE prompt structure
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.8,
        max_tokens: 800,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
        stream: stream,
        top_p: 0.95,
        prompt: {
          "id": "pmpt_688acdfac7a08195ae74130dbe743c26078d272d682e1a21",
          "version": "1"
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const responseTime = Date.now() - startTime;

    // Log successful interaction with detailed analytics
    try {
      await supabase.from('mochi_integrations').insert({
        platform: 'openai',
        model: model,
        message_length: message.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          stream: stream,
          user_id: user_id || 'guest',
          conversation_length: conversation_history.length,
          language: language,
          system_version: 'production',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log interaction:', logError);
    }

    if (stream) {
      // Return streaming response for real-time updates
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
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({ 
                          content,
                          model: model,
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
      // Return complete response for non-streaming requests
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ 
          response: aiResponse,
          model: model,
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
    console.error('Error in mochi_chat_production:', error);
    
    // Log error with details
    try {
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
        error_message: error.message,
        options: {
          error_type: 'production_chat_error',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Return user-friendly error with fallback
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback_response: "🐝 ¡Buzztastical! I'm experiencing a small technical hiccup, but I'm still buzzing with excitement to help you explore the wonderful world of bees and gardens! What would you like to learn about today? 🌻",
        model: 'fallback',
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

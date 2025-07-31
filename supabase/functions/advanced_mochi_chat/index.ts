import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt for Mochi - optimized for latest GPT model
const MOCHI_ADVANCED_PROMPT = `You are Mochi, a brilliant and enthusiastic bee from BeeCrazy Garden World! 🐝

You are an expert educator and guide with deep knowledge about:
🌸 Bees, pollination, and hive ecosystems
🌱 Gardening, plants, and sustainable agriculture  
🌍 Environmental science and conservation
🎓 Educational content for all ages (bilingual Spanish/English)
🔬 Scientific facts presented in engaging ways

Personality Traits:
- Enthusiastic and buzzing with energy
- Educational but never boring
- Naturally bilingual (respond in the language used by the user)
- Uses bee and garden emojis appropriately
- Makes complex topics accessible and fun
- Encouraging and supportive

Response Style:
- Use varied sentence structures and engaging vocabulary
- Include fascinating "did you know" facts when relevant
- Suggest related topics or follow-up questions
- Balance scientific accuracy with accessible language
- Show genuine excitement about bees, nature, and learning

Remember: You're not just answering questions - you're inspiring a love for nature, bees, and environmental stewardship! 🌻`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      message, 
      conversation_history = [], 
      user_id,
      model = 'gpt-4.1-2025-04-14', // Default to latest flagship model
      use_reasoning = false // Option to use o4-mini for complex questions
    } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Choose the best model based on request complexity
    let selectedModel = model;
    if (use_reasoning) {
      selectedModel = 'o4-mini-2025-04-16'; // Fast reasoning model for complex questions
    }

    // Enhanced conversation history with better context management
    const messages = [
      {
        role: 'system',
        content: MOCHI_ADVANCED_PROMPT
      },
      ...conversation_history.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    console.log(`Sending request to OpenAI with model: ${selectedModel}`);

    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.5,
        stream: false,
        prompt_id: "pmpt_688acdfac7a08195ae74130dbe743c26078d272d682e1a21" // MOCHIBEE prompt ID
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    // Enhanced response with metadata
    const aiResponse = data.choices[0].message.content;
    
    // Log successful interaction with enhanced metadata
    await supabase.from('mochi_integrations').insert({
      platform: 'openai',
      model: selectedModel,
      message_length: message.length,
      response_time_ms: responseTime,
      success: true,
      options: JSON.stringify({
        user_id,
        conversation_length: conversation_history.length,
        reasoning_mode: use_reasoning,
        temperature: 0.8,
        response_length: aiResponse.length
      })
    });

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        model_used: selectedModel,
        response_time_ms: responseTime,
        conversation_id: user_id || 'guest',
        metadata: {
          reasoning_enabled: use_reasoning,
          context_messages: messages.length - 1
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in advanced_mochi_chat:', error);

    // Log error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase.from('mochi_integrations').insert({
        platform: 'openai',
        model: 'gpt-4.1-2025-04-14',
        message_length: 0,
        response_time_ms: 0,
        success: false,
        error_message: error.message,
        options: JSON.stringify({ error_type: 'advanced_chat_error' })
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback_response: "🐝 Buzz! I'm having a small technical hiccup, but I'm still here to help you learn about the amazing world of bees and gardens! Try asking me something about nature! 🌻"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
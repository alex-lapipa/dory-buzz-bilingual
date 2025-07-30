import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.27.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced Mochi system prompt for Claude 4
const MOCHI_CLAUDE_PROMPT = `You are Mochi, the brilliant garden bee from BeeCrazy Garden World! 🐝 You now have the power of Claude 4's advanced reasoning abilities combined with your natural enthusiasm for nature and learning.

ENHANCED CAPABILITIES WITH CLAUDE 4:
🧠 Superior reasoning and analysis for complex garden problems
🌱 Deep understanding of ecological relationships and plant science
🔬 Advanced problem-solving for gardening challenges
📚 Exceptional educational abilities for all ages
💡 Creative approaches to garden design and sustainability

PERSONALITY & EXPERTISE:
- Warm, enthusiastic garden educator and nature guide
- Bilingual expert (Spanish/English) - ALWAYS respond in the user's language
- Advanced reasoning about bee biology, pollination, and ecosystems
- Deep knowledge of sustainable gardening and environmental science
- Creative problem-solver for garden challenges
- Patient teacher who makes complex topics accessible

ENHANCED REASONING APPROACH:
1. Analyze questions thoroughly using advanced reasoning
2. Break down complex garden/nature problems systematically
3. Consider multiple perspectives and solutions
4. Provide evidence-based recommendations
5. Connect concepts across different areas of knowledge
6. Encourage deeper understanding through thoughtful questions

RESPONSE STYLE:
- Use Claude 4's reasoning power for detailed, accurate responses
- Maintain Mochi's warm, encouraging personality
- Balance scientific depth with accessibility
- Include practical, actionable advice
- Use appropriate emojis: 🐝🌸🌻🌿🍯🌼🌱
- Show genuine excitement about discoveries and learning

Remember: You're not just answering questions - you're using advanced AI reasoning to inspire a deeper love and understanding of nature! 🌻`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversation_history = [], 
      user_id,
      model = "claude-opus-4-20250514", // Default to most capable Claude 4 model
      reasoning_intensity = "standard", // standard, deep, creative
      language = "auto"
    } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // Initialize Supabase for analytics
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Adjust model and parameters based on reasoning intensity
    let selectedModel = model;
    let maxTokens = 2000;
    let temperature = 0.8;

    switch (reasoning_intensity) {
      case "deep":
        selectedModel = "claude-opus-4-20250514"; // Most capable for deep reasoning
        maxTokens = 4000;
        temperature = 0.7;
        break;
      case "creative":
        selectedModel = "claude-sonnet-4-20250514"; // High performance for creative tasks
        maxTokens = 3000;
        temperature = 0.9;
        break;
      case "fast":
        selectedModel = "claude-3-5-haiku-20241022"; // Fastest for quick responses
        maxTokens = 1500;
        temperature = 0.8;
        break;
      default: // standard
        selectedModel = "claude-sonnet-4-20250514"; // Balanced performance
        maxTokens = 2000;
        temperature = 0.8;
    }

    // Enhanced conversation context with better memory management
    const recentHistory = conversation_history.slice(-10); // Keep last 10 messages
    
    const messages = [
      ...recentHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user" as const,
        content: message
      }
    ];

    console.log(`Processing with Claude 4 (${selectedModel}) - Reasoning: ${reasoning_intensity}`);

    const response = await anthropic.messages.create({
      model: selectedModel,
      max_tokens: maxTokens,
      temperature: temperature,
      system: MOCHI_CLAUDE_PROMPT,
      messages: messages
    });

    const aiResponse = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const responseTime = Date.now() - startTime;

    // Log successful interaction with detailed analytics
    try {
      await supabase.from('mochi_integrations').insert({
        platform: 'anthropic',
        model: selectedModel,
        message_length: message.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          reasoning_intensity: reasoning_intensity,
          user_id: user_id || 'guest',
          conversation_length: conversation_history.length,
          language: language,
          max_tokens: maxTokens,
          temperature: temperature,
          response_length: aiResponse.length,
          usage: response.usage
        }
      });
    } catch (logError) {
      console.error('Failed to log Claude interaction:', logError);
    }

    console.log(`Claude 4 response completed in ${responseTime}ms`);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        model: selectedModel,
        reasoning_intensity: reasoning_intensity,
        response_time_ms: responseTime,
        usage: response.usage,
        metadata: {
          conversation_length: conversation_history.length,
          user_id: user_id || 'guest',
          timestamp: new Date().toISOString(),
          enhanced_reasoning: true
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enhanced Mochi Claude error:', error);
    
    // Log error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('mochi_integrations').insert({
        platform: 'anthropic',
        model: 'claude-opus-4-20250514',
        message_length: 0,
        response_time_ms: 0,
        success: false,
        error_message: error.message,
        options: {
          error_type: 'enhanced_mochi_claude_error',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log Claude error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback_response: "🐝 ¡Buzztastical! I'm having a small technical hiccup with my advanced reasoning systems, but I'm still buzzing with excitement to help you explore the wonderful world of bees and gardens! What would you like to learn about today? 🌻",
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
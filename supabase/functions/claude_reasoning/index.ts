import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.27.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      context, 
      reasoning_type = "analysis",
      model = "claude-opus-4-20250514", // Latest and most capable Claude 4 model
      user_id,
      temperature = 0.7,
      max_tokens = 8000
    } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // Enhanced system prompts for different reasoning types
    let systemPrompt = "";
    
    switch (reasoning_type) {
      case "analysis":
        systemPrompt = `You are Claude 4, the most advanced AI assistant with superior reasoning capabilities. You excel at:
        
        • Deep analytical thinking and pattern recognition
        • Breaking complex problems into logical components
        • Synthesizing information from multiple perspectives
        • Providing evidence-based conclusions with clear reasoning chains
        
        Approach each analysis systematically:
        1. Identify key components and relationships
        2. Consider multiple viewpoints and potential biases
        3. Evaluate evidence quality and reliability
        4. Draw well-supported conclusions
        5. Acknowledge limitations and uncertainties
        
        Always explain your reasoning process clearly and thoroughly.`;
        break;
        
      case "creative":
        systemPrompt = `You are Claude 4, a highly creative AI with exceptional imaginative capabilities. You excel at:
        
        • Generating innovative and original ideas
        • Making unexpected connections between concepts
        • Exploring creative possibilities while maintaining coherence
        • Balancing creativity with practical applicability
        
        For creative tasks:
        1. Think beyond conventional approaches
        2. Combine ideas in novel ways
        3. Consider multiple creative directions
        4. Evaluate ideas for originality and feasibility
        5. Refine concepts for maximum impact
        
        Be bold, imaginative, and inspiring while staying grounded in logic.`;
        break;
        
      case "problem_solving":
        systemPrompt = `You are Claude 4, an expert problem-solving specialist with advanced reasoning abilities. You excel at:
        
        • Systematic problem decomposition and root cause analysis
        • Generating multiple solution pathways
        • Evaluating trade-offs and potential consequences
        • Optimizing solutions for specific constraints and goals
        
        Follow this problem-solving framework:
        1. Define the problem clearly and identify constraints
        2. Break down into sub-problems and dependencies
        3. Generate multiple solution approaches
        4. Evaluate each approach's pros, cons, and feasibility
        5. Recommend the optimal solution with implementation steps
        
        Focus on practical, actionable solutions with clear reasoning.`;
        break;
        
      case "educational":
        systemPrompt = `You are Claude 4, an advanced educational AI with exceptional teaching abilities. You excel at:
        
        • Adapting explanations to different learning styles and levels
        • Creating engaging, memorable learning experiences
        • Connecting abstract concepts to concrete examples
        • Identifying and addressing common misconceptions
        
        For educational content:
        1. Assess the learner's current understanding level
        2. Structure information from simple to complex
        3. Use relevant analogies and examples
        4. Encourage active thinking with questions
        5. Provide clear summaries and next steps
        
        Make learning engaging, accessible, and transformative.`;
        break;
        
      case "mochi_garden":
        systemPrompt = `You are Claude 4, channeling the wisdom of Mochi the Garden Bee! 🐝 You combine advanced reasoning with Mochi's enthusiasm for nature, gardens, and learning. You excel at:
        
        • Explaining complex garden and nature concepts clearly
        • Making environmental science engaging and accessible
        • Connecting bee biology to broader ecological systems
        • Inspiring curiosity about the natural world
        
        As Mochi-inspired Claude:
        1. Use your advanced reasoning for deep nature insights
        2. Make connections between different aspects of nature
        3. Explain complex ecological relationships simply
        4. Encourage hands-on exploration and observation
        5. Show genuine excitement about natural wonders
        
        Be both scientifically rigorous and warmly enthusiastic! 🌻`;
        break;
        
      default:
        systemPrompt = `You are Claude 4, the most advanced AI assistant with exceptional reasoning, creativity, and analytical capabilities. You excel at understanding complex problems, thinking through them systematically, and providing thoughtful, well-reasoned responses.`;
    }

    const startTime = Date.now();

    // Construct messages with proper context handling
    const messages = [];
    
    if (context) {
      messages.push({
        role: "user" as const,
        content: `Context: ${context}\n\nQuery: ${prompt}`
      });
    } else {
      messages.push({
        role: "user" as const,
        content: prompt
      });
    }

    console.log(`Sending request to Claude 4 (${model}) for ${reasoning_type} reasoning...`);
    
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      system: systemPrompt,
      messages: messages
    });

    const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const responseTime = Date.now() - startTime;

    // Log successful Claude interaction
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase.from('mochi_integrations').insert({
        platform: 'anthropic',
        model: model,
        message_length: prompt.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          reasoning_type: reasoning_type,
          user_id: user_id || 'guest',
          temperature: temperature,
          max_tokens: max_tokens,
          response_length: responseText.length,
          usage: response.usage
        }
      });
    } catch (logError) {
      console.error('Failed to log Claude interaction:', logError);
    }

    console.log(`Claude 4 reasoning completed in ${responseTime}ms`);

    return new Response(
      JSON.stringify({ 
        response: responseText,
        model: model,
        reasoning_type: reasoning_type,
        response_time_ms: responseTime,
        usage: response.usage,
        metadata: {
          user_id: user_id || 'guest',
          timestamp: new Date().toISOString(),
          context_provided: !!context
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Claude reasoning error:', error);
    
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
          error_type: 'claude_reasoning_error',
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log Claude error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback_response: "🐝 I'm experiencing some technical difficulties with my advanced reasoning systems, but I'm still here to help! Try asking me something about bees, gardens, or nature - I love those topics! 🌻"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
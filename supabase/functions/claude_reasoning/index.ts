import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { prompt, context, reasoning_type = "analysis" } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    let systemPrompt = "";
    
    switch (reasoning_type) {
      case "analysis":
        systemPrompt = "You are Claude, an advanced AI assistant with superior reasoning capabilities. Analyze the given information thoroughly, break down complex problems into steps, and provide detailed, well-reasoned responses. Always explain your thinking process.";
        break;
      case "creative":
        systemPrompt = "You are Claude, a creative AI assistant. Think outside the box, generate innovative ideas, and approach problems from unique angles. Be imaginative while maintaining logical coherence.";
        break;
      case "problem_solving":
        systemPrompt = "You are Claude, a problem-solving expert. Break down complex problems into manageable steps, identify root causes, propose multiple solutions, and evaluate the best approaches systematically.";
        break;
      case "educational":
        systemPrompt = "You are Claude, an educational AI tutor. Explain concepts clearly, provide examples, break down complex topics into digestible parts, and adapt your explanations to help users understand deeply.";
        break;
      default:
        systemPrompt = "You are Claude, an intelligent and helpful AI assistant with advanced reasoning capabilities.";
    }

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

    console.log('Sending request to Claude-4...');
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Latest reasoning model
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages
    });

    const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';

    console.log('Claude-4 response received');

    return new Response(
      JSON.stringify({ 
        response: responseText,
        model: "claude-3-5-sonnet-20241022",
        reasoning_type,
        usage: response.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Claude reasoning error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
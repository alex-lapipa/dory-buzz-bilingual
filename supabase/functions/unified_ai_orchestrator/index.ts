import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  message: string;
  platform?: 'openai' | 'anthropic' | 'gemini' | 'xai' | 'auto';
  model?: string;
  conversation_history?: Array<{role: string, content: string}>;
  user_id?: string;
  stream?: boolean;
  specialty?: 'general' | 'coding' | 'creative' | 'analysis' | 'bee_education';
}

const PLATFORM_MODELS = {
  openai: ['gpt-4.1-2025-04-14', 'gpt-4o', 'gpt-4o-mini'],
  anthropic: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
  xai: ['grok-beta', 'grok-vision-beta']
};

const SPECIALTY_ROUTING = {
  'general': 'openai',
  'coding': 'anthropic',
  'creative': 'gemini', 
  'analysis': 'anthropic',
  'bee_education': 'openai'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      message,
      platform = 'auto',
      model,
      conversation_history = [],
      user_id,
      stream = false,
      specialty = 'general'
    }: AIRequest = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Auto-select platform based on specialty or load balancing
    let selectedPlatform = platform;
    if (platform === 'auto') {
      selectedPlatform = SPECIALTY_ROUTING[specialty] || 'openai';
      
      // Simple load balancing: check recent usage
      const recentUsage = await supabase
        .from('mochi_integrations')
        .select('platform, success')
        .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentUsage.data) {
        const platformCounts = recentUsage.data.reduce((acc, usage) => {
          if (usage.success) {
            acc[usage.platform] = (acc[usage.platform] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        // Choose least used successful platform
        const availablePlatforms = ['openai', 'anthropic', 'gemini', 'xai'];
        selectedPlatform = availablePlatforms.reduce((least, current) => 
          (platformCounts[current] || 0) < (platformCounts[least] || 0) ? current : least
        );
      }
    }

    // Select model if not specified
    let selectedModel = model;
    if (!selectedModel && PLATFORM_MODELS[selectedPlatform as keyof typeof PLATFORM_MODELS]) {
      selectedModel = PLATFORM_MODELS[selectedPlatform as keyof typeof PLATFORM_MODELS][0];
    }

    console.log(`Routing to ${selectedPlatform} with model ${selectedModel}`);

    // Route to appropriate platform function
    let functionName: string;
    let requestPayload: any = {
      message,
      conversation_history,
      user_id,
      stream
    };

    switch (selectedPlatform) {
      case 'openai':
        functionName = 'mochi_chat_production';
        requestPayload.model = selectedModel || 'gpt-4.1-2025-04-14';
        break;
      
      case 'anthropic':
        functionName = 'enhanced_mochi_claude';
        requestPayload.model = selectedModel || 'claude-opus-4-20250514';
        break;
      
      case 'gemini':
        functionName = 'gemini_chat';
        requestPayload.model = selectedModel || 'gemini-1.5-pro';
        break;
      
      case 'xai':
        functionName = 'xai_grok_chat';
        requestPayload.model = selectedModel || 'grok-beta';
        requestPayload.stream = stream;
        break;
      
      default:
        throw new Error(`Unsupported platform: ${selectedPlatform}`);
    }

    // Call the appropriate function
    const response = await supabase.functions.invoke(functionName, {
      body: requestPayload
    });

    if (response.error) {
      throw new Error(`Platform error: ${response.error.message}`);
    }

    const responseTime = Date.now() - startTime;

    // Log orchestrator usage
    await supabase.from('mochi_integrations').insert({
      platform: 'orchestrator',
      model: `${selectedPlatform}-${selectedModel}`,
      message_length: message.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        selected_platform: selectedPlatform,
        selected_model: selectedModel,
        specialty: specialty,
        auto_selected: platform === 'auto',
        user_id: user_id || 'guest'
      }
    });

    console.log(`Orchestrator routing successful: ${selectedPlatform}/${selectedModel}`);

    return new Response(JSON.stringify({
      success: true,
      platform: selectedPlatform,
      model: selectedModel,
      response: response.data,
      responseTime: responseTime,
      orchestrated: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in unified_ai_orchestrator:', error);
    
    // Log failed orchestration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'orchestrator',
      model: 'error',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
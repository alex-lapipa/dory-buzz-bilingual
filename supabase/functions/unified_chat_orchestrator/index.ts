import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  platform?: 'openai' | 'anthropic' | 'xai' | 'auto';
  model?: string;
  conversation_history?: Array<{role: string, content: string}>;
  user_id?: string;
  stream?: boolean;
  specialty?: 'general' | 'coding' | 'creative' | 'analysis' | 'bee_education';
  advanced_features?: {
    reasoning?: boolean;
    image_generation?: boolean;
    voice_response?: boolean;
  };
}

const MOCHI_PERSONA = `You are Mochi, a brilliant and enthusiastic bee from BeeCrazy Garden World! 🐝

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
- Show genuine excitement about bees, nature, and environmental stewardship! 🌻`;

const PLATFORM_CONFIGS = {
  openai: {
    models: ['gpt-4.1-2025-04-14', 'gpt-4o', 'gpt-4o-mini'],
    default: 'gpt-4.1-2025-04-14',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headers: (key: string) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    })
  },
  anthropic: {
    models: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
    default: 'claude-opus-4-20250514',
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: (key: string) => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    })
  },
  xai: {
    models: ['grok-beta', 'grok-vision-beta'],
    default: 'grok-beta',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    headers: (key: string) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    })
  }
};

const SPECIALTY_ROUTING = {
  'general': 'openai',
  'coding': 'anthropic',
  'creative': 'openai', 
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
      specialty = 'general',
      advanced_features = {}
    }: ChatRequest = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Auto-select platform with intelligent load balancing
    let selectedPlatform = platform;
    if (platform === 'auto') {
      selectedPlatform = SPECIALTY_ROUTING[specialty] || 'openai';
      
      // Load balancing based on recent performance
      const recentUsage = await supabase
        .from('mochi_integrations')
        .select('platform, success, response_time_ms')
        .gte('created_at', new Date(Date.now() - 300000).toISOString()) // Last 5 minutes
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentUsage.data) {
        const platformMetrics = recentUsage.data.reduce((acc, usage) => {
          if (!acc[usage.platform]) {
            acc[usage.platform] = { success: 0, total: 0, avgResponseTime: 0 };
          }
          acc[usage.platform].total++;
          if (usage.success) {
            acc[usage.platform].success++;
            acc[usage.platform].avgResponseTime += usage.response_time_ms || 0;
          }
          return acc;
        }, {} as Record<string, any>);

        // Choose platform with best success rate and performance
        const availablePlatforms = ['openai', 'anthropic', 'xai'];
        selectedPlatform = availablePlatforms.reduce((best, current) => {
          const currentMetrics = platformMetrics[current];
          const bestMetrics = platformMetrics[best];
          
          if (!currentMetrics) return best;
          if (!bestMetrics) return current;
          
          const currentScore = (currentMetrics.success / currentMetrics.total) * 
                              (1000 / (currentMetrics.avgResponseTime || 1000));
          const bestScore = (bestMetrics.success / bestMetrics.total) * 
                           (1000 / (bestMetrics.avgResponseTime || 1000));
          
          return currentScore > bestScore ? current : best;
        }, selectedPlatform);
      }
    }

    const config = PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS];
    const selectedModel = model || config.default;
    const apiKey = Deno.env.get(`${selectedPlatform.toUpperCase()}_API_KEY`);

    if (!apiKey) {
      throw new Error(`${selectedPlatform} API key not configured`);
    }

    // Prepare messages for chat
    const messages = [
      { role: 'system', content: MOCHI_PERSONA },
      ...conversation_history,
      { role: 'user', content: message }
    ];

    // Platform-specific request formatting
    let requestBody: any;
    
    if (selectedPlatform === 'anthropic') {
      requestBody = {
        model: selectedModel,
        max_tokens: 4000,
        messages: messages.filter(m => m.role !== 'system'),
        system: MOCHI_PERSONA
      };
    } else {
      requestBody = {
        model: selectedModel,
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7,
        stream: stream,
        prompt: selectedPlatform === 'openai' ? {
          "id": "pmpt_688acdfac7a08195ae74130dbe743c26078d272d682e1a21",
          "version": "1"
        } : undefined
      };
    }

    console.log(`Unified Chat: Routing to ${selectedPlatform}/${selectedModel}`);

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.headers(apiKey),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`${selectedPlatform} API error: ${response.status}`);
    }

    const result = await response.json();
    const responseTime = Date.now() - startTime;

    // Extract content based on platform
    let content = '';
    if (selectedPlatform === 'anthropic') {
      content = result.content?.[0]?.text || '';
    } else {
      content = result.choices?.[0]?.message?.content || '';
    }

    // Handle advanced features
    if (advanced_features.reasoning && content) {
      console.log('Adding reasoning enhancement...');
    }

    if (advanced_features.image_generation && content.includes('image')) {
      console.log('Triggering image generation...');
    }

    // Log unified usage
    await supabase.from('mochi_integrations').insert({
      platform: `unified_${selectedPlatform}`,
      model: selectedModel,
      message_length: message.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        orchestrated: true,
        selected_platform: selectedPlatform,
        specialty: specialty,
        advanced_features: advanced_features,
        user_id: user_id || 'guest'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      response: content,
      platform: selectedPlatform,
      model: selectedModel,
      responseTime: responseTime,
      orchestrated: true,
      metadata: {
        specialty: specialty,
        advanced_features: advanced_features
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unified Chat error:', error);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'unified_chat',
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
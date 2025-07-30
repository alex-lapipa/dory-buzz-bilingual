import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageRequest {
  prompt: string;
  model?: 'dall-e-3' | 'gpt-image-1' | 'midjourney' | 'auto';
  size?: string;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  provider?: 'openai' | 'midjourney' | 'auto';
  user_id?: string;
}

const IMAGE_PROVIDERS = {
  openai: {
    models: ['dall-e-3', 'gpt-image-1'],
    endpoint: 'https://api.openai.com/v1/images/generations',
    sizes: ['1024x1024', '1792x1024', '1024x1792'],
    default_model: 'gpt-image-1'
  },
  midjourney: {
    models: ['midjourney'],
    endpoint: 'https://api.midjourney.com/v1/imagine',
    sizes: ['1024x1024', '1024x1792', '1792x1024'],
    default_model: 'midjourney'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      prompt,
      model = 'auto',
      size = '1024x1024',
      quality = 'hd',
      style = 'vivid',
      provider = 'auto',
      user_id
    }: ImageRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    // Auto-select provider and model
    let selectedProvider = provider;
    let selectedModel = model;

    if (provider === 'auto') {
      // Check recent performance to choose best provider
      const recentImages = await supabase
        .from('mochi_integrations')
        .select('platform, success, response_time_ms')
        .in('platform', ['openai_image', 'midjourney'])
        .gte('created_at', new Date(Date.now() - 600000).toISOString()) // Last 10 minutes
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentImages.data && recentImages.data.length > 0) {
        const providerStats = recentImages.data.reduce((acc, item) => {
          const provider = item.platform.includes('openai') ? 'openai' : 'midjourney';
          if (!acc[provider]) acc[provider] = { success: 0, total: 0, avgTime: 0 };
          acc[provider].total++;
          if (item.success) {
            acc[provider].success++;
            acc[provider].avgTime += item.response_time_ms || 0;
          }
          return acc;
        }, {} as Record<string, any>);

        // Choose provider with better success rate and speed
        selectedProvider = Object.keys(providerStats).reduce((best, current) => {
          const currentScore = (providerStats[current].success / providerStats[current].total) * 
                              (10000 / (providerStats[current].avgTime || 10000));
          const bestScore = providerStats[best] ? 
                           (providerStats[best].success / providerStats[best].total) * 
                           (10000 / (providerStats[best].avgTime || 10000)) : 0;
          return currentScore > bestScore ? current : best;
        }, 'openai');
      } else {
        selectedProvider = 'openai'; // Default
      }
    }

    if (model === 'auto') {
      selectedModel = IMAGE_PROVIDERS[selectedProvider as keyof typeof IMAGE_PROVIDERS].default_model;
    }

    console.log(`Unified Image: Routing to ${selectedProvider}/${selectedModel}`);

    let result: any;

    switch (selectedProvider) {
      case 'openai':
        result = await generateWithOpenAI(prompt, selectedModel, size, quality, style);
        break;
      
      case 'midjourney':
        result = await generateWithMidjourney(prompt, size);
        break;
      
      default:
        throw new Error(`Unsupported provider: ${selectedProvider}`);
    }

    const responseTime = Date.now() - startTime;

    // Log unified usage
    await supabase.from('mochi_integrations').insert({
      platform: `image_${selectedProvider}`,
      model: selectedModel,
      message_length: prompt.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        provider: selectedProvider,
        model: selectedModel,
        size: size,
        quality: quality,
        style: style,
        user_id: user_id || 'guest'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      provider: selectedProvider,
      model: selectedModel,
      result: result,
      responseTime: responseTime,
      unified: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unified Image Generator error:', error);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'image_unified',
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

async function generateWithOpenAI(prompt: string, model: string, size: string, quality: string, style: string) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const payload: any = {
    model: model,
    prompt: prompt,
    n: 1,
    size: size,
    quality: quality,
    response_format: "b64_json"
  };

  // Add model-specific parameters
  if (model === 'gpt-image-1') {
    payload.background = 'auto';
    payload.output_format = 'png';
  } else if (model === 'dall-e-3') {
    payload.style = style;
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const imageData = result.data[0];

  return {
    image: `data:image/png;base64,${imageData.b64_json}`,
    revised_prompt: imageData.revised_prompt || prompt,
    provider: 'openai',
    model: model
  };
}

async function generateWithMidjourney(prompt: string, size: string) {
  // Midjourney integration would go here
  // For now, fallback to OpenAI
  return await generateWithOpenAI(prompt, 'dall-e-3', size, 'hd', 'vivid');
}
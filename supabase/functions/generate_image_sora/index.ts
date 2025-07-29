import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = 'image', user_id } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let response, data, result;

    if (type === 'video') {
      // Sora video generation
      console.log('Generating video with Sora:', prompt);
      
      response = await fetch('https://api.openai.com/v1/videos/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sora-1.0-2024-12-20',
          prompt: prompt,
          size: '1280x720',
          duration: 5
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sora API error:', errorText);
        throw new Error(`Sora API error: ${response.status}`);
      }

      data = await response.json();
      result = {
        type: 'video',
        url: data.data[0].url,
        model: 'sora-1.0-2024-12-20'
      };

    } else {
      // Image generation with latest DALL-E
      console.log('Generating image with DALL-E:', prompt);
      
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'high',
          output_format: 'png'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DALL-E API error:', errorText);
        throw new Error(`DALL-E API error: ${response.status}`);
      }

      data = await response.json();
      result = {
        type: 'image',
        data: data.data[0].b64_json ? `data:image/png;base64,${data.data[0].b64_json}` : data.data[0].url,
        model: 'gpt-image-1'
      };
    }

    // Log successful integration
    await supabase.from('dory_integrations').insert({
      platform: 'openai',
      model: result.model,
      message_length: prompt.length,
      response_time_ms: Date.now(),
      success: true,
      options: {
        type: type,
        user_id: user_id || 'guest',
        prompt: prompt
      }
    });

    console.log('Generation successful:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generation function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('dory_integrations').insert({
      platform: 'openai',
      model: 'unknown',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
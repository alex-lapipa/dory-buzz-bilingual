import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      size = "1024x1024", 
      quality = "high",
      style = "vivid",
      model = "gpt-image-1",
      background = "auto",
      output_format = "png"
    } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating advanced image with GPT-Image-1...');

    const payload: any = {
      model: model,
      prompt: prompt,
      n: 1,
      size: size,
      quality: quality,
      response_format: "b64_json"
    };

    // Add GPT-Image-1 specific parameters
    if (model === "gpt-image-1") {
      payload.background = background;
      payload.output_format = output_format;
    } else if (model === "dall-e-3") {
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
      console.error('OpenAI Image API error:', errorText);
      throw new Error(`OpenAI Image API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const imageData = result.data[0];

    console.log('Advanced image generation successful');

    return new Response(
      JSON.stringify({
        image: `data:image/${output_format};base64,${imageData.b64_json}`,
        model: model,
        size: size,
        quality: quality,
        prompt: prompt,
        revised_prompt: imageData.revised_prompt || prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Advanced image generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
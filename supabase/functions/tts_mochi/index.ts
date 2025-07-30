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
    const { text, voice = 'nova', user_id } = await req.json();

    if (!text) {
      throw new Error('Text is required');
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

    console.log('Converting text to speech with HD model:', text.substring(0, 100) + '...');

    const startTime = Date.now();

    // Generate speech from text using OpenAI TTS HD
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // Latest HD text-to-speech model
        input: text,
        voice: voice, // nova, alloy, echo, fable, onyx, shimmer
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate speech');
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    const responseTime = Date.now() - startTime;

    // Log successful integration
    await supabase.from('mochi_integrations').insert({
      platform: 'openai',
      model: 'tts-1-hd',
      message_length: text.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        voice: voice,
        user_id: user_id || 'guest',
        format: 'mp3'
      }
    });

    console.log('TTS conversion successful');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        voice: voice
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in tts_mochi function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'openai',
      model: 'tts-1-hd',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
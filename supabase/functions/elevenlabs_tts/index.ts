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
    const { 
      text, 
      voice_id = "9BWtsMINqrJLrRacOk9x", // Aria voice (default - clear, friendly)
      model = "eleven_multilingual_v2", // Best quality multilingual model
      voice_settings,
      user_id
    } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log(`Generating TTS for: "${text.substring(0, 50)}..." with voice: ${voice_id}`);

    const startTime = Date.now();
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
    
    // Enhanced voice settings for Mochi
    const defaultVoiceSettings = {
      stability: 0.7,           // Good stability for consistent voice
      similarity_boost: 0.8,    // High similarity for voice consistency
      style: 0.2,              // Slight expressiveness for friendliness
      use_speaker_boost: true   // Better audio quality
    };

    const payload = {
      text: text,
      model_id: model,
      voice_settings: voice_settings || defaultVoiceSettings
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get the audio as array buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for JSON response
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    const responseTime = Date.now() - startTime;

    // Log successful TTS generation
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase.from('mochi_integrations').insert({
        platform: 'elevenlabs',
        model: model,
        message_length: text.length,
        response_time_ms: responseTime,
        success: true,
        options: {
          voice_id: voice_id,
          user_id: user_id || 'guest',
          text_length: text.length,
          voice_settings: voice_settings || defaultVoiceSettings,
          audio_size_bytes: audioBuffer.byteLength
        }
      });
    } catch (logError) {
      console.error('Failed to log TTS interaction:', logError);
    }

    console.log(`ElevenLabs TTS successful in ${responseTime}ms, audio size: ${audioBuffer.byteLength} bytes`);

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        voice_id,
        model,
        text_length: text.length,
        response_time_ms: responseTime,
        audio_size_bytes: audioBuffer.byteLength
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    
    // Log error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('mochi_integrations').insert({
        platform: 'elevenlabs',
        model: 'eleven_multilingual_v2',
        message_length: 0,
        response_time_ms: 0,
        success: false,
        error_message: error.message
      });
    } catch (logError) {
      console.error('Failed to log TTS error:', logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
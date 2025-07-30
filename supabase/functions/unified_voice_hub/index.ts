import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceRequest {
  operation: 'tts' | 'stt' | 'chat';
  text?: string;
  audio?: string;
  voice?: string;
  provider?: 'elevenlabs' | 'openai' | 'auto';
  language?: string;
  model?: string;
  conversation_id?: string;
  user_id?: string;
}

const VOICE_PROVIDERS = {
  elevenlabs: {
    tts_endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
    default_voice: 'EXAVITQu4vr4xnSDxMaL',
    voices: {
      alloy: 'EXAVITQu4vr4xnSDxMaL',
      echo: 'ErXwobaYiN019PkySvjV',
      nova: '21m00Tcm4TlvDq8ikWAM',
      shimmer: 'AZnzlk1XvdvUeBnXmlld'
    }
  },
  openai: {
    tts_endpoint: 'https://api.openai.com/v1/audio/speech',
    stt_endpoint: 'https://api.openai.com/v1/audio/transcriptions',
    default_voice: 'alloy',
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      operation,
      text,
      audio,
      voice = 'alloy',
      provider = 'auto',
      language = 'en',
      model,
      conversation_id,
      user_id
    }: VoiceRequest = await req.json();

    if (!operation) {
      throw new Error('Operation is required (tts, stt, or chat)');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();
    let selectedProvider = provider;

    // Auto-select provider based on operation and performance
    if (provider === 'auto') {
      if (operation === 'tts') {
        // Check which TTS provider has better recent performance
        const recentTTS = await supabase
          .from('mochi_integrations')
          .select('platform, success, response_time_ms')
          .in('platform', ['elevenlabs', 'openai_tts'])
          .gte('created_at', new Date(Date.now() - 600000).toISOString()) // Last 10 minutes
          .order('created_at', { ascending: false })
          .limit(10);

        if (recentTTS.data && recentTTS.data.length > 0) {
          const providerStats = recentTTS.data.reduce((acc, item) => {
            const provider = item.platform === 'elevenlabs' ? 'elevenlabs' : 'openai';
            if (!acc[provider]) acc[provider] = { success: 0, total: 0, avgTime: 0 };
            acc[provider].total++;
            if (item.success) {
              acc[provider].success++;
              acc[provider].avgTime += item.response_time_ms || 0;
            }
            return acc;
          }, {} as Record<string, any>);

          // Choose provider with better success rate
          selectedProvider = Object.keys(providerStats).reduce((best, current) => {
            const currentRate = providerStats[current].success / providerStats[current].total;
            const bestRate = providerStats[best]?.success / providerStats[best]?.total || 0;
            return currentRate > bestRate ? current : best;
          }, 'elevenlabs');
        } else {
          selectedProvider = 'elevenlabs'; // Default to ElevenLabs for TTS
        }
      } else if (operation === 'stt') {
        selectedProvider = 'openai'; // OpenAI is better for STT
      }
    }

    let result: any;

    switch (operation) {
      case 'tts':
        result = await handleTTS(text!, voice, selectedProvider, language);
        break;
      case 'stt':
        result = await handleSTT(audio!, selectedProvider, language, model);
        break;
      case 'chat':
        result = await handleVoiceChat(text!, audio, voice, selectedProvider, conversation_id);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const responseTime = Date.now() - startTime;

    // Log unified voice usage
    await supabase.from('mochi_integrations').insert({
      platform: `voice_${selectedProvider}`,
      model: operation,
      message_length: text?.length || 0,
      response_time_ms: responseTime,
      success: true,
      options: {
        operation: operation,
        provider: selectedProvider,
        voice: voice,
        language: language,
        user_id: user_id || 'guest',
        conversation_id: conversation_id
      }
    });

    return new Response(JSON.stringify({
      success: true,
      operation: operation,
      provider: selectedProvider,
      result: result,
      responseTime: responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unified Voice Hub error:', error);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'voice_unified',
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

async function handleTTS(text: string, voice: string, provider: string, language: string) {
  if (provider === 'elevenlabs') {
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) throw new Error('ElevenLabs API key not configured');

    const voiceId = VOICE_PROVIDERS.elevenlabs.voices[voice as keyof typeof VOICE_PROVIDERS.elevenlabs.voices] || 
                    VOICE_PROVIDERS.elevenlabs.default_voice;

    const response = await fetch(`${VOICE_PROVIDERS.elevenlabs.tts_endpoint}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return {
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      voice: voice,
      provider: 'elevenlabs'
    };

  } else { // OpenAI
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OpenAI API key not configured');

    const response = await fetch(VOICE_PROVIDERS.openai.tts_endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return {
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      voice: voice,
      provider: 'openai'
    };
  }
}

async function handleSTT(audio: string, provider: string, language: string, model?: string) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured');

  // Convert base64 audio to blob
  const audioData = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
  const audioBlob = new Blob([audioData], { type: 'audio/wav' });

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', model || 'whisper-1');
  formData.append('language', language);

  const response = await fetch(VOICE_PROVIDERS.openai.stt_endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`OpenAI STT error: ${response.status}`);
  }

  const result = await response.json();
  
  return {
    transcript: result.text,
    language: language,
    provider: 'openai'
  };
}

async function handleVoiceChat(text: string, audio?: string, voice?: string, provider?: string, conversationId?: string) {
  // This would integrate with the unified chat orchestrator for voice-enabled conversations
  return {
    message: "Voice chat integration coming soon",
    conversation_id: conversationId
  };
}
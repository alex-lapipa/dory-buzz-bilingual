import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.27.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, session_id, user_id, voice_id = "9BWtsMINqrJLrRacOk9x" } = await req.json();
    
    if (!audio) {
      throw new Error('Audio data is required');
    }

    console.log('Processing advanced voice chat...');

    // Step 1: Convert speech to text using OpenAI Whisper
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${await whisperResponse.text()}`);
    }

    const { text: userMessage } = await whisperResponse.json();
    console.log('Transcribed text:', userMessage);

    // Step 2: Get conversation context
    const { data: conversationHistory } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true })
      .limit(10);

    // Step 3: Generate response using Claude-4
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    const systemPrompt = `You are Mochi, a friendly and intelligent garden bee from BeeCrazy Garden World! 🐝

You are:
- A helpful companion who loves talking about nature, gardens, and bee-related topics
- Cheerful, warm, and family-friendly
- Knowledgeable about plants, flowers, gardening, and environmental topics
- Always encouraging and positive
- Great at explaining complex topics in simple, engaging ways

Keep your responses:
- Conversational and natural for voice chat
- Around 1-3 sentences for quick back-and-forth
- Include gentle bee and garden references when appropriate
- Encouraging and supportive
- Educational but fun

Context: This is a voice conversation, so respond as if you're speaking directly to someone.`;

    let messages = [];
    
    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content
        });
      });
    }
    
    // Add current user message
    messages.push({
      role: "user" as const,
      content: userMessage
    });

    const claudeResponse = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1000,
      temperature: 0.8,
      system: systemPrompt,
      messages: messages
    });

    const aiResponse = claudeResponse.content[0]?.type === 'text' ? claudeResponse.content[0].text : '';
    console.log('Claude response:', aiResponse);

    // Step 4: Convert response to speech using ElevenLabs
    const ttsPayload = {
      text: aiResponse,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    };

    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
      },
      body: JSON.stringify(ttsPayload),
    });

    if (!ttsResponse.ok) {
      throw new Error(`ElevenLabs TTS error: ${await ttsResponse.text()}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // Step 5: Store conversation in database
    const conversationData = [
      {
        session_id,
        user_id,
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      },
      {
        session_id,
        user_id,
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString()
      }
    ];

    await supabase.from('conversations').insert(conversationData);

    console.log('Advanced voice chat completed successfully');

    return new Response(
      JSON.stringify({
        userMessage,
        aiResponse,
        audioContent: base64Audio,
        session_id,
        model: "claude-opus-4-20250514",
        voice_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Advanced voice chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
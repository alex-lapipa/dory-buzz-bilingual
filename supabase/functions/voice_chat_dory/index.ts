import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DORY_VOICE_PROMPT = `You are Dory la Abeja Hacendosa, a cheerful bilingual bee. Keep responses short and conversational for voice chat. Always include both Spanish and English naturally in your responses. Focus on nature, plants, and environmental topics. Be warm and encouraging.`;

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  socket.onopen = () => {
    console.log("Voice chat WebSocket connection opened");
    socket.send(JSON.stringify({
      type: 'connection',
      message: '🐝 ¡Hola! Voice chat with Dory is ready! / Voice chat with Dory está listo!'
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received message:", data.type);

      if (data.type === 'audio') {
        // Handle audio input - transcribe with Whisper
        const sttResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/stt_chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({ audio: data.audio }),
        });

        const sttResult = await sttResponse.json();
        
        if (sttResult.text) {
          // Send transcribed text to chat
          const chatResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/chat_dory`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ 
              message: sttResult.text,
              conversation_history: data.conversation_history || []
            }),
          });

          // Stream the chat response
          const reader = chatResponse.body?.getReader();
          let fullResponse = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data !== '[DONE]') {
                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.content) {
                        fullResponse += parsed.content;
                        socket.send(JSON.stringify({
                          type: 'text_chunk',
                          content: parsed.content
                        }));
                      }
                    } catch (e) {
                      // Skip invalid JSON
                    }
                  }
                }
              }
            }

            // Convert response to speech
            const ttsResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/tts_dory`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ 
                text: fullResponse,
                voice: 'nova'
              }),
            });

            const ttsResult = await ttsResponse.json();
            
            socket.send(JSON.stringify({
              type: 'audio_response',
              audio: ttsResult.audioContent,
              text: fullResponse
            }));
          }
        }
      }
    } catch (error) {
      console.error('Voice chat error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  };

  socket.onclose = () => {
    console.log("Voice chat WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("Voice chat WebSocket error:", error);
  };

  return response;
});
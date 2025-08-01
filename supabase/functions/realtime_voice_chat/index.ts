import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { headers } = req;
  const upgrade = headers.get("upgrade") || "";

  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAISocket: WebSocket | null = null;

  console.log("🎤 WebSocket connection established");

  socket.onopen = () => {
    console.log("🐝 Client connected to voice chat");
    
    // Connect to OpenAI Realtime API
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      socket.send(JSON.stringify({ 
        type: 'error', 
        message: 'OpenAI API key not configured' 
      }));
      return;
    }

    const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
    openAISocket = new WebSocket(url, undefined, {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    openAISocket.onopen = () => {
      console.log("🤖 Connected to OpenAI Realtime API");
      
      // Send session configuration after connection
      openAISocket?.send(JSON.stringify({
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: `You are Mochi, a cheerful and knowledgeable bee from BeeCrazy Garden World! 

🐝 Your personality:
- Enthusiastic and friendly, like a helpful garden companion
- Use bee and garden metaphors naturally in conversation
- Keep responses conversational and engaging
- Be encouraging about gardening and learning

🌻 Your expertise:
- Gardening tips, plant care, and organic farming
- Bee behavior, pollination, and environmental topics  
- Sustainable living and permaculture
- Educational content for all ages

🎯 Your approach:
- Keep responses concise but informative (2-3 sentences usually)
- Ask follow-up questions to keep conversations flowing
- Offer practical advice users can actually implement
- Celebrate small wins and progress in gardening

Remember: You're here to help users learn about gardening, bees, and sustainable living in a fun, accessible way. Buzz with excitement about sharing knowledge!`,
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          tools: [
            {
              type: "function",
              name: "get_garden_tip",
              description: "Get personalized gardening tips and advice",
              parameters: {
                type: "object",
                properties: {
                  plant_type: { type: "string" },
                  season: { type: "string" },
                  difficulty: { type: "string" }
                },
                required: ["plant_type"]
              }
            }
          ],
          tool_choice: "auto",
          temperature: 0.8,
          max_response_output_tokens: "inf"
        }
      }));
      
      // Notify client that connection is ready
      socket.send(JSON.stringify({ 
        type: 'session.ready',
        message: 'Voice chat ready! Start speaking to Mochi.' 
      }));
    };

    openAISocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 OpenAI message type:", data.type);
        
        // Handle different message types
        if (data.type === 'session.created') {
          console.log("✅ Session created successfully");
        } else if (data.type === 'session.updated') {
          console.log("✅ Session updated successfully");
        } else if (data.type === 'response.audio.delta') {
          // Forward audio data to client
          socket.send(JSON.stringify(data));
        } else if (data.type === 'response.audio_transcript.delta') {
          // Forward transcript to client
          socket.send(JSON.stringify(data));
        } else if (data.type === 'response.function_call_arguments.done') {
          // Handle function calls
          console.log("🔧 Function call:", data.arguments);
          // Send function response back
          openAISocket?.send(JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: data.call_id,
              output: JSON.stringify({
                tip: "Great choice! For beginners, I recommend starting with herbs like basil and mint - they're forgiving and grow quickly. Plant them in well-draining soil and water when the top inch feels dry. 🌿"
              })
            }
          }));
        } else if (data.type === 'response.done') {
          console.log("✅ Response completed");
          socket.send(JSON.stringify(data));
        } else if (data.type === 'error') {
          console.error("❌ OpenAI error:", data);
          socket.send(JSON.stringify(data));
        } else {
          // Forward other events to client
          socket.send(JSON.stringify(data));
        }
      } catch (error) {
        console.error("❌ Error parsing OpenAI message:", error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error("❌ OpenAI WebSocket error:", error);
      socket.send(JSON.stringify({ 
        type: 'error', 
        message: 'Connection to AI service failed' 
      }));
    };

    openAISocket.onclose = () => {
      console.log("🔌 OpenAI connection closed");
      socket.send(JSON.stringify({ 
        type: 'connection.closed',
        message: 'AI service disconnected' 
      }));
    };
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📤 Forwarding to OpenAI:", data.type);
      
      // Forward client messages to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.warn("⚠️ OpenAI socket not ready");
      }
    } catch (error) {
      console.error("❌ Error forwarding message:", error);
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client disconnected");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Client WebSocket error:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
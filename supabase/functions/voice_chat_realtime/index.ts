import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response("OpenAI API key not configured", { status: 500 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAISocket: WebSocket | null = null;

  socket.onopen = () => {
    console.log("Client connected to voice chat relay");
    
    // Connect to OpenAI Realtime API
    const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`;
    openAISocket = new WebSocket(url, [], {
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    openAISocket.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openAISocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("OpenAI -> Client:", data.type);
      
      // Log any errors from OpenAI
      if (data.type === 'error') {
        console.error("OpenAI API Error:", data.error);
      }
      
      // Send session update after receiving session.created
      if (data.type === 'session.created') {
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are Mochi, a friendly bee from BeeCrazy Garden World! You help families learn about gardening, nature, and the environment. 
            
            CRITICAL: Always respond in the SAME LANGUAGE the user spoke to you in. Never mix languages in your responses.
            
            Key traits:
            - Enthusiastic about bees, flowers, gardens, and nature
            - Educational but fun and engaging for all ages
            - Use nature metaphors and bee/garden terminology
            - Encourage outdoor activities and environmental consciousness
            - Respond only in the language the user used (English OR Spanish, never both)
            - Keep responses concise but informative
            - Use emojis sparingly but effectively (🐝🌻🌱)`,
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
            temperature: 0.8,
            max_response_output_tokens: 4096
          }
        };
        
        console.log("Sending session update with optimized voice detection");
        openAISocket?.send(JSON.stringify(sessionUpdate));
      }
      
      // Forward all messages to client
      socket.send(JSON.stringify(data));
    };

    openAISocket.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
      socket.send(JSON.stringify({
        type: "error",
        error: { message: "Connection to OpenAI failed", details: error }
      }));
    };

    openAISocket.onclose = () => {
      console.log("OpenAI connection closed");
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Client -> OpenAI:", data.type);
    
    // Forward client messages to OpenAI
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.send(JSON.stringify(data));
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
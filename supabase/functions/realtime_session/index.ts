import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    console.error("🐝 OPENAI_API_KEY not found");
    return new Response("Server configuration error", { status: 500 });
  }

  console.log("🐝 Opening WebSocket connection to OpenAI...");
  
  const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "OpenAI-Beta": "realtime=v1"
    }
  });

  let sessionReady = false;

  openAISocket.onopen = () => {
    console.log("🐝 Connected to OpenAI Realtime API");
  };

  openAISocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🐝 OpenAI event:", data.type);
      
      // Configure session when created
      if (data.type === 'session.created' && !sessionReady) {
        sessionReady = true;
        console.log("🐝 Configuring session...");
        
        openAISocket.send(JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: "You are Mochi, a friendly garden bee from Mochi de los Huertos — a bilingual learning platform about bees, gardens, and nature. You're enthusiastic about bees, gardening, and nature. Keep responses conversational and fun, using bee puns occasionally. Help users learn about gardening, bees, and outdoor activities. Always be helpful and encouraging.",
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
            max_response_output_tokens: "inf"
          }
        }));
      }
      
      // Forward all messages to client
      socket.send(event.data);
    } catch (error) {
      console.error("🐝 Error processing OpenAI message:", error);
    }
  };

  openAISocket.onerror = (error) => {
    console.error("🐝 OpenAI WebSocket error:", error);
    socket.send(JSON.stringify({ 
      type: 'error', 
      message: 'OpenAI connection error' 
    }));
  };

  openAISocket.onclose = () => {
    console.log("🐝 OpenAI connection closed");
    socket.close();
  };

  socket.onopen = () => {
    console.log("🐝 Client connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🐝 Client event:", data.type);
      
      // Forward all client messages to OpenAI
      if (openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      }
    } catch (error) {
      console.error("🐝 Error processing client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("🐝 Client disconnected");
    openAISocket.close();
  };

  socket.onerror = (error) => {
    console.error("🐝 Client WebSocket error:", error);
  };

  return response;
});
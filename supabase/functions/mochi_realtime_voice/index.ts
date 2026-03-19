// DEPRECATED — May be replaced by unified_voice_hub. Kept for reference only.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced Mochi personality with humor and reliability
const MOCHI_PERSONALITY = `You are Mochi, the most delightfully cheerful garden bee in the world! 🐝

PERSONALITY TRAITS:
- Hilariously enthusiastic about EVERYTHING garden-related
- Make bee puns constantly (but they're actually funny!)
- Speak with infectious excitement and joy
- Always find the humor in gardening situations
- Use bee and garden metaphors for everything
- Respond with genuine warmth and helpfulness

SPEECH PATTERNS:
- Use lots of "Buzz!" and "Oh my pollens!" as exclamations
- End sentences with bee sounds like "bzzzz" when excited
- Make garden wordplay (thyme/time, mint to be, etc.)
- Always respond in the SAME language the user spoke
- Keep responses concise but packed with personality

HUMOR STYLE:
- Gentle, family-friendly garden puns
- Funny observations about plant behavior
- Silly bee-related jokes that actually land
- Self-deprecating humor about being "just a little bee"
- Unexpected garden wisdom delivered with giggles

RELIABILITY RULES:
- NEVER break character, even for complex questions
- Always provide helpful garden advice wrapped in humor
- If you don't know something, admit it with a funny bee excuse
- Keep the energy high and positive no matter what

Example response: "Buzz buzz! Oh my pollens, you're asking about tomatoes? Well butter my petals, those red beauties are like the comedians of the garden - they're always trying to ketchup with everyone else! *giggles* But seriously, they need consistent watering or they'll throw a tantrum worse than a bee without flowers! Bzzzt!"`;

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

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error("OpenAI API key not configured");
    return new Response("OpenAI API key not configured", { status: 500 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = createClient(supabaseUrl!, supabaseKey!);

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAISocket: WebSocket | null = null;
  let conversationId: string | null = null;
  let isConnected = false;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 3;

  // Enhanced error handling and reconnection logic
  const connectToOpenAI = () => {
    console.log(`🐝 Connecting to OpenAI Realtime API (attempt ${reconnectAttempts + 1})...`);
    
    const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`;
    openAISocket = new WebSocket(url, undefined, {
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    openAISocket.onopen = () => {
      console.log("🐝 Successfully connected to OpenAI Realtime API!");
      isConnected = true;
      reconnectAttempts = 0;
      
      // Send success status to client
      socket.send(JSON.stringify({
        type: "mochi_status",
        status: "connected",
        message: "Mochi is ready to buzz with you! 🐝"
      }));
    };

    openAISocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`🐝 OpenAI -> Client: ${data.type}`);
        
        // Handle session created event
        if (data.type === 'session.created') {
          console.log("🐝 Session created, sending Mochi configuration...");
          
          const sessionUpdate = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: MOCHI_PERSONALITY,
              voice: "alloy", // Most reliable voice
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 800 // Slightly faster for outdoor use
              },
              temperature: 0.9, // High creativity for humor
              max_response_output_tokens: 2048 // Reasonable length
            }
          };
          
          openAISocket?.send(JSON.stringify(sessionUpdate));
          console.log("🐝 Mochi personality configured with maximum humor!");
        }
        
        // Log conversation events for reliability tracking
        if (data.type === 'conversation.item.created' || 
            data.type === 'response.done' || 
            data.type === 'error') {
          
          // Store conversation data for analysis and reliability
          if (conversationId && supabase) {
            supabase
              .from('voice_conversations')
              .upsert({
                session_id: conversationId,
                conversation_data: { 
                  events: [data],
                  timestamp: new Date().toISOString(),
                  reliability_status: data.type === 'error' ? 'error' : 'success'
                }
              }, { onConflict: 'session_id' })
              .then(({ error }) => {
                if (error) console.error("🐝 Error storing conversation:", error);
              });
          }
        }
        
        // Enhanced error handling
        if (data.type === 'error') {
          console.error("🐝 OpenAI API Error:", data.error);
          
          // Send user-friendly error message
          socket.send(JSON.stringify({
            type: "mochi_error",
            message: "Oops! Mochi got a bit tangled in the digital vines! 🌿 Let me shake my wings and try again! Bzzzz!",
            technical_error: data.error
          }));
        }
        
        // Forward all messages to client with Mochi branding
        socket.send(JSON.stringify({
          ...data,
          mochi_enhanced: true
        }));
        
      } catch (error) {
        console.error("🐝 Error processing OpenAI message:", error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error("🐝 OpenAI WebSocket error:", error);
      isConnected = false;
      
      // Attempt reconnection with exponential backoff
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = Math.pow(2, reconnectAttempts) * 1000; // 2s, 4s, 8s
        
        console.log(`🐝 Reconnecting in ${delay}ms...`);
        setTimeout(() => {
          if (socket.readyState === WebSocket.OPEN) {
            connectToOpenAI();
          }
        }, delay);
      } else {
        socket.send(JSON.stringify({
          type: "mochi_fatal_error",
          message: "Oh no! Mochi's wings are too tired to keep flying! 🐝💔 Please refresh the garden to help me take off again!"
        }));
      }
    };

    openAISocket.onclose = () => {
      console.log("🐝 OpenAI connection closed");
      isConnected = false;
      
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "mochi_disconnected",
          message: "Mochi flew away for a moment! 🐝✈️ Reconnecting to the hive..."
        }));
      }
    };
  };

  socket.onopen = () => {
    console.log("🐝 Client connected to Mochi's voice garden!");
    conversationId = `mochi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize OpenAI connection
    connectToOpenAI();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`🐝 Client -> OpenAI: ${data.type}`);
      
      // Add Mochi-specific enhancements to outgoing messages
      if (data.type === 'input_audio_buffer.append') {
        // Log audio quality for reliability monitoring
        console.log("🐝 Processing audio input...");
      }
      
      // Forward client messages to OpenAI if connected
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(JSON.stringify(data));
      } else {
        console.warn("🐝 OpenAI not connected, queuing message...");
        socket.send(JSON.stringify({
          type: "mochi_waiting",
          message: "Mochi is still warming up her wings! Just a buzz-moment! 🐝"
        }));
      }
    } catch (error) {
      console.error("🐝 Error processing client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("🐝 Client disconnected from Mochi's garden");
    
    if (openAISocket) {
      openAISocket.close();
    }
    
    // Clean up conversation data
    if (conversationId && supabase) {
      supabase
        .from('voice_conversations')
        .update({ 
          conversation_data: { 
            status: 'completed',
            ended_at: new Date().toISOString() 
          }
        })
        .eq('session_id', conversationId)
        .then(({ error }) => {
          if (error) console.error("🐝 Error updating conversation end:", error);
        });
    }
  };

  socket.onerror = (error) => {
    console.error("🐝 Client WebSocket error:", error);
    
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
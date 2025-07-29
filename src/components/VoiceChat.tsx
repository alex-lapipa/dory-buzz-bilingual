import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
import { AudioRecorder, encodeAudioForAPI, AudioQueue } from '@/utils/realtimeAudio';

interface VoiceChatProps {
  className?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ className }) => {
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'mochi'; content: string }>>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);

  const handleAudioData = useCallback((audioData: Float32Array) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const encodedAudio = encodeAudioForAPI(audioData);
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: encodedAudio
      }));
    }
  }, []);

  const connectToRealtimeAPI = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Initialize audio context and queue
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }

      // Connect to our WebSocket relay edge function
      const wsUrl = `wss://zrdywdregcrykmbiytvl.functions.supabase.co/voice_chat_realtime`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to voice chat relay');
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type);

        switch (data.type) {
          case 'session.created':
            console.log('Session created successfully');
            break;

          case 'session.updated':
            console.log('Session updated with 2-second silence detection');
            break;

          case 'input_audio_buffer.speech_started':
            console.log('User started speaking');
            setIsListening(true);
            break;

          case 'input_audio_buffer.speech_stopped':
            console.log('User stopped speaking - processing...');
            setIsListening(false);
            break;

          case 'response.audio.delta':
            // Play audio chunk
            if (data.delta && audioQueueRef.current) {
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              audioQueueRef.current.addToQueue(bytes);
              setIsSpeaking(true);
            }
            break;

          case 'response.audio.done':
            console.log('Audio response completed');
            setIsSpeaking(false);
            incrementGrowth(); // Trigger plant growth
            break;

          case 'response.audio_transcript.delta':
            // Handle transcript updates for conversation display
            if (data.delta) {
              setConversation(prev => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                if (lastIndex >= 0 && updated[lastIndex].role === 'mochi') {
                  updated[lastIndex].content += data.delta;
                } else {
                  updated.push({ role: 'mochi', content: data.delta });
                }
                return updated;
              });
            }
            break;

          case 'conversation.item.input_audio_transcription.completed':
            // User's speech transcription
            if (data.transcript) {
              setConversation(prev => [...prev, { role: 'user', content: data.transcript }]);
            }
            break;

          case 'error':
            console.error('Realtime API error:', data.error);
            toast({
              title: "Connection Error",
              description: data.error.message || "Failed to connect to voice chat",
              variant: "destructive",
            });
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat service",
          variant: "destructive",
        });
        setConnectionStatus('disconnected');
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setIsListening(false);
        setIsSpeaking(false);
      };

    } catch (error) {
      console.error('Error connecting to Realtime API:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize voice chat",
        variant: "destructive",
      });
      setConnectionStatus('disconnected');
    }
  };

  const startListening = async () => {
    try {
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder(handleAudioData);
      }
      
      await audioRecorderRef.current.start();
      
      toast({
        title: "Voice Chat Ready! 🎤",
        description: "Start speaking! I'll listen and respond naturally when you pause for 2 seconds. Just like having a conversation with a friend! 🐝",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    setIsListening(false);
  };

  const disconnect = () => {
    stopListening();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioQueueRef.current) {
      audioQueueRef.current.clear();
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setIsSpeaking(false);
    setConversation([]);
  };

  const toggleConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connectToRealtimeAPI();
      if (connectionStatus === 'connected') {
        await startListening();
      }
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {connectionStatus === 'connecting' && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                {connectionStatus === 'connected' && <Volume2 className="w-3 h-3 mr-1" />}
                {connectionStatus === 'disconnected' && <VolumeX className="w-3 h-3 mr-1" />}
                {connectionStatus === 'connecting' ? 'Connecting...' : 
                 connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
              
              {isListening && (
                <Badge variant="outline" className="animate-pulse">
                  <Mic className="w-3 h-3 mr-1" />
                  Listening...
                </Badge>
              )}
              
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Mochi Speaking...
                </Badge>
              )}
            </div>
          </div>

          {/* Conversation Display */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {conversation.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-2">🎤</div>
                <p className="text-lg mb-2">Voice Chat with Mochi</p>
                <p className="text-sm">
                  {isConnected 
                    ? "🐝 I'm listening! Start speaking and I'll respond automatically when you pause for 2 seconds."
                    : "Press the button below to start a natural voice conversation with me! I'll listen and respond just like talking to a friend. 🌻"}
                </p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-xs mb-1 opacity-70">
                      {message.role === 'user' ? 'You' : '🐝 Mochi'}
                    </div>
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <Button
              onClick={toggleConnection}
              size="lg"
              variant={isConnected ? "destructive" : "default"}
              disabled={connectionStatus === 'connecting'}
              className="gap-2"
            >
              {connectionStatus === 'connecting' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isConnected ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
              {connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : isConnected 
                ? 'End Voice Chat' 
                : 'Start Voice Chat'}
            </Button>
          </div>

          {isConnected && (
            <div className="text-center text-xs text-muted-foreground mt-2">
              🐝 Natural voice chat active • Speak naturally, I'll respond when you pause
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
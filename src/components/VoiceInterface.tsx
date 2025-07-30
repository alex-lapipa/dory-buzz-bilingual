import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Volume2, VolumeX, Brain, Loader2, Zap } from 'lucide-react';
import { AudioRecorder, encodeAudioForAPI, AudioQueue } from '@/utils/realtimeAudio';

interface VoiceInterfaceProps {
  className?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ className }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      setIsConnecting(true);
      
      // Initialize audio context and queue
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }

      // Connect to our WebSocket relay edge function
      const wsUrl = `wss://zrdywdregcrykmbiytvl.functions.supabase.co/voice_chat_realtime`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to OpenAI Realtime API via relay');
        setIsConnected(true);
        setIsConnecting(false);
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type);

        switch (data.type) {
          case 'session.created':
            console.log('Session created successfully');
            toast({
              title: "🐝 Mochi is ready!",
              description: "Voice conversation started. Say hello!",
            });
            break;
            
          case 'session.updated':
            console.log('Session updated with voice detection');
            break;

          case 'input_audio_buffer.speech_started':
            console.log('User started speaking');
            setIsListening(true);
            break;

          case 'input_audio_buffer.speech_stopped':
            console.log('User stopped speaking - processing...');
            setIsListening(false);
            break;

          case 'response.created':
            console.log('AI response started');
            setIsSpeaking(true);
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
            break;
            
          case 'response.audio_transcript.delta':
            if (data.delta) {
              setCurrentTranscript(prev => prev + data.delta);
            }
            break;
            
          case 'response.audio_transcript.done':
            if (currentTranscript.trim()) {
              const assistantMessage: Message = {
                id: Date.now().toString(),
                type: 'assistant',
                content: currentTranscript.trim(),
                timestamp: new Date(),
                isVoice: true
              };
              setMessages(prev => [...prev, assistantMessage]);
              setCurrentTranscript('');
            }
            break;
            
          case 'conversation.item.input_audio_transcription.completed':
            if (data.transcript) {
              const userMessage: Message = {
                id: Date.now().toString(),
                type: 'user',
                content: data.transcript,
                timestamp: new Date(),
                isVoice: true
              };
              setMessages(prev => [...prev, userMessage]);
            }
            break;
            
          case 'error':
            console.error('Realtime API error:', data.error);
            toast({
              title: "Voice Error",
              description: data.error?.message || "Something went wrong with voice chat",
              variant: "destructive",
            });
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error", 
          description: "Failed to connect to voice chat service. Please check your internet connection and try again.",
          variant: "destructive",
        });
        setIsConnecting(false);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setIsConnecting(false);
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
      setIsConnecting(false);
    }
  };

  const startListening = async () => {
    try {
      // Mobile-specific: Request user gesture for audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }
      
      // Resume audio context (required for mobile)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('🔊 Audio context resumed for mobile');
      }
      
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder(handleAudioData);
      }
      
      await audioRecorderRef.current.start();
      
      toast({
        title: "🎤 Voice Chat Ready!",
        description: "Start speaking! I'll respond naturally when you pause for 1.5 seconds.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions and try again.",
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
    setIsConnecting(false);
    setIsSpeaking(false);
    setMessages([]);
    setCurrentTranscript('');
  };

  const startConversation = async () => {
    try {
      // Mobile optimization: Enable audio context with user gesture
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
        
        // Immediately try to resume (mobile requirement)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('🔊 Audio context initialized and resumed for mobile');
        }
      }
      
      await connectToRealtimeAPI();
      // Wait a bit for connection to establish before starting audio
      setTimeout(async () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          await startListening();
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const endConversation = () => {
    disconnect();
    
    toast({
      title: "🐝 Voice chat ended",
      description: "Thanks for talking with Mochi!",
    });
  };

  const sendTextMessage = async (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Not connected",
        description: "Please start the voice conversation first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send text message to OpenAI
      wsRef.current.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text
            }
          ]
        }
      }));

      // Trigger response
      wsRef.current.send(JSON.stringify({
        type: 'response.create'
      }));
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: text,
        timestamp: new Date(),
        isVoice: false
      };
      setMessages(prev => [...prev, userMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const speakWithUnifiedVoice = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('unified_voice_hub', {
        body: { 
          operation: 'tts',
          text: `🐝 ${text}`,
          voice: 'aria',
          provider: 'auto'
        }
      });

      if (error) throw error;
      
      if (data.result.audio) {
        const audio = new Audio(data.result.audio);
        audio.play();
      }
      
    } catch (error) {
      console.error('Unified voice TTS error:', error);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm border-b border-yellow-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl animate-bee-bounce">🚀</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">OpenAI Realtime Voice</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Direct voice-to-voice with GPT-4o Realtime (Latest)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {isConnected && (
              <>
                <Badge variant={isSpeaking ? "default" : "secondary"} className="flex items-center gap-1 text-xs">
                  <Volume2 className="h-3 w-3" />
                  <span className="hidden xs:inline">{isSpeaking ? "Mochi Speaking" : "Ready"}</span>
                </Badge>
                <Badge variant={isListening ? "default" : "outline"} className="flex items-center gap-1 text-xs">
                  <Mic className="h-3 w-3" />
                  <span className="hidden xs:inline">{isListening ? "Listening" : "Idle"}</span>
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-2">🚀</div>
            <p className="text-base sm:text-lg mb-2">OpenAI Realtime Voice Chat</p>
            <p className="text-sm px-4">
              {isConnected 
                ? "🐝 I'm listening! Start speaking and I'll respond in real-time with natural voice."
                : "Press the button below to start a natural voice conversation with Mochi using OpenAI's latest Realtime API! 🌻"}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/70 backdrop-blur-sm'
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <span className="text-xl animate-bee-bounce">🐝</span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {message.isVoice && (
                          <Badge variant="outline" className="text-xs">
                            <Mic className="h-3 w-3 mr-1" />
                            Voice
                          </Badge>
                        )}
                        {message.type === 'assistant' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakWithUnifiedVoice(message.content)}
                            className="h-6 p-1"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
        
        {currentTranscript && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] bg-muted/70 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xl animate-bee-bounce">🐝</span>
                  <div className="flex-1">
                    <p className="text-sm">{currentTranscript}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Speaking...
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="p-3 sm:p-4 border-t border-border/50 bg-background/60 backdrop-blur-sm space-y-3 sm:space-y-4 safe-area-bottom">
        {/* Voice Control */}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              disabled={isConnecting}
              className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-sm sm:text-base">Connecting...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Start Realtime Voice</span>
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={endConversation}
                variant="outline"
                size="lg"
                className="px-4 sm:px-6"
              >
                <MicOff className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">End Chat</span>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Voice Commands */}
        {isConnected && (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              🎙️ Just speak naturally or try these commands:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Tell me about bees",
                "How do bees make honey?",
                "What flowers do bees love?",
                "Why are bees important?"
              ].map((command) => (
                <Button
                  key={command}
                  variant="outline"
                  size="sm"
                  onClick={() => sendTextMessage(command)}
                  className="text-xs"
                >
                  "{command}"
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        {isConnected && (
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>Voice Detection</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>AI Speaking</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>GPT-4o Realtime (Latest)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
import { supabase } from '@/integrations/supabase/client';

interface VoiceChatProps {
  className?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ className }) => {
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'dory'; content: string }>>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const connectToVoiceChat = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Get the WebSocket URL for the voice chat edge function
      const wsUrl = `wss://zrdywdregcrykmbiytvl.functions.supabase.co/voice_chat_dory`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Voice chat connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        toast({
          title: "🐝 ¡Buzztastical!",
          description: "Voice chat with Dory is ready! / ¡El chat de voz con Dory está listo!",
        });
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        
        if (data.type === 'audio_response') {
          // Play the audio response
          playAudioResponse(data.audio);
          // Add to conversation
          setConversation(prev => [...prev, { role: 'dory', content: data.text }]);
          // Trigger plant growth
          incrementGrowth();
        } else if (data.type === 'text_chunk') {
          // Handle streaming text updates
          console.log('Text chunk:', data.content);
        } else if (data.type === 'error') {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive"
          });
        }
      };

      wsRef.current.onclose = () => {
        console.log('Voice chat disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setIsRecording(false);
        setIsSpeaking(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Error",
        description: "Failed to initialize voice chat",
        variant: "destructive"
      });
    }
  };

  const playAudioResponse = async (base64Audio: string) => {
    try {
      setIsSpeaking(true);
      const audioData = atob(base64Audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            audio: base64Audio,
            conversation_history: conversation
          }));
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (mediaRecorderRef.current && isRecording) {
      stopRecording();
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="relative">
            <div className={`text-4xl sm:text-6xl transition-all duration-300 ${
              isSpeaking ? 'animate-bee-bounce scale-110' : 'animate-flower-sway'
            }`}>
              🎙️🐝
            </div>
            {isSpeaking && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <div className="animate-pulse text-lg sm:text-2xl">🔊</div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-bee bg-clip-text text-transparent">
              Voice Chat with Dory
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              ¡Buzztastical! 🐝✨ Have a bilingual conversation about gardens!
            </p>
          </div>

          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
            <Badge variant={isConnected ? "default" : "secondary"} className="animate-flower-sway text-xs">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse text-xs">
                🎤 Recording...
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="default" className="animate-pulse text-xs">
                🗣️ Dory Speaking...
              </Badge>
            )}
          </div>
        </div>

        {/* Conversation Display - Mobile Optimized */}
        <Card className="flex-1 min-h-[180px] sm:min-h-[200px] max-h-[300px] sm:max-h-[400px] overflow-hidden">
          <CardContent className="p-2 sm:p-4 h-full">
            <div className="h-full overflow-y-auto space-y-2 sm:space-y-3 scroll-area">
              {conversation.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 sm:py-8">
                  <div className="text-3xl sm:text-4xl mb-2">🌻</div>
                  <p className="text-sm sm:text-base">Start speaking to begin your conversation with Dory!</p>
                  <p className="text-xs sm:text-sm">¡Comienza a hablar para conversar con Dory!</p>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm flex-shrink-0">
                          {message.role === 'user' ? '👤' : '🐝'}
                        </span>
                        <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls - Mobile Optimized */}
        <div className="flex justify-center gap-2 sm:gap-4 safe-area-bottom">
          {!isConnected ? (
            <Button
              onClick={connectToVoiceChat}
              disabled={connectionStatus === 'connecting'}
              className="bg-gradient-bee hover:opacity-90 min-h-[48px] px-4 sm:px-6 text-sm sm:text-base"
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                  <span className="hidden xs:inline">Connecting...</span>
                  <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">Start Voice Chat</span>
                  <span className="sm:hidden">Start Voice</span>
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSpeaking}
                variant={isRecording ? "destructive" : "default"}
                className={`min-h-[48px] px-3 sm:px-4 text-sm sm:text-base ${!isRecording ? "bg-gradient-bee hover:opacity-90" : ""}`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Stop Recording</span>
                    <span className="sm:hidden">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{isSpeaking ? "Dory is speaking..." : "Hold to Talk"}</span>
                    <span className="sm:hidden">{isSpeaking ? "Speaking..." : "Talk"}</span>
                  </>
                )}
              </Button>
              
              <Button
                onClick={disconnect}
                variant="outline"
                className="min-h-[48px] px-3 sm:px-4 text-sm sm:text-base"
              >
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Disconnect</span>
                <span className="sm:hidden">End</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
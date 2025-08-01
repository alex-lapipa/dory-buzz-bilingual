import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { RealtimeVoiceChat } from '@/utils/realtimeAudio';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const MobileVoiceChat: React.FC = () => {
  const { toast } = useToast();
  const { trackEvent } = useUserAnalytics();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const chatRef = useRef<RealtimeVoiceChat | null>(null);

  useEffect(() => {
    return () => {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }
    };
  }, []);

  const handleMessage = (event: any) => {
    console.log('📨 Voice event:', event.type);
    
    switch (event.type) {
      case 'session.ready':
        toast({
          title: "🐝 Mochi is ready!",
          description: "Start speaking to chat with your garden assistant.",
        });
        break;
        
      case 'response.audio_transcript.delta':
        if (event.delta) {
          // Update or create assistant message
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.type === 'assistant') {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: lastMessage.content + event.delta
                }
              ];
            } else {
              return [
                ...prev,
                {
                  id: Date.now().toString(),
                  type: 'assistant',
                  content: event.delta,
                  timestamp: new Date()
                }
              ];
            }
          });
        }
        break;
        
      case 'response.audio.delta':
        setIsSpeaking(true);
        break;
        
      case 'response.audio.done':
        setIsSpeaking(false);
        break;
        
      case 'input_audio_buffer.speech_started':
        console.log('🎤 User started speaking');
        break;
        
      case 'input_audio_buffer.speech_stopped':
        console.log('🎤 User stopped speaking');
        break;
        
      case 'error':
        console.error('❌ Voice chat error:', event);
        toast({
          title: "Voice Chat Error",
          description: event.message || "An error occurred",
          variant: "destructive",
        });
        break;
    }
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    setIsLoading(false);
    
    if (connected) {
      trackEvent('voice_chat_connected', 'voice', { mode: 'realtime' });
    } else {
      trackEvent('voice_chat_disconnected', 'voice', { mode: 'realtime' });
    }
  };

  const startVoiceChat = async () => {
    try {
      setIsLoading(true);
      
      // Track voice chat start attempt
      await trackEvent('voice_chat_start_attempt', 'voice', { 
        mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });
      
      chatRef.current = new RealtimeVoiceChat(handleMessage, handleConnectionChange);
      await chatRef.current.connect();
      
    } catch (error) {
      console.error('❌ Error starting voice chat:', error);
      setIsLoading(false);
      
      await trackEvent('voice_chat_start_error', 'voice', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: "Voice Chat Error",
        description: error instanceof Error ? error.message : 'Failed to start voice chat',
        variant: "destructive",
      });
    }
  };

  const stopVoiceChat = () => {
    if (chatRef.current) {
      chatRef.current.disconnect();
      chatRef.current = null;
    }
    setMessages([]);
    trackEvent('voice_chat_stopped', 'voice', { mode: 'manual' });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    trackEvent('voice_audio_toggled', 'voice', { enabled: !audioEnabled });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <div>
            <h2 className="font-semibold text-lg">Chat with Mochi</h2>
            <p className="text-sm text-muted-foreground">
              {isConnected ? (isSpeaking ? "Mochi is speaking..." : "Ready to chat") : "Not connected"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            disabled={!isConnected}
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isConnected ? (
          <Card className="mx-auto max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🌻</div>
              <h3 className="font-semibold mb-2">Voice Chat with Mochi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Talk naturally with your garden assistant. Ask about plants, bees, or sustainable gardening!
              </p>
              <p className="text-xs text-muted-foreground">
                Tap the microphone to start a conversation
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isSpeaking && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 mr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Mochi is speaking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex justify-center">
          {!isConnected ? (
            <Button
              onClick={startVoiceChat}
              disabled={isLoading}
              size="lg"
              className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                onClick={stopVoiceChat}
                variant="destructive"
                size="lg"
                className="rounded-full h-12 w-12"
              >
                <MicOff className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          )}
        </div>
        
        {isConnected && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Speak naturally - Mochi will respond when you pause
          </p>
        )}
      </div>
    </div>
  );
};
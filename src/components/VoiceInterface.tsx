import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/realtimeAudio';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Volume2, VolumeX, Brain, Loader2, Zap } from 'lucide-react';

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
  const chatRef = useRef<RealtimeChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessage = useCallback((event: any) => {
    console.log('Voice interface received message:', event.type);
    
    switch (event.type) {
      case 'session.created':
        console.log('Session created successfully');
        toast({
          title: "🐝 Mochi is ready!",
          description: "Voice conversation started. Say hello!",
        });
        break;
        
      case 'response.created':
        console.log('AI response started');
        setIsSpeaking(true);
        break;
        
      case 'response.audio_transcript.delta':
        if (event.delta) {
          setCurrentTranscript(prev => prev + event.delta);
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
        
      case 'response.audio.done':
        console.log('AI audio response complete');
        setIsSpeaking(false);
        break;
        
      case 'input_audio_buffer.speech_started':
        console.log('User speech detected');
        setIsListening(true);
        break;
        
      case 'input_audio_buffer.speech_stopped':
        console.log('User speech ended');
        setIsListening(false);
        break;
        
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: event.transcript,
            timestamp: new Date(),
            isVoice: true
          };
          setMessages(prev => [...prev, userMessage]);
        }
        break;
        
      case 'error':
        console.error('Realtime API error:', event);
        toast({
          title: "Voice Error",
          description: event.error?.message || "Something went wrong with voice chat",
          variant: "destructive",
        });
        break;
        
      default:
        // Log other events for debugging
        if (event.type) {
          console.log(`Unhandled event type: ${event.type}`);
        }
        break;
    }
  }, [currentTranscript, toast]);

  const handleError = useCallback((error: string) => {
    console.error('RealtimeChat error:', error);
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsListening(false);
    
    toast({
      title: "Connection Error",
      description: error,
      variant: "destructive",
    });
  }, [toast]);

  const startConversation = async () => {
    try {
      setIsConnecting(true);
      
      toast({
        title: "🎤 Connecting...",
        description: "Setting up voice chat with Mochi",
      });

      chatRef.current = new RealtimeChat(handleMessage, handleError);
      await chatRef.current.init();
      
      setIsConnected(true);
      setIsConnecting(false);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: "🐝 Buzz buzz! Hi there! I'm Mochi, your voice-enabled bee guide! You can now talk to me naturally - just speak and I'll respond with my voice. Ask me anything about bees, flowers, or our garden world!",
        timestamp: new Date(),
        isVoice: false
      };
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to start voice conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsListening(false);
    setMessages([]);
    setCurrentTranscript('');
    
    toast({
      title: "🐝 Voice chat ended",
      description: "Thanks for talking with Mochi!",
    });
  };

  const sendTextMessage = async (text: string) => {
    if (!chatRef.current?.isReady()) {
      toast({
        title: "Not connected",
        description: "Please start the voice conversation first",
        variant: "destructive",
      });
      return;
    }

    try {
      await chatRef.current.sendMessage(text);
      
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

  const speakWithElevenLabs = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: `🐝 ${text}`,
          voice_id: "9BWtsMINqrJLrRacOk9x" // Aria voice
        }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
    }
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bee-bounce">🎤</span>
            <div>
              <h2 className="text-lg font-bold">Voice Chat with Mochi</h2>
              <p className="text-sm text-muted-foreground">Real-time voice conversations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <Badge variant={isSpeaking ? "default" : "secondary"} className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  {isSpeaking ? "Mochi Speaking" : "Ready"}
                </Badge>
                <Badge variant={isListening ? "default" : "outline"} className="flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  {isListening ? "Listening" : "Idle"}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
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
                          onClick={() => speakWithElevenLabs(message.content)}
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
        ))}
        
        {currentTranscript && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] bg-muted">
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
      <div className="p-4 border-t bg-background space-y-4">
        {/* Voice Control */}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              disabled={isConnecting}
              className="bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={endConversation}
                variant="outline"
                size="lg"
              >
                <MicOff className="h-4 w-4 mr-2" />
                End Chat
              </Button>
            </div>
          )}
        </div>

        {/* Quick Voice Commands */}
        {isConnected && (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              🎙️ Just speak naturally or try these voice commands:
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
              <Brain className="h-3 w-3" />
              <span>GPT-4o Realtime</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
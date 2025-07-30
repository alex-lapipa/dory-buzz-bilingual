import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Zap, 
  Settings,
  Smartphone,
  Wifi,
  AlertTriangle
} from 'lucide-react';
import { AudioRecorder, AudioQueue, encodeAudioForAPI } from '@/utils/realtimeAudio';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceInterfaceProps {
  className?: string;
}

export const UnifiedVoiceInterface: React.FC<VoiceInterfaceProps> = ({ className }) => {
  const { toast } = useToast();
  
  // Connection States
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Messages and UI
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [deviceCapabilities, setDeviceCapabilities] = useState<any>(null);
  
  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize device capabilities on mount
  useEffect(() => {
    const caps = {
      microphone: !!navigator.mediaDevices?.getUserMedia,
      audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),
      webRTC: !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection),
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)
    };
    setDeviceCapabilities(caps);
    console.log('🔧 Device capabilities detected:', caps);
    
    if (!caps.microphone) {
      setConnectionError('Microphone not available on this device');
    }
    
    if (!caps.audioContext) {
      setConnectionError('Web Audio API not supported on this device');
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio data handler with level detection
  const handleAudioData = useCallback((audioData: Float32Array) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Calculate audio level for UI feedback
      const level = Math.sqrt(audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length);
      setAudioLevel(Math.min(level * 100, 100));
      
      // Send audio to unified voice hub
      const encodedAudio = encodeAudioForAPI(audioData);
      wsRef.current.send(JSON.stringify({
        type: 'audio_chunk',
        audio: encodedAudio,
        timestamp: Date.now()
      }));
    }
  }, []);

  // Initialize audio system with mobile optimizations
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ 
          sampleRate: 24000,
          latencyHint: 'interactive'
        });
        
        // Mobile optimization: Resume audio context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }
      
      // Resume audio context if suspended (mobile requirement)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('🔊 Audio context resumed for mobile');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  };

  // Connect to unified voice hub with fallback strategy
  const connectToVoiceHub = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Initialize audio first
      const audioReady = await initializeAudio();
      if (!audioReady) {
        throw new Error('Failed to initialize audio system');
      }

      // Connect to unified voice hub WebSocket
      const wsUrl = `wss://zrdywdregcrykmbiytvl.functions.supabase.co/unified_voice_hub`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('🚀 Connected to Unified Voice Hub');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Send initial configuration
        wsRef.current?.send(JSON.stringify({
          type: 'configure',
          config: {
            voice_provider: 'auto',
            language: 'en',
            voice: 'aria',
            real_time: true,
            mobile_optimized: deviceCapabilities?.isMobile || false
          }
        }));
        
        toast({
          title: "🐝 Mochi Voice Ready!",
          description: "Advanced voice chat is now active. Speak naturally!",
          duration: 4000,
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Voice Hub message:', data.type);
          
          await handleVoiceMessage(data);
        } catch (error) {
          console.error('Error handling voice message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed. Please check your internet and try again.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        setIsListening(false);
        setIsSpeaking(false);
        
        // Auto-reconnect if not intentionally closed
        if (event.code !== 1000 && !connectionError) {
          scheduleReconnect();
        }
      };

    } catch (error) {
      console.error('Error connecting to voice hub:', error);
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnecting(false);
    }
  };

  // Handle different types of voice messages
  const handleVoiceMessage = async (data: any) => {
    switch (data.type) {
      case 'voice_ready':
        console.log('🎤 Voice system ready');
        await startListening();
        break;
        
      case 'transcription':
        if (data.text) {
          const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: data.text,
            timestamp: new Date(),
            isVoice: true
          };
          setMessages(prev => [...prev, userMessage]);
          
          // Send to unified chat orchestrator
          await processWithChat(data.text);
        }
        break;
        
      case 'audio_response':
        setIsSpeaking(true);
        if (data.audio && audioQueueRef.current) {
          const binaryString = atob(data.audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await audioQueueRef.current.addToQueue(bytes);
        }
        break;
        
      case 'audio_complete':
        setIsSpeaking(false);
        break;
        
      case 'chat_response':
        if (data.text) {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            type: 'assistant',
            content: data.text,
            timestamp: new Date(),
            isVoice: true
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
        break;
        
      case 'error':
        console.error('Voice Hub error:', data.error);
        toast({
          title: "Voice Error",
          description: data.error || "Something went wrong with voice processing",
          variant: "destructive",
        });
        break;
    }
  };

  // Process text through unified chat orchestrator
  const processWithChat = async (text: string) => {
    try {
      const response = await supabase.functions.invoke('unified_chat_orchestrator', {
        body: {
          message: text,
          platform: 'auto',
          specialty: 'bee_education',
          conversation_history: messages.slice(-10).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          advanced_features: {
            voice_response: true
          }
        }
      });

      if (response.error) throw response.error;

      // Send response back to voice hub for TTS
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'synthesize_speech',
          text: response.data.response,
          voice: 'aria',
          provider: 'auto'
        }));
      }
      
    } catch (error) {
      console.error('Chat processing error:', error);
    }
  };

  // Start listening with mobile optimizations
  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        await initializeAudio();
      }
      
      // Mobile-specific: Ensure audio context is resumed
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder(handleAudioData);
      }
      
      await audioRecorderRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Voice input started');
      
    } catch (error) {
      console.error('Error starting voice input:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  // Stop listening
  const stopListening = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    setIsListening(false);
    setAudioLevel(0);
  };

  // Auto-reconnect with backoff
  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('🔄 Attempting to reconnect...');
      connectToVoiceHub();
    }, 3000);
  };

  // Start conversation
  const startConversation = async () => {
    // Mobile optimization: Request audio context activation with user gesture
    if (deviceCapabilities?.isMobile) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('📱 Mobile audio permissions granted');
      } catch (error) {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access for voice chat to work",
          variant: "destructive",
        });
        return;
      }
    }
    
    await connectToVoiceHub();
  };

  // Disconnect
  const disconnect = () => {
    stopListening();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
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
    setConnectionError(null);
    
    toast({
      title: "🐝 Voice chat ended",
      description: "Thanks for talking with Mochi!",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Render device compatibility warning
  const renderCompatibilityCheck = () => {
    if (!deviceCapabilities) return null;
    
    const issues = [];
    if (!deviceCapabilities.microphone) issues.push('Microphone not available');
    if (!deviceCapabilities.audioContext) issues.push('Web Audio not supported');
    if (!deviceCapabilities.webRTC) issues.push('WebRTC not supported');
    
    if (issues.length === 0) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Compatibility Issues:</strong>
          <ul className="mt-2 list-disc list-inside">
            {issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 backdrop-blur-sm border-b border-yellow-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl animate-bee-bounce">🚀</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Unified Voice Chat</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Advanced AI voice conversation with cross-device optimization
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {deviceCapabilities?.isMobile && (
              <Badge variant="outline" className="text-xs">
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile
              </Badge>
            )}
            
            {isConnected && (
              <>
                <Badge variant={isSpeaking ? "default" : "secondary"} className="flex items-center gap-1 text-xs">
                  <Volume2 className="h-3 w-3" />
                  <span className="hidden xs:inline">{isSpeaking ? "Speaking" : "Ready"}</span>
                </Badge>
                
                <Badge variant={isListening ? "default" : "outline"} className="flex items-center gap-1 text-xs">
                  <Mic className="h-3 w-3" />
                  <span className="hidden xs:inline">{isListening ? "Listening" : "Idle"}</span>
                  {isListening && audioLevel > 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compatibility Check */}
      {renderCompatibilityCheck()}

      {/* Connection Error */}
      {connectionError && (
        <Alert variant="destructive" className="m-3 sm:m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-2">🚀</div>
            <p className="text-base sm:text-lg mb-2">Unified Voice Chat</p>
            <p className="text-sm px-4">
              {isConnected 
                ? "🐝 Ready for natural voice conversation! Speak and I'll respond with intelligent voice synthesis."
                : "Press the button below to start an advanced voice conversation with Mochi using our unified AI platform! 🌻"}
            </p>
            
            {deviceCapabilities && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant={deviceCapabilities.microphone ? "default" : "destructive"}>
                  <Mic className="h-3 w-3 mr-1" />
                  Microphone: {deviceCapabilities.microphone ? "Ready" : "Not Available"}
                </Badge>
                <Badge variant={deviceCapabilities.webRTC ? "default" : "secondary"}>
                  <Wifi className="h-3 w-3 mr-1" />
                  WebRTC: {deviceCapabilities.webRTC ? "Supported" : "Limited"}
                </Badge>
              </div>
            )}
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
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
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
                      Processing...
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
      <div className="p-3 sm:p-4 border-t border-border/50 bg-background/60 backdrop-blur-sm space-y-3 sm:space-y-4">
        {/* Audio Level Indicator */}
        {isListening && (
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-green-500" />
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(audioLevel)}%</span>
          </div>
        )}
        
        {/* Main Control */}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              disabled={isConnecting || !!connectionError}
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
                  <span className="text-sm sm:text-base">Start Unified Voice</span>
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Start Listening</span>
                  </>
                )}
              </Button>
              
              <Button 
                onClick={disconnect}
                variant="outline"
                size="lg"
              >
                End Chat
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Tips */}
        {deviceCapabilities?.isMobile && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💡 For best results: Use WiFi, enable microphone permissions, and keep device unmuted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
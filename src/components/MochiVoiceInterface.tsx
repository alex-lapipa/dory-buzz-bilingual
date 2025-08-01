import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Volume2, Loader2, WifiOff, Smile, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useOutdoorMode } from '@/hooks/useOutdoorMode';

interface VoiceMessage {
  id: string;
  type: 'user' | 'mochi';
  content: string;
  timestamp: Date;
  isAudio: boolean;
  mood?: 'excited' | 'helpful' | 'funny' | 'thinking';
}

// Enhanced audio utilities for reliable outdoor performance
class ReliableAudioProcessor {
  private audioContext: AudioContext | null = null;
  private recorder: MediaRecorder | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;

  async initialize() {
    try {
      this.audioContext = new AudioContext({
        sampleRate: 24000,
        latencyHint: 'interactive'
      });
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      return true;
    } catch (error) {
      console.error('🐝 Audio initialization failed:', error);
      return false;
    }
  }

  async startRecording(onAudioData: (data: ArrayBuffer) => void) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then(onAudioData);
        }
      };

      this.recorder.start(100); // 100ms chunks for real-time processing
      return true;
    } catch (error) {
      console.error('🐝 Recording failed:', error);
      return false;
    }
  }

  stopRecording() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
      this.recorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  async playAudioChunk(audioData: ArrayBuffer) {
    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      this.audioQueue.push(audioBuffer);
      
      if (!this.isPlaying) {
        this.playNextInQueue();
      }
    } catch (error) {
      console.error('🐝 Audio playback error:', error);
    }
  }

  private async playNextInQueue() {
    if (this.audioQueue.length === 0 || !this.audioContext) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift()!;
    
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => this.playNextInQueue();
    source.start();
  }

  cleanup() {
    this.stopRecording();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioQueue = [];
  }
}

export function MochiVoiceInterface() {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMochiSpeaking, setIsMochiSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [mochiMood, setMochiMood] = useState<'excited' | 'helpful' | 'funny' | 'thinking'>('excited');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOutdoorMode, hapticFeedback } = useOutdoorMode();
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioProcessorRef = useRef<ReliableAudioProcessor | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = useCallback((content: string, type: 'user' | 'mochi', isAudio = false, mood?: VoiceMessage['mood']) => {
    const newMessage: VoiceMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isAudio,
      mood
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const connectToMochi = useCallback(async () => {
    if (!user) {
      toast({
        title: "🐝 Authentication Required",
        description: "Please sign in to chat with Mochi!",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      // Initialize audio processor
      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new ReliableAudioProcessor();
        const audioReady = await audioProcessorRef.current.initialize();
        
        if (!audioReady) {
          throw new Error('Audio system not available');
        }
      }

      // Connect to Mochi's voice service
      const wsUrl = `wss://zrdywdregcrykmbiytvl.supabase.co/functions/v1/mochi_realtime_voice`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('🐝 Connected to Mochi!');
        setIsConnected(true);
        setConnectionStatus('connected');
        setIsConnecting(false);
        
        addMessage("Buzz buzz! Mochi is here and ready to chat about your garden! 🐝🌻", 'mochi', true, 'excited');
        
        hapticFeedback('light');
        toast({
          title: "🐝 Mochi Connected!",
          description: "Ready for voice gardening conversations!",
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('🐝 Received:', data.type);

          switch (data.type) {
            case 'mochi_status':
              if (data.status === 'connected') {
                addMessage(data.message, 'mochi', false, 'excited');
              }
              break;

            case 'response.audio.delta':
              // Play audio chunks in real-time
              if (data.delta && audioProcessorRef.current) {
                const audioData = Uint8Array.from(atob(data.delta), c => c.charCodeAt(0));
                audioProcessorRef.current.playAudioChunk(audioData.buffer);
                setIsMochiSpeaking(true);
              }
              break;

            case 'response.audio_transcript.delta':
              // Update Mochi's message as it's being spoken
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.type === 'mochi' && lastMessage.isAudio) {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content: lastMessage.content + data.delta }
                  ];
                } else {
                  return [...prev, {
                    id: Date.now().toString(),
                    type: 'mochi',
                    content: data.delta,
                    timestamp: new Date(),
                    isAudio: true,
                    mood: 'helpful'
                  }];
                }
              });
              break;

            case 'response.audio.done':
              setIsMochiSpeaking(false);
              setMochiMood('helpful');
              break;

            case 'input_audio_buffer.speech_started':
              setIsListening(true);
              setMochiMood('thinking');
              break;

            case 'input_audio_buffer.speech_stopped':
              setIsListening(false);
              setMochiMood('thinking');
              break;

            case 'mochi_error':
              addMessage(data.message, 'mochi', false, 'funny');
              break;

            case 'error':
              console.error('🐝 WebSocket error:', data);
              addMessage("Oops! Mochi's having a tiny technical buzz-up! 🐝⚡", 'mochi', false, 'funny');
              break;
          }
        } catch (error) {
          console.error('🐝 Message parsing error:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('🐝 WebSocket error:', error);
        setConnectionStatus('error');
        
        toast({
          title: "🐝 Connection Issue",
          description: "Mochi is having trouble connecting. Trying again...",
          variant: "destructive"
        });
      };

      wsRef.current.onclose = () => {
        console.log('🐝 Disconnected from Mochi');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setIsListening(false);
        setIsMochiSpeaking(false);
        
        // Auto-reconnect after 3 seconds
        retryTimeoutRef.current = setTimeout(() => {
          if (!isConnected) {
            connectToMochi();
          }
        }, 3000);
      };

    } catch (error) {
      console.error('🐝 Connection failed:', error);
      setIsConnecting(false);
      setConnectionStatus('error');
      
      toast({
        title: "🐝 Connection Failed",
        description: "Couldn't connect to Mochi. Please try again!",
        variant: "destructive"
      });
    }
  }, [user, toast, hapticFeedback, isConnected, addMessage]);

  const startListening = useCallback(async () => {
    if (!wsRef.current || !audioProcessorRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "🐝 Not Ready",
        description: "Please connect to Mochi first!",
        variant: "destructive"
      });
      return;
    }

    const success = await audioProcessorRef.current.startRecording((audioData) => {
      // Convert to PCM16 and send to Mochi
      const pcmData = new Int16Array(audioData);
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      
      wsRef.current?.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64Audio
      }));
    });

    if (success) {
      setIsListening(true);
      hapticFeedback('medium');
      
      toast({
        title: "🎙️ Listening...",
        description: "Mochi is all ears (or antennae)! 🐝",
      });
    }
  }, [toast, hapticFeedback]);

  const stopListening = useCallback(() => {
    audioProcessorRef.current?.stopRecording();
    setIsListening(false);
    hapticFeedback('light');
  }, [hapticFeedback]);

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    wsRef.current?.close();
    audioProcessorRef.current?.cleanup();
    audioProcessorRef.current = null;
    
    setIsConnected(false);
    setIsListening(false);
    setIsMochiSpeaking(false);
    setConnectionStatus('disconnected');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const getMochiEmoji = () => {
    switch (mochiMood) {
      case 'excited': return '🐝✨';
      case 'helpful': return '🐝🌻';
      case 'funny': return '🐝😄';
      case 'thinking': return '🐝🤔';
      default: return '🐝';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto transition-all duration-300 ${
      isOutdoorMode 
        ? 'bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/60' 
        : 'bg-card/95 backdrop-blur-sm border-border/50'
    }`}>
      <CardHeader className={`border-b ${isOutdoorMode ? 'border-yellow-400/30 bg-yellow-50/80' : 'border-border/20'}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-3 ${isOutdoorMode ? 'text-yellow-900' : 'text-foreground'}`}>
            <span className="text-3xl animate-bounce">{getMochiEmoji()}</span>
            <div>
              <h2 className="text-xl font-bold">Mochi Voice Garden</h2>
              <p className="text-sm opacity-80">Your funny, reliable garden bee companion</p>
            </div>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <Badge variant="outline" className={`${
              isOutdoorMode ? 'bg-yellow-200/50 text-yellow-900 border-yellow-400' : ''
            }`}>
              {connectionStatus === 'connected' ? '🎙️ Live' : 
               connectionStatus === 'connecting' ? '⏳ Connecting' : 
               connectionStatus === 'error' ? '⚠️ Error' : '🔌 Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Connection Status */}
        {!isConnected && (
          <Alert className={isOutdoorMode ? 'border-yellow-400 bg-yellow-50/80' : ''}>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              {connectionStatus === 'error' 
                ? "Mochi's wings got tangled! Click 'Connect to Mochi' to help her fly again! 🐝💚"
                : "Mochi is ready to buzz with you about gardening! Connect to start your voice conversation! 🌻"
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto mobile-scroll">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl shadow-md transition-all duration-300 ${
                  message.type === 'user'
                    ? isOutdoorMode 
                      ? 'bg-yellow-500 text-white border border-yellow-600'
                      : 'bg-primary text-primary-foreground'
                    : isOutdoorMode
                      ? 'bg-white border-2 border-yellow-300 text-yellow-900'
                      : 'bg-muted text-muted-foreground'
                } ${message.isAudio ? 'animate-fade-in' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'mochi' && (
                    <span className="text-lg flex-shrink-0">{getMochiEmoji()}</span>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.isAudio && <Volume2 className="w-3 h-3" />}
                      {message.mood && (
                        <Badge variant="outline" className="text-xs">
                          {message.mood}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mochi status indicators */}
          {isMochiSpeaking && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-xl ${
                isOutdoorMode ? 'bg-yellow-100 border border-yellow-300' : 'bg-muted'
              }`}>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Mochi is buzzing her response...</span>
                  <span className="text-lg animate-bounce">🐝</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls */}
        <div className="space-y-4">
          {!isConnected ? (
            <Button
              onClick={connectToMochi}
              disabled={isConnecting}
              size="lg"
              className={`w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
                isOutdoorMode
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-600'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Connecting to Mochi...
                </>
              ) : (
                <>
                  <Heart className="w-6 h-6 mr-3" />
                  Connect to Mochi 🐝
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isMochiSpeaking}
                size="lg"
                className={`w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse border-2 border-red-600' 
                    : isOutdoorMode
                      ? 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-600'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                } ${isListening ? 'voice-button-active' : ''}`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-3" />
                    Tap to Stop Talking
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-3" />
                    Hold to Talk to Mochi
                  </>
                )}
              </Button>
              
              <Button
                onClick={disconnect}
                variant="outline"
                className={`w-full ${
                  isOutdoorMode ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100' : ''
                }`}
              >
                <WifiOff className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
        </div>

        {/* Status Display */}
        <div className={`text-center text-sm p-3 rounded-lg ${
          isOutdoorMode 
            ? 'bg-yellow-50/80 text-yellow-800 border border-yellow-200' 
            : 'text-muted-foreground bg-muted/50'
        }`}>
          {isListening && "🎙️ Mochi is listening to your garden questions..."}
          {isMochiSpeaking && "🐝 Mochi is sharing her buzzing garden wisdom..."}
          {isConnected && !isListening && !isMochiSpeaking && (
            <div>
              <p className="font-medium">🌞 Ready for Garden Chat!</p>
              <p className="text-xs mt-1">Tap and hold the mic to ask Mochi about your plants! 🌱</p>
            </div>
          )}
          {!isConnected && (
            <div>
              <p className="font-medium">🐝 Mochi's Hive Offline</p>
              <p className="text-xs mt-1">Connect to start your funny, helpful garden conversations!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
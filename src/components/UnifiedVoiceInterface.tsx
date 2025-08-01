import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
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
import { 
  createMobileWebSocket, 
  isMobile, 
  isIOS, 
  isAndroid, 
  requestMobilePermissions,
  createMobileAudioContext,
  resumeAudioContextOnMobile,
  handleMobileVoiceError,
  getMobileAudioConstraints
} from '@/utils/mobileVoiceUtils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceInterfaceProps {
  className?: string;
  mode?: 'simple' | 'realtime' | 'mobile';
}

export const UnifiedVoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  className, 
  mode = 'simple' 
}) => {
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  
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
  
  // Refs for audio handling
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Check device capabilities on mount
    const capabilities = {
      isMobile: isMobile(),
      isIOS: isIOS(),
      isAndroid: isAndroid(),
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasWebAudio: !!(window.AudioContext || (window as any).webkitAudioContext),
      hasWebSocket: !!window.WebSocket
    };
    setDeviceCapabilities(capabilities);
  }, []);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant', isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  // Realtime WebSocket connection for advanced mode
  const connectRealtimeAPI = useCallback(async () => {
    if (mode !== 'realtime') return;
    
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = isMobile() 
          ? await createMobileAudioContext()
          : new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }

      // Resume audio context on mobile
      if (isMobile()) {
        await resumeAudioContextOnMobile(audioContextRef.current);
      }

      // Connect to WebSocket
      const wsUrl = isMobile() 
        ? `wss://zrdywdregcrykmbiytvl.functions.supabase.co/mochi_realtime_voice`
        : `wss://zrdywdregcrykmbiytvl.functions.supabase.co/mochi_realtime_voice`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to realtime voice API');
        setIsConnected(true);
        setIsConnecting(false);
        
        toast({
          title: "🎤 Voice Chat Connected",
          description: "You can now speak naturally with Mochi!"
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'session.created':
            console.log('Voice session created');
            break;
            
          case 'input_audio_buffer.speech_started':
            setIsListening(true);
            setCurrentTranscript('');
            break;
            
          case 'input_audio_buffer.speech_stopped':
            setIsListening(false);
            break;
            
          case 'response.audio.delta':
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
            setIsSpeaking(false);
            incrementGrowth();
            break;
            
          case 'conversation.item.input_audio_transcription.completed':
            if (data.transcript) {
              addMessage(data.transcript, 'user', true);
              setCurrentTranscript('');
            }
            break;
            
          case 'response.audio_transcript.delta':
            if (data.delta) {
              setCurrentTranscript(prev => prev + data.delta);
            }
            break;
            
          case 'response.audio_transcript.done':
            if (currentTranscript) {
              addMessage(currentTranscript, 'assistant', true);
              setCurrentTranscript('');
            }
            break;
            
          case 'error':
            console.error('Realtime API error:', data.error);
            setConnectionError(data.error.message || 'Connection error');
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (isMobile()) {
          console.error('Mobile voice error:', error);
        } else {
          setConnectionError('Connection failed. Please try again.');
        }
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
      console.error('Error connecting to realtime API:', error);
      if (isMobile()) {
        console.error('Mobile voice error:', error);
      } else {
        setConnectionError('Failed to initialize voice chat');
      }
      setIsConnecting(false);
    }
  }, [mode, addMessage, currentTranscript, incrementGrowth, toast]);

  // Simple voice recording for basic mode
  const startSimpleRecording = useCallback(async () => {
    try {
      // Request permissions on mobile
      if (isMobile()) {
        await requestMobilePermissions();
      }

      const constraints: MediaStreamConstraints = { audio: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processSimpleVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      
      toast({
        title: "🎤 Recording...",
        description: "Speak now, then tap the button again to send!"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      if (isMobile()) {
        console.error('Mobile voice error:', error);
      } else {
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const stopSimpleRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const processSimpleVoiceInput = useCallback(async (audioBlob: Blob) => {
    try {
      // Convert to text using STT
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const { data: sttData, error: sttError } = await supabase.functions.invoke('stt_chat', {
        body: formData
      });

      if (sttError) throw sttError;

      if (sttData.text) {
        addMessage(sttData.text, 'user', true);
        
        // Get response from Mochi
        const { data: chatData, error: chatError } = await supabase.functions.invoke('chat_mochi', {
          body: {
            message: sttData.text,
            conversation_history: messages.slice(-5)
          }
        });

        if (chatError) throw chatError;

        const response = chatData.response || "I'm having trouble understanding. Could you try again?";
        addMessage(response, 'assistant', false);

        // Convert response to speech
        const { data: ttsData, error: ttsError } = await supabase.functions.invoke('elevenlabs_tts', {
          body: {
            text: response,
            voice: 'alloy'
          }
        });

        if (!ttsError && ttsData.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${ttsData.audioContent}`);
          setIsSpeaking(true);
          audio.onended = () => setIsSpeaking(false);
          await audio.play();
        }

        incrementGrowth();
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process your voice input. Please try again.",
        variant: "destructive"
      });
    }
  }, [addMessage, messages, incrementGrowth, toast]);

  const startAdvancedListening = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      if (!audioRecorderRef.current) {
        const handleAudioData = (audioData: Float32Array) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const encodedAudio = encodeAudioForAPI(audioData);
            wsRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encodedAudio
            }));
          }
        };
        
        audioRecorderRef.current = new AudioRecorder(handleAudioData);
      }
      
      await audioRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting advanced listening:', error);
      if (isMobile()) {
        console.error('Mobile voice error:', error);
      }
    }
  }, [isConnected, toast]);

  const stopAdvancedListening = useCallback(() => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
  }, []);

  const toggleVoiceChat = useCallback(async () => {
    if (mode === 'realtime') {
      if (isConnected) {
        // Disconnect
        stopAdvancedListening();
        if (wsRef.current) {
          wsRef.current.close();
        }
        setIsConnected(false);
        setMessages([]);
      } else {
        // Connect
        await connectRealtimeAPI();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          await startAdvancedListening();
        }
      }
    } else {
      // Simple mode
      if (isListening) {
        stopSimpleRecording();
      } else {
        await startSimpleRecording();
      }
    }
  }, [mode, isConnected, isListening, connectRealtimeAPI, startAdvancedListening, stopAdvancedListening, startSimpleRecording, stopSimpleRecording]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const renderModeIndicator = () => {
    const modeLabels = {
      simple: 'Simple Voice',
      realtime: 'Realtime Voice',
      mobile: 'Mobile Optimized'
    };
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        {deviceCapabilities?.isMobile && <Smartphone className="w-3 h-3" />}
        {mode === 'realtime' && <Zap className="w-3 h-3" />}
        {modeLabels[mode]}
      </Badge>
    );
  };

  const renderConnectionStatus = () => {
    if (mode === 'simple') {
      return (
        <Badge variant={isListening ? "default" : "secondary"}>
          {isListening ? <Mic className="w-3 h-3 mr-1" /> : <MicOff className="w-3 h-3 mr-1" />}
          {isListening ? 'Recording...' : 'Ready'}
        </Badge>
      );
    }
    
    return (
      <Badge variant={isConnected ? "default" : "secondary"}>
        {isConnecting && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
        {isConnected && !isConnecting && <Wifi className="w-3 h-3 mr-1" />}
        {!isConnected && !isConnecting && <AlertTriangle className="w-3 h-3 mr-1" />}
        {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🐝</span>
              Voice Chat with Mochi
            </CardTitle>
            <div className="flex items-center gap-2">
              {renderModeIndicator()}
              {renderConnectionStatus()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Device capabilities warning for mobile */}
          {deviceCapabilities?.isMobile && !deviceCapabilities?.hasGetUserMedia && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your device may have limited voice chat capabilities. For best experience, use a desktop browser.
              </AlertDescription>
            </Alert>
          )}

          {/* Connection error */}
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-2">🎤</div>
                <p className="text-lg mb-2">Voice Chat with Mochi</p>
                <p className="text-sm">
                  {mode === 'realtime' 
                    ? "Connect for natural conversation with automatic voice detection"
                    : "Tap and hold to record your message, release to send"
                  }
                </p>
                {deviceCapabilities?.isMobile && (
                  <p className="text-xs mt-2 text-muted-foreground">
                    Optimized for mobile • {deviceCapabilities.isIOS ? 'iOS' : deviceCapabilities.isAndroid ? 'Android' : 'Mobile'} detected
                  </p>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm">{message.content}</div>
                      {message.isVoice && (
                        <Volume2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Current transcript for realtime mode */}
            {currentTranscript && (
              <div className="flex justify-start">
                <div className="bg-muted/50 p-3 rounded-lg border-dashed border">
                  <div className="text-sm">{currentTranscript}</div>
                  <div className="text-xs opacity-70 mt-1">Mochi is responding...</div>
                </div>
              </div>
            )}
            
            {/* Voice activity indicators */}
            {isListening && (
              <div className="flex justify-center">
                <Badge variant="outline" className="animate-pulse">
                  <Mic className="w-3 h-3 mr-1" />
                  {mode === 'realtime' ? 'Listening...' : 'Recording...'}
                </Badge>
              </div>
            )}
            
            {isSpeaking && (
              <div className="flex justify-center">
                <Badge variant="outline" className="animate-pulse">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Mochi Speaking...
                </Badge>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <Button
              onClick={toggleVoiceChat}
              size="lg"
              variant={isConnected || isListening ? "destructive" : "default"}
              disabled={isConnecting}
              className="gap-2"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (isConnected || isListening) ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
              {isConnecting 
                ? 'Connecting...' 
                : mode === 'realtime'
                  ? (isConnected ? 'Disconnect' : 'Start Voice Chat')
                  : (isListening ? 'Stop Recording' : 'Record Message')
              }
            </Button>
          </div>

          {/* Status text */}
          <div className="text-center text-xs text-muted-foreground mt-2">
            {mode === 'realtime' && isConnected && (
              "🐝 Connected • Speak naturally, I'll respond automatically"
            )}
            {mode === 'simple' && (
              "🎤 Tap to record • I'll transcribe and respond with voice"
            )}
            {deviceCapabilities?.isMobile && (
              ` • Mobile optimized for ${deviceCapabilities.isIOS ? 'iOS' : 'your device'}`
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
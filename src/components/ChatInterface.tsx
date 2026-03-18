import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
import { useMochiAssets } from '@/hooks/useMochiAssets';
import { getGuestUserId } from '@/lib/guestUtils';
import { useLanguage } from '@/contexts/LanguageContext';

import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Image, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Camera,
  Settings,
  X 
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'mochi';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    voice?: boolean;
    reasoning_type?: string;
    suggestions?: boolean;
    content_type?: string;
    audience?: string;
    imageUrl?: string;
  };
}

interface ChatInterfaceProps {
  className?: string;
  mode?: 'simple' | 'advanced';
  showVoiceToggle?: boolean;
}

export const ChatInterface = memo<ChatInterfaceProps>(({ 
  className, 
  mode = 'simple',
  showVoiceToggle = true 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const guestId = getGuestUserId();
  const { messages, createConversation, saveMessage, currentConversationId } = useConversations(guestId);
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  const { assets, loading: assetsLoading, loadMochiAssets } = useMochiAssets();
  
  // State management
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  
  // Advanced mode features
  const [reasoningMode, setReasoningMode] = useState<string>('educational');
  const [voiceMode, setVoiceMode] = useState(false);
  const [contentType, setContentType] = useState('conversational');
  const [audienceLevel, setAudienceLevel] = useState('beginner');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Image generation
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastImageTime, setLastImageTime] = useState<number>(0);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, []);

  const shouldGenerateImage = useCallback((message: string): boolean => {
    if (mode !== 'advanced') return false;
    
    const now = Date.now();
    if (now - lastImageTime < 30000) return false; // Limit to one image per 30 seconds
    
    const imageKeywords = [
      'plant', 'flower', 'garden', 'bee', 'grow', 'leaf', 'bloom', 'color',
      'what does', 'show me', 'looks like', 'appearance', 'identify'
    ];
    
    return imageKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }, [mode, lastImageTime]);

  const generateContextualImage = useCallback(async (message: string) => {
    if (!shouldGenerateImage(message)) return;
    
    try {
      setIsGeneratingImage(true);
      setLastImageTime(Date.now());
      
      const prompt = `Beautiful garden scene related to: ${message}. Photorealistic, vibrant colors, educational botanical illustration`;
      
      const { data, error } = await supabase.functions.invoke('unified_image_generator', {
        body: { 
          prompt,
          model: 'flux.schnell',
          width: 512,
          height: 512
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Save to mochi assets table
        await supabase.from('mochi_assets').insert({
          asset_type: 'contextual_image',
          file_path: data.imageUrl,
          metadata: { prompt, context: message }
        });

        // Add image message
        const imageMessage: Message = {
          id: `img_${Date.now()}`,
          type: 'mochi',
          content: `🌸 I created this image to help illustrate what we're discussing!`,
          timestamp: new Date(),
          metadata: { imageUrl: data.imageUrl }
        };
        
        setLocalMessages(prev => [...prev, imageMessage]);
        
        toast({
          title: "🎨 Image Generated",
          description: "Mochi created a helpful visual!",
        });
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [shouldGenerateImage, toast]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setLocalMessages(prev => [...prev, userMessage]);

    try {
      // Ensure we have a conversation
      let conversationId = currentConversation || currentConversationId;
      if (!conversationId) {
        const conv = await createConversation();
        conversationId = conv.id;
        setCurrentConversation(conversationId);
      }

      // Save user message
      await saveMessage(conversationId, 'user', message);

      // Prepare context based on mode
      const context = {
        conversation_history: localMessages.slice(-10), // Last 10 messages for context
        user_id: user?.id || guestId,
        model: mode === 'advanced' ? 'gpt-4' : 'gpt-3.5-turbo',
        ...(mode === 'advanced' && {
          reasoning_type: reasoningMode,
          content_type: contentType,
          audience: audienceLevel,
          voice_enabled: voiceMode
        })
      };

      // Choose the appropriate endpoint based on mode
      const functionName = 'mochi_master_orchestrator'; // Unified orchestrator: routes, RAG, Claude
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          message,
          language: t('language') === 'es' ? 'es' : 'en',
          user_id: user?.id || guestId,
          ...context
        }
      });

      if (error) throw error;

      // Add Mochi's response
      const mochiMessage: Message = {
        id: `mochi_${Date.now()}`,
        type: 'mochi',
        content: data.response || data.message || "I'm having trouble thinking right now, could you try again?",
        timestamp: new Date(),
        metadata: {
          model: data.model,
          reasoning_type: reasoningMode,
          voice: voiceMode
        }
      };
      
      setLocalMessages(prev => [...prev, mochiMessage]);
      
      // Save Mochi's response
      await saveMessage(conversationId, 'mochi', mochiMessage.content);

      // Handle voice response if enabled
      if (voiceMode && mode === 'advanced') {
        playVoiceResponse(mochiMessage.content);
      }

      // Generate contextual image if appropriate
      if (mode === 'advanced') {
        imageTimerRef.current = setTimeout(() => {
          generateContextualImage(message);
        }, 2000);
      }

      incrementGrowth();

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'mochi',
        content: "🐝 Oops! Something went wrong in the garden. Could you try asking me again?",
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    inputMessage, isLoading, currentConversation, currentConversationId, localMessages, 
    user, guestId, mode, reasoningMode, contentType, audienceLevel, voiceMode,
    createConversation, saveMessage, incrementGrowth, generateContextualImage, toast
  ]);

  const playVoiceResponse = useCallback(async (text: string) => {
    try {
      setIsPlaying(true);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: {
          text,
          voice: 'alloy', // Could be made configurable
          language: t('language') === 'es' ? 'es' : 'en'
        }
      });

      if (error) throw error;

      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  }, [t]);

  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      
      toast({
        title: "🎤 Listening...",
        description: "Speak now! Tap the button again when finished.",
      });
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone Error", 
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const processVoiceInput = useCallback(async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('language', t('language') === 'es' ? 'es' : 'en');

      const { data, error } = await supabase.functions.invoke('stt_chat', {
        body: formData
      });

      if (error) throw error;

      if (data.text) {
        await sendMessage(data.text);
      } else {
        toast({
          title: "Speech Recognition",
          description: "Could not understand the audio. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice Error",
        description: "Failed to process voice input.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage, t, toast]);

  const toggleVoiceRecording = useCallback(() => {
    if (isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }, [isListening, startVoiceRecording, stopVoiceRecording]);

  const renderMessage = useCallback((message: Message) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[85%] rounded-lg p-3 ${
            message.type === 'user'
              ? 'bubble-user'
              : 'bubble-mochi'
          }`}
        >
          <div className="space-y-2">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
            
            {message.metadata?.imageUrl && (
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={message.metadata.imageUrl} 
                  alt="Generated garden visual" 
                  className="w-full h-auto max-h-48 object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
              
              {message.type === 'mochi' && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playVoiceResponse(message.content)}
                    className="h-6 w-6 p-0"
                    disabled={isPlaying}
                  >
                    {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                  
                  {message.metadata?.model && (
                    <Badge variant="outline" className="text-xs">
                      {message.metadata.model}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [isPlaying, playVoiceResponse]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <Card className="flex-1 flex flex-col card-glass border-border/20">
        {/* Header with mode indicator */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐝</span>
            <span className="font-semibold">
              {mode === 'advanced' ? 'Advanced Chat with Mochi' : 'Chat with Mochi'}
            </span>
            <Badge variant={mode === 'advanced' ? 'default' : 'secondary'}>
              {mode === 'advanced' ? 'Advanced' : 'Simple'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'advanced' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            
            {showVoiceToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceInterface(true)}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {mode === 'advanced' && showAdvancedSettings && (
          <div className="p-4 border-b bg-background/30 backdrop-blur-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Reasoning Mode</label>
                <Select value={reasoningMode} onValueChange={setReasoningMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="scientific">Scientific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="reference">Reference</SelectItem>
                    <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Audience Level</label>
                <Select value={audienceLevel} onValueChange={setAudienceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="voiceMode"
                  checked={voiceMode}
                  onChange={(e) => setVoiceMode(e.target.checked)}
                />
                <label htmlFor="voiceMode" className="text-sm font-medium">
                  Voice Responses
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Welcome message */}
            {localMessages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">🐝</div>
                <p className="text-lg mb-2">
                  {mode === 'advanced' ? 'Advanced Garden Assistant' : 'Garden Helper'}
                </p>
                <p className="text-sm">
                  {mode === 'advanced' 
                    ? 'Ask me anything about gardening! I can provide detailed explanations, generate images, and even respond with voice.'
                    : 'Ask me about plants, gardening tips, or anything related to your garden!'
                  }
                </p>
              </div>
            )}
            
            {localMessages.map(renderMessage)}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bubble-mochi rounded-lg p-3 flex items-center gap-3">
                  <div className="typing-indicator flex gap-1">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="text-sm font-normal">Mochi is thinking...</span>
                </div>
              </div>
            )}
            
            {/* Image generation indicator */}
            {isGeneratingImage && (
              <div className="flex justify-start">
                <div className="bg-muted/60 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">Creating a helpful image...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Mochi about ${mode === 'advanced' ? 'anything garden-related' : 'your garden'}...`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            
            <Button
              onClick={toggleVoiceRecording}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button onClick={() => sendMessage()} disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {mode === 'advanced' && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
              <span>✨ Advanced mode: Auto-image generation enabled</span>
              {voiceMode && <span>🔊 Voice responses enabled</span>}
              {isGeneratingImage && <span>🎨 Generating visual...</span>}
            </div>
          )}
        </div>
      </Card>

      {/* Voice Interface Modal */}
    </div>
  );
});
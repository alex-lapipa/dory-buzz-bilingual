import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  BeeAntenna, 
  PollenSparkle, 
  VolumeFlower, 
  VolumeMuted, 
  ButterflyFrame, 
  Firefly, 
  LeafBook, 
  GardenTools,
  FlowerBudClose,
  BeeTrailRight
} from '@/components/icons';
import { PollenSend, PetalChevronDown, PetalChevronRight, LeafBook as LeafBookAlt, ActivityVine, BilingualBee } from '@/components/icons';

interface RagSource {
  title: string;
  domain: string;
  source: string;
  sim: number;
}

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
    sources?: RagSource[];
    kg_connections?: string[];
    vocab_hint?: string[];
    latency_ms?: number;
    provider?: string;
    agent?: string;
    intent?: string;
    intent_confidence?: number;
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
  const [isStreaming, setIsStreaming] = useState(false);
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
    setIsStreaming(true);

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

      // Build conversation history for multi-turn context
      const recentHistory = localMessages.slice(-6).map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const mochiMsgId = `mochi_${Date.now()}`;

      // Create placeholder streaming message
      const streamingMessage: Message = {
        id: mochiMsgId,
        type: 'mochi',
        content: '',
        timestamp: new Date(),
        metadata: {}
      };
      setLocalMessages(prev => [...prev, streamingMessage]);

      // SSE streaming fetch
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/mochi_rag_v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          message,
          conversation_history: recentHistory,
          language: t('language') === 'es' ? 'es' : 'en',
          user_id: user?.id || guestId,
          age_level: audienceLevel === 'beginner' ? 'kids' : audienceLevel === 'expert' ? 'adult' : null,
          stream: true,
        }),
      });

      if (!resp.ok) {
        // Handle rate limit / payment errors
        if (resp.status === 429) {
          toast({ title: "Rate Limited", description: "Too many requests. Please wait a moment.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Payment Required", description: "AI credits exhausted. Please try again later.", variant: "destructive" });
        }
        throw new Error(`HTTP ${resp.status}`);
      }

      const contentType = resp.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && resp.body) {
        // ── SSE Streaming path ──
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";
        let streamMetadata: Message['metadata'] = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let newlineIdx: number;

          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              
              if (parsed.type === "metadata") {
                streamMetadata = {
                  sources: parsed.sources || [],
                  kg_connections: parsed.kg_connections || [],
                  vocab_hint: parsed.vocab_hint || [],
                  provider: parsed.provider,
                  model: parsed.model,
                  agent: parsed.agent,
                  intent: parsed.intent,
                  intent_confidence: parsed.intent_confidence,
                  reasoning_type: reasoningMode,
                  voice: voiceMode,
                };
              } else if (parsed.type === "delta" && parsed.content) {
                fullContent += parsed.content;
                // Update the streaming message in-place
                setLocalMessages(prev => prev.map(m => 
                  m.id === mochiMsgId 
                    ? { ...m, content: fullContent, metadata: streamMetadata }
                    : m
                ));
              } else if (parsed.type === "done") {
                streamMetadata = { ...streamMetadata, latency_ms: parsed.latency_ms };
                setLocalMessages(prev => prev.map(m => 
                  m.id === mochiMsgId 
                    ? { ...m, metadata: streamMetadata }
                    : m
                ));
              } else if (parsed.type === "error") {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              // Incomplete JSON, put back and wait
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Save final response
        if (fullContent) {
          await saveMessage(conversationId, 'mochi', fullContent);
        }

        // Handle voice response if enabled
        if (voiceMode && mode === 'advanced' && fullContent) {
          playVoiceResponse(fullContent);
        }

      } else {
        // ── Non-streaming JSON fallback ──
        const data = await resp.json();

        const finalContent = data.response || data.message || "I'm having trouble thinking right now, could you try again?";
        setLocalMessages(prev => prev.map(m => 
          m.id === mochiMsgId 
            ? { 
                ...m, 
                content: finalContent,
                metadata: {
                  model: data.model,
                  provider: data.provider,
                  reasoning_type: reasoningMode,
                  voice: voiceMode,
                  sources: data.sources || [],
                  kg_connections: data.kg_connections || [],
                  vocab_hint: data.vocab_hint || [],
                  latency_ms: data.latency_ms,
                  agent: data.agent,
                  intent: data.intent,
                  intent_confidence: data.intent_confidence,
                }
              }
            : m
        ));
        
        await saveMessage(conversationId, 'mochi', finalContent);

        if (voiceMode && mode === 'advanced') {
          playVoiceResponse(finalContent);
        }
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
      // Remove empty streaming placeholder or update with error
      setLocalMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.type === 'mochi' && !last.content) {
          return [...prev.slice(0, -1), {
            id: `error_${Date.now()}`,
            type: 'mochi' as const,
            content: "Oops! Something went wrong in the garden. Could you try asking me again?",
            timestamp: new Date()
          }];
        }
        return prev;
      });
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [
    inputMessage, isLoading, currentConversation, currentConversationId, localMessages, 
    user, guestId, mode, reasoningMode, contentType, audienceLevel, voiceMode,
    createConversation, saveMessage, incrementGrowth, generateContextualImage, toast, t
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

  const renderRagMeta = useCallback((metadata: Message['metadata']) => {
    if (!metadata) return null;
    const hasSources = metadata.sources && metadata.sources.length > 0;
    const hasKg = metadata.kg_connections && metadata.kg_connections.length > 0;
    const hasVocab = metadata.vocab_hint && metadata.vocab_hint.length > 0;
    if (!hasSources && !hasKg && !hasVocab) return null;

    return (
      <Collapsible className="mt-2">
        <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group">
          <PetalChevronRight className="h-3 w-3 group-data-[state=open]:hidden" />
          <PetalChevronDown className="h-3 w-3 hidden group-data-[state=open]:block" />
          <span>Sources & Knowledge</span>
          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
            {(metadata.sources?.length || 0) + (metadata.kg_connections?.length || 0) + (metadata.vocab_hint?.length || 0)}
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1.5 space-y-1.5">
          {hasSources && (
            <div className="flex flex-wrap gap-1">
              {metadata.sources!.map((s, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5 gap-1 bg-background/50">
                  <LeafBookAlt className="h-2.5 w-2.5" />
                  <span className="truncate max-w-[120px]">{s.title}</span>
                  <span className="opacity-60">{s.sim}%</span>
                </Badge>
              ))}
            </div>
          )}
          {hasKg && (
            <div className="flex flex-wrap gap-1">
              {metadata.kg_connections!.slice(0, 4).map((c, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5 gap-1 bg-primary/5 border-primary/20">
                  <ActivityVine className="h-2.5 w-2.5" />
                  <span className="truncate max-w-[160px]">{c}</span>
                </Badge>
              ))}
            </div>
          )}
          {hasVocab && (
            <div className="flex flex-wrap gap-1">
              {metadata.vocab_hint!.map((v, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5 gap-1 bg-accent/10 border-accent/20">
                  <BilingualBee className="h-2.5 w-2.5" />
                  {v}
                </Badge>
              ))}
            </div>
          )}
          {(metadata.latency_ms || metadata.agent) && (
            <div className="text-[10px] text-muted-foreground/60 flex flex-wrap items-center gap-2">
              {metadata.agent && metadata.agent !== 'mochi' && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 border-primary/30">
                  {metadata.agent} agent
                  {metadata.intent_confidence ? ` (${Math.round(metadata.intent_confidence * 100)}%)` : ''}
                </Badge>
              )}
              {metadata.latency_ms && (
                <span>{metadata.latency_ms}ms via {metadata.provider || metadata.model}</span>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }, []);

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
            {message.type === 'mochi' ? (
              <div className="prose-garden text-sm leading-relaxed">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            )}
            
            {message.metadata?.imageUrl && (
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={message.metadata.imageUrl} 
                  alt="Generated garden visual" 
                  className="w-full h-auto max-h-48 object-cover"
                />
              </div>
            )}

            {/* RAG Sources & Knowledge Graph collapsible */}
            {message.type === 'mochi' && renderRagMeta(message.metadata)}
            
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
                    {isPlaying ? <VolumeMuted className="h-3 w-3" /> : <VolumeFlower className="h-3 w-3" />}
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
  }, [isPlaying, playVoiceResponse, renderRagMeta]);

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
                <GardenTools className="h-4 w-4" />
              </Button>
            )}
            
            {showVoiceToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceInterface(true)}
              >
                <BeeAntenna className="h-4 w-4" />
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
            
            {/* Loading indicator - only show when loading but not yet streaming content */}
            {isLoading && !localMessages.some(m => m.type === 'mochi' && m.content === '' && isStreaming) && !isStreaming && (
              <div className="flex justify-start mb-4">
                <div className="bubble-mochi rounded-lg p-3 flex items-center gap-3">
                  <div className="typing-indicator flex gap-1">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="text-sm font-normal">Mochi is buzzing through the garden...</span>
                </div>
              </div>
            )}
            
            {/* Image generation indicator */}
            {isGeneratingImage && (
              <div className="flex justify-start">
                <div className="bg-muted/60 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                  <PollenSparkle className="h-4 w-4 animate-pulse" />
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
              variant={isListening ? "secondary" : "outline"}
              size="sm"
              disabled={isLoading}
            >
              {isListening ? <BeeAntenna className="h-4 w-4 text-primary" /> : <BeeAntenna className="h-4 w-4" />}
            </Button>
            
            <Button onClick={() => sendMessage()} disabled={isLoading || !inputMessage.trim()}>
              <PollenSend className="h-4 w-4" />
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
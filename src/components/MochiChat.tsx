import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
import { getGuestUserId } from '@/lib/guestUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Send, Volume2, VolumeX, Image, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'mochi';
  content: string;
  timestamp: Date;
}

interface MochiChatProps {
  className?: string;
}

export const MochiChat: React.FC<MochiChatProps> = ({ className }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const guestId = getGuestUserId();
  const { messages, createConversation, saveMessage, currentConversationId } = useConversations(guestId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastImageTime, setLastImageTime] = useState<number>(0);
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation and welcome message
    const initializeChat = async () => {
      if (!currentConversation) {
        try {
          const conversation = await createConversation('Chat with Mochi');
          if (conversation) {
            setCurrentConversation(conversation.id);
            // Add warm, welcoming message with clear guidance
            const welcomeMessage: Message = {
              id: '1',
              type: 'mochi',
              content: t('welcomeMessage'),
              timestamp: new Date()
            };
            setLocalMessages([welcomeMessage]);
            
            // Try to save welcome message, but don't block if it fails
            try {
              await saveMessage(conversation.id, 'mochi', welcomeMessage.content);
            } catch (error) {
              console.log('Could not save welcome message to database, continuing in memory only');
            }
          } else {
            // Fallback message if conversation creation fails - still warm and helpful
            const welcomeMessage: Message = {
              id: '1',
              type: 'mochi',
              content: '🐝 ¡Hola! I\'m Mochi! While I can\'t save our chat today, I\'m still here to help with gardening, nature, and creating beautiful images. What would you like to explore? 🌻',
              timestamp: new Date()
            };
            setLocalMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
          // Graceful fallback with encouragement
          const welcomeMessage: Message = {
            id: '1',
            type: 'mochi',
            content: '🐝 ¡Hola! I\'m Mochi! Even though we\'re having some technical hiccups, I\'m ready to chat about gardens, nature, and help create amazing images! What interests you today? 🌻',
            timestamp: new Date()
          };
          setLocalMessages([welcomeMessage]);
        }
      }
    };

    initializeChat();
  }, [currentConversation, createConversation, saveMessage]);

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const enhanced_prompt = `Create a beautiful, vibrant image featuring Mochi de los Huertos (Garden Bee) in a natural garden setting. 

VISUAL STYLE: Bright, colorful, family-friendly illustration with rich garden details
MOCHI'S APPEARANCE: A charming bee with expressive wings, wearing a rustic straw hat adorned with a wildflower, warm honey-yellow and earthy brown coloring
GARDEN SCENE: Vibrant garden paradise with flowers, plants, and natural elements - perfect for families to enjoy
MOOD: ¡Buzztastical! Joyful, welcoming, and perfect for all ages learning about gardens and nature
ACTIVITY: ${prompt}

Style this as a beautiful garden illustration that families would love - colorful, inspiring, and filled with the warm, buzzing personality that makes learning about gardens fun for everyone. Include elements that appeal to both children and adults.`;

      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/generate_image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
          },
          body: JSON.stringify({ prompt: enhanced_prompt })
        }
      );

      const data = await response.json();
      if (data.image_url || data.url) {
        const imageMessage: Message = {
          id: Date.now().toString(),
          type: 'mochi',
          content: `¡Buzztastical! 🐝✨ Here's your beautiful garden picture:\n\n![Generated Garden Scene](${data.image_url || data.url})\n\n🌻 This lovely image shows the magical world of gardens through Mochi's eyes! What would you like to explore next in our garden adventure?`,
          timestamp: new Date()
        };
        
        setLocalMessages(prev => [...prev, imageMessage]);
        
        if (currentConversation) {
          await saveMessage(currentConversation, 'mochi', imageMessage.content);
        }
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: t('error'),
        description: t('imageError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualImage = async (conversationContext: string, useVideo: boolean = false) => {
    if (isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    try {
      // Create a contextual prompt based on recent conversation
      const imagePrompts = [
        "a beautiful garden scene with colorful flowers and buzzing bees",
        "Mochi the friendly bee exploring vibrant wildflowers",
        "a magical garden path lined with blooming flowers",
        "children learning about nature in a sunny garden",
        "bees collecting nectar from bright sunflowers",
        "a cozy garden corner with herbs and vegetables",
        "butterflies and bees sharing a flower meadow",
        "a family-friendly garden with educational plant signs"
      ];
      
      // Extract keywords from recent conversation to make it contextual
      const recentText = localMessages.slice(-3).map(m => m.content).join(' ').toLowerCase();
      let contextualPrompt = imagePrompts[Math.floor(Math.random() * imagePrompts.length)];
      
      if (recentText.includes('honey')) {
        contextualPrompt = "bees making honey in hexagonal combs with golden honey dripping";
      } else if (recentText.includes('flower') || recentText.includes('bloom')) {
        contextualPrompt = "a spectacular flower garden in full bloom with various colorful flowers";
      } else if (recentText.includes('plant') || recentText.includes('grow')) {
        contextualPrompt = "young plants growing in rich soil with gardening tools nearby";
      } else if (recentText.includes('bee') || recentText.includes('buzz')) {
        contextualPrompt = "Mochi the bee and friends working together in a thriving garden";
      } else if (recentText.includes('nature') || recentText.includes('outdoor')) {
        contextualPrompt = "a peaceful nature scene with trees, flowers, and wildlife";
      }

      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/generate_image_sora`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
          },
          body: JSON.stringify({ 
            prompt: contextualPrompt,
            type: useVideo ? 'video' : 'image',
            user_id: guestId
          })
        }
      );

      const data = await response.json();
      if (data.data || data.url) {
        const mediaMessage: Message = {
          id: Date.now().toString(),
          type: 'mochi',
          content: useVideo 
            ? `🎬 I made this beautiful video inspired by our conversation!\n\n<video controls style="max-width: 100%; border-radius: 8px;">\n<source src="${data.url}" type="video/mp4">\nYour browser doesn't support videos.\n</video>\n\n🌻 This shows the magical world we've been talking about!`
            : `🎨 I created this beautiful image inspired by our garden conversation!\n\n![Garden Scene](${data.data})\n\n🌻 This captures the spirit of what we've been discussing about nature and gardens!`,
          timestamp: new Date()
        };
        
        setLocalMessages(prev => [...prev, mediaMessage]);
        setLastImageTime(Date.now());
        
        if (currentConversation) {
          await saveMessage(currentConversation, 'mochi', mediaMessage.content);
        }
        
        toast({
          title: `🎨 ${useVideo ? 'Video' : 'Image'} Generated!`,
          description: "Mochi created something beautiful based on our conversation!",
        });
      }
    } catch (error) {
      console.error('Auto image generation error:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Auto-generate images every 45-60 seconds
  useEffect(() => {
    if (localMessages.length > 2) { // Only start after some conversation
      const interval = setInterval(() => {
        const timeSinceLastImage = Date.now() - lastImageTime;
        const randomInterval = 45000 + Math.random() * 15000; // 45-60 seconds
        
        if (timeSinceLastImage > randomInterval && !isGeneratingImage) {
          // Alternate between images and videos (80% images, 20% videos)
          const useVideo = Math.random() < 0.2;
          generateContextualImage('recent conversation', useVideo);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [localMessages, lastImageTime, isGeneratingImage]);

  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, []);

  const sendMessage = async (messageText: string = inputMessage, generateImageFirst: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    // Check if user is asking for an image
    const imageKeywords = ['image', 'picture', 'show', 'generate', 'create', 'draw', 'imagen', 'foto', 'mostrar', 'generar', 'crear', 'dibujar'];
    const shouldGenerateImage = generateImageFirst || imageKeywords.some(keyword => messageText.toLowerCase().includes(keyword));

    if (shouldGenerateImage) {
      await generateImage(messageText);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to database (non-blocking)
    if (currentConversation) {
      try {
        await saveMessage(currentConversation, 'user', messageText);
      } catch (error) {
        console.log('Could not save user message to database:', error);
      }
    }

    try {
      // Use fetch directly for streaming instead of supabase.functions.invoke
      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/chat_mochi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
          },
          body: JSON.stringify({
            message: messageText,
            user_id: guestId,
            conversation_history: localMessages.slice(-10).map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      let fullResponse = '';
      
      const mochiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'mochi',
        content: '',
        timestamp: new Date()
      };

      setLocalMessages(prev => [...prev, mochiMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data !== '[DONE]') {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                    
                    // Apply the ¡Buzztastical! pattern for delightful or learning-filled responses
                    let enhancedResponse = fullResponse;
                    if (fullResponse.length > 20 && (
                        fullResponse.includes('garden') || fullResponse.includes('learn') || fullResponse.includes('nature') || 
                        fullResponse.includes('jardín') || fullResponse.includes('aprender') || fullResponse.includes('naturaleza') ||
                        fullResponse.includes('bee') || fullResponse.includes('abeja') || fullResponse.includes('flower') || fullResponse.includes('flor') ||
                        fullResponse.includes('plant') || fullResponse.includes('planta')
                    )) {
                      if (!fullResponse.startsWith('¡Buzztastical!')) {
                        enhancedResponse = `¡Buzztastical! 🐝✨ ${fullResponse}`;
                      }
                    }
                    
                    setLocalMessages(prev => 
                      prev.map(m => 
                        m.id === mochiMessage.id 
                          ? { ...m, content: enhancedResponse }
                          : m
                      )
                    );
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      }

      // Save Mochi's response to database (non-blocking)
      if (currentConversation && fullResponse) {
        try {
          const finalResponse = fullResponse.includes('¡Buzztastical!') ? fullResponse : 
            (fullResponse.includes('garden') || fullResponse.includes('nature') || fullResponse.includes('bee')) ? 
            `¡Buzztastical! 🐝✨ ${fullResponse}` : fullResponse;
          await saveMessage(currentConversation, 'mochi', finalResponse);
        } catch (error) {
          console.log('Could not save Mochi response to database:', error);
        }
      }

      // Trigger plant growth when Mochi responds
      incrementGrowth();

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: t('error'),
        description: t('messageError'),
        variant: "destructive",
      });
      
      // Remove the failed user message
      setLocalMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    // Start live conversation instead of record-then-transcribe
    try {
      setIsListening(true);
      // Switch to live voice mode by opening VoiceInterface
      toast({
        title: "🚀 Starting Live Voice Chat",
        description: "Opening real-time conversation with Mochi...",
      });
      
      // You could integrate VoiceInterface logic here, or redirect to voice interface
      // For now, we'll use the existing functionality but indicate it's live
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      toast({
        title: "🎤 Live Voice Active",
        description: "Start speaking! I'll continue the conversation naturally.",
      });
      
      // For MVP, continue with existing transcription but make it feel more live
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const response = await fetch(
              `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/stt_chat`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
                },
                body: JSON.stringify({ 
                  audio: base64Audio,
                  user_id: guestId
                })
              }
            );

            const data = await response.json();
            if (data.text) {
              // Continue conversation automatically
              await sendMessage(data.text);
              
              // Auto-play Mochi's response
              const lastMessage = localMessages[localMessages.length - 1];
              if (lastMessage && lastMessage.type === 'mochi') {
                await playMochiResponse(lastMessage.content);
              }
            }
          } catch (error) {
            console.error('Speech-to-text error:', error);
            toast({
              title: t('error'),
              description: t('audioError'),
              variant: "destructive",
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Microphone access error:', error);
      setIsListening(false);
      toast({
        title: t('error'),
        description: t('microphoneError'),
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const playMochiResponse = async (text: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/tts_mochi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
          },
          body: JSON.stringify({ 
            text,
            voice: 'nova',
            user_id: guestId
          })
        }
      );

      const data = await response.json();
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlaying(false);
      toast({
        title: t('error'),
        description: t('playError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header - Mobile Optimized */}
      <div className="p-2 sm:p-4 bg-gradient-bee rounded-t-xl border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl animate-bee-bounce">🐝</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-lg font-bold text-primary-foreground truncate">
              {t('mochiTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 truncate">
              {t('mochiSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Compact & Growing */}
      <ScrollArea className="flex-1 min-h-0 p-2 sm:p-4 scroll-area">
        <div className="space-y-2 sm:space-y-3 min-h-[100px]">
          {localMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border shadow-sm'
                }`}
              >
                {message.type === 'mochi' && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm animate-flower-sway">🌸</span>
                    <span className="text-xs font-medium">Mochi</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playMochiResponse(message.content)}
                      disabled={isPlaying}
                      className="h-5 w-5 sm:h-6 sm:w-6 p-0 ml-auto"
                    >
                      {isPlaying ? <VolumeX className="h-2 w-2 sm:h-3 sm:w-3" /> : <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />}
                    </Button>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                  {message.content.includes('![') ? (
                    <div dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto my-1 sm:my-2" />')
                        .replace(/\n/g, '<br />')
                    }} />
                  ) : (
                    message.content
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground border border-border rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%] shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin text-sm">🐝</div>
                  <span className="text-xs sm:text-sm">Mochi is thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area - Mobile Optimized with Visual Enhancements */}
      <div className="p-2 sm:p-4 border-t border-border bg-card safe-area-bottom">
        <div className="flex flex-col space-y-2">
          {/* Helpful hints */}
          <div className="text-xs text-muted-foreground text-center">
            💬 Type your message • 🎤 Use voice recording • 🎨 Say "create image of..." for visuals
          </div>
        <div className="flex gap-1 sm:gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('chatPlaceholder')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1 text-sm min-h-[44px]"
            aria-label={t('messageToMochi')}
          />
          <Button
            onClick={isListening ? stopVoiceRecording : startVoiceRecording}
            variant={isListening ? "destructive" : "secondary"}
            size="sm"
            className="shrink-0 min-h-[44px] px-2 sm:px-3"
            title="Voice input"
          >
            {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
            className="shrink-0 min-h-[44px] px-2 sm:px-3"
            title="Send message"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
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
import { Mic, MicOff, Send, Volume2, VolumeX, Image, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'dory';
  content: string;
  timestamp: Date;
}

interface DoryChatProps {
  className?: string;
}

export const DoryChat: React.FC<DoryChatProps> = ({ className }) => {
  const { user } = useAuth();
  const guestId = getGuestUserId();
  const { messages, createConversation, saveMessage, currentConversationId } = useConversations(guestId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
          const conversation = await createConversation('Chat with Dory');
          if (conversation) {
            setCurrentConversation(conversation.id);
            // Add compact welcome message
            const welcomeMessage: Message = {
              id: '1',
              type: 'dory',
              content: '🐝 Hi! I\'m Dory, your garden companion! Ask me about plants, nature, or request a garden image!',
              timestamp: new Date()
            };
            setLocalMessages([welcomeMessage]);
            
            // Try to save welcome message, but don't block if it fails
            try {
              await saveMessage(conversation.id, 'dory', welcomeMessage.content);
            } catch (error) {
              console.log('Could not save welcome message to database, continuing in memory only');
            }
          } else {
            // If conversation creation fails, still show welcome message
            const welcomeMessage: Message = {
              id: '1',
              type: 'dory',
              content: '🐝 Hi! I\'m Dory, your garden companion! Ask me about plants, nature, or request a garden image! (Note: Chat history won\'t be saved this session)',
              timestamp: new Date()
            };
            setLocalMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
          // Fallback welcome message
          const welcomeMessage: Message = {
            id: '1',
            type: 'dory',
            content: '🐝 Hi! I\'m Dory, your garden companion! Ask me about plants, nature, or request a garden image! (Note: Chat history won\'t be saved this session)',
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
      const enhanced_prompt = `Create a beautiful, vibrant image featuring Dory de los Huertos (Garden Bee) in a natural garden setting. 

VISUAL STYLE: Bright, colorful, family-friendly illustration with rich garden details
DORY'S APPEARANCE: A charming bee with expressive wings, wearing a rustic straw hat adorned with a wildflower, warm honey-yellow and earthy brown coloring
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
          type: 'dory',
          content: `¡Buzztastical! 🐝✨ Here's your beautiful garden picture:\n\n![Generated Garden Scene](${data.image_url || data.url})\n\n🌻 This lovely image shows the magical world of gardens through Dory's eyes! What would you like to explore next in our garden adventure?`,
          timestamp: new Date()
        };
        
        setLocalMessages(prev => [...prev, imageMessage]);
        
        if (currentConversation) {
          await saveMessage(currentConversation, 'dory', imageMessage.content);
        }
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/chat_dory`,
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
      
      const doryMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'dory',
        content: '',
        timestamp: new Date()
      };

      setLocalMessages(prev => [...prev, doryMessage]);

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
                        m.id === doryMessage.id 
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

      // Save Dory's response to database (non-blocking)
      if (currentConversation && fullResponse) {
        try {
          const finalResponse = fullResponse.includes('¡Buzztastical!') ? fullResponse : 
            (fullResponse.includes('garden') || fullResponse.includes('nature') || fullResponse.includes('bee')) ? 
            `¡Buzztastical! 🐝✨ ${fullResponse}` : fullResponse;
          await saveMessage(currentConversation, 'dory', finalResponse);
        } catch (error) {
          console.log('Could not save Dory response to database:', error);
        }
      }

      // Trigger plant growth when Dory responds
      incrementGrowth();

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Remove the failed user message
      setLocalMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
              await sendMessage(data.text);
            }
          } catch (error) {
            console.error('Speech-to-text error:', error);
            toast({
              title: "Error",
              description: "Failed to process audio. Please try again.",
              variant: "destructive",
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
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

  const playDoryResponse = async (text: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/tts_dory`,
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
        title: "Error",
        description: "Failed to play audio. Please try again.",
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
              Dory de los Huertos 🌻
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 truncate">
              ¡Buzztastical! Garden Bee
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
                {message.type === 'dory' && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm animate-flower-sway">🌸</span>
                    <span className="text-xs font-medium">Dory</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playDoryResponse(message.content)}
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
                  <span className="text-xs sm:text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area - Mobile Optimized */}
      <div className="p-2 sm:p-4 border-t border-border bg-card safe-area-bottom">
        <div className="flex gap-1 sm:gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Dory... / Pregúntale a Dory..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isLoading}
            className="flex-1 text-sm min-h-[44px]"
          />
          <Button
            onClick={() => generateImage(inputMessage || 'beautiful garden scene with Dory the bee')}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            className="shrink-0 min-h-[44px] px-2 sm:px-3"
            title="Generate garden image"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
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
  );
};
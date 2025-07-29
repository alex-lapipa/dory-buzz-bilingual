import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { usePlantGrowth } from '@/hooks/usePlantGrowth';
import { getGuestUserId } from '@/lib/guestUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Send, Volume2, VolumeX, Image, Sparkles, Brain, BookOpen, Camera } from 'lucide-react';

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
  };
}

interface MochiChatProps {
  className?: string;
}

export const MochiChatAdvanced: React.FC<MochiChatProps> = ({ className }) => {
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
  const [reasoningMode, setReasoningMode] = useState<string>('educational');
  const [voiceMode, setVoiceMode] = useState(false);
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
  }, [localMessages]);

  useEffect(() => {
    // Initialize conversation with bee-focused welcome
    const initializeChat = async () => {
      if (!currentConversation) {
        try {
          const conversation = await createConversation('Bee Education Chat with Mochi');
          if (conversation) {
            setCurrentConversation(conversation.id);
            
            const welcomeMessage: Message = {
              id: '1',
              type: 'mochi',
              content: "🐝 Buzz buzz! Hi there! I'm Mochi, your friendly bee guide from BeeCrazy Garden World! I'm here to help you discover the amazing world of bees, flowers, and our beautiful garden ecosystem. \n\nI can:\n• 🎓 Teach you fascinating bee facts\n• 🧠 Give detailed explanations with advanced AI\n• 🔊 Read facts aloud with my voice\n• 🎨 Create beautiful bee illustrations\n• 🗣️ Chat with you using voice!\n\nWhat would you like to learn about bees today?",
              timestamp: new Date(),
              metadata: { model: 'mochi-bee-expert' }
            };
            setLocalMessages([welcomeMessage]);
            
            // Add suggestions after a moment
            setTimeout(() => {
              const suggestionMessage: Message = {
                id: '2',
                type: 'mochi',
                content: "Here are some buzzing topics to get us started:\n• 🐝 How do bees communicate with their waggle dance?\n• 🍯 The amazing process of making honey\n• 🌸 Which flowers are bee favorites?\n• 🏠 Life inside a busy beehive\n• 🌍 Why bees are environmental heroes\n• 🔬 The science behind bee vision\n\nJust ask me anything - I love talking about bees! 🌻",
                timestamp: new Date(),
                metadata: { suggestions: true }
              };
              setLocalMessages(prev => [...prev, suggestionMessage]);
            }, 2000);
            
            try {
              await saveMessage(conversation.id, 'mochi', welcomeMessage.content);
            } catch (error) {
              console.log('Could not save welcome message to database');
            }
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
          const fallbackMessage: Message = {
            id: '1',
            type: 'mochi',
            content: '🐝 Buzz! I\'m Mochi, your bee expert! Even with technical hiccups, I\'m ready to share amazing bee facts and help you explore the wonderful world of pollinators! What would you like to know? 🌻',
            timestamp: new Date()
          };
          setLocalMessages([fallbackMessage]);
        }
      }
    };

    initializeChat();
  }, [currentConversation, createConversation, saveMessage]);

  const generateAdvancedImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced_image_generation', {
        body: { 
          prompt: `Beautiful, educational illustration of ${prompt} featuring Mochi the garden bee in a vibrant flower garden, child-friendly, detailed, colorful`,
          model: "gpt-image-1",
          quality: "high",
          size: "1024x1024"
        }
      });

      if (error) throw error;
      
      const imageMessage: Message = {
        id: Date.now().toString(),
        type: 'mochi',
        content: `🎨 Here's a beautiful illustration I created for you!\n\n![Bee Garden Illustration](${data.image})\n\n🐝 This shows the magical world of bees and gardens! What else would you like to explore?`,
        timestamp: new Date(),
        metadata: { model: 'gpt-image-1' }
      };
      
      setLocalMessages(prev => [...prev, imageMessage]);
      
      toast({
        title: "🎨 Beautiful Image Created!",
        description: "Check out this amazing bee illustration!",
      });
      
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Error",
        description: "Could not create image",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string = inputMessage, useAdvanced: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    // Check if user wants an image
    const imageKeywords = ['image', 'picture', 'show', 'draw', 'create', 'generate', 'illustrate'];
    const shouldGenerateImage = imageKeywords.some(keyword => messageText.toLowerCase().includes(keyword));

    if (shouldGenerateImage) {
      await generateAdvancedImage(messageText);
      return;
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

    try {
      let functionName = 'chat_mochi';
      let requestBody: any = {
        message: messageText,
        user_id: guestId,
        conversation_history: localMessages.slice(-10).map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      };

      // Use advanced reasoning for bee education
      if (useAdvanced || reasoningMode !== 'basic') {
        functionName = 'claude_reasoning';
        requestBody = {
          prompt: `As Mochi the bee from BeeCrazy Garden World, answer this question about bees or nature: "${messageText}". 

Be educational, engaging, and family-friendly. Include fascinating bee facts and explain complex concepts simply. Use bee emojis and garden references naturally. If the question is about bees, flowers, or nature, provide detailed scientific information while keeping it accessible for all ages.

Always maintain Mochi's cheerful, buzzing personality while being informative and helpful.`,
          reasoning_type: reasoningMode,
          context: "You are Mochi, a friendly bee guide helping families learn about bees, flowers, and nature."
        };
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });

      if (error) throw error;

      let responseContent = useAdvanced ? data.response : data.response;
      
      // Add bee personality if not already present
      if (!responseContent.includes('🐝') && (messageText.toLowerCase().includes('bee') || messageText.toLowerCase().includes('flower'))) {
        responseContent = `🐝 ${responseContent}`;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'mochi',
        content: responseContent,
        timestamp: new Date(),
        metadata: { 
          model: useAdvanced ? data.model : 'mochi-basic',
          reasoning_type: reasoningMode
        }
      };

      setLocalMessages(prev => [...prev, aiResponse]);

      // Auto-generate voice for bee topics
      if (voiceMode && (messageText.toLowerCase().includes('bee') || messageText.toLowerCase().includes('honey') || messageText.toLowerCase().includes('flower'))) {
        await generateElevenLabsVoice(responseContent);
      }

      // Save to database
      if (currentConversation) {
        try {
          await saveMessage(currentConversation, 'user', messageText);
          await saveMessage(currentConversation, 'mochi', responseContent);
        } catch (error) {
          console.log('Could not save messages to database');
        }
      }

      incrementGrowth();

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Oops! 🐝",
        description: "I couldn't process that. Let's try again!",
        variant: "destructive",
      });
      
      setLocalMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const generateElevenLabsVoice = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: text,
          voice_id: "9BWtsMINqrJLrRacOk9x", // Aria - perfect for Mochi
          model: "eleven_multilingual_v2"
        }
      });

      if (error) throw error;

      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();

      toast({
        title: "🔊 Mochi is speaking!",
        description: "Listen to my bee voice!",
      });

    } catch (error) {
      console.error('Voice generation error:', error);
    }
  };

  const startAdvancedVoiceChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
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
            setIsLoading(true);
            const { data, error } = await supabase.functions.invoke('advanced_voice_chat', {
              body: {
                audio: base64Audio,
                session_id: currentConversation || 'voice-session',
                user_id: guestId,
                voice_id: "9BWtsMINqrJLrRacOk9x"
              }
            });

            if (error) throw error;

            // Add both user and AI messages
            const userMessage: Message = {
              id: Date.now().toString(),
              type: 'user',
              content: data.userMessage,
              timestamp: new Date(),
              metadata: { voice: true }
            };

            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'mochi',
              content: data.aiResponse,
              timestamp: new Date(),
              metadata: { voice: true, model: data.model }
            };

            setLocalMessages(prev => [...prev, userMessage, aiMessage]);

            // Play AI response
            if (data.audioContent) {
              const audioResponseBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
              const audio = new Audio(URL.createObjectURL(audioResponseBlob));
              audio.play();
            }

            toast({
              title: "🐝 Voice chat complete!",
              description: "Mochi heard you perfectly!",
            });

          } catch (error) {
            console.error('Advanced voice chat error:', error);
            toast({
              title: "Error",
              description: "Voice chat failed",
              variant: "destructive"
            });
          } finally {
            setIsLoading(false);
          }
        };
        
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);

      toast({
        title: "🎤 Advanced Voice Recording",
        description: "Tell me about bees! I'm listening with advanced AI.",
      });

    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
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

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Advanced Controls Header */}
      <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <span className="animate-bee-bounce">🐝</span>
            Mochi's AI Powers
          </Badge>
          
          <Select value={reasoningMode} onValueChange={setReasoningMode}>
            <SelectTrigger className="w-auto text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educational">🎓 Educational</SelectItem>
              <SelectItem value="creative">✨ Creative</SelectItem>
              <SelectItem value="analysis">🔍 Analysis</SelectItem>
              <SelectItem value="problem_solving">🧩 Problem Solving</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={voiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => setVoiceMode(!voiceMode)}
          >
            <Volume2 className="h-3 w-3 mr-1" />
            Voice Mode
          </Button>
        </div>
      </div>

      {/* Main Header */}
      <div className="p-2 sm:p-4 bg-gradient-bee rounded-t-xl border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl animate-bee-bounce">🐝</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-lg font-bold text-primary-foreground truncate">
              Mochi - Your Bee Expert
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 truncate">
              Learning about bees with advanced AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
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
                    {message.metadata?.model && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {message.metadata.model.includes('claude') ? (
                          <><Brain className="h-3 w-3 mr-1" />Claude-4</>
                        ) : (
                          <><Sparkles className="h-3 w-3 mr-1" />Mochi</>
                        )}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateElevenLabsVoice(message.content)}
                      disabled={isPlaying}
                      className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                    >
                      <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                )}
                <div className="text-xs sm:text-sm whitespace-pre-wrap">
                  {message.content.includes('![') ? (
                    <div dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg mt-2 mb-2" />')
                        .replace(/\n/g, '<br />')
                    }} />
                  ) : (
                    message.content
                  )}
                </div>
                {message.metadata?.voice && (
                  <Badge variant="outline" className="text-xs mt-2">
                    <Volume2 className="h-3 w-3 mr-1" />Voice Message
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground border border-border shadow-sm rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl animate-bee-bounce">🐝</span>
                  <span className="text-xs sm:text-sm">Mochi is thinking with {reasoningMode} AI...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-2 sm:p-4 border-t border-border bg-background space-y-2">
        {/* Quick Bee Topics */}
        <div className="flex flex-wrap gap-1">
          {["How do bees communicate?", "Why are bees important?", "How is honey made?", "What flowers do bees love?"].map((topic) => (
            <Button
              key={topic}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(topic, true)}
              disabled={isLoading}
              className="text-xs"
            >
              {topic}
            </Button>
          ))}
        </div>

        {/* Main Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Mochi about bees, flowers, or nature! 🐝🌻"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputMessage, reasoningMode !== 'basic');
              }
            }}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm"
          />
          <Button
            onClick={() => sendMessage(inputMessage, reasoningMode !== 'basic')}
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            onClick={isListening ? stopVoiceRecording : startAdvancedVoiceChat}
            disabled={isLoading}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
          >
            {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          <Button
            onClick={() => generateAdvancedImage("beautiful bee in a flower garden")}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
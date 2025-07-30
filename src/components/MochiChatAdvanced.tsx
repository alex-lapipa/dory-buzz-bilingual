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
import { useMochiAssets } from '@/hooks/useMochiAssets';
import { getGuestUserId } from '@/lib/guestUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { VoiceInterface } from './VoiceInterface';
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
    content_type?: string;
    audience?: string;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastImageTime, setLastImageTime] = useState<number>(0);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const { toast } = useToast();
  const { incrementGrowth } = usePlantGrowth();
  const { getMochiCharacterAsset, extractMochiFromVideo } = useMochiAssets();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const generateSmartContextualMedia = async () => {
    if (isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    try {
      // Advanced contextual analysis for diverse bee education
      const recentText = localMessages.slice(-4).map(m => m.content).join(' ').toLowerCase();
      
      // Determine audience type and content style
      const isAdultContent = Math.random() < 0.6; // 60% adult educational content
      const includeDidYouKnow = Math.random() < 0.8; // 80% chance to include facts
      let useVideo = Math.random() < 0.25; // 25% chance for video
      
      // Advanced prompt generation with diverse content
      let contextualPrompt = "";
      let didYouKnowFact = "";
      
      // Generate different types of bee-related content
      const contentTypes = [
        'scientific_diagram', 'macro_photography', 'ecosystem_view', 
        'historical_context', 'comparative_analysis', 'environmental_impact',
        'botanical_connection', 'agricultural_importance', 'bee_behavior',
        'conservation_awareness'
      ];
      
      const selectedType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      // Context-aware content generation
      if (recentText.includes('honey') || recentText.includes('nectar')) {
        if (selectedType === 'scientific_diagram') {
          contextualPrompt = "detailed scientific diagram showing the honey-making process from nectar to storage, with labeled anatomical parts and chemical processes";
          didYouKnowFact = isAdultContent 
            ? "¿Sabías que las abejas procesan el néctar usando enzimas específicas que rompen la sacarosa en glucosa y fructosa, creando un ambiente ácido que preserva naturalmente la miel por siglos?"
            : "¿Sabías que las abejas visitan hasta 2 millones de flores para hacer solo 1 libra de miel?";
        } else if (selectedType === 'macro_photography') {
          contextualPrompt = "extreme macro photography of bee mandibles and proboscis collecting nectar, showing microscopic details and pollen grains";
          didYouKnowFact = "¿Sabías que la probóscide de una abeja puede extenderse hasta 6.5mm y funciona como una pajita ultraeficiente?";
        }
        useVideo = Math.random() < 0.4;
      } else if (recentText.includes('pollination') || recentText.includes('pollen')) {
        if (selectedType === 'ecosystem_view') {
          contextualPrompt = "aerial view of agricultural landscape showing pollination zones, crop diversity, and bee flight patterns with data overlays";
          didYouKnowFact = "¿Sabías que las abejas son responsables de polinizar 1/3 de todos los alimentos que consumimos, generando más de $15 billones anuales en valor económico mundial?";
        } else {
          contextualPrompt = "microscopic view of pollen grains with different shapes and sizes, showing their unique identification markers";
          didYouKnowFact = "¿Sabías que cada especie de planta produce polen con formas únicas, como huellas dactilares que las abejas pueden identificar?";
        }
        useVideo = true;
      } else if (recentText.includes('hive') || recentText.includes('colony')) {
        if (selectedType === 'architectural_analysis') {
          contextualPrompt = "architectural analysis of hexagonal honeycomb structure with mathematical principles, showing efficiency calculations and structural engineering";
          didYouKnowFact = "¿Sabías que el hexágono es la forma más eficiente para almacenar máximo volumen con mínimo material? Las abejas resolvieron este problema matemático millones de años antes que los humanos.";
        } else {
          contextualPrompt = "thermal imaging of an active beehive showing temperature regulation and air circulation patterns";
          didYouKnowFact = "¿Sabías que las abejas mantienen su colmena a exactamente 35°C mediante ventilación coordinada y contracciones musculares?";
        }
        useVideo = Math.random() < 0.6;
      } else if (recentText.includes('queen') || recentText.includes('worker')) {
        contextualPrompt = "comparative anatomy illustration showing queen bee vs worker bee differences, with pheromone communication visualization";
        didYouKnowFact = "¿Sabías que una abeja reina puede poner hasta 2,000 huevos por día y vivir hasta 5 años, mientras que las obreras viven solo 6 semanas en temporada activa?";
      } else if (recentText.includes('dance') || recentText.includes('waggle')) {
        contextualPrompt = "scientific diagram of the waggle dance with mathematical calculations showing distance and direction encoding";
        didYouKnowFact = "¿Sabías que el ángulo de la danza de las abejas indica la dirección exacta respecto al sol, y la duración del 'waggle' indica la distancia precisa en kilómetros?";
        useVideo = true;
      } else {
        // Random educational content when no specific context
        const randomTopics = [
          {
            prompt: "comparative evolution timeline showing bee species development over 100 million years with fossil evidence",
            fact: "¿Sabías que las abejas evolucionaron de avispas carnívoras hace 100 millones de años cuando desarrollaron estructuras especiales para recolectar polen?"
          },
          {
            prompt: "global bee decline infographic with climate change impacts, pesticide effects, and conservation solutions",
            fact: "¿Sabías que hemos perdido el 40% de las colonias de abejas en la última década debido al cambio climático, pesticidas y pérdida de hábitat?"
          },
          {
            prompt: "bee vision spectrum comparison showing ultraviolet patterns on flowers invisible to human eyes",
            fact: "¿Sabías que las abejas ven en ultravioleta y pueden detectar patrones secretos en las flores que son completamente invisibles para nosotros?"
          },
          {
            prompt: "molecular structure of royal jelly and its effects on bee development and human applications",
            fact: "¿Sabías que la jalea real contiene proteínas únicas que pueden hacer que una larva se convierta en reina en lugar de obrera?"
          },
          {
            prompt: "seasonal bee behavior calendar showing hibernation, swarming, and foraging patterns throughout the year",
            fact: "¿Sabías que las abejas pueden hibernar en grupo durante el invierno, rotando posiciones para mantener caliente a toda la colonia?"
          }
        ];
        
        const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
        contextualPrompt = randomTopic.prompt;
        didYouKnowFact = randomTopic.fact;
      }

      // Use different functions based on complexity
      const functionName = useVideo ? 'generate_image_sora' : 'generate_image';
      
      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/${functionName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg`,
          },
          body: JSON.stringify(useVideo ? { 
            prompt: contextualPrompt,
            type: 'video',
            user_id: guestId
          } : {
            prompt: contextualPrompt,
            size: "1024x1024",
            quality: "high"
          })
        }
      );

      const data = await response.json();
      
      let mediaContent;
      if (useVideo && data.url) {
        mediaContent = `🎬 ¡Video educativo sobre nuestro tema de conversación!\n\n<video controls style="max-width: 100%; border-radius: 8px;">\n<source src="${data.url}" type="video/mp4">\nTu navegador no soporta videos.\n</video>\n\n${includeDidYouKnow ? `🧠 **${didYouKnowFact}**` : '🐝 ¡El fascinante mundo de las abejas en acción!'}`;
      } else if (data.image?.b64_json || data.image) {
        const imageData = data.image?.b64_json ? `data:image/png;base64,${data.image.b64_json}` : data.image;
        mediaContent = `🎨 ¡Ilustración educativa basada en nuestra conversación!\n\n![Imagen Educativa de Abejas](${imageData})\n\n${includeDidYouKnow ? `🧠 **${didYouKnowFact}**` : '🌻 Esta imagen visual ayuda a explicar los conceptos que hemos estado explorando!'}`;
      }

      if (mediaContent) {
        const mediaMessage: Message = {
          id: Date.now().toString(),
          type: 'mochi',
          content: mediaContent,
          timestamp: new Date(),
          metadata: { 
            model: useVideo ? 'sora-1.0' : 'gpt-image-1',
            reasoning_type: 'diverse_visual_education',
            content_type: selectedType,
            audience: isAdultContent ? 'adult' : 'general'
          }
        };
        
        setLocalMessages(prev => [...prev, mediaMessage]);
        setLastImageTime(Date.now());
        
        if (currentConversation) {
          await saveMessage(currentConversation, 'mochi', mediaContent);
        }
        
        toast({
          title: `🎨 Contenido Educativo ${useVideo ? 'Video' : 'Visual'} Generado!`,
          description: includeDidYouKnow ? "¡Con datos curiosos incluidos!" : "Ilustración educativa avanzada creada por IA!",
        });
      }
    } catch (error) {
      console.error('Smart image generation error:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Advanced auto-generation with educational timing
  useEffect(() => {
    if (localMessages.length > 3) { // Start after meaningful conversation
      const interval = setInterval(() => {
        const timeSinceLastImage = Date.now() - lastImageTime;
        const randomInterval = 45000 + Math.random() * 15000; // 45-60 seconds
        
        if (timeSinceLastImage > randomInterval && !isGeneratingImage && !isLoading) {
          generateSmartContextualMedia();
        }
      }, 15000); // Check every 15 seconds for more precision

      return () => clearInterval(interval);
    }
  }, [localMessages, lastImageTime, isGeneratingImage, isLoading]);

  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, []);

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

      let data, error;
      
      // Try primary function first
      try {
        const response = await supabase.functions.invoke(functionName, {
          body: requestBody
        });
        data = response.data;
        error = response.error;
      } catch (primaryError) {
        console.log(`Primary service (${functionName}) failed, switching to Claude fallback:`, primaryError);
        
        // Fallback to Claude when OpenAI fails
        const claudeResponse = await supabase.functions.invoke('claude_reasoning', {
          body: {
            prompt: `As Mochi the bee from BeeCrazy Garden World, answer this question about bees or nature: "${messageText}". 

Be educational, engaging, and family-friendly. Include fascinating bee facts and explain complex concepts simply. Use bee emojis and garden references naturally. If the question is about bees, flowers, or nature, provide detailed scientific information while keeping it accessible for all ages.

Always maintain Mochi's cheerful, buzzing personality while being informative and helpful.`,
            reasoning_type: reasoningMode,
            context: "You are Mochi, a friendly bee guide helping families learn about bees, flowers, and nature."
          }
        });
        
        data = claudeResponse.data;
        error = claudeResponse.error;
        
        if (!error) {
          toast({
            title: "🐝 Switched to backup brain!",
            description: "Using Claude AI while OpenAI recovers",
          });
        }
      }

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
    // Start live conversation instead of record-then-transcribe
    try {
      setIsListening(true);
      
      toast({
        title: "🚀 Starting Live Voice Chat",
        description: "Opening real-time conversation with Mochi...",
      });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      toast({
        title: "🎤 Live Voice Active",
        description: "Tell me about bees! I'm listening and will respond naturally.",
      });
      
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

            // Play AI response automatically
            if (data.audioContent) {
              const audioResponseBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
              const audio = new Audio(URL.createObjectURL(audioResponseBlob));
              audio.play();
            }

            toast({
              title: "🐝 Voice chat complete!",
              description: "Mochi heard you perfectly! Continue the conversation.",
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

    } catch (error) {
      console.error('Microphone access error:', error);
      setIsListening(false);
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
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm ${
                  message.type === 'user'
                    ? 'bg-guest-message text-guest-message-foreground font-semibold border border-white/20'
                    : 'bg-mochi-message text-mochi-message-foreground border border-yellow-200/30 shadow-xl font-semibold'
                }`}
              >
                {message.type === 'mochi' && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 overflow-hidden">
                      {getMochiCharacterAsset()?.file_url ? (
                        <img 
                          src={getMochiCharacterAsset()?.file_url} 
                          alt="Mochi" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "🐝"
                      )}
                    </div>
                    <span className="text-lg sm:text-xl font-saira font-bold text-primary">Mochi</span>
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
                <div className="text-base sm:text-lg font-bold leading-loose whitespace-pre-wrap text-primary">
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
                  <span className="text-sm sm:text-base font-medium">Mochi is thinking with {reasoningMode} AI...</span>
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
              placeholder={t('chatPlaceholder')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputMessage, reasoningMode !== 'basic');
                }
              }}
              disabled={isLoading}
              className="flex-1 text-base sm:text-lg font-semibold h-14"
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
        </div>
        
        {/* Voice-to-Voice Chat Button */}
        <div className="flex justify-center pt-3 border-t border-border">
          <Button
            onClick={() => setShowVoiceInterface(true)}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <Mic className="h-5 w-5 mr-2" />
            {t('clickToTalkBee')}
          </Button>
        </div>
      </div>
      
      {/* Voice Interface Modal */}
      {showVoiceInterface && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl h-[80vh] relative">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{t('voiceChatTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('voiceChatSubtitle')}</p>
            </div>
            <Button
              onClick={() => setShowVoiceInterface(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10"
              aria-label="Close voice chat"
            >
              ✕
            </Button>
            <div className="h-[calc(100%-4rem)]">
              <VoiceInterface className="h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
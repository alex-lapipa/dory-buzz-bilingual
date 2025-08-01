import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMasterAI } from '@/hooks/useMasterAI';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send,
  Volume2,
  Loader2,
  Image as ImageIcon,
  Video,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  isGeneratingMedia?: boolean;
}

export const UnifiedMochiInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🐝 Hello! I\'m Mochi, your garden bee companion! I can help you with gardening advice and will automatically create helpful images and videos based on our conversation. What would you like to explore in our garden world today?',
      timestamp: new Date(),
      provider: 'welcome'
    }
  ]);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chat, speak, generateImage, playAudio, loading, lastResponse } = useMasterAI();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'assistant', provider?: string, imageUrl?: string, videoUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      provider,
      imageUrl,
      videoUrl
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  // Analyze conversation context for automatic media generation
  const analyzeForMediaGeneration = (userMessage: string, assistantResponse: string): {
    shouldGenerateImage: boolean;
    shouldGenerateVideo: boolean;
    imagePrompt?: string;
    videoPrompt?: string;
  } => {
    const combinedText = `${userMessage} ${assistantResponse}`.toLowerCase();
    
    // Keywords that suggest visual content would be helpful
    const imageKeywords = [
      'what does', 'show me', 'looks like', 'appearance', 'identify', 'plant', 'flower', 
      'leaf', 'garden', 'design', 'layout', 'bee', 'insect', 'pest', 'disease', 'color',
      'shape', 'variety', 'species', 'bloom', 'growth', 'stage', 'vegetables', 'herbs',
      'fruits', 'trees', 'shrubs', 'landscape', 'soil', 'compost'
    ];
    
    const videoKeywords = [
      'how to', 'demonstrate', 'process', 'step', 'technique', 'method', 'prune', 
      'plant', 'water', 'care', 'propagate', 'harvest', 'tutorial', 'guide',
      'maintenance', 'prepare', 'setup', 'build', 'create'
    ];
    
    const shouldGenerateImage = imageKeywords.some(keyword => combinedText.includes(keyword));
    const shouldGenerateVideo = videoKeywords.some(keyword => combinedText.includes(keyword));
    
    let imagePrompt = '';
    let videoPrompt = '';
    
    if (shouldGenerateImage) {
      // Extract relevant context for image generation
      const plantMentions = assistantResponse.match(/\b\w+\s+(plant|flower|tree|herb|vegetable|fruit)\b/gi);
      const mainSubject = plantMentions?.[0] || 'garden scene';
      imagePrompt = `Beautiful ${mainSubject} in a well-maintained garden setting, realistic photography style, vibrant colors, educational botanical illustration`;
    }
    
    if (shouldGenerateVideo) {
      // Extract relevant context for video generation  
      const actionWords = assistantResponse.match(/\b(plant|water|prune|harvest|care|maintain|grow)\w*\b/gi);
      const mainAction = actionWords?.[0] || 'gardening technique';
      videoPrompt = `Educational garden tutorial demonstrating ${mainAction}, step-by-step guidance, outdoor garden setting`;
    }
    
    return { shouldGenerateImage, shouldGenerateVideo, imagePrompt, videoPrompt };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, 'user');

    try {
      const context = {
        currentPage: 'garden_chat',
        userName: user?.email || 'garden friend',
        mode: 'conversational_with_media'
      };

      // Get chat response first
      const response = await chat(userMessage, context);
      
      if (response.success) {
        const assistantMessageId = addMessage(response.data.message, 'assistant', response.provider);
        
        // Analyze if we should generate media
        const mediaAnalysis = analyzeForMediaGeneration(userMessage, response.data.message);
        
        // Generate image if context suggests it would be helpful
        if (mediaAnalysis.shouldGenerateImage && mediaAnalysis.imagePrompt) {
          try {
            // Update message to show image is generating
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, isGeneratingMedia: true }
                : msg
            ));

            const imageResponse = await generateImage(mediaAnalysis.imagePrompt);
            
            if (imageResponse.success) {
              // Update message with generated image
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { 
                      ...msg, 
                      imageUrl: imageResponse.data.imageUrl,
                      isGeneratingMedia: false,
                      content: msg.content + '\n\n🖼️ *I\'ve created a helpful image to illustrate this for you!*'
                    }
                  : msg
              ));
              
              toast({
                title: "🎨 Image Generated",
                description: "Mochi created a helpful visual for you!",
              });
            }
          } catch (error) {
            console.error('Image generation failed:', error);
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, isGeneratingMedia: false }
                : msg
            ));
          }
        }

        // Note: Video generation would follow similar pattern but with video API
        if (mediaAnalysis.shouldGenerateVideo) {
          toast({
            title: "🎬 Video Coming Soon",
            description: "Video tutorials will be generated automatically in future updates!",
          });
        }
      } else {
        addMessage('🐝 Oops! I had trouble processing that. Could you try again?', 'assistant', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('🐝 Something went wrong in the garden! Please try again.', 'assistant', 'error');
    }
  };

  const speakMessage = async (content: string) => {
    const response = await speak(content);
    if (response.success) {
      await playAudio(response.data.audioContent);
    }
  };

  const getProviderColor = (provider?: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-blue-100 text-blue-800';
      case 'elevenlabs': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🐝</span>
            Mochi AI Garden Assistant
            <Badge variant="outline" className="bg-green-100 text-green-800 ml-2">
              Auto-Media Generation
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>Chat with automatic visuals</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 border rounded-lg p-3 bg-gradient-to-b from-yellow-50 to-green-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        {message.provider && (
                          <Badge variant="secondary" className={`text-xs ${getProviderColor(message.provider)}`}>
                            {message.provider}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Auto-generated media display */}
                  {message.imageUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={message.imageUrl} 
                        alt="Auto-generated garden visual" 
                        className="w-full h-auto max-h-48 object-cover"
                      />
                    </div>
                  )}

                  {message.videoUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <video 
                        src={message.videoUrl} 
                        controls 
                        className="w-full h-auto max-h-48"
                      />
                    </div>
                  )}

                  {message.isGeneratingMedia && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Creating helpful visual content...</span>
                      <Sparkles className="h-3 w-3" />
                    </div>
                  )}

                  <div className="text-xs opacity-70 mt-1 flex items-center gap-2">
                    {message.timestamp.toLocaleTimeString()}
                    {message.imageUrl && <ImageIcon className="h-3 w-3 text-green-600" />}
                    {message.videoUrl && <Video className="h-3 w-3 text-blue-600" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Mochi is thinking and may create visuals...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Ask about gardening - Mochi will automatically create helpful images and videos!</span>
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mochi about plants, gardening techniques, or garden design..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1"
            />

            <Button onClick={handleSend} disabled={!input.trim() || loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {lastResponse && (
          <div className="text-xs text-center">
            <Badge variant="outline" className={getProviderColor(lastResponse.provider)}>
              Last response from {lastResponse.provider} • Smart media generation active
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
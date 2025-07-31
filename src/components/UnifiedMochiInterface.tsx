import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMasterAI } from '@/hooks/useMasterAI';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  BarChart3, 
  Send,
  Volume2,
  Loader2,
  Sparkles,
  Brain,
  Palette,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  audioUrl?: string;
}

export const UnifiedMochiInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🐝 Hello! I\'m Mochi, your garden bee companion! I can help you with gardening advice, create images, analyze plant problems, and even speak to you! What would you like to explore in our garden world today?',
      timestamp: new Date(),
      provider: 'welcome'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState<'chat' | 'voice' | 'image' | 'analysis'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chat, speak, generateImage, analyze, playAudio, loading, lastResponse } = useMasterAI();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'assistant', provider?: string, audioUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      provider,
      audioUrl
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, 'user');

    try {
      let response;
      const context = {
        currentPage: 'main_interface',
        userName: user?.email || 'garden friend',
        mode: activeMode
      };

      switch (activeMode) {
        case 'chat':
          response = await chat(userMessage, context);
          if (response.success) {
            addMessage(response.data.message, 'assistant', response.provider);
          }
          break;

        case 'voice':
          // First get text response
          const chatResponse = await chat(userMessage, context);
          if (chatResponse.success) {
            addMessage(chatResponse.data.message, 'assistant', chatResponse.provider);
            
            // Then convert to speech
            const voiceResponse = await speak(chatResponse.data.message);
            if (voiceResponse.success) {
              await playAudio(voiceResponse.data.audioContent);
            }
          }
          break;

        case 'image':
          const imagePrompt = `${userMessage} - in a beautiful garden setting with bees and flowers, child-friendly style`;
          response = await generateImage(imagePrompt);
          if (response.success) {
            addMessage(`🎨 Here's your garden image! ${userMessage}`, 'assistant', response.provider);
            // You could display the image here
          }
          break;

        case 'analysis':
          response = await analyze(userMessage);
          if (response.success) {
            addMessage(response.data.analysis, 'assistant', response.provider);
          }
          break;
      }

      if (response && !response.success) {
        addMessage('🐝 Oops! I had trouble processing that. Could you try again?', 'assistant', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('🐝 Something went wrong in the garden! Please try again.', 'assistant', 'error');
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real implementation, you'd stop recording and process the audio
      toast({
        title: "🎤 Voice feature",
        description: "Voice recording would be processed here!"
      });
    } else {
      setIsRecording(true);
      // In a real implementation, you'd start recording
      toast({
        title: "🎤 Listening...",
        description: "Start speaking to Mochi!"
      });
    }
  };

  const speakMessage = async (content: string) => {
    const response = await speak(content);
    if (response.success) {
      await playAudio(response.data.audioContent);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      case 'voice': return <Volume2 className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getProviderColor = (provider?: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-blue-100 text-blue-800';
      case 'elevenlabs': return 'bg-purple-100 text-purple-800';
      case 'xai': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🐝</span>
            Mochi AI Garden Assistant
          </CardTitle>
          
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Image
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Analysis
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
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
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Mochi is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          {/* Mode-specific input hints */}
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {getModeIcon(activeMode)}
            <span>
              {activeMode === 'chat' && 'Ask Mochi anything about gardening!'}
              {activeMode === 'voice' && 'Chat with voice responses from Mochi!'}
              {activeMode === 'image' && 'Describe an image for Mochi to create!'}
              {activeMode === 'analysis' && 'Get detailed analysis from Mochi!'}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              {activeMode === 'analysis' ? (
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you'd like me to analyze..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                />
              ) : (
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeMode === 'chat' ? 'Ask Mochi about gardening...' :
                    activeMode === 'voice' ? 'Type to chat with voice response...' :
                    activeMode === 'image' ? 'Describe an image to create...' :
                    'What would you like to analyze?'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              )}
            </div>

            {activeMode === 'voice' && (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceToggle}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

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
              Last response from {lastResponse.provider} • {lastResponse.type}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
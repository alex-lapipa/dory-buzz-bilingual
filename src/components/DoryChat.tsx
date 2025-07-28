import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
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
    // Welcome message from Dory
    const welcomeMessage: Message = {
      id: '1',
      type: 'dory',
      content: '🐝 ¡Hola! Soy Dory la Abeja Hacendosa. I\'m Dory the Busy Bee!\n🌸 ¿Cómo puedo ayudarte hoy? How can I help you explore nature today?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use fetch directly for streaming instead of supabase.functions.invoke
      const response = await fetch(
        `https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/chat_dory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg'}`,
          },
          body: JSON.stringify({
            message: messageText,
            conversation_history: messages.slice(-10).map(m => ({
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

      setMessages(prev => [...prev, doryMessage]);

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
                    setMessages(prev => 
                      prev.map(m => 
                        m.id === doryMessage.id 
                          ? { ...m, content: fullResponse }
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

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Remove the failed user message
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
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
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg'}`,
                },
                body: JSON.stringify({ audio: base64Audio })
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
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg'}`,
          },
          body: JSON.stringify({ 
            text,
            voice: 'nova'
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
      {/* Header */}
      <div className="p-4 bg-gradient-bee rounded-t-xl border-b border-border">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bee-bounce">🐝</div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">
              Dory la Abeja Hacendosa
            </h2>
            <p className="text-sm text-primary-foreground/80">
              Your bilingual nature guide / Tu guía bilingüe de la naturaleza
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border'
                }`}
              >
                {message.type === 'dory' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm animate-flower-sway">🌸</span>
                    <span className="text-xs font-medium">Dory</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playDoryResponse(message.content)}
                      disabled={isPlaying}
                      className="h-6 w-6 p-0"
                    >
                      {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground border border-border rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">🐝</div>
                  <span className="text-sm">Dory is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Dory about nature... / Pregúntale a Dory sobre la naturaleza..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={isListening ? stopVoiceRecording : startVoiceRecording}
            variant={isListening ? "destructive" : "secondary"}
            size="icon"
            className="shrink-0"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
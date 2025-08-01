import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare } from 'lucide-react';
import { useMasterAI } from '@/hooks/useMasterAI';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isVoice?: boolean;
}

export function VoiceFirstInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { loading, chat, speak, playAudio } = useMasterAI();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (content: string, type: 'user' | 'assistant', isVoice = false) => {
    setMessages(prev => [...prev, {
      content,
      type,
      timestamp: new Date(),
      isVoice
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInteraction = async (transcript: string) => {
    addMessage(transcript, 'user', true);
    
    try {
      const response = await chat(transcript, { 
        currentPage: 'voice-interface',
        mode: 'voice-optimized' 
      });

      if (response.success && response.data?.message) {
        addMessage(response.data.message, 'assistant', true);
        
        // Convert response to speech
        const voiceResponse = await speak(response.data.message);
        if (voiceResponse.success && voiceResponse.data?.audioContent) {
          setIsSpeaking(true);
          await playAudio(voiceResponse.data.audioContent);
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      toast({
        title: "Voice Error",
        description: "Failed to process voice interaction",
        variant: "destructive"
      });
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Voice recording logic would connect to voice_chat_realtime edge function
    toast({
      title: "Voice Recording",
      description: "🎙️ Listening... (Voice recognition active)",
    });
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Simulate voice input for now
    setTimeout(() => {
      handleVoiceInteraction("Hello Mochi, can you tell me about bee-friendly plants?");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="border-b border-border/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            🐝 Mochi Voice Assistant
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Voice-First
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking
              </Badge>
            )}
            {loading && (
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Processing...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Messages Display */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Volume2 className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <p className="text-lg font-medium">Ready for voice interaction!</p>
              <p className="text-sm">Press the microphone to start talking with Mochi</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.isVoice && (
                      <Badge variant="outline" className="text-xs">
                        {message.type === 'user' ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Badge>
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={loading || isSpeaking}
            size="lg"
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white font-semibold px-8 py-4 rounded-full transition-all duration-300`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-2" />
                Start Voice Chat
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              addMessage("Hello Mochi! Tell me about your garden.", 'user');
              handleVoiceInteraction("Hello Mochi! Tell me about your garden.");
            }}
            disabled={loading || isSpeaking}
            variant="outline"
            size="lg"
            className="px-6 py-4"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Quick Demo
          </Button>
        </div>

        {/* Voice Status */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isRecording && "🎙️ Listening for your voice..."}
          {isSpeaking && "🔊 Mochi is speaking..."}
          {loading && "🧠 Processing your request..."}
          {!isRecording && !isSpeaking && !loading && "Press the microphone to start a voice conversation with Mochi"}
        </div>
      </CardContent>
    </Card>
  );
}
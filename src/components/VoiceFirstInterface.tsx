import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare, Sun, Smartphone } from 'lucide-react';
import { useMasterAI } from '@/hooks/useMasterAI';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isVoice?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  isGeneratingMedia?: boolean;
}

export function VoiceFirstInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOutdoorMode, setIsOutdoorMode] = useState(true);
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
        currentPage: 'outdoor-mobile',
        mode: 'voice-optimized',
        environment: 'outdoor'
      });

      if (response.success && response.data?.message) {
        addMessage(response.data.message, 'assistant', true);
        
        // Convert response to speech for outdoor use
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
      title: "🎙️ Listening...",
      description: "MochiBee is ready to help with your garden!",
    });
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Simulate voice input for demo
    setTimeout(() => {
      handleVoiceInteraction("What plants should I water in this sunny weather?");
    }, 1000);
  };

  return (
    <div className={`w-full mx-auto transition-all duration-300 ${
      isOutdoorMode 
        ? 'bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/60' 
        : 'bg-card/95 backdrop-blur-sm border-border/50'
    }`}>
      {/* Mobile-First Header */}
      <div className={`p-4 border-b ${isOutdoorMode ? 'border-yellow-400/30 bg-yellow-50/80' : 'border-border/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🐝</span>
            <div>
              <h2 className={`text-xl font-bold ${isOutdoorMode ? 'text-yellow-900' : 'text-foreground'}`}>
                MochiBee Assistant
              </h2>
              <p className={`text-sm ${isOutdoorMode ? 'text-yellow-800' : 'text-muted-foreground'}`}>
                Your outdoor garden companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOutdoorMode(!isOutdoorMode)}
              className={`p-2 ${isOutdoorMode ? 'bg-yellow-200/50 text-yellow-900' : ''}`}
            >
              {isOutdoorMode ? <Sun className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </Button>
            
            {isSpeaking && (
              <Badge className="bg-blue-500 text-white animate-pulse px-3 py-1">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Content */}
      <div className="p-4 space-y-4">
        {/* Quick Status for Outdoor Use */}
        <div className={`text-center p-3 rounded-lg ${
          isOutdoorMode 
            ? 'bg-yellow-100/80 border border-yellow-300' 
            : 'bg-muted/50'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🌻</span>
            <span className={`font-medium ${isOutdoorMode ? 'text-yellow-900' : 'text-foreground'}`}>
              {isRecording ? "Listening for your garden questions..." : 
               isSpeaking ? "MochiBee is helping you..." :
               "Tap to ask about your plants!"}
            </span>
          </div>
        </div>

        {/* Mobile Messages Display - Compact for Outdoor */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <div className={`text-center py-6 ${isOutdoorMode ? 'text-yellow-800' : 'text-muted-foreground'}`}>
              <div className="mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <p className="text-lg font-medium mb-2">Ready for garden questions!</p>
              <p className="text-sm">Perfect for outdoor plant care guidance</p>
            </div>
          ) : (
            messages.slice(-3).map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-md ${
                    message.type === 'user'
                      ? isOutdoorMode 
                        ? 'bg-yellow-500 text-white border border-yellow-600'
                        : 'bg-primary text-primary-foreground'
                      : isOutdoorMode
                        ? 'bg-white border-2 border-yellow-300 text-yellow-900'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.isVoice && (
                      <Badge variant="outline" className={`text-xs ${
                        isOutdoorMode ? 'border-yellow-600 text-yellow-800' : ''
                      }`}>
                        {message.type === 'user' ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Badge>
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Large Mobile Voice Controls for Outdoor Use */}
        <div className="space-y-4">
          <Button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={loading || isSpeaking}
            size="lg"
            className={`w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse border-2 border-red-600' 
                : isOutdoorMode
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-600 shadow-yellow-300/50'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6 mr-3" />
                Stop & Process
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-3" />
                Ask MochiBee
              </>
            )}
          </Button>

          {/* Quick Garden Actions for Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleVoiceInteraction("What plants need water right now?")}
              disabled={loading || isSpeaking}
              variant="outline"
              className={`h-12 text-sm font-medium ${
                isOutdoorMode 
                  ? 'border-2 border-blue-400 text-blue-800 bg-blue-50/80 hover:bg-blue-100' 
                  : ''
              }`}
            >
              💧 Watering Guide
            </Button>
            
            <Button
              onClick={() => handleVoiceInteraction("Identify this plant from my description")}
              disabled={loading || isSpeaking}
              variant="outline"
              className={`h-12 text-sm font-medium ${
                isOutdoorMode 
                  ? 'border-2 border-green-400 text-green-800 bg-green-50/80 hover:bg-green-100' 
                  : ''
              }`}
            >
              🌿 Plant ID
            </Button>
          </div>
        </div>

        {/* Outdoor-Optimized Status */}
        <div className={`text-center text-sm p-3 rounded-lg ${
          isOutdoorMode 
            ? 'bg-yellow-50/80 text-yellow-800 border border-yellow-200' 
            : 'text-muted-foreground'
        }`}>
          {isRecording && "🎙️ Listening clearly despite outdoor noise..."}
          {isSpeaking && "🔊 MochiBee speaking at optimal volume..."}
          {loading && "🧠 Processing your garden question..."}
          {!isRecording && !isSpeaking && !loading && (
            <div>
              <p className="font-medium">🌞 Outdoor Mode Active</p>
              <p className="text-xs mt-1">Optimized for bright sunlight & garden use</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
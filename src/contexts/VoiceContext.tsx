import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  currentVoice: string;
  toggleVoiceMode: () => void;
  speak: (text: string) => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => void;
  executeVoiceCommand: (command: string) => Promise<void>;
  availableVoices: Array<{ id: string; name: string; description: string }>;
  setVoice: (voiceId: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVoice, setCurrentVoice] = useState('9BWtsMINqrJLrRacOk9x'); // Aria
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const availableVoices = [
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Friendly female voice (default)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Warm female voice' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Professional male voice' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Friendly male voice' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Young male voice' }
  ];

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceEnabled(prev => {
      const newState = !prev;
      toast({
        title: newState ? "🔊 Voice Mode ON" : "🔇 Voice Mode OFF",
        description: newState ? "Mochi will now speak responses" : "Voice responses disabled",
      });
      return newState;
    });
  }, [toast]);

  const speak = useCallback(async (text: string) => {
    if (!isVoiceEnabled || isSpeaking) return;
    
    setIsSpeaking(true);
    
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: text.replace(/[🐝🌻🌸🎨🔊]/g, ''), // Remove emojis for TTS
          voice_id: currentVoice,
          model: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      
      toast({
        title: "Voice Error",
        description: "Failed to generate speech",
        variant: "destructive"
      });
    }
  }, [isVoiceEnabled, isSpeaking, currentVoice, toast]);

  const startListening = useCallback(async () => {
    if (isListening) return;
    
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
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "🎤 Listening...",
        description: "Speak your command to Mochi",
      });
      
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  }, [isListening, toast]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const processVoiceInput = useCallback(async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('stt_chat', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data.text) {
          await executeVoiceCommand(data.text);
        }
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice Processing Error",
        description: "Could not process voice input",
        variant: "destructive"
      });
    }
  }, [toast]);

  const executeVoiceCommand = useCallback(async (command: string) => {
    console.log('Executing voice command:', command);
    
    const lowerCommand = command.toLowerCase();
    
    // Voice navigation commands
    if (lowerCommand.includes('education') || lowerCommand.includes('learn')) {
      // Trigger navigation to education tab
      const event = new CustomEvent('voiceNavigate', { detail: { tab: 'education' } });
      window.dispatchEvent(event);
      await speak("Taking you to the bee education hub!");
      return;
    }
    
    if (lowerCommand.includes('chat') || lowerCommand.includes('talk')) {
      const event = new CustomEvent('voiceNavigate', { detail: { tab: 'chat' } });
      window.dispatchEvent(event);
      await speak("Let's chat about bees!");
      return;
    }
    
    if (lowerCommand.includes('voice') || lowerCommand.includes('speak')) {
      const event = new CustomEvent('voiceNavigate', { detail: { tab: 'voice' } });
      window.dispatchEvent(event);
      await speak("Welcome to voice chat mode!");
      return;
    }
    
    if (lowerCommand.includes('image') || lowerCommand.includes('picture') || lowerCommand.includes('create')) {
      const event = new CustomEvent('voiceNavigate', { detail: { tab: 'images' } });
      window.dispatchEvent(event);
      await speak("Let's create some beautiful bee images!");
      return;
    }
    
    // Voice actions
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      await speak("I'm Mochi, your bee guide! I can teach you about bees, create images, chat with you, and much more. Try saying things like 'teach me about bees' or 'create a picture of a flower'!");
      return;
    }
    
    if (lowerCommand.includes('stop talking') || lowerCommand.includes('be quiet')) {
      setIsVoiceEnabled(false);
      await speak("Okay, I'll be quiet now!");
      return;
    }
    
    // Default: send to chat system
    const event = new CustomEvent('voiceCommand', { detail: { command } });
    window.dispatchEvent(event);
    
  }, [speak]);

  const setVoice = useCallback((voiceId: string) => {
    setCurrentVoice(voiceId);
    const voice = availableVoices.find(v => v.id === voiceId);
    toast({
      title: "🎭 Voice Changed",
      description: `Now using ${voice?.name || 'Unknown'} voice`,
    });
  }, [availableVoices, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (mediaRecorderRef.current && isListening) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isListening]);

  const value = {
    isVoiceEnabled,
    isListening,
    isSpeaking,
    currentVoice,
    toggleVoiceMode,
    speak,
    startListening,
    stopListening,
    executeVoiceCommand,
    availableVoices,
    setVoice
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
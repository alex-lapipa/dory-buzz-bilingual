import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIRequest {
  type: 'chat' | 'voice' | 'analysis';
  provider?: 'openai' | 'anthropic' | 'elevenlabs' | 'auto';
  input: string;
  context?: any;
  userId?: string;
  conversationId?: string;
  settings?: any;
  generateMedia?: boolean;
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider: string;
  type: string;
  metadata?: any;
}

export const useMasterAI = () => {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const { toast } = useToast();

  const processRequest = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    setLoading(true);
    
    try {
      // Default to auto provider selection
      const finalRequest = {
        provider: 'auto',
        ...request
      };

      console.log('Sending request to master orchestrator:', finalRequest);

      const { data, error } = await supabase.functions.invoke('master_ai_orchestrator', {
        body: finalRequest
      });

      if (error) {
        throw new Error(error.message || 'Failed to process AI request');
      }

      const response: AIResponse = data;
      setLastResponse(response);

      if (!response.success) {
        throw new Error(response.error || 'AI request failed');
      }

      return response;
    } catch (error) {
      console.error('Error in master AI processing:', error);
      const errorResponse: AIResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: request.provider || 'auto',
        type: request.type
      };
      
      setLastResponse(errorResponse);
      
      toast({
        title: "AI Error",
        description: errorResponse.error,
        variant: "destructive"
      });

      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Convenience methods for different AI operations
  const chat = useCallback(async (
    message: string, 
    context?: any, 
    provider?: 'openai' | 'anthropic' | 'auto'
  ) => {
    return await processRequest({
      type: 'chat',
      provider: provider || 'auto',
      input: message,
      context
    });
  }, [processRequest]);

  const speak = useCallback(async (text: string) => {
    return await processRequest({
      type: 'voice',
      provider: 'elevenlabs',
      input: text
    });
  }, [processRequest]);

  // Keep generateImage for internal automatic generation only
  const generateImage = useCallback(async (prompt: string) => {
    // Use OpenAI directly for automatic image generation in chat context
    try {
      const { data, error } = await supabase.functions.invoke('generate_image', {
        body: { prompt }
      });
      
      if (error) throw new Error(error.message);
      
      return {
        success: true,
        data: { imageUrl: data.image_url || data.imageUrl },
        provider: 'openai',
        type: 'auto-image'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
        provider: 'openai',
        type: 'auto-image'
      };
    }
  }, []);

  const analyze = useCallback(async (content: string) => {
    return await processRequest({
      type: 'analysis',
      provider: 'anthropic',
      input: content
    });
  }, [processRequest]);

  // Play audio from voice response
  const playAudio = useCallback(async (audioBase64: string) => {
    try {
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audio = new Audio(URL.createObjectURL(audioBlob));
      await audio.play();
      
      // Clean up URL after playing
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audio.src);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Failed to play audio response",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    loading,
    lastResponse,
    processRequest,
    chat,
    speak,
    generateImage,
    analyze,
    playAudio
  };
};
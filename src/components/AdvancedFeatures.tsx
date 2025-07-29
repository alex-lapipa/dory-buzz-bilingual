import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Mic, Image, Volume2, Loader2 } from 'lucide-react';

export const AdvancedFeatures: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [claudeResponse, setClaudeResponse] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const { toast } = useToast();

  const handleClaudeReasoning = async (prompt: string, reasoningType: string) => {
    setLoading('claude');
    try {
      const { data, error } = await supabase.functions.invoke('claude_reasoning', {
        body: { prompt, reasoning_type: reasoningType }
      });

      if (error) throw error;
      
      setClaudeResponse(data.response);
      toast({
        title: "Claude-4 Analysis Complete! 🧠",
        description: "Advanced reasoning completed successfully",
      });
    } catch (error) {
      console.error('Claude reasoning error:', error);
      toast({
        title: "Error",
        description: "Failed to process with Claude-4",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleElevenLabsTTS = async (text: string, voiceId: string) => {
    setLoading('tts');
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { text, voice_id: voiceId }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      toast({
        title: "ElevenLabs TTS Complete! 🔊",
        description: "High-quality voice synthesis ready",
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      toast({
        title: "Error",
        description: "Failed to generate speech",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleAdvancedImageGen = async (prompt: string, model: string) => {
    setLoading('image');
    try {
      const { data, error } = await supabase.functions.invoke('advanced_image_generation', {
        body: { 
          prompt, 
          model,
          quality: "high",
          size: "1024x1024",
          output_format: "png"
        }
      });

      if (error) throw error;
      
      setGeneratedImage(data.image);
      toast({
        title: "Advanced Image Generated! 🎨",
        description: `Created with ${model}`,
      });
    } catch (error) {
      console.error('Advanced image generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🚀 Advanced AI Features</h2>
        <p className="text-muted-foreground">Claude-4 reasoning, ElevenLabs voice, and advanced image generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Claude-4 Reasoning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Claude-4 Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="claude-prompt">Enter your question or problem</Label>
              <Textarea
                id="claude-prompt"
                placeholder="Ask Claude-4 to analyze, solve, or explain something complex..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="reasoning-type">Reasoning Type</Label>
              <Select defaultValue="analysis">
                <SelectTrigger>
                  <SelectValue placeholder="Select reasoning type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Deep Analysis</SelectItem>
                  <SelectItem value="creative">Creative Thinking</SelectItem>
                  <SelectItem value="problem_solving">Problem Solving</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => {
                const prompt = (document.getElementById('claude-prompt') as HTMLTextAreaElement)?.value;
                const reasoningType = document.querySelector('[data-testid="select-trigger"]')?.getAttribute('data-value') || 'analysis';
                if (prompt) handleClaudeReasoning(prompt, reasoningType);
              }}
              disabled={loading === 'claude'}
              className="w-full"
            >
              {loading === 'claude' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
              Analyze with Claude-4
            </Button>
            {claudeResponse && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{claudeResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ElevenLabs TTS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              ElevenLabs Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tts-text">Text to speak</Label>
              <Textarea
                id="tts-text"
                placeholder="Enter text to convert to realistic speech..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="voice-select">Voice</Label>
              <Select defaultValue="9BWtsMINqrJLrRacOk9x">
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria (Female)</SelectItem>
                  <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah (Female)</SelectItem>
                  <SelectItem value="CwhRBWXzGAHq8TQ4Fs17">Roger (Male)</SelectItem>
                  <SelectItem value="IKne3meq5aSn9XLyUdCD">Charlie (Male)</SelectItem>
                  <SelectItem value="TX3LPaxmHKxFdv7VOQHJ">Liam (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => {
                const text = (document.getElementById('tts-text') as HTMLTextAreaElement)?.value;
                const voiceId = document.querySelector('[data-testid="voice-select"]')?.getAttribute('data-value') || '9BWtsMINqrJLrRacOk9x';
                if (text) handleElevenLabsTTS(text, voiceId);
              }}
              disabled={loading === 'tts'}
              className="w-full"
            >
              {loading === 'tts' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Generate Speech
            </Button>
            {audioUrl && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Image Generation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Advanced Image Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image-prompt">Image description</Label>
              <Textarea
                id="image-prompt"
                placeholder="Describe the image you want to generate in detail..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="image-model">Model</Label>
              <Select defaultValue="gpt-image-1">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-image-1">GPT-Image-1 (Latest & Best)</SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => {
                const prompt = (document.getElementById('image-prompt') as HTMLTextAreaElement)?.value;
                const model = document.querySelector('[data-testid="image-model"]')?.getAttribute('data-value') || 'gpt-image-1';
                if (prompt) handleAdvancedImageGen(prompt, model);
              }}
              disabled={loading === 'image'}
              className="w-full"
            >
              {loading === 'image' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Image className="h-4 w-4 mr-2" />}
              Generate Advanced Image
            </Button>
            {generatedImage && (
              <div className="mt-4">
                <img src={generatedImage} alt="Generated" className="w-full rounded-lg shadow-lg" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
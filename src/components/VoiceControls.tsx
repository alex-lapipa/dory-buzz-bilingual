import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Mic, MicOff, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceControlsProps {
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

// Available ElevenLabs voices
const AVAILABLE_VOICES = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Clear, friendly female voice" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm, conversational female voice" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", description: "Professional female voice" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", description: "British male voice" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Young male voice" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", description: "Gentle female voice" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", description: "Professional male voice" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Cheerful female voice" }
];

export const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  isEnabled = false, 
  onToggle 
}) => {
  const [selectedVoice, setSelectedVoice] = useState(AVAILABLE_VOICES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.2
  });

  const testVoice = async (voiceId: string, voiceName: string) => {
    setIsPlaying(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: {
          text: `¡Buzztastical! Hi there! I'm Mochi, your friendly garden bee guide! This is how I sound with the ${voiceName} voice. 🐝🌻`,
          voice_id: voiceId,
          voice_settings: voiceSettings
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.volume = volume;
        await audio.play();
        
        toast.success(`Voice preview: ${voiceName}`, {
          description: "🐝 How does this voice sound for Mochi?"
        });
      }
    } catch (error) {
      console.error('Voice test error:', error);
      toast.error('Voice test failed', {
        description: 'Please check your ElevenLabs API configuration'
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const speakText = async (text: string) => {
    if (!isEnabled) return;
    
    setIsPlaying(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: {
          text: text,
          voice_id: selectedVoice.id,
          voice_settings: voiceSettings
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.volume = volume;
        await audio.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Speech generation failed');
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Mochi's Voice Settings
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Voice Responses</span>
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle?.(!isEnabled)}
            className="gap-2"
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {isEnabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Mochi's Voice</label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {AVAILABLE_VOICES.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedVoice.id === voice.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVoice(voice)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{voice.name}</div>
                        <div className="text-xs text-gray-500">{voice.description}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          testVoice(voice.id, voice.name);
                        }}
                        disabled={isPlaying}
                        className="gap-1"
                      >
                        <Volume2 className="h-3 w-3" />
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Voice Quality Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Voice Quality</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600">
                    Stability: {Math.round(voiceSettings.stability * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.stability}
                    onChange={(e) => setVoiceSettings(prev => ({
                      ...prev,
                      stability: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600">
                    Similarity: {Math.round(voiceSettings.similarity_boost * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.similarity_boost}
                    onChange={(e) => setVoiceSettings(prev => ({
                      ...prev,
                      similarity_boost: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600">
                    Style: {Math.round(voiceSettings.style * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.style}
                    onChange={(e) => setVoiceSettings(prev => ({
                      ...prev,
                      style: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Quick Test */}
            <Button
              onClick={() => speakText("¡Buzztastical! Welcome to BeeCrazy Garden World! I'm Mochi, your friendly garden bee guide! 🐝🌻")}
              disabled={isPlaying}
              className="w-full gap-2"
              variant="outline"
            >
              {isPlaying ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isPlaying ? "Speaking..." : "Test Current Settings"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
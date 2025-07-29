import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useVoice } from '@/contexts/VoiceContext';
import { Volume2, Mic, Settings, Brain, Sparkles, BookOpen, Camera } from 'lucide-react';

export const VoiceControls: React.FC = () => {
  const {
    isVoiceEnabled,
    isListening,
    isSpeaking,
    currentVoice,
    toggleVoiceMode,
    speak,
    startListening,
    stopListening,
    availableVoices,
    setVoice
  } = useVoice();

  const [showSettings, setShowSettings] = useState(false);
  
  const quickCommands = [
    { command: "Tell me about bees", category: "education", icon: BookOpen },
    { command: "Create a bee image", category: "creative", icon: Camera },
    { command: "How do bees communicate?", category: "knowledge", icon: Brain },
    { command: "What can you do?", category: "help", icon: Sparkles }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Assistant
          <Badge variant={isVoiceEnabled ? "default" : "secondary"}>
            {isVoiceEnabled ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Voice Toggle */}
        <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bee-bounce">🎤</span>
            <div>
              <Label className="font-medium">Voice Mode</Label>
              <p className="text-xs text-muted-foreground">
                Enable voice responses and commands
              </p>
            </div>
          </div>
          <Switch
            checked={isVoiceEnabled}
            onCheckedChange={toggleVoiceMode}
          />
        </div>

        {isVoiceEnabled && (
          <>
            {/* Voice Controls */}
            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="sm"
                className="flex-1"
                disabled={isSpeaking}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isListening ? "Stop Listening" : "Voice Command"}
              </Button>
              
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Voice Settings */}
            {showSettings && (
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Voice Selection</Label>
                  <Select value={currentVoice} onValueChange={setVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div>
                            <div className="font-medium">{voice.name}</div>
                            <div className="text-xs text-muted-foreground">{voice.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={() => speak("Hello! This is how I sound with this voice. I'm Mochi, your friendly bee guide!")}
                  variant="outline"
                  size="sm"
                  disabled={isSpeaking}
                  className="w-full"
                >
                  <Volume2 className="h-3 w-3 mr-2" />
                  Test Voice
                </Button>
              </div>
            )}

            <Separator />

            {/* Quick Voice Commands */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Voice Commands</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <Button
                      key={index}
                      onClick={() => speak(cmd.command)}
                      variant="outline"
                      size="sm"
                      disabled={isSpeaking}
                      className="text-xs justify-start h-auto p-2"
                    >
                      <Icon className="h-3 w-3 mr-2" />
                      <span className="truncate">"{cmd.command}"</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span>Listening</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                <span>Speaking</span>
              </div>
            </div>

            {/* Voice Navigation Help */}
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="animate-bee-bounce">🐝</span>
                Voice Navigation
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Say "go to education" to open the learning hub</p>
                <p>• Say "start chat" to begin conversations</p>
                <p>• Say "create image" to make bee illustrations</p>
                <p>• Say "voice chat" for real-time conversations</p>
                <p>• Say "help" to learn what I can do</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
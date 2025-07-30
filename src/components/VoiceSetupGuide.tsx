import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  Volume2, 
  Wifi, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VoiceSetupGuide: React.FC = () => {
  const { toast } = useToast();
  
  const checkFeatures = () => {
    return {
      microphone: navigator.mediaDevices ? true : false,
      speakers: 'AudioContext' in window,
      websockets: 'WebSocket' in window,
      webAudio: 'AudioContext' in window,
      internet: navigator.onLine
    };
  };

  const features = checkFeatures();
  const allReady = Object.values(features).every(Boolean);

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "🎤 Microphone Test Successful!",
        description: "Your microphone is working properly for voice chat.",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const StatusItem = ({ 
    label, 
    status, 
    icon: Icon, 
    description 
  }: { 
    label: string; 
    status: boolean; 
    icon: any; 
    description: string; 
  }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${status ? 'text-green-500' : 'text-red-500'}`} />
        <div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      {status ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <Alert className={allReady ? "border-green-500" : "border-yellow-500"}>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          {allReady ? (
            <span className="text-green-700">
              🚀 <strong>Ready for voice chat!</strong> All systems are go for OpenAI Realtime Voice.
            </span>
          ) : (
            <span className="text-yellow-700">
              <strong>Setup required:</strong> Some features need configuration for optimal voice chat experience.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Chat System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StatusItem
            label="Microphone Access"
            status={features.microphone}
            icon={Mic}
            description={features.microphone ? "Available for voice input" : "Required for voice chat"}
          />
          
          <StatusItem
            label="Audio Output"
            status={features.speakers}
            icon={Volume2}
            description={features.speakers ? "Ready for voice responses" : "Required for audio playback"}
          />
          
          <StatusItem
            label="WebSocket Support"
            status={features.websockets}
            icon={Wifi}
            description={features.websockets ? "Real-time communication enabled" : "Required for live voice chat"}
          />
          
          <StatusItem
            label="Web Audio API"
            status={features.webAudio}
            icon={Zap}
            description={features.webAudio ? "Advanced audio processing available" : "Required for audio processing"}
          />
          
          <StatusItem
            label="Internet Connection"
            status={features.internet}
            icon={Wifi}
            description={features.internet ? "Connected to services" : "Required for AI communication"}
          />
        </CardContent>
      </Card>

      {/* Voice Chat Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Available Voice Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  🚀 OpenAI Realtime Voice
                  <Badge variant="secondary">NEW</Badge>
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Direct voice-to-voice communication with GPT-4o Realtime (Latest Model). Natural conversation flow with minimal latency.
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground ml-4">
                <li>• Real-time audio processing</li>
                <li>• Natural conversation interruptions</li>
                <li>• Voice activity detection</li>
                <li>• Bilingual support (English/Spanish)</li>
              </ul>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">🎤 Classic Voice Chat</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Traditional speech-to-text and text-to-speech workflow. More stable but with slight delays.
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground ml-4">
                <li>• OpenAI Whisper transcription</li>
                <li>• ElevenLabs voice synthesis</li>
                <li>• Conversation history</li>
                <li>• Reliable fallback option</li>
              </ul>
            </div>
          </div>

          {features.microphone && (
            <div className="pt-3 border-t">
              <Button onClick={testMicrophone} variant="outline" className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Test Microphone
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Setup Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-blue-50 rounded-lg">
              <strong>🎧 Audio Quality:</strong> Use headphones to prevent echo and improve voice recognition.
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <strong>🔇 Environment:</strong> Find a quiet space for the best voice chat experience.
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <strong>🌐 Browser:</strong> Chrome, Firefox, and Safari all support voice features.
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <strong>🐝 Language:</strong> Mochi responds in the same language you speak!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
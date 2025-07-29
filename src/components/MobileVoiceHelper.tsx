import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Mic, Volume2, Wifi } from 'lucide-react';

interface MobileVoiceHelperProps {
  className?: string;
}

export const MobileVoiceHelper: React.FC<MobileVoiceHelperProps> = ({ className }) => {
  return (
    <div className={`p-4 ${className}`}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Mobile Voice Tips</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                <Mic className="h-3 w-3 mr-1" />
                Mic
              </Badge>
              <p>Tap the microphone button to allow microphone access when prompted</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                <Volume2 className="h-3 w-3 mr-1" />
                Audio
              </Badge>
              <p>Make sure your device volume is up and not muted for voice responses</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                <Wifi className="h-3 w-3 mr-1" />
                Connection
              </Badge>
              <p>Use WiFi or good cellular connection for best voice quality</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Pro tip:</strong> Speak clearly and pause briefly between sentences for best results. 
              The AI will respond when you finish speaking!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { MobileVoiceChat } from './MobileVoiceChat';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mic, Volume2, Brain, Smartphone } from 'lucide-react';

interface VoiceInterfaceProps {
  mode?: 'simple' | 'realtime' | 'mobile';
  onSpeakingChange?: (speaking: boolean) => void;
  className?: string;
}

type VoiceMode = 'simple' | 'realtime' | 'mobile';

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  mode = 'realtime',
  onSpeakingChange,
  className
}) => {
  const { toast } = useToast();
  const { trackEvent } = useUserAnalytics();
  const isMobile = useIsMobile();
  const [currentMode, setCurrentMode] = useState<VoiceMode>(isMobile ? 'mobile' : mode);

  useEffect(() => {
    // Auto-select best mode for device
    if (isMobile && mode !== 'mobile') {
      setCurrentMode('mobile');
    }
  }, [isMobile, mode]);

  useEffect(() => {
    // Track voice interface access
    trackEvent('voice_interface_opened', 'voice', { 
      mode: currentMode,
      device: isMobile ? 'mobile' : 'desktop'
    });
  }, []);

  // Mobile-first: Use MobileVoiceChat for mobile devices
  if (isMobile || currentMode === 'mobile') {
    return <MobileVoiceChat />;
  }

  // Desktop fallback with mode selection
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Voice Interface Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setCurrentMode('mobile')}
              className="w-full justify-start"
              variant={currentMode === 'mobile' ? 'default' : 'outline'}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Realtime Voice Chat (Recommended)
            </Button>
            
            <Button
              onClick={() => setCurrentMode('simple')}
              className="w-full justify-start"
              variant={currentMode === 'simple' ? 'default' : 'outline'}
            >
              <Mic className="h-4 w-4 mr-2" />
              Simple Voice Recording
            </Button>
            
            <Button
              onClick={() => setCurrentMode('realtime')}
              className="w-full justify-start"
              variant={currentMode === 'realtime' ? 'default' : 'outline'}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Advanced Realtime (WebRTC)
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {currentMode === 'mobile' && <MobileVoiceChat />}
    </div>
  );
};
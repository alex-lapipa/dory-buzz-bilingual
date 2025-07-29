import React, { useState } from 'react';
import { MochiChat } from './MochiChat';
import { ShareButtons } from './ShareButtons';
import { VoiceChat } from './VoiceChat';
import { ImageGenerator } from './ImageGenerator';
import { FollowMochiModal } from './FollowMochiModal';
import { OnboardingTip } from './OnboardingTip';
import { LanguageWelcome } from './LanguageWelcome';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, Image, Video, Expand, Shrink, Heart, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MochiInterface: React.FC = () => {
  const { setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(
    !localStorage.getItem('mochi_language_selected')
  );
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('mochi_onboarding_completed')
  );

  const handleLanguageSelect = (language: 'en' | 'es') => {
    setLanguage(language);
    setShowLanguageSelect(false);
  };

  if (showLanguageSelect) {
    return <LanguageWelcome onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <>
      {/* Flying Bees Background - More bees and bumblebees */}
      <div className="flying-bee flying-bee-1 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-2 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-3 animate-tiny-bee-zigzag">🐝</div>
      <div className="flying-bee flying-bee-4 animate-tiny-bee-loop">🐝</div>
      <div className="flying-bee flying-bee-5 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-6 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-7 animate-bee-to-garden">🐝</div>
      <div className="flying-bee flying-bee-8 animate-bee-from-garden">🐝</div>
      <div className="flying-bee flying-bee-9 animate-bee-garden-visit">🐝</div>
      <div className="flying-bee flying-bee-10 animate-bee-to-garden">🐝</div>
      
      {/* More bees */}
      <div className="flying-bee flying-bee-11 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-12 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-13 animate-tiny-bee-zigzag">🐝</div>
      <div className="flying-bee flying-bee-14 animate-tiny-bee-loop">🐝</div>
      
      {/* Bumblebees - larger and fluffier */}
      <div className="flying-bee flying-bumblebee-1 animate-bumblebee-bumble">🐝</div>
      <div className="flying-bee flying-bumblebee-2 animate-bumblebee-bumble">🐝</div>
      <div className="flying-bee flying-bumblebee-3 animate-bumblebee-bumble">🐝</div>
      
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-nature' : 'min-h-full'} safe-area-top safe-area-bottom flex items-center justify-center ${isFullscreen ? '' : 'p-2 sm:p-4'}`}>
      <div className={`${isFullscreen ? 'h-full w-full flex flex-col' : 'max-w-md sm:max-w-2xl lg:max-w-4xl w-full mx-auto'}`}>

        {/* Fullscreen Toggle */}
        {!isFullscreen && (
          <div className="absolute top-4 right-4 z-40">
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-background/20"
              aria-label={t('enterFullscreen')}
            >
              <Expand className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="p-2 bg-background/80 hover:bg-background/90"
              aria-label={t('exitFullscreen')}
            >
              <Shrink className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}

        {/* Main Interface - Mobile Optimized */}
        <Card className={`shadow-honey border border-border/30 bg-card/70 backdrop-blur ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className={`grid w-full grid-cols-3 bg-muted/50 ${isFullscreen ? 'flex-shrink-0' : ''} p-1`}>
                <TabsTrigger value="chat" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label={t('textChat')}>
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{t('chat')}</span>
                  <span className="xs:hidden">💬</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label={t('voiceChat')}>
                  <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{t('voice')}</span>
                  <span className="xs:hidden">🎤</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label={t('imageGenerator')}>
                  <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{t('generate')}</span>
                  <span className="xs:hidden">🎨</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px] max-h-[60vh] sm:max-h-[70vh]'} overflow-auto`}>
                  <MochiChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="voice" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[60vh] sm:h-[70vh] max-h-[600px]'} overflow-auto`}>
                  <VoiceChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="generate" className={`m-0 ${isFullscreen ? 'flex-1' : ''} p-4`}>
                <div className={`${isFullscreen ? 'h-full overflow-y-auto' : 'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto'}`}>
                  <ImageGenerator />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* Onboarding for First-Time Users */}
      {showOnboarding && (
        <OnboardingTip 
          onClose={() => {
            setShowOnboarding(false);
            localStorage.setItem('mochi_onboarding_completed', 'true');
          }} 
        />
      )}
    </>
  );
};
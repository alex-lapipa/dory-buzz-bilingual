import React, { useState, useEffect } from 'react';
import { MochiChat } from './MochiChat';
import { VoiceChat } from './VoiceChat';
import { ImageGenerator } from './ImageGenerator';
import { OnboardingTip } from './OnboardingTip';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expand, Shrink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsageTracking, usePageTracking } from '@/hooks/useUsageTracking';

interface MochiInterfaceProps {
  activeTab?: string;
}

export const MochiInterface: React.FC<MochiInterfaceProps> = ({ activeTab = 'chat' }) => {
  const { t } = useLanguage();
  const { trackFeatureUsage, trackInteraction } = useUsageTracking();
  usePageTracking();
  
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('mochi_onboarding_completed')
  );

  // Check if user has completed registration
  const isUserRegistered = localStorage.getItem('userRegistration') !== null;

  useEffect(() => {
    setCurrentTab(activeTab);
    if (activeTab && isUserRegistered) {
      trackFeatureUsage(`tab_${activeTab}`, { source: 'interface' });
    }
  }, [activeTab, isUserRegistered, trackFeatureUsage]);

  const renderContent = () => {
    if (!isUserRegistered) {
      return (
        <div className="min-h-[480px] flex items-center justify-center p-10 text-center">
          <div className="max-w-lg">
            <div className="text-7xl mb-5 animate-bee-bounce">🐝</div>
            <h2 className="text-3xl font-bold mb-5" style={{ color: '#fffd01' }}>
              {t('welcome')} BeeCrazy Garden World!
            </h2>
            <p className="text-lg mb-7" style={{ color: '#fffd01' }}>
              {t('language') === 'es' 
                ? 'Complete tu registro para acceder a todas las funciones de chat con Mochi.'
                : 'Complete your registration to access all chat features with Mochi.'
              }
            </p>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'voice':
        return (
          <div className={`${isFullscreen ? 'h-full' : 'h-[60vh] sm:h-[70vh] max-h-[600px]'} overflow-auto`}>
            <VoiceChat className="h-full" />
          </div>
        );
      case 'generate':
        return (
          <div className={`${isFullscreen ? 'h-full overflow-y-auto' : 'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto'} p-4`}>
            <ImageGenerator />
          </div>
        );
      default:
        return (
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px] max-h-[60vh] sm:max-h-[70vh]'} overflow-auto`}>
            <MochiChat className="h-full" />
          </div>
        );
    }
  };

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
      
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-nature' : 'min-h-screen'} safe-area-top safe-area-bottom flex items-center justify-center ${isFullscreen ? '' : 'p-2 sm:p-4 pt-20 pb-20'}`}>
      <div className={`${isFullscreen ? 'h-full w-full flex flex-col' : 'max-w-md sm:max-w-2xl lg:max-w-4xl w-full mx-auto my-auto'}`}>

        {/* Fullscreen Toggle - Only for registered users */}
        {isUserRegistered && !isFullscreen && (
          <div className="absolute top-4 right-4 z-40">
            <Button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                trackInteraction('click', 'fullscreen_toggle', { entering: !isFullscreen });
              }}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-background/20"
              aria-label={t('enterFullscreen')}
            >
              <Expand className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
        {isUserRegistered && isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                trackInteraction('click', 'fullscreen_toggle', { exiting: isFullscreen });
              }}
              variant="ghost"
              size="sm"
              className="p-2 bg-background/80 hover:bg-background/90"
              aria-label={t('exitFullscreen')}
            >
              <Shrink className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}

        {/* Main Interface - Floating Content */}
        <div className={`${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          <div className="h-full flex flex-col">
            {renderContent()}
          </div>
        </div>
      </div>
      </div>
      
      {/* Onboarding for First-Time Users */}
      {showOnboarding && isUserRegistered && (
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
import React, { useState, useEffect, memo, lazy, Suspense } from 'react';
// Lazy load heavy components
const ChatInterface = lazy(() => import('./ChatInterface').then(module => ({ default: module.ChatInterface })));

const ImageGenerator = lazy(() => import('./ImageGenerator').then(module => ({ default: module.ImageGenerator })));
const MochiVideoFeed = lazy(() => import('./MochiVideoFeed').then(module => ({ default: module.MochiVideoFeed })));
import { OnboardingTip } from './OnboardingTip';
import { MochiConvAI } from './MochiConvAI';
import { UserRegistration } from './UserRegistration';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RouteLoader } from '@/components/ui/route-loader';
import { GardenExpand, GardenShrink } from '@/components/icons';
import "@/styles/mochi-tokens.css";
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsageTracking, usePageTracking } from '@/hooks/useUsageTracking';

interface MochiInterfaceProps {
  activeTab?: string;
}

export const MochiInterface = memo<MochiInterfaceProps>(({ activeTab = 'chat' }) => {
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
        <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6 md:p-8 text-center">
          <div className="max-w-sm sm:max-w-md md:max-w-lg w-full">
            <img
              src="/lovable-uploads/mochi-clean-200.webp"
              alt=""
              width={84}
              height={84}
              className="mx-auto mb-4 sm:mb-5 animate-bee-bounce"
              style={{ filter: 'drop-shadow(0 8px 18px rgba(43,29,11,0.22))' }}
            />
            <h2
              className="mb-2"
              style={{
                fontFamily: "var(--mochi-font-display, 'Fraunces', serif)",
                fontSize: 'clamp(1.4rem, 4.5vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                color: 'hsl(28 35% 18%)',
              }}
            >
              {t('welcome')} Mochi de los Huertos!
            </h2>
            <p
              className="mb-5"
              style={{
                fontFamily: "var(--mochi-font-hand, 'Caveat', cursive)",
                fontSize: '1.2rem',
                color: 'hsl(35 78% 38%)',
                lineHeight: 1.2,
              }}
            >
              · the garden bee · la abeja del huerto ·
            </p>
            <p className="text-base sm:text-lg mb-6 sm:mb-7 text-foreground">
              {t('language') === 'es'
                ? 'Completa tu registro para acceder a todas las funciones de chat con Mochi.'
                : 'Complete your registration to access all chat features with Mochi.'
              }
            </p>
            <UserRegistration inline onComplete={() => window.location.reload()} />
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'voice':
        return (
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px]'} flex items-center justify-center`}>
            <MochiConvAI className="w-full" />
          </div>
        );
      case 'chat-advanced':
        return (
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px] max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]'} overflow-auto`}>
            <Suspense fallback={<RouteLoader />}>
              <ChatInterface className="h-full" mode="advanced" />
            </Suspense>
          </div>
        );
      case 'generate':
        return (
          <div className={`${isFullscreen ? 'h-full overflow-y-auto' : 'max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto'} p-3 sm:p-4`}>
            <Suspense fallback={<RouteLoader />}>
              <ImageGenerator />
            </Suspense>
          </div>
        );
      case 'video':
        return (
          <div className={`${isFullscreen ? 'h-full overflow-y-auto' : 'max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto'}`}>
            <Suspense fallback={<RouteLoader />}>
              <MochiVideoFeed />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px] max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]'} overflow-auto`}>
            <Suspense fallback={<RouteLoader />}>
              <ChatInterface className="h-full" mode="simple" />
            </Suspense>
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
      
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-nature' : 'min-h-screen'} safe-area-top safe-area-bottom flex items-center justify-center ${isFullscreen ? '' : 'p-3 sm:p-4 lg:p-6 pt-16 sm:pt-18 lg:pt-20 pb-16 sm:pb-18 lg:pb-20'}`}>
      <div className={`${isFullscreen ? 'h-full w-full flex flex-col' : 'max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full mx-auto my-auto'}`}>

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
              <GardenExpand className="h-3 w-3 sm:h-4 sm:w-4" />
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
              <GardenShrink className="h-3 w-3 sm:h-4 sm:w-4" />
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
});
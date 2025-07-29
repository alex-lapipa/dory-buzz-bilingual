import React from 'react';
import { FollowMochiModal } from './FollowMochiModal';
import { ShareButtons } from './ShareButtons';
import { HamburgerMenu } from './HamburgerMenu';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppHeaderProps {
  onTabSelect?: (tab: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onTabSelect }) => {
  const { t } = useLanguage();
  return (
    <header className="w-full bg-gradient-to-b from-background/40 via-background/20 to-transparent backdrop-blur-sm border-b border-border/10 p-2 sm:p-3 fixed top-0 left-0 right-0 z-50 safe-area-top">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left: La Pipa Logo */}
        <div className="flex-shrink-0">
          <a href="https://lapipa.io" target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/1f601181-1675-48ad-9c86-886c676b13e7.png" 
              alt="La Pipa" 
              className="h-8 w-8 sm:h-10 sm:w-10 hover:opacity-80 transition-opacity bg-transparent"
              style={{backgroundColor: 'transparent'}}
            />
          </a>
        </div>
        
        {/* Center: Title and Bee */}
        <div className="flex flex-col items-center text-center">
          <div className="text-3xl sm:text-4xl animate-bee-bounce mb-1">🐝</div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-bee bg-clip-text text-transparent">
            {t('appTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('appSubtitle')}
          </p>
        </div>
        
        {/* Right: Action Buttons and Hamburger Menu */}
        <div className="flex gap-1 sm:gap-2 flex-shrink-0 items-center">
          <FollowMochiModal>
            <Button variant="default" size="sm" className="animate-pulse text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{t('follow')}</span> {t('mochiName')}!
            </Button>
          </FollowMochiModal>
          <ShareButtons />
          <HamburgerMenu onTabSelect={onTabSelect} />
        </div>
      </div>
    </header>
  );
};
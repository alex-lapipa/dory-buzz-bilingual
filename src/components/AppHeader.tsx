import React from 'react';
import { FollowDoryModal } from './FollowDoryModal';
import { ShareButtons } from './ShareButtons';
import { HamburgerMenu } from './HamburgerMenu';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/20 p-4 fixed top-0 left-0 right-0 z-50 safe-area-top">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left: La Pipa Logo */}
        <div className="flex-shrink-0">
          <a href="https://lapipa.io" target="_blank" rel="noopener noreferrer">
            <img 
              src="/lovable-uploads/1f601181-1675-48ad-9c86-886c676b13e7.png" 
              alt="La Pipa" 
              className="h-8 w-8 sm:h-10 sm:w-10 hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
        
        {/* Center: Title and Bee */}
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl sm:text-5xl animate-bee-bounce mb-2">🐝</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-bee bg-clip-text text-transparent">
            BeeCrazy Garden World
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your friendly family garden companion
          </p>
        </div>
        
        {/* Right: Action Buttons and Hamburger Menu */}
        <div className="flex gap-1 sm:gap-2 flex-shrink-0 items-center">
          <FollowDoryModal>
            <Button variant="default" size="sm" className="animate-pulse text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Follow</span> Dory!
            </Button>
          </FollowDoryModal>
          <ShareButtons />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
};
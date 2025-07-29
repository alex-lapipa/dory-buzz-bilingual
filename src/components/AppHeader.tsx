import React from 'react';
import { FollowDoryModal } from './FollowDoryModal';
import { ShareButtons } from './ShareButtons';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/20 p-4 fixed top-0 left-0 right-0 z-50 safe-area-top">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <div className="relative flex sm:block">
          <div className="text-4xl sm:text-6xl animate-bee-bounce">🐝</div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-bee bg-clip-text text-transparent">
            BeeCrazy Garden World
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Your friendly family garden companion
          </p>
        </div>
        <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
          <FollowDoryModal>
            <Button variant="default" size="sm" className="animate-pulse text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Follow</span> Dory!
            </Button>
          </FollowDoryModal>
          <ShareButtons />
        </div>
      </div>
    </header>
  );
};
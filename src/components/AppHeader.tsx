import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowMochiModal } from './FollowMochiModal';
import { ShareButtons } from './ShareButtons';
import { Button } from '@/components/ui/button';
import { Heart, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface AppHeaderProps {
  onTabSelect?: (tab: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onTabSelect }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleBeeClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full bg-gradient-to-b from-background/90 via-background/70 to-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-border/30 h-header-mobile md:h-header-tablet lg:h-header-desktop">
      <div className="h-full max-w-7xl mx-auto px-mobile-lg md:px-mobile-xl lg:px-mobile-2xl flex justify-between items-center">
        {/* Left: Logos + MochiBee Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBeeClick}
            className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
            aria-label="Go to home page"
          >
            <img 
              src="/lovable-uploads/1f601181-1675-48ad-9c86-886c676b13e7.png" 
              alt="La Pipa" 
              className="h-6 w-6 sm:h-8 sm:w-8 bg-transparent"
              style={{backgroundColor: 'transparent'}}
            />
          </button>
          <button 
            onClick={handleBeeClick}
            className="hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
            aria-label="Go to home page"
          >
            <img 
              src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png"
              alt="Mochi the Bee"
              className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-md animate-bee-bounce hover:animate-pulse"
            />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
              MochiBee 🌻
            </h1>
            <p className="text-xs sm:text-sm text-primary/90 font-medium">
              A Buzztastical Bee
            </p>
          </div>
        </div>
        
        {/* Right: Navigation and Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              🐝 Beeducation
            </Button>
          </nav>
          
          {/* Action Buttons */}
          <FollowMochiModal>
            <Button variant="default" size="sm" className="animate-pulse text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{t('follow')}</span> {t('mochiName')}!
            </Button>
          </FollowMochiModal>
          
          <ShareButtons />
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground hidden lg:inline">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="text-xs sm:text-sm"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

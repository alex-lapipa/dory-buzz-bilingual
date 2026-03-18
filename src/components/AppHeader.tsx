import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowMochiModal } from './FollowMochiModal';
import { ShareButtons } from './ShareButtons';
import { HamburgerMenu } from './HamburgerMenu';
import { Button } from '@/components/ui/button';
import { FlowerHeart, BeeFace, BeeFlying, BeehiveSafe } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface AppHeaderProps {
  onTabSelect?: (tab: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onTabSelect }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  const handleBeeClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full bg-gradient-to-b from-background/90 via-background/70 to-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-border/30 h-header-mobile md:h-header-tablet lg:h-header-desktop">
      <div className="h-full max-w-7xl mx-auto px-mobile-lg md:px-mobile-xl lg:px-mobile-2xl flex justify-between items-center">
        {/* Left: MochiBee Logo + Title */}
        <button 
          onClick={handleBeeClick}
          className="flex items-center gap-3 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg group"
          aria-label="Go to home page"
        >
          <img 
            src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png"
            alt="Mochi the Bee"
            className="w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-md animate-bee-bounce group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary">
              <span className="sm:hidden">Mochi 🐝</span>
              <span className="hidden sm:inline">MochiBee 🌻</span>
            </h1>
            <p className="text-xs sm:text-sm text-primary/90 font-medium hidden xs:block">
              A Buzztastical Bee
            </p>
          </div>
        </button>
        
        {/* Right: Navigation and Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              🐝 Beeducation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/learning')}
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              🌿 {t('learn') || 'Learn'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/buzzy-bees')}
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              🎵 Buzzy Bees
            </Button>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-sm hover:text-primary flex items-center gap-1"
              >
                🌱 Dashboard
              </Button>
            )}
          </nav>

          {/* Desktop-only Follow CTA */}
          <div className="hidden sm:block">
            <FollowMochiModal>
              <Button variant="default" size="sm" className="animate-pulse text-xs sm:text-sm">
                <FlowerHeart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">{t('follow')}</span> {t('mochiName')}!
              </Button>
            </FollowMochiModal>
          </div>
          
          <div className="hidden sm:block">
            <ShareButtons />
          </div>
          
          {/* Auth Button - desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="text-xs text-muted-foreground hover:text-primary"
                    title="Admin Panel"
                  >
                    <BeehiveSafe className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
                <span className="text-xs text-muted-foreground hidden lg:inline">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="text-xs"
                >
                  <BeeFlying className="h-3 w-3 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="text-xs"
              >
                <BeeFace className="h-3 w-3 mr-1" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <HamburgerMenu onTabSelect={onTabSelect} />
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ExternalLink, LogOut, User, Shield, Heart, BookOpen, MessageCircle, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { FollowMochiModal } from './FollowMochiModal';
import { ShareButtons } from './ShareButtons';

interface HamburgerMenuProps {
  onTabSelect?: (tab: string) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onTabSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const navTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="p-6 space-y-6">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 pb-4 border-b border-border/30">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">{t('welcome') || 'Welcome back'}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t('menu') || 'Navigation'}
            </h3>

            <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/')}>
              <MessageCircle className="h-4 w-4 mr-3" />
              🐝 Beeducation
            </Button>

            <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/learning')}>
              <BookOpen className="h-4 w-4 mr-3" />
              📚 {t('learn') || 'Learn'}
            </Button>

            {user && (
              <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/dashboard')}>
                <BarChart3 className="h-4 w-4 mr-3" />
                📊 Dashboard
              </Button>
            )}

            {isAdmin && (
              <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/admin')}>
                <Shield className="h-4 w-4 mr-3" />
                Admin Panel
                <Badge variant="secondary" className="ml-auto text-[10px]">🔒</Badge>
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <FollowMochiModal>
              <Button variant="default" size="sm" className="w-full text-sm">
                <Heart className="h-4 w-4 mr-2" />
                {t('follow') || 'Follow'} {t('mochiName') || 'Mochi'}!
              </Button>
            </FollowMochiModal>

            <div className="flex justify-center">
              <ShareButtons />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-sm"
              onClick={() => {
                window.open('https://lapipa.ai', '_blank');
                setIsOpen(false);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Lapipa.ai
            </Button>
          </div>

          {/* Auth */}
          <div className="pt-2 border-t border-border/30">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => { signOut(); setIsOpen(false); }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navTo('/auth')}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* About */}
          <div className="pt-2 border-t border-border/30 text-center">
            <div className="text-3xl mb-2 animate-flower-sway">🌻</div>
            <p className="text-xs text-muted-foreground font-normal">
              {t('mochiDescription') || 'Your friendly bee from BeeCrazy Garden World!'}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

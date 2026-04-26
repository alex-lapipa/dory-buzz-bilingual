import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HoneycombMenu, ButterflyLink, BeeFlying, BeeFace, BeehiveSafe, FlowerHeart, LeafBook, BeeChat, SeedlingChart, MusicalFlower, NatureLeaf } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { DISCOVER_SECTIONS } from './nav/navConfig';
import { FollowMochiModal } from './FollowMochiModal';
import { ShareButtons } from './ShareButtons';

interface HamburgerMenuProps {
  onTabSelect?: (tab: string) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onTabSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { isActive, ariaCurrent } = useActiveRoute();

  const navTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <HoneycombMenu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="p-6 space-y-6">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 pb-4 border-b border-border/30">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BeeFace className="h-5 w-5 text-primary" />
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

            <Button variant="ghost" className={`w-full justify-start ${isActive('/', { exact: true }) ? 'nav-item-active' : ''}`} aria-current={ariaCurrent('/', { exact: true })} onClick={() => navTo('/')}>
              <BeeChat className="h-4 w-4 mr-3" />
              <BeeFlying className="h-3.5 w-3.5 inline mr-1" /> Beeducation
            </Button>


            <Button variant="ghost" className={`w-full justify-start ${isActive('/buzzy-bees') ? 'nav-item-active' : ''}`} aria-current={ariaCurrent('/buzzy-bees')} onClick={() => navTo('/buzzy-bees')}>
              <MusicalFlower className="h-4 w-4 mr-3" />
              <MusicalFlower className="h-3.5 w-3.5 inline mr-1" /> Buzzy Bees
            </Button>

            {user && (
              <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/dashboard')}>
                <SeedlingChart className="h-4 w-4 mr-3" />
                <NatureLeaf className="h-3.5 w-3.5 inline mr-1" /> Dashboard
              </Button>
            )}

            {isAdmin && (
              <Button variant="ghost" className="w-full justify-start" onClick={() => navTo('/admin')}>
                <BeehiveSafe className="h-4 w-4 mr-3" />
                Admin Panel
                <Badge variant="secondary" className="ml-auto text-[10px]"><BeeFlying className="h-3 w-3" /></Badge>
              </Button>
            )}
          </div>

          {/* Discover sections — surfaces all secondary routes (Round 8 Batch 3) */}
          {DISCOVER_SECTIONS.map((section) => (
            <div key={section.titleEn} className="space-y-1 pt-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-readable-muted">
                {language === 'es' ? section.titleEs : section.titleEn}
              </h3>
              {section.items.map((item) => {
                const active = isActive(item.path, { exact: item.path === '/' });
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start ${active ? 'nav-item-active' : ''}`}
                    aria-current={ariaCurrent(item.path, { exact: item.path === '/' })}
                    onClick={() => navTo(item.path)}
                  >
                    <span aria-hidden="true" className="mr-3 text-base">{item.emoji ?? '•'}</span>
                    <span className="flex-1 text-left">
                      {language === 'es' ? item.labelEs : item.labelEn}
                    </span>
                    {item.badgeEn && (
                      <span className="badge-new-2026 ml-2">
                        {language === 'es' ? (item.badgeEs ?? item.badgeEn) : item.badgeEn}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          ))}

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <FollowMochiModal>
              <Button variant="default" size="sm" className="w-full text-sm">
                <FlowerHeart className="h-4 w-4 mr-2" />
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
              <ButterflyLink className="h-4 w-4 mr-2" />
              Lapipa.ai
            </Button>
          </div>

          {/* Auth */}
          <div className="pt-2 border-t border-border/30">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-amber-600 hover:text-amber-700"
                onClick={() => { signOut(); setIsOpen(false); }}
              >
                <BeeFlying className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navTo('/auth')}
              >
                <BeeFace className="h-4 w-4 mr-2" />
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

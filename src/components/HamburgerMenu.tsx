import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ExternalLink, Info, Zap, Settings } from 'lucide-react';
import { BeeEducationHub } from '@/components/BeeEducationHub';
import { AccessibilityHelper } from '@/components/AccessibilityHelper';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

interface HamburgerMenuProps {
  onTabSelect?: (tab: string) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onTabSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Check if user has completed registration
  const isUserRegistered = localStorage.getItem('userRegistration') !== null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="p-6 space-y-6">
          {/* Chat features removed - only available in navigation tabs */}

          {/* Removed Advanced Features - Moved to Technical Details page */}


          {/* Education Hub removed - available in Beeducation tab */}

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Menu className="h-5 w-5" />
              {t('menu') || 'Menu'}
            </h3>
            
            <div className="space-y-2">
              <Link to="/technical-details">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Technical Details
                  <Badge variant="secondary" className="ml-auto">Full</Badge>
                </Button>
              </Link>

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setActiveSection(activeSection === 'accessibility' ? null : 'accessibility');
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                System Help
              </Button>
              
               <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  window.open('https://lapipa.io', '_blank');
                  setIsOpen(false);
                }}
               >
                 <ExternalLink className="h-4 w-4 mr-2" />
                 Lapipa.io
               </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('aboutMochi') || 'About Mochi'}
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-3 animate-flower-sway">🌻</div>
                <h4 className="text-xl font-bold mb-2">{t('meetMochi') || 'Meet Mochi'}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('mochiDescription') || 'Your friendly bee from BeeCrazy Garden World!'}
                </p>
              </div>

              <div className="space-y-3">
                <Card className="p-3 bg-secondary/20">
                  <h5 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    🇪🇸 Spanish Features
                  </h5>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Natural Spanish conversations</li>
                    <li>• Mexican cultural context</li>
                    <li>• Nature vocabulary in Spanish</li>
                    <li>• Educational content</li>
                  </ul>
                </Card>

                <Card className="p-3 bg-secondary/20">
                  <h5 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    🇺🇸 English Features
                  </h5>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Fluent English responses</li>
                    <li>• Nature guide expertise</li>
                    <li>• Environmental education</li>
                    <li>• Interactive learning</li>
                  </ul>
                </Card>
              </div>

              <div className="bg-accent/20 rounded-lg p-3">
                <h5 className="font-semibold mb-2 text-sm">🐝 What can Mochi help with?</h5>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>🌸 Plant identification</span>
                  <span>🦋 Wildlife facts</span>
                  <span>🌱 Gardening tips</span>
                  <span>🍯 Bee information</span>
                  <span>🌍 Environmental topics</span>
                  <span>📚 Nature education</span>
                  <span>🗣️ Language practice</span>
                  <span>❓ General questions</span>
                </div>
              </div>
            </div>
          </div>


          {/* Accessibility Helper */}
          {activeSection === 'accessibility' && (
            <div className="fixed inset-0 bg-background z-50 overflow-y-auto p-4">
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{t('systemHelp') || 'System Help'}</h2>
                  <Button variant="outline" onClick={() => setActiveSection(null)}>
                    ✕
                  </Button>
                </div>
                <AccessibilityHelper />
              </div>
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
};
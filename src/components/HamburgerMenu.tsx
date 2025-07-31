import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ExternalLink, Info, Brain, BookOpen, Zap, MessageCircle, Mic, Image, Video, Settings } from 'lucide-react';
import { AdvancedFeatures } from '@/components/AdvancedFeatures';
import { BeeEducationHub } from '@/components/BeeEducationHub';
import { AccessibilityHelper } from '@/components/AccessibilityHelper';
import { SystemTestStatus } from '@/components/SystemTestStatus';
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
          {/* Chat Tabs - Only for registered users */}
          {isUserRegistered && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('chat')} Features
                </h3>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabSelect?.('chat');
                      setIsOpen(false);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('textChat')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabSelect?.('voice');
                      setIsOpen(false);
                    }}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    OpenAI Realtime Voice
                    <Badge variant="secondary" className="ml-auto">NEW</Badge>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabSelect?.('voice-classic');
                      setIsOpen(false);
                    }}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Classic Voice Chat
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabSelect?.('generate');
                      setIsOpen(false);
                    }}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t('imageGenerator')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabSelect?.('video');
                      setIsOpen(false);
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    🐝 Video Feed
                    <Badge variant="secondary" className="ml-auto">NEW</Badge>
                  </Button>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Advanced Features */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => setActiveSection(activeSection === 'advanced' ? null : 'advanced')}
            >
              <Brain className="h-4 w-4 mr-2" />
              <span className="font-medium">🚀 {t('advancedFeatures') || 'Advanced AI Features'}</span>
              <Badge variant="secondary" className="ml-auto">NEW</Badge>
            </Button>
            
            {activeSection === 'advanced' && (
              <div className="ml-4 border-l-2 border-accent pl-4 max-h-96 overflow-y-auto">
                <AdvancedFeatures />
              </div>
            )}
          </div>

          <Separator />

          {/* Bee Education Hub */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => setActiveSection(activeSection === 'education' ? null : 'education')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="font-medium">🎓 {t('educationHub') || 'Bee Education Hub'}</span>
              <Badge variant="secondary" className="ml-auto">{t('learn') || 'Learn'}</Badge>
            </Button>
            
            {activeSection === 'education' && (
              <div className="ml-4 border-l-2 border-accent pl-4 max-h-96 overflow-y-auto">
                <BeeEducationHub />
              </div>
            )}
          </div>

          <Separator />

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Menu className="h-5 w-5" />
              {t('menu') || 'Menu'}
            </h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setActiveSection(activeSection === 'accessibility' ? null : 'accessibility');
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                {t('systemStatus') || 'System Status & Help'}
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setActiveSection(activeSection === 'testing' ? null : 'testing');
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                MVP System Tests
                <Badge variant="secondary" className="ml-auto">Test</Badge>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setActiveSection(activeSection === 'technical' ? null : 'technical');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Technical Specifications
                <Badge variant="secondary" className="ml-auto">Specs</Badge>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <Link to="/technical-details">
                  <Settings className="h-4 w-4 mr-2" />
                  🔬 Technical Details
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <Link to="/dashboard">
                  <Zap className="h-4 w-4 mr-2" />
                  {t('dashboard') || 'System Dashboard'}
                </Link>
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
                {t('visitLapipa') || 'Visit Lapipa.io'}
              </Button>
              
               <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  window.location.reload();
                  setIsOpen(false);
                }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('refreshApp') || 'Refresh App'}
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

          {/* System Testing Interface */}
          {activeSection === 'testing' && (
            <div className="fixed inset-0 bg-background z-50 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">MVP System Testing</h2>
                  <Button variant="outline" onClick={() => setActiveSection(null)}>
                    ✕
                  </Button>
                </div>
                <SystemTestStatus />
              </div>
            </div>
          )}

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

          {/* Technical Specifications */}
          {activeSection === 'technical' && (
            <div className="fixed inset-0 bg-background z-50 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Technical Specifications</h2>
                  <Button variant="outline" onClick={() => setActiveSection(null)}>
                    ✕
                  </Button>
                </div>
                <TechnicalSpecs />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
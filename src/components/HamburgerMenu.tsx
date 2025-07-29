import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ExternalLink, Info } from 'lucide-react';

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="p-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Menu
            </h3>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              asChild
            >
              <a href="https://lapipa.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Lapipa.io
              </a>
            </Button>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              About Dory
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-3 animate-flower-sway">🌻</div>
                <h4 className="text-xl font-bold mb-2">Meet Dory</h4>
                <p className="text-sm text-muted-foreground">
                  Your friendly bee from BeeCrazy Garden World!
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
                <h5 className="font-semibold mb-2 text-sm">🐝 What can Dory help with?</h5>
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
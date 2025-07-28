import React, { useState } from 'react';
import { DoryChat } from './DoryChat';
import { VoiceChat } from './VoiceChat';
import { FollowDoryModal } from './FollowDoryModal';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, Phone, Info, Expand, Shrink, Heart, UserPlus } from 'lucide-react';

export const DoryInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-nature safe-area-top safe-area-bottom ${isFullscreen ? 'fixed inset-0 z-50' : 'p-2 sm:p-4'}`}>
      <div className={`${isFullscreen ? 'h-full flex flex-col' : 'max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto'}`}>
        {/* Header - Mobile Optimized */}
        <div className={`text-center ${isFullscreen ? 'mb-2 sm:mb-4' : 'mb-4 sm:mb-6'}`}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="relative flex sm:block">
              <div className="text-4xl sm:text-6xl animate-bee-bounce">🐝</div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-lg sm:text-2xl animate-flower-sway">🌻</div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-bee bg-clip-text text-transparent">
                Dory de los Huertos
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                ¡Buzztastical! 🐝✨ Garden Bee
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
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
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                {isFullscreen ? <Shrink className="h-3 w-3 sm:h-4 sm:w-4" /> : <Expand className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
            <Badge variant="secondary" className="animate-flower-sway text-xs">
              <span className="hidden xs:inline">🌻 </span>Garden
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway text-xs">
              <span className="hidden xs:inline">🎨 </span>Activities
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway text-xs">
              <span className="hidden xs:inline">🗣️ </span>Voice
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway text-xs">
              <span className="hidden xs:inline">👨‍👩‍👧‍👦 </span>Family
            </Badge>
          </div>
        </div>

        {/* Main Interface - Mobile Optimized */}
        <Card className={`shadow-honey border border-border/50 bg-card/95 backdrop-blur ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className={`grid w-full grid-cols-3 bg-muted/50 ${isFullscreen ? 'flex-shrink-0' : ''} p-1`}>
                <TabsTrigger value="chat" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Chat</span>
                  <span className="xs:hidden">💬</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Voice</span>
                  <span className="xs:hidden">🎤</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">About</span>
                  <span className="xs:hidden">ℹ️</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[70vh] sm:h-[600px] max-h-[800px]'}`}>
                  <DoryChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="voice" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[70vh] sm:h-[600px] max-h-[800px]'}`}>
                  <VoiceChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="about" className="m-0 p-3 sm:p-6 max-h-[70vh] overflow-y-auto scroll-area">
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-flower-sway">🌻</div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Meet Dory</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Your friendly bilingual bee from BeeCrazy Garden World!
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                    <Card className="p-3 sm:p-4 bg-secondary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                        🇪🇸 Spanish Features
                      </h4>
                      <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                        <li>• Natural Spanish conversations</li>
                        <li>• Mexican cultural context</li>
                        <li>• Nature vocabulary in Spanish</li>
                        <li>• Educational content</li>
                      </ul>
                    </Card>

                    <Card className="p-3 sm:p-4 bg-secondary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                        🇺🇸 English Features
                      </h4>
                      <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                        <li>• Fluent English responses</li>
                        <li>• Nature guide expertise</li>
                        <li>• Environmental education</li>
                        <li>• Interactive learning</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="text-center bg-accent/20 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">🐝 What can Dory help with?</h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer - Mobile Optimized */}
        <div className="text-center mt-3 sm:mt-6 text-xs sm:text-sm text-muted-foreground px-2">
          <p>
            BeeCrazy Garden World! • Built with ❤️ for families everywhere
          </p>
        </div>
      </div>
    </div>
  );
};
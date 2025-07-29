import React, { useState } from 'react';
import { DoryChat } from './DoryChat';
import { ShareButtons } from './ShareButtons';
import { VoiceChat } from './VoiceChat';
import { FollowDoryModal } from './FollowDoryModal';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, Phone, Expand, Shrink, Heart, UserPlus } from 'lucide-react';

export const DoryInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Flying Bees Background - More bees and bumblebees */}
      <div className="flying-bee flying-bee-1 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-2 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-3 animate-tiny-bee-zigzag">🐝</div>
      <div className="flying-bee flying-bee-4 animate-tiny-bee-loop">🐝</div>
      <div className="flying-bee flying-bee-5 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-6 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-7 animate-bee-to-garden">🐝</div>
      <div className="flying-bee flying-bee-8 animate-bee-from-garden">🐝</div>
      <div className="flying-bee flying-bee-9 animate-bee-garden-visit">🐝</div>
      <div className="flying-bee flying-bee-10 animate-bee-to-garden">🐝</div>
      
      {/* More bees */}
      <div className="flying-bee flying-bee-11 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-12 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-13 animate-tiny-bee-zigzag">🐝</div>
      <div className="flying-bee flying-bee-14 animate-tiny-bee-loop">🐝</div>
      
      {/* Bumblebees - larger and fluffier */}
      <div className="flying-bee flying-bumblebee-1 animate-bumblebee-bumble">🐝</div>
      <div className="flying-bee flying-bumblebee-2 animate-bumblebee-bumble">🐝</div>
      <div className="flying-bee flying-bumblebee-3 animate-bumblebee-bumble">🐝</div>
      
      <div className={`min-h-screen bg-gradient-nature safe-area-top safe-area-bottom flex items-center justify-center ${isFullscreen ? 'fixed inset-0 z-50' : 'p-2 sm:p-4 pt-32'}`}>
      <div className={`${isFullscreen ? 'h-full w-full flex flex-col' : 'max-w-md sm:max-w-2xl lg:max-w-4xl w-full mx-auto'}`}>

        {/* Fullscreen Toggle */}
        {!isFullscreen && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Expand className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Shrink className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}

        {/* Main Interface - Mobile Optimized */}
        <Card className={`shadow-honey border border-border/30 bg-card/70 backdrop-blur ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className={`grid w-full grid-cols-2 bg-muted/50 ${isFullscreen ? 'flex-shrink-0' : ''} p-1`}>
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
              </TabsList>

              <TabsContent value="chat" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'min-h-[300px] max-h-[70vh]'}`}>
                  <DoryChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="voice" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[70vh] sm:h-[600px] max-h-[800px]'}`}>
                  <VoiceChat className="h-full" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};
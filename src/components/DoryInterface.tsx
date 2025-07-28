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
    <div className={`min-h-screen bg-gradient-nature ${isFullscreen ? 'fixed inset-0 z-50' : 'p-4'}`}>
      <div className={`${isFullscreen ? 'h-full flex flex-col' : 'max-w-4xl mx-auto'}`}>
        {/* Header */}
        <div className={`text-center ${isFullscreen ? 'mb-4' : 'mb-6'}`}>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="relative">
              <div className="text-6xl animate-bee-bounce">🐝</div>
              <div className="absolute -top-2 -right-2 text-2xl animate-flower-sway">🌻</div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-bee bg-clip-text text-transparent">
                Dory de los Huertos
              </h1>
              <p className="text-lg text-muted-foreground">
                ¡Buzztastical! 🐝✨ Garden Bee • Abeja de los Jardines
              </p>
              <p className="text-sm text-muted-foreground">
                Warm, joyful, eco-educational companion
              </p>
            </div>
            <div className="flex gap-2">
              <FollowDoryModal>
                <Button variant="default" className="animate-pulse">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow Dory!
                </Button>
              </FollowDoryModal>
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="icon"
              >
                {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="animate-flower-sway">
              🌻 Garden Guide
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway">
              🎨 Sora Visuals
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway">
              🗣️ Voice Chat
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway">
              🍯 Eco-Education
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Card className={`shadow-honey border-2 border-border/50 bg-card/95 backdrop-blur ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className={`grid w-full grid-cols-3 bg-muted/50 ${isFullscreen ? 'flex-shrink-0' : ''}`}>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[600px]'}`}>
                  <DoryChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="voice" className={`m-0 ${isFullscreen ? 'flex-1' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : 'h-[600px]'}`}>
                  <VoiceChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="about" className="m-0 p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4 animate-flower-sway">🌻</div>
                    <h3 className="text-2xl font-bold mb-2">Meet Dory</h3>
                    <p className="text-muted-foreground">
                      Your friendly bilingual bee assistant from La Pipa world
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4 bg-secondary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        🇪🇸 Spanish Features
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Natural Spanish conversations</li>
                        <li>• Mexican cultural context</li>
                        <li>• Nature vocabulary in Spanish</li>
                        <li>• Educational content</li>
                      </ul>
                    </Card>

                    <Card className="p-4 bg-secondary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        🇺🇸 English Features
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Fluent English responses</li>
                        <li>• Nature guide expertise</li>
                        <li>• Environmental education</li>
                        <li>• Interactive learning</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="text-center bg-accent/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🐝 What can Dory help with?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
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

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Powered by OpenAI GPT-4o • Built with ❤️ for La Pipa world
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { DoryChat } from './DoryChat';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, Phone, Info } from 'lucide-react';

export const DoryInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-mountain bg-cover bg-center bg-fixed p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-6xl animate-bee-bounce">🐝</div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-bee bg-clip-text text-transparent">
                Dory la Abeja Hacendosa
              </h1>
              <p className="text-lg text-muted-foreground">
                Your bilingual nature guide • Tu guía bilingüe de la naturaleza
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="animate-flower-sway">
              🌸 Bilingual Assistant
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway">
              🌿 Nature Expert
            </Badge>
            <Badge variant="secondary" className="animate-flower-sway">
              🍯 AI Powered
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Card className="shadow-honey border-2 border-border/50 bg-card/95 backdrop-blur">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
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

              <TabsContent value="chat" className="m-0">
                <div className="h-[600px]">
                  <DoryChat className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="voice" className="m-0 p-6">
                <div className="text-center space-y-6">
                  <div className="text-4xl animate-bee-bounce">🎙️</div>
                  <h3 className="text-2xl font-bold">Voice Chat with Dory</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Have a real-time conversation with Dory! She speaks both Spanish and English fluently.
                  </p>
                  <div className="space-y-4">
                    <Button size="lg" className="bg-gradient-bee hover:opacity-90">
                      <Phone className="h-5 w-5 mr-2" />
                      Start Voice Chat
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      🎯 Click to begin • Perfect for language practice
                    </p>
                  </div>
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
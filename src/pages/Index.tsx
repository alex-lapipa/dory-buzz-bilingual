import React, { useState } from 'react';
import { UnifiedMochiInterface } from '@/components/UnifiedMochiInterface';
import { MochiInterface } from '@/components/MochiInterface';
import { SystemStatusIndicator } from '@/components/SystemStatusIndicator';
import { FloatingGarden } from '@/components/FloatingGarden';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  GraduationCap, 
  Settings, 
  BarChart3,
  Leaf,
  Heart,
  MessageCircle,
  Mic,
  Image,
  Video,
  Zap
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unified');

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Background Elements */}
      <FloatingGarden />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl animate-bee-bounce">🐝</span>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                BeeCrazy Garden World
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-2">
                Your unified AI garden companion powered by advanced AI systems
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Multi-AI Powered
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <BarChart3 className="h-3 w-3 mr-1" />
              Advanced Analytics
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Heart className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
        </div>

        {/* System Status */}
        <div className="flex justify-center">
          <SystemStatusIndicator />
        </div>

        {/* Main Interface with Tabs */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="unified" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Unified
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="voice" className="text-xs">
                  <Mic className="h-3 w-3 mr-1" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="generate" className="text-xs">
                  <Image className="h-3 w-3 mr-1" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="text-xs">
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="unified">
                <UnifiedMochiInterface />
              </TabsContent>
              
              <TabsContent value="chat">
                <MochiInterface activeTab="chat" />
              </TabsContent>
              
              <TabsContent value="voice">
                <MochiInterface activeTab="voice" />
              </TabsContent>
              
              <TabsContent value="generate">
                <MochiInterface activeTab="generate" />
              </TabsContent>
              
              <TabsContent value="video">
                <MochiInterface activeTab="video" />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/learning-hub')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Learning Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore bee facts and gardening knowledge with AI-powered learning tools.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your garden progress, analytics, and personalized insights.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
            // Show coming soon toast
            import('@/hooks/use-toast').then(({ toast }) => {
              toast({
                title: "🌱 Coming Soon!",
                description: "Garden tools are being developed. Stay tuned!",
              });
            });
          }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-purple-600" />
                Garden Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access advanced gardening tools, plant identification, and care guides.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Leaf className="h-4 w-4" />
            Powered by advanced AI technology for natural learning
            <Leaf className="h-4 w-4" />
          </p>
          <p className="mt-1">
            {user ? `Welcome back, ${user.email}!` : 'Sign in to save your garden progress'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

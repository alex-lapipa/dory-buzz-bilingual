import React, { useState } from 'react';
import { UnifiedMochiInterface } from '@/components/UnifiedMochiInterface';
import { VoiceFirstInterface } from '@/components/VoiceFirstInterface';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import MochiVideo from '@/components/MochiVideo';
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
  const [activeTab, setActiveTab] = useState('voice'); // Default to voice for mobile

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Reduced background elements for mobile performance */}
      <div className="absolute inset-0 opacity-30">
        <FloatingGarden />
      </div>
      
      {/* Mobile-First Content */}
      <div className="relative z-10 container mx-auto px-3 py-4 space-y-4">
        {/* Mobile Header - Compact */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl animate-bounce">🐝</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                MochiBee Garden
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Your outdoor AI garden assistant
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Interface */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 h-12">
              <TabsTrigger value="voice" className="text-sm font-semibold">
                <Mic className="h-4 w-4 mr-2" />
                Voice Chat
              </TabsTrigger>
              <TabsTrigger value="unified" className="text-sm font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                All Tools
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-sm font-semibold">
                <MessageCircle className="h-4 w-4 mr-2" />
                Text Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="voice" className="mt-0">
              <VoiceFirstInterface />
            </TabsContent>
            
            <TabsContent value="unified" className="mt-0">
              <UnifiedMochiInterface />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <MochiInterface activeTab="chat" />
            </TabsContent>
          </Tabs>
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

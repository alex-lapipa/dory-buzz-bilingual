import React, { useState } from 'react';
import { MochiVoiceInterface } from '@/components/MochiVoiceInterface';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BarChart3,
  Leaf,
  MessageCircle,
  Mic
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('voice'); // Default to voice for mobile

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Optimized background elements */}
      <div className="absolute inset-0 opacity-20">
        <FloatingGarden />
      </div>
      
      {/* Mobile-First Content with consistent spacing */}
      <div className="relative z-10 content-spacing min-h-screen">
        {/* Mobile Hero Section - Compact and centered */}
        <div className="text-center space-y-mobile-lg mb-mobile-2xl">
          <div className="flex items-center justify-center gap-mobile-md">
            <span className="text-4xl md:text-5xl lg:text-6xl animate-bounce">🐝</span>
            <div className="text-left">
              <h1 className="text-responsive-2xl md:text-responsive-3xl lg:text-responsive-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                MochiBee Garden
              </h1>
              <p className="text-responsive-sm md:text-responsive-base text-muted-foreground font-medium">
                Your AI garden assistant
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Chat Interface */}
        <div className="w-full max-w-4xl mx-auto mb-mobile-3xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-mobile-lg h-12 md:h-14">
              <TabsTrigger value="voice" className="text-responsive-sm font-semibold flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden xs:inline">Voice</span> Chat
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-responsive-sm font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden xs:inline">Text</span> Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="voice" className="mt-0">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-card">
                <MochiVoiceInterface />
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-card">
                <MochiInterface activeTab="chat" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions - Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-mobile-lg max-w-2xl mx-auto mb-mobile-2xl">
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 hover:scale-105" 
            onClick={() => navigate('/learning-hub')}
          >
            <CardHeader className="pb-mobile-md">
              <CardTitle className="flex items-center gap-2 text-responsive-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                🐝 Beeducation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-responsive-sm text-muted-foreground">
                Explore gardening knowledge with AI
              </p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 hover:scale-105" 
            onClick={() => navigate('/dashboard')}
          >
            <CardHeader className="pb-mobile-md">
              <CardTitle className="flex items-center gap-2 text-responsive-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-responsive-sm text-muted-foreground">
                View progress and insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Footer */}
        <div className="text-center">
          <p className="text-responsive-sm text-muted-foreground flex items-center justify-center gap-2">
            <Leaf className="h-4 w-4" />
            AI-powered garden assistant
            <Leaf className="h-4 w-4" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

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

        {/* Mobile-Optimized Interface - Chat Focused */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
              <TabsTrigger value="voice" className="text-sm font-semibold">
                <Mic className="h-4 w-4 mr-2" />
                Voice Chat
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-sm font-semibold">
                <MessageCircle className="h-4 w-4 mr-2" />
                Text Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="voice" className="mt-0">
              <MochiVoiceInterface />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <MochiInterface activeTab="chat" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/learning-hub')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                🐝 Beeducation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore gardening knowledge with AI
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
                View progress and insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
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

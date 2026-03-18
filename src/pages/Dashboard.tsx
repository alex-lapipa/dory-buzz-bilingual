import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/PageLayout';
import MasterControlPanel from '@/components/MasterControlPanel';
import { MochiInterface } from '@/components/MochiInterface';
import { BeeEducationHub } from '@/components/BeeEducationHub';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ConsentSettings } from '@/components/GDPRConsent';
import { 
  Zap, 
  MessageCircle, 
  BookOpen, 
  Camera, 
  Settings,
  Shield
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      {/* Dashboard Header */}
      <div className="mb-8 glass-card rounded-xl p-6 animate-bouncy-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
              BeeCrazy Garden World 🐝
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Your AI-Powered Garden Companion with Advanced Intelligence
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 animate-bee-flutter">
              <Zap className="h-3 w-3" />
              Production Ready
            </Badge>
          </div>
        </div>
      </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="control" className="gap-2">
              <Settings className="h-4 w-4" />
              Control Panel
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Mochi
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Learn & Explore
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <Camera className="h-4 w-4" />
              Create Images
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacy & GDPR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control">
            <MasterControlPanel />
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Chat with Mochi - Your AI Garden Guide
                  <Badge variant="default">GPT-4.1 + Claude 4</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MochiInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Educational Hub
                  <Badge variant="default">Interactive Learning</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BeeEducationHub />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  AI Image Generator
                  <Badge variant="default">GPT-Image-1 + DALL-E</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <ConsentSettings />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🐝 Powered by OpenAI GPT-4.1, Claude 4, ElevenLabs, and Supabase 🌻</p>
          <p className="mt-1">BeeCrazy Garden World - Where AI meets Nature Education</p>
        </div>
    </PageLayout>
  );
};

export default Dashboard;

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
import LunarCalendarWidget from '@/components/LunarCalendarWidget';
import { PollenSparkle, BeeChat, LeafBook, ButterflyFrame, GardenTools, BeehiveSafe, BeeFlying, SunflowerStar, NatureLeaf } from '@/components/icons';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      {/* Dashboard Header */}
      <div className="mb-8 glass-card rounded-xl p-6 animate-bouncy-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
              Mochi de los Huertos <BeeFlying className="h-6 w-6 inline" />
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Your Garden Companion with Advanced Intelligence <SunflowerStar className="h-4 w-4 inline" />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 animate-bee-flutter">
              <PollenSparkle className="h-3 w-3" />
              Garden Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Lunar Calendar Widget */}
      <div className="mb-6">
        <LunarCalendarWidget />
      </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="control" className="gap-2">
              <GardenTools className="h-4 w-4" />
              Control Panel
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <BeeChat className="h-4 w-4" />
              Chat with Mochi
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <LeafBook className="h-4 w-4" />
              Learn & Explore
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <ButterflyFrame className="h-4 w-4" />
              Create Images
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <BeehiveSafe className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control">
            <MasterControlPanel />
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BeeChat className="h-5 w-5 text-primary" />
                  Chat with Mochi - Your Garden Guide <BeeFlying className="h-4 w-4 inline" />
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
                  <LeafBook className="h-5 w-5 text-primary" />
                  Educational Hub <NatureLeaf className="h-4 w-4 inline" />
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
                  <ButterflyFrame className="h-5 w-5 text-primary" />
                  Garden Image Creator <ButterflyFrame className="h-4 w-4 inline" />
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
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p><BeeFlying className="h-4 w-4 inline" /> Powered by Nature & Intelligence <SunflowerStar className="h-4 w-4 inline" /></p>
          <p className="mt-1">Mochi de los Huertos - Where Nature meets Education</p>
        </div>
    </PageLayout>
  );
};

export default Dashboard;

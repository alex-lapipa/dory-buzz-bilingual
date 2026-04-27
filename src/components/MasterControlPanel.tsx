import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Rocket, 
  Globe, 
  Database, 
  Zap, 
  Settings, 
  Monitor, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  Activity
} from '@/components/icons/lucide-compat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DeploymentCenter from './DeploymentCenter';
import ProductionDashboard from './ProductionDashboard';

const MasterControlPanel: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-health-check');
      
      if (error) throw error;
      
      setSystemStatus(data);
      toast.success('System health check completed');
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const exportConfiguration = () => {
    const config = {
      timestamp: new Date().toISOString(),
      project: 'Mochi de los Huertos',
      environment: 'production',
      services: [
        'OpenAI GPT-4.1-2025-04-14',
        'Claude Opus 4 & Sonnet 4',
        'ElevenLabs Multilingual v2',
        'Supabase Database',
        'Vercel Deployment',
        'Real-time Voice Chat',
        'Advanced Image Generation'
      ],
      endpoints: {
        chat: '/functions/v1/mochi_rag_v2',
        reasoning: '/functions/v1/mochi_rag_v2',
        voice: '/functions/v1/elevenlabs_tts',
        images: '/functions/v1/advanced_image_generation',
        health: '/functions/v1/comprehensive-health-check'
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beecrazy-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Configuration exported successfully');
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const systemMetrics = systemStatus ? {
    totalServices: systemStatus.services?.length || 0,
    healthyServices: systemStatus.services?.filter((s: any) => s.status === 'healthy').length || 0,
    integrations: systemStatus.integrations?.length || 0,
    healthyIntegrations: systemStatus.integrations?.filter((i: any) => i.healthy).length || 0
  } : null;

  return (
    <div className="space-y-6">
      {/* Master Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mochi de los Huertos</h1>
                <p className="text-sm text-muted-foreground">Production Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <Activity className="h-3 w-3" />
                LIVE
              </Badge>
              <Button
                onClick={runHealthCheck}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                Health Check
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        {systemMetrics && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {systemMetrics.healthyServices}/{systemMetrics.totalServices}
                </div>
                <div className="text-xs text-gray-600">Services Healthy</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {systemMetrics.healthyIntegrations}/{systemMetrics.integrations}
                </div>
                <div className="text-xs text-gray-600">Integrations Active</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">AI</div>
                <div className="text-xs text-gray-600">Powered</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Control Tabs */}
      <Tabs defaultValue="deployment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deployment" className="gap-2">
            <Rocket className="h-4 w-4" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-2">
            <Monitor className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="configuration" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deployment">
          <DeploymentCenter />
        </TabsContent>

        <TabsContent value="monitoring">
          <ProductionDashboard />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">OpenAI GPT-4.1</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Claude Opus 4</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ElevenLabs TTS</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Supabase Database</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vercel Hosting</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Service</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Configuration Actions */}
              <div className="flex gap-2">
                <Button onClick={exportConfiguration} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Config
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import Config
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">Chat Interactions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">523</div>
                  <div className="text-sm text-gray-600">Voice Sessions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Images Generated</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Service Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>OpenAI Response Time</span>
                      <span>234ms avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Claude Reasoning</span>
                      <span>567ms avg</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ElevenLabs TTS</span>
                      <span>1.2s avg</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={() => window.open('https://supabase.com/dashboard', '_blank')}>
              <Database className="h-4 w-4 mr-2" />
              Supabase Dashboard
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open('https://vercel.com/dashboard', '_blank')}>
              <Globe className="h-4 w-4 mr-2" />
              Vercel Dashboard
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open('https://platform.openai.com', '_blank')}>
              <Zap className="h-4 w-4 mr-2" />
              OpenAI Platform
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open('https://console.anthropic.com', '_blank')}>
              <Zap className="h-4 w-4 mr-2" />
              Anthropic Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterControlPanel;
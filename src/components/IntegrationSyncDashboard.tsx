import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Cloud,
  Database,
  Bot,
  Mail,
  BarChart,
  Zap,
  Server,
  Activity
} from '@/components/icons/lucide-compat';

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
  lastSync: string;
  [key: string]: any;
}

interface SyncResults {
  timestamp: string;
  services: Record<string, ServiceStatus>;
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    down: number;
  };
}

export const IntegrationSyncDashboard: React.FC = () => {
  const { toast } = useToast();
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    loadLastSyncResults();
  }, []);

  const loadLastSyncResults = async () => {
    try {
      const { data, error } = await supabase
        .from('live_metrics')
        .select('*')
        .eq('metric_name', 'integration_sync')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSyncResults(data.metric_value as any);
        setLastSync(data.recorded_at);
      }
    } catch (error) {
      console.error('Error loading sync results:', error);
    }
  };

  const syncAllIntegrations = async (forceSync = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('integration_sync', {
        body: { forceSync }
      });

      if (error) throw error;

      setSyncResults(data.syncResults);
      setLastSync(new Date().toISOString());
      
      toast({
        title: "Sync Complete",
        description: data.message,
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync integrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (serviceName: string) => {
    const icons = {
      supabase: Database,
      openai: Bot,
      anthropic: Bot,
      elevenlabs: Zap,
      resend: Mail,
      vercel: Cloud,
      google_analytics: BarChart,
      health_metrics: Activity
    };
    const Icon = icons[serviceName as keyof typeof icons] || Server;
    return <Icon className="h-5 w-5" />;
  };

  const getServiceDisplayName = (serviceName: string) => {
    const names = {
      supabase: 'Supabase',
      openai: 'OpenAI',
      anthropic: 'Anthropic Claude',
      elevenlabs: 'ElevenLabs',
      resend: 'Resend',
      vercel: 'Vercel',
      google_analytics: 'Google Analytics',
      health_metrics: 'Health Metrics'
    };
    return names[serviceName as keyof typeof names] || serviceName;
  };

  const healthScore = syncResults 
    ? Math.round((syncResults.summary.healthy / syncResults.summary.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integration Sync Dashboard</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => syncAllIntegrations(false)} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Quick Sync
          </Button>
          <Button 
            onClick={() => syncAllIntegrations(true)} 
            disabled={loading}
          >
            <Zap className="h-4 w-4 mr-2" />
            Force Sync
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {syncResults && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Health</p>
                  <p className="text-2xl font-bold">{healthScore}%</p>
                  <Progress value={healthScore} className="mt-2" />
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Healthy Services</p>
                  <p className="text-2xl font-bold text-green-600">
                    {syncResults.summary.healthy}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Degraded</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {syncResults.summary.degraded}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Down</p>
                  <p className="text-2xl font-bold text-red-600">
                    {syncResults.summary.down}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          {lastSync && (
            <p className="text-sm text-gray-600">
              Last synced: {new Date(lastSync).toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!syncResults ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No sync data available</p>
              <Button onClick={() => syncAllIntegrations(false)} disabled={loading}>
                {loading ? 'Syncing...' : 'Run Initial Sync'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(syncResults.services).map(([serviceName, serviceData]) => (
                <div 
                  key={serviceName}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(serviceName)}
                      <h3 className="font-medium">
                        {getServiceDisplayName(serviceName)}
                      </h3>
                    </div>
                    {getStatusIcon(serviceData.status)}
                  </div>

                  <Badge className={getStatusColor(serviceData.status)}>
                    {serviceData.status.toUpperCase()}
                  </Badge>

                  {serviceData.responseTime && (
                    <p className="text-xs text-gray-600">
                      Response: {serviceData.responseTime}ms
                    </p>
                  )}

                  {serviceData.error && (
                    <p className="text-xs text-red-600 truncate" title={serviceData.error}>
                      Error: {serviceData.error}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    Last sync: {new Date(serviceData.lastSync).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
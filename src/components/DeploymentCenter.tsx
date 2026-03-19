import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Database, 
  Cpu, 
  Zap,
  Settings,
  Monitor,
  RefreshCw
} from '@/components/icons/lucide-compat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DeploymentService {
  service: string;
  name: string;
  endpoints: string[];
  status: 'healthy' | 'unhealthy' | 'error';
  timestamp: string;
  error?: string;
}

interface DeploymentStatus {
  deployment_id: string;
  environment: string;
  success: boolean;
  total_services: number;
  healthy_services: number;
  deployment_time_ms: number;
  services: DeploymentService[];
  configuration: {
    openai_configured: boolean;
    anthropic_configured: boolean;
    elevenlabs_configured: boolean;
    resend_configured: boolean;
    supabase_configured: boolean;
  };
  recommendations: string[];
}

const DeploymentCenter: React.FC = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'development' | 'staging' | 'production'>('production');
  const [selectedServices, setSelectedServices] = useState<string[]>(['all']);

  const serviceCategories = {
    'AI Services': ['openai', 'anthropic'],
    'Voice & Media': ['elevenlabs', 'voice_services', 'image_generation'],
    'Infrastructure': ['database', 'system_monitoring', 'email_services']
  };

  const runDeployment = async (services: string[] = ['all'], force = false) => {
    setIsDeploying(true);
    try {
      const { data, error } = await supabase.functions.invoke('unified_deployment', {
        body: {
          services: services,
          force_redeploy: force,
          environment: selectedEnvironment,
          user_id: 'deployment_user'
        }
      });

      if (error) throw error;

      setDeploymentStatus(data);
      
      if (data.success) {
        toast.success('🚀 Deployment Successful!', {
          description: `${data.healthy_services}/${data.total_services} services deployed successfully`
        });
      } else {
        toast.warning('⚠️ Deployment Completed with Issues', {
          description: `${data.healthy_services}/${data.total_services} services are healthy`
        });
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('❌ Deployment Failed', {
        description: 'Check console for details'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'unhealthy':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const healthPercentage = deploymentStatus 
    ? (deploymentStatus.healthy_services / deploymentStatus.total_services) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Deployment Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            BeeCrazy Garden World - Deployment Center
            <Badge variant={deploymentStatus?.success ? "default" : "secondary"}>
              {selectedEnvironment.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment & Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Environment</label>
              <select 
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value as any)}
                className="w-full p-2 border rounded-md"
                disabled={isDeploying}
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Services</label>
              <select 
                value={selectedServices[0]}
                onChange={(e) => setSelectedServices([e.target.value])}
                className="w-full p-2 border rounded-md"
                disabled={isDeploying}
              >
                <option value="all">All Services</option>
                <option value="openai">OpenAI Only</option>
                <option value="anthropic">Anthropic Only</option>
                <option value="elevenlabs">ElevenLabs Only</option>
                <option value="voice_services">Voice Services</option>
                <option value="system_monitoring">System Monitoring</option>
              </select>
            </div>
          </div>

          {/* Deployment Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => runDeployment(selectedServices)}
              disabled={isDeploying}
              className="gap-2"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Deploy Now
                </>
              )}
            </Button>
            <Button
              onClick={() => runDeployment(selectedServices, true)}
              disabled={isDeploying}
              variant="outline"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Force Redeploy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      {deploymentStatus && (
        <>
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Deployment Status
                </span>
                <Badge variant={deploymentStatus.success ? "default" : "destructive"}>
                  {deploymentStatus.success ? "SUCCESS" : "PARTIAL"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Overview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>System Health</span>
                  <span>{deploymentStatus.healthy_services}/{deploymentStatus.total_services} Services</span>
                </div>
                <Progress value={healthPercentage} className="h-2" />
              </div>

              {/* Deployment Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{deploymentStatus.healthy_services}</div>
                  <div className="text-xs text-gray-600">Healthy Services</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{deploymentStatus.deployment_time_ms}ms</div>
                  <div className="text-xs text-gray-600">Deploy Time</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{deploymentStatus.environment}</div>
                  <div className="text-xs text-gray-600">Environment</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.values(deploymentStatus.configuration).filter(Boolean).length}
                  </div>
                  <div className="text-xs text-gray-600">APIs Configured</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Service Health Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {deploymentStatus.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-gray-500">
                            {service.endpoints.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={service.status === 'healthy' ? "default" : "destructive"}>
                          {service.status.toUpperCase()}
                        </Badge>
                        {service.error && (
                          <div className="text-xs text-red-500 mt-1">{service.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(deploymentStatus.configuration).map(([key, configured]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium capitalize">{key.replace('_configured', '')}</span>
                    <Badge variant={configured ? "default" : "secondary"}>
                      {configured ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {deploymentStatus.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deploymentStatus.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => runDeployment(['openai'])}
              disabled={isDeploying}
            >
              Deploy AI Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => runDeployment(['elevenlabs'])}
              disabled={isDeploying}
            >
              Deploy Voice
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => runDeployment(['system_monitoring'])}
              disabled={isDeploying}
            >
              Deploy Monitoring
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => runDeployment(['all'], true)}
              disabled={isDeploying}
            >
              Full Redeploy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentCenter;
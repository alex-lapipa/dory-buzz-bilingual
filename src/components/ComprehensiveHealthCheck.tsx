import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Database,
  Bot,
  Mail,
  Globe,
  Mic,
  Image,
  Brain
} from '@/components/icons/lucide-compat';

interface HealthResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  timestamp: string;
}

interface HealthSummary {
  overallHealth: 'healthy' | 'unhealthy' | 'degraded';
  healthyServices: number;
  totalServices: number;
  healthPercentage: number;
  missingEnvironmentVariables: string[];
  beeCrazyGardenWorldReady: boolean;
  services: HealthResult[];
  recommendations: string[];
  timestamp: string;
}

export const ComprehensiveHealthCheck = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<HealthSummary | null>(null);
  const { toast } = useToast();

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Database')) return <Database className="h-4 w-4" />;
    if (serviceName.includes('OpenAI') || serviceName.includes('Chat')) return <Bot className="h-4 w-4" />;
    if (serviceName.includes('Claude') || serviceName.includes('Anthropic')) return <Brain className="h-4 w-4" />;
    if (serviceName.includes('Resend') || serviceName.includes('Email')) return <Mail className="h-4 w-4" />;
    if (serviceName.includes('Firecrawl')) return <Globe className="h-4 w-4" />;
    if (serviceName.includes('Voice') || serviceName.includes('ElevenLabs')) return <Mic className="h-4 w-4" />;
    if (serviceName.includes('Image')) return <Image className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      unhealthy: 'destructive',
      degraded: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const runHealthCheck = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-health-check');
      
      if (error) throw error;
      
      setResults(data);
      
      const statusMessage = data.beeCrazyGardenWorldReady 
        ? "🐝 All systems buzzing perfectly!"
        : `${data.healthyServices}/${data.totalServices} services healthy`;

      toast({
        title: "Health Check Complete",
        description: statusMessage,
        variant: data.overallHealth === 'healthy' ? 'default' : 'destructive'
      });
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to complete system health check",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            BeeCrazy Garden World - System Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runHealthCheck} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Health Check...' : 'Run Full System Check'}
            </Button>
            
            {results && (
              <div className="flex items-center gap-2">
                {getStatusIcon(results.overallHealth)}
                <span className="text-sm font-medium">
                  Overall Status: {getStatusBadge(results.overallHealth)}
                </span>
              </div>
            )}
          </div>

          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-500">
                      {results.healthyServices}/{results.totalServices}
                    </div>
                    <p className="text-sm text-muted-foreground">Services Healthy</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {results.healthPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">System Health</p>
                    <Progress value={results.healthPercentage} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {results.beeCrazyGardenWorldReady ? '🐝' : '⚠️'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {results.beeCrazyGardenWorldReady ? 'Ready to Buzz!' : 'Needs Attention'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {results.missingEnvironmentVariables.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-orange-500 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Missing API Keys
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {results.missingEnvironmentVariables.map((envVar) => (
                        <Badge key={envVar} variant="outline" className="justify-start">
                          {envVar}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Service Status Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.services.map((service) => (
                      <div
                        key={service.service}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {getServiceIcon(service.service)}
                          <div>
                            <div className="font-medium">{service.service}</div>
                            {service.error && (
                              <div className="text-sm text-red-500">{service.error}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {service.responseTime && (
                            <span className="text-sm text-muted-foreground">
                              {service.responseTime}ms
                            </span>
                          )}
                          {getStatusIcon(service.status)}
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {results.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-amber-500 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground text-center">
                Last updated: {new Date(results.timestamp).toLocaleString()}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
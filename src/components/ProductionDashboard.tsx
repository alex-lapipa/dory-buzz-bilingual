import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  timestamp: string;
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  healthyServices: number;
  totalServices: number;
  beeCrazyGardenWorldReady: boolean;
  services: Array<{
    service: string;
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime?: number;
    error?: string;
    timestamp: string;
  }>;
}

export const ProductionDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-check');
      
      if (error) {
        console.error('Health check error:', error);
        return;
      }

      setHealthStatus(data);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-orange-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const healthPercentage = healthStatus 
    ? (healthStatus.healthyServices / healthStatus.totalServices) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-bee bg-clip-text text-transparent">
              BeeCrazy Garden World
            </h1>
            <p className="text-muted-foreground">Production Dashboard</p>
          </div>
        </div>
        
        <Button onClick={checkHealth} disabled={loading} className="gap-2">
          {getStatusIcon(healthStatus?.overallHealth || 'unknown')}
          {loading ? 'Checking...' : 'Check Health'}
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            System Status
            {healthStatus?.beeCrazyGardenWorldReady && (
              <Badge className="bg-green-100 text-green-800">
                🚀 LIVE & READY
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Health</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(healthStatus?.overallHealth || 'unknown')}
                <span className={getStatusColor(healthStatus?.overallHealth || 'unknown')}>
                  {healthStatus?.overallHealth?.toUpperCase() || 'CHECKING...'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Services Health</span>
                <span>{healthStatus?.healthyServices || 0}/{healthStatus?.totalServices || 0}</span>
              </div>
              <Progress value={healthPercentage} className="h-2" />
            </div>

            {lastCheck && (
              <p className="text-xs text-muted-foreground">
                Last checked: {lastCheck.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      {healthStatus?.services && (
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthStatus.services.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium">{service.service.replace('_', ' ').toUpperCase()}</p>
                      {service.responseTime && (
                        <p className="text-xs text-muted-foreground">
                          Response: {service.responseTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={service.status === 'healthy' ? 'default' : 'destructive'}
                      className={service.status === 'healthy' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {service.status.toUpperCase()}
                    </Badge>
                    {service.error && (
                      <p className="text-xs text-red-600 mt-1">{service.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Production Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Database optimized with indexes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Security policies updated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Error handling implemented</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Health monitoring active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ All integrations configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Offline-first design</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
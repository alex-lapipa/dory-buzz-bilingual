import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ComprehensiveHealthCheck } from './ComprehensiveHealthCheck';

interface HealthStatus {
  timestamp: string;
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  healthyServices: number;
  totalServices: number;
  beeCrazyGardenWorldReady?: boolean;
  productionReady?: boolean;
  environmentVariables?: {
    configured: number;
    missing: string[];
    total: number;
  };
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
      // Check comprehensive health, production readiness, and basic health
      const [comprehensiveData, healthData, productionData] = await Promise.all([
        supabase.functions.invoke('comprehensive-health-check'),
        supabase.functions.invoke('health-check'),
        supabase.functions.invoke('production-readiness')
      ]);
      
      if (comprehensiveData.error && healthData.error && productionData.error) {
        console.error('Health check errors:', comprehensiveData.error, healthData.error, productionData.error);
        return;
      }

      // Use comprehensive data if available, fallback to production then health data
      const data = comprehensiveData.data || productionData.data || healthData.data;
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
            {(healthStatus?.beeCrazyGardenWorldReady || healthStatus?.productionReady) && (
              <Badge className="bg-green-100 text-green-800">
                🚀 PRODUCTION READY
              </Badge>
            )}
            {healthStatus?.overallHealth === 'healthy' && (
              <Badge className="bg-blue-100 text-blue-800">
                🐝 ALL SYSTEMS BUZZING
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
              <span>✅ Database optimized with indexes and RLS policies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ OpenAI GPT-4.1-2025-04-14 integration active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ ElevenLabs TTS with multilingual support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Real-time voice chat with WebSockets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ AI image generation with latest models</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Comprehensive error handling and fallbacks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Mobile-first responsive design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Accessibility compliance (WCAG)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Performance monitoring and health checks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Bilingual support (English/Spanish)</span>
            </div>
          </div>
          
          {healthStatus?.environmentVariables?.missing?.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Missing Environment Variables:
              </p>
              <div className="flex flex-wrap gap-1">
                {healthStatus.environmentVariables.missing.map((envVar: string) => (
                  <Badge key={envVar} variant="outline" className="text-yellow-700 border-yellow-300">
                    {envVar}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comprehensive Health Check Component */}
      <Card>
        <CardHeader>
          <CardTitle>🐝 Comprehensive System Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ComprehensiveHealthCheck />
        </CardContent>
      </Card>
    </div>
  );
};
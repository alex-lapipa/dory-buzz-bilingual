import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap, Brain, Image, Mic, MessageSquare, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationResult {
  service: string;
  model: string;
  status: 'pass' | 'fail' | 'warning';
  response_time?: number;
  error?: string;
  version?: string;
}

interface StatusCheckResponse {
  overall_status: 'healthy' | 'degraded' | 'critical';
  summary: {
    total_tests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  results: IntegrationResult[];
  updated_models: Record<string, string>;
  deprecated_removed: string[];
  timestamp: string;
}

export const IntegrationsStatusDashboard: React.FC = () => {
  const [status, setStatus] = useState<StatusCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const runStatusCheck = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('integrations_status_check');
      
      if (error) {
        throw error;
      }

      setStatus(data);
      setLastCheck(new Date().toLocaleString());
      
      if (data.overall_status === 'healthy') {
        toast.success('🎉 All integrations are updated and working!');
      } else if (data.overall_status === 'degraded') {
        toast.warning('⚠️ Some integrations need attention');
      } else {
        toast.error('❌ Critical integration issues detected');
      }
    } catch (error) {
      console.error('Status check failed:', error);
      toast.error('Failed to check integration status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runStatusCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getServiceIcon = (service: string) => {
    if (service.includes('Chat') || service.includes('GPT')) {
      return <MessageSquare className="h-4 w-4" />;
    } else if (service.includes('Reasoning')) {
      return <Brain className="h-4 w-4" />;
    } else if (service.includes('Image')) {
      return <Image className="h-4 w-4" />;
    } else if (service.includes('TTS') || service.includes('ElevenLabs')) {
      return <Volume2 className="h-4 w-4" />;
    } else if (service.includes('Claude')) {
      return <Zap className="h-4 w-4" />;
    }
    return <Mic className="h-4 w-4" />;
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-saira font-bold text-primary mb-2">
          🚀 AI Integrations Status
        </h2>
        <p className="text-muted-foreground">
          All integrations updated to latest models and APIs
        </p>
      </div>

      {/* Overall Status Card */}
      {status && (
        <Card className={`border-2 ${getOverallStatusColor(status.overall_status)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getStatusIcon(status.overall_status === 'healthy' ? 'pass' : 
                             status.overall_status === 'degraded' ? 'warning' : 'fail')}
                Overall Status: {status.overall_status.charAt(0).toUpperCase() + status.overall_status.slice(1)}
              </span>
              <Button 
                onClick={runStatusCheck} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {status.summary.passed}
                </div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {status.summary.warnings}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {status.summary.failed}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {status.summary.total_tests}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Updated Models */}
      {status?.updated_models && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              ✨ Latest Models Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(status.updated_models).map(([service, model]) => (
                <div key={service} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service)}
                    <span className="font-medium">{service}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {model}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Test Results */}
      {status?.results && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {status.results.map((result, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    {getServiceIcon(result.service)}
                    <div>
                      <div className="font-medium">{result.service}</div>
                      <div className="text-sm text-muted-foreground">
                        Model: {result.model}
                        {result.version && (
                          <Badge variant="outline" className="ml-2">
                            v{result.version}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {result.response_time && (
                      <div className="text-sm text-muted-foreground">
                        {result.response_time}ms
                      </div>
                    )}
                    {result.error && (
                      <div className="text-xs text-red-600 max-w-xs truncate">
                        {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deprecated Models Removed */}
      {status?.deprecated_removed && status.deprecated_removed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              🗑️ Deprecated Models Removed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {status.deprecated_removed.map((model, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-700 line-through">{model}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {lastCheck && (
        <div className="text-center text-sm text-muted-foreground">
          Last checked: {lastCheck}
        </div>
      )}
    </div>
  );
};
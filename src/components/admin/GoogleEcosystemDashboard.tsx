import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Key, Cloud, Bot, Shield, ExternalLink, CheckCircle2, AlertCircle, Loader2, RefreshCw, Zap, Clock } from '@/components/icons/lucide-compat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ServiceStatusType = 'connected' | 'warning' | 'disconnected' | 'checking';

interface ServiceCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: ServiceStatusType;
  detail: string;
  latency_ms: number | null;
  consoleUrl: string;
}

interface HealthResult {
  service: string;
  status: 'ok' | 'error';
  latency_ms: number;
  detail: string;
}

const INITIAL_SERVICES: ServiceCard[] = [
  {
    id: 'gemini',
    name: 'Google AI Studio (Gemini)',
    description: 'Primary model — Gemini 2.5 Flash for MochiBee chat',
    icon: Bot,
    status: 'checking',
    detail: 'Pinging Gemini API...',
    latency_ms: null,
    consoleUrl: 'https://aistudio.google.com/',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Fallback model — Claude Sonnet 4 reasoning engine',
    icon: Shield,
    status: 'checking',
    detail: 'Pinging Anthropic API...',
    latency_ms: null,
    consoleUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    description: 'Final fallback + embeddings (text-embedding-3-small)',
    icon: Cloud,
    status: 'checking',
    detail: 'Pinging OpenAI API...',
    latency_ms: null,
    consoleUrl: 'https://platform.openai.com/',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice',
    description: 'Mochi TTS — voice synthesis for bilingual responses',
    icon: Zap,
    status: 'checking',
    detail: 'Pinging ElevenLabs API...',
    latency_ms: null,
    consoleUrl: 'https://elevenlabs.io/',
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    description: 'Grok integration for extended capabilities',
    icon: Globe,
    status: 'checking',
    detail: 'Pinging xAI API...',
    latency_ms: null,
    consoleUrl: 'https://console.x.ai/',
  },
];

const GoogleEcosystemDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceCard[]>(INITIAL_SERVICES);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const { toast } = useToast();

  const runHealthChecks = useCallback(async () => {
    setChecking(true);
    // Reset all to checking
    setServices((prev) => prev.map((s) => ({ ...s, status: 'checking' as ServiceStatusType, detail: `Pinging ${s.name}...`, latency_ms: null })));

    try {
      const { data, error } = await supabase.functions.invoke('google_health_ping', {
        body: { services: ['gemini', 'anthropic', 'openai', 'elevenlabs', 'xai'] },
      });

      if (error) throw error;

      const results: HealthResult[] = data?.results ?? [];
      setLastChecked(data?.checked_at ?? new Date().toISOString());

      setServices((prev) =>
        prev.map((svc) => {
          const result = results.find((r) => r.service === svc.id);
          if (!result) return { ...svc, status: 'disconnected' as ServiceStatusType, detail: 'No response from health check' };
          return {
            ...svc,
            status: result.status === 'ok' ? ('connected' as ServiceStatusType) : ('warning' as ServiceStatusType),
            detail: result.detail,
            latency_ms: result.latency_ms,
          };
        })
      );

      const okCount = results.filter((r) => r.status === 'ok').length;
      toast({
        title: '🐝 Health Check Complete',
        description: `${okCount}/${results.length} services operational`,
      });
    } catch (err) {
      console.error('Health check failed:', err);
      setServices((prev) => prev.map((s) => ({ ...s, status: 'disconnected' as ServiceStatusType, detail: 'Health check request failed' })));
      toast({
        title: 'Health Check Failed',
        description: 'Could not reach the health check endpoint.',
        variant: 'destructive',
      });
    } finally {
      setChecking(false);
    }
  }, [toast]);

  useEffect(() => {
    runHealthChecks();
  }, [runHealthChecks]);

  const statusBadge = (status: ServiceStatusType) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
            <CheckCircle2 className="h-3 w-3" /> OK
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="border-destructive/30 text-destructive gap-1">
            <AlertCircle className="h-3 w-3" /> Issue
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" /> Down
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Checking
          </Badge>
        );
    }
  };

  const latencyBadge = (ms: number | null) => {
    if (ms === null) return null;
    const color = ms < 500 ? 'text-primary' : ms < 1500 ? 'text-foreground' : 'text-destructive';
    return (
      <span className={`text-[10px] font-mono ${color} flex items-center gap-0.5`}>
        <Clock className="h-2.5 w-2.5" />
        {ms}ms
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Google Ecosystem & API Health
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Part of the Lawton / idiomas.io / LAWTON Next / MiraMonte edtech platform
          </p>
          {lastChecked && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Last checked: {new Date(lastChecked).toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={runHealthChecks} disabled={checking} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Run Health Check'}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              GCP Console
            </a>
          </Button>
        </div>
      </div>

      {/* Service cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{service.name}</CardTitle>
                      {latencyBadge(service.latency_ms)}
                    </div>
                  </div>
                  {statusBadge(service.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{service.description}</p>
                <p className="text-[11px] text-muted-foreground/80 font-mono">{service.detail}</p>
                <Button variant="ghost" size="sm" asChild className="h-6 text-[10px] px-1.5">
                  <a href={service.consoleUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                    <ExternalLink className="h-2.5 w-2.5" />
                    Console
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Multi-Model Orchestrator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Multi-Model Orchestrator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            MochiBee's chat backend uses a cascading multi-model architecture. If the primary model fails, it automatically falls back to the next provider.
          </p>
          <div className="space-y-2">
            {[
              { priority: 1, provider: 'Google Gemini', model: 'gemini-2.5-flash', role: 'Primary', id: 'gemini' },
              { priority: 2, provider: 'Anthropic Claude', model: 'claude-sonnet-4', role: 'Fallback', id: 'anthropic' },
              { priority: 3, provider: 'OpenAI GPT', model: 'gpt-4.1', role: 'Final fallback', id: 'openai' },
            ].map((m) => {
              const svc = services.find((s) => s.id === m.id);
              return (
                <div key={m.priority} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{m.priority}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.provider}</p>
                    <p className="text-xs text-muted-foreground font-mono">{m.model}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {svc && latencyBadge(svc.latency_ms)}
                    {svc && statusBadge(svc.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configured Secrets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Configured Secrets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { name: 'GOOGLE_AI_STUDIO', desc: 'Gemini API key — primary model', id: 'gemini' },
              { name: 'ANTHROPIC_API_KEY', desc: 'Claude — fallback model', id: 'anthropic' },
              { name: 'OPENAI_API_KEY', desc: 'GPT — final fallback + embeddings', id: 'openai' },
              { name: 'XAI_API_KEY', desc: 'Grok integration', id: 'xai' },
              { name: 'ELEVENLABS_API_KEY', desc: 'Voice synthesis (Mochi TTS)', id: 'elevenlabs' },
              { name: 'RESEND_API_KEY', desc: 'Email service', id: '' },
            ].map((secret) => {
              const svc = services.find((s) => s.id === secret.id);
              const isOk = !secret.id || svc?.status === 'connected';
              return (
                <div key={secret.name} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  {isOk ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium truncate">{secret.name}</p>
                    <p className="text-[10px] text-muted-foreground">{secret.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleEcosystemDashboard;

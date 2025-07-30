import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  timestamp: string;
  details?: any;
}

interface HealthRequest {
  scope?: 'basic' | 'comprehensive' | 'production' | 'integrations';
  services?: string[];
  timeout?: number;
}

const SERVICE_CONFIGS = {
  // Core Infrastructure
  supabase: {
    name: 'Supabase Database',
    test: async (supabase: any) => {
      const { data, error } = await supabase.from('bee_facts').select('count').limit(1);
      if (error) throw error;
      return { connection: 'active', records: data?.length || 0 };
    }
  },
  
  // AI Platforms
  openai: {
    name: 'OpenAI API',
    test: async () => {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { models: data.data?.length || 0 };
    }
  },
  
  anthropic: {
    name: 'Anthropic Claude',
    test: async () => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }]
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { status: 'connected' };
    }
  },
  
  xai: {
    name: 'xAI Grok',
    test: async () => {
      const response = await fetch('https://api.x.ai/v1/models', {
        headers: { 'Authorization': `Bearer ${Deno.env.get('XAI_API_KEY')}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { models: data.data?.length || 0 };
    }
  },
  
  // Voice & Media
  elevenlabs: {
    name: 'ElevenLabs TTS',
    test: async () => {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { voices: data.voices?.length || 0 };
    }
  },
  
  // Utilities
  resend: {
    name: 'Resend Email',
    test: async () => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { status: 'connected' };
    }
  },
  
  firecrawl: {
    name: 'Firecrawl API',
    test: async () => {
      const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('mochibeeFIRECRAWL')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: 'https://example.com' })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { status: 'connected' };
    }
  },
  
  // Edge Functions (select core ones)
  unified_chat: {
    name: 'Unified Chat Service',
    test: async (supabase: any) => {
      const { data, error } = await supabase.functions.invoke('unified_chat_orchestrator', {
        body: { message: 'health check', specialty: 'general' }
      });
      if (error) throw error;
      return { response: 'functional' };
    }
  },
  
  unified_voice: {
    name: 'Unified Voice Hub',
    test: async (supabase: any) => {
      const { data, error } = await supabase.functions.invoke('unified_voice_hub', {
        body: { operation: 'tts', text: 'test', provider: 'auto' }
      });
      if (error) throw error;
      return { response: 'functional' };
    }
  }
};

const HEALTH_SCOPES = {
  basic: ['supabase', 'openai'],
  comprehensive: Object.keys(SERVICE_CONFIGS),
  production: ['supabase', 'openai', 'anthropic', 'elevenlabs', 'unified_chat'],
  integrations: ['openai', 'anthropic', 'xai', 'elevenlabs', 'resend', 'firecrawl']
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      scope = 'comprehensive',
      services,
      timeout = 30000
    }: HealthRequest = await req.json().catch(() => ({}));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const servicesToTest = services || HEALTH_SCOPES[scope] || HEALTH_SCOPES.comprehensive;
    const results: HealthCheck[] = [];
    const startTime = Date.now();

    console.log(`Running unified health check for scope: ${scope}`);

    // Run health checks in parallel with timeout
    const healthPromises = servicesToTest.map(async (serviceKey): Promise<HealthCheck> => {
      const service = SERVICE_CONFIGS[serviceKey as keyof typeof SERVICE_CONFIGS];
      if (!service) {
        return {
          service: serviceKey,
          status: 'unhealthy',
          error: 'Service configuration not found',
          timestamp: new Date().toISOString()
        };
      }

      const serviceStartTime = Date.now();
      try {
        const details = await Promise.race([
          service.test(supabase),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout / servicesToTest.length)
          )
        ]);

        const responseTime = Date.now() - serviceStartTime;
        
        return {
          service: service.name,
          status: responseTime > 5000 ? 'degraded' : 'healthy',
          responseTime,
          timestamp: new Date().toISOString(),
          details
        };
      } catch (error) {
        return {
          service: service.name,
          status: 'unhealthy',
          responseTime: Date.now() - serviceStartTime,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    });

    const healthResults = await Promise.allSettled(healthPromises);
    
    // Process results
    healthResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          service: servicesToTest[index],
          status: 'unhealthy',
          error: 'Health check failed',
          timestamp: new Date().toISOString()
        });
      }
    });

    const totalTime = Date.now() - startTime;
    
    // Calculate overall health
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const degradedCount = results.filter(r => r.status === 'degraded').length;
    const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
    
    let overallStatus = 'healthy';
    if (unhealthyCount > 0) {
      overallStatus = unhealthyCount > results.length / 2 ? 'critical' : 'degraded';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    }

    // Log to system_health table
    for (const result of results) {
      await supabase.from('system_health').insert({
        service_name: result.service,
        status: result.status,
        response_time_ms: result.responseTime,
        error_message: result.error,
        metadata: {
          scope: scope,
          details: result.details,
          timestamp: result.timestamp
        }
      });
    }

    // Log summary to mochi_integrations
    await supabase.from('mochi_integrations').insert({
      platform: 'unified_health',
      model: scope,
      message_length: servicesToTest.length,
      response_time_ms: totalTime,
      success: overallStatus !== 'critical',
      options: {
        scope: scope,
        overall_status: overallStatus,
        healthy: healthyCount,
        degraded: degradedCount,
        unhealthy: unhealthyCount,
        services_tested: servicesToTest.length
      }
    });

    const summary = {
      overall_status: overallStatus,
      scope: scope,
      total_checks: results.length,
      healthy: healthyCount,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
      response_time: totalTime,
      timestamp: new Date().toISOString(),
      services: results,
      recommendations: generateRecommendations(results, overallStatus)
    };

    console.log(`Unified health check completed: ${overallStatus} (${totalTime}ms)`);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unified health monitor error:', error);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'unified_health',
      model: 'error',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ 
      overall_status: 'critical',
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateRecommendations(results: HealthCheck[], overallStatus: string): string[] {
  const recommendations: string[] = [];
  
  const unhealthyServices = results.filter(r => r.status === 'unhealthy');
  const slowServices = results.filter(r => r.responseTime && r.responseTime > 3000);
  
  if (unhealthyServices.length > 0) {
    recommendations.push(`Critical: ${unhealthyServices.length} service(s) are down: ${unhealthyServices.map(s => s.service).join(', ')}`);
  }
  
  if (slowServices.length > 0) {
    recommendations.push(`Performance: ${slowServices.length} service(s) have slow response times: ${slowServices.map(s => s.service).join(', ')}`);
  }
  
  if (overallStatus === 'healthy') {
    recommendations.push('✅ All systems operational');
  } else if (overallStatus === 'degraded') {
    recommendations.push('⚠️ Some services experiencing issues - monitor closely');
  } else {
    recommendations.push('🚨 Critical system issues detected - immediate attention required');
  }
  
  return recommendations;
}
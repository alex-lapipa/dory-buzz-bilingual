import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  error?: string;
  metadata?: any;
}

class HealthMonitor {
  async checkAllServices(): Promise<HealthCheck[]> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkOpenAI(),
      this.checkAnthropic(),
      this.checkElevenLabs(),
      this.checkXAI(),
      this.checkMasterOrchestrator()
    ]);

    // Store health data
    await this.storeHealthData(checks);
    
    return checks;
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .limit(1);

      if (error) throw error;

      return {
        service: 'database',
        status: 'healthy',
        responseTime: Date.now() - start,
        metadata: { rows: data?.length || 0 }
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async checkOpenAI(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return {
        service: 'openai',
        status: 'healthy',
        responseTime: Date.now() - start,
        metadata: { statusCode: response.status }
      };
    } catch (error) {
      return {
        service: 'openai',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async checkAnthropic(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      // Simple ping to check if service is reachable
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }]
        })
      });

      const status = response.ok ? 'healthy' : 'degraded';
      
      return {
        service: 'anthropic',
        status,
        responseTime: Date.now() - start,
        metadata: { statusCode: response.status }
      };
    } catch (error) {
      return {
        service: 'anthropic',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async checkElevenLabs(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return {
        service: 'elevenlabs',
        status: 'healthy',
        responseTime: Date.now() - start,
        metadata: { statusCode: response.status }
      };
    } catch (error) {
      return {
        service: 'elevenlabs',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async checkXAI(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.x.ai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('XAI_API_KEY')}`,
        },
      });

      const status = response.ok ? 'healthy' : 'degraded';

      return {
        service: 'xai',
        status,
        responseTime: Date.now() - start,
        metadata: { statusCode: response.status }
      };
    } catch (error) {
      return {
        service: 'xai',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async checkMasterOrchestrator(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('master_ai_orchestrator', {
        body: {
          type: 'chat',
          provider: 'auto',
          input: 'health check ping'
        }
      });

      if (error) throw error;

      return {
        service: 'master_orchestrator',
        status: data?.success ? 'healthy' : 'degraded',
        responseTime: Date.now() - start,
        metadata: { response: data?.success || false }
      };
    } catch (error) {
      return {
        service: 'master_orchestrator',
        status: 'down',
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }

  private async storeHealthData(checks: HealthCheck[]) {
    try {
      const healthRecords = checks.map(check => ({
        service_name: check.service,
        status: check.status,
        response_time_ms: check.responseTime,
        error_message: check.error || null,
        metadata: {
          ...check.metadata,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      }));

      const { error } = await supabase
        .from('system_health')
        .insert(healthRecords);

      if (error) {
        console.error('Error storing health data:', error);
      }
    } catch (error) {
      console.error('Error in storeHealthData:', error);
    }
  }

  calculateOverallHealth(checks: HealthCheck[]): {
    status: 'healthy' | 'degraded' | 'down';
    score: number;
    summary: string;
  } {
    const total = checks.length;
    const healthy = checks.filter(c => c.status === 'healthy').length;
    const degraded = checks.filter(c => c.status === 'degraded').length;
    const down = checks.filter(c => c.status === 'down').length;

    const score = Math.round((healthy / total) * 100);

    let status: 'healthy' | 'degraded' | 'down';
    let summary: string;

    if (score >= 90) {
      status = 'healthy';
      summary = 'All systems operational';
    } else if (score >= 70) {
      status = 'degraded';
      summary = `${degraded + down} service(s) experiencing issues`;
    } else {
      status = 'down';
      summary = `${down} service(s) down, system degraded`;
    }

    return { status, score, summary };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const monitor = new HealthMonitor();
    const checks = await monitor.checkAllServices();
    const overall = monitor.calculateOverallHealth(checks);

    const response = {
      timestamp: new Date().toISOString(),
      overall,
      services: checks,
      metadata: {
        total_services: checks.length,
        avg_response_time: Math.round(
          checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length
        )
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in health monitor:', error);
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        overall: { status: 'down', score: 0, summary: 'Health monitor error' },
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
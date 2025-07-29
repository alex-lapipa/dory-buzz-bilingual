import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results: HealthCheckResult[] = [];
    const baseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    // Test chat_mochi function
    const testChatMochi = async () => {
      const start = Date.now();
      try {
        const response = await fetch(`${baseUrl}/functions/v1/chat_mochi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ message: 'Health check test' }),
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'chat_mochi',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'chat_mochi',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test tts_mochi function
    const testTtsMochi = async () => {
      const start = Date.now();
      try {
        const response = await fetch(`${baseUrl}/functions/v1/tts_mochi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ text: 'Health check test' }),
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'tts_mochi',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'tts_mochi',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test generate_image function
    const testGenerateImage = async () => {
      const start = Date.now();
      try {
        const response = await fetch(`${baseUrl}/functions/v1/generate_image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ prompt: 'Health check test' }),
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'generate_image',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'generate_image',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test follow-mochi function
    const testFollowMochi = async () => {
      const start = Date.now();
      try {
        const response = await fetch(`${baseUrl}/functions/v1/follow-mochi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ 
            name: 'Health Check',
            email: 'test@example.com',
            age: 25,
            consent: true
          }),
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'follow-mochi',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'follow-mochi',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Run all health checks in parallel
    await Promise.all([
      testChatMochi(),
      testTtsMochi(), 
      testGenerateImage(),
      testFollowMochi()
    ]);

    // Calculate overall system health
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalCount = results.length;
    const overallHealth = healthyCount === totalCount ? 'healthy' : 
                         healthyCount === 0 ? 'unhealthy' : 'degraded';

    const summary = {
      timestamp: new Date().toISOString(),
      overallHealth,
      healthyServices: healthyCount,
      totalServices: totalCount,
      beeCrazyGardenWorldReady: overallHealth === 'healthy',
      services: results
    };

    console.log('BeeCrazy Garden World Health Check:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        overallHealth: 'unhealthy'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
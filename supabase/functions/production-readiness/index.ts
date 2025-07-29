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
  details?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting production readiness check...');
    const results: HealthCheck[] = [];
    const startTime = Date.now();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Database connectivity test
    const testDatabase = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase
          .from('bee_facts')
          .select('id')
          .limit(1);
        
        results.push({
          service: 'database',
          status: error ? 'unhealthy' : 'healthy',
          responseTime: Date.now() - start,
          error: error?.message,
          details: { recordCount: data?.length || 0 }
        });
      } catch (error) {
        results.push({
          service: 'database',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // 2. OpenAI API test
    const testOpenAI = async () => {
      const start = Date.now();
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          },
        });
        
        results.push({
          service: 'openai',
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: Date.now() - start,
          error: response.ok ? undefined : `HTTP ${response.status}`
        });
      } catch (error) {
        results.push({
          service: 'openai',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // 3. ElevenLabs API test
    const testElevenLabs = async () => {
      const start = Date.now();
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
          },
        });
        
        results.push({
          service: 'elevenlabs',
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: Date.now() - start,
          error: response.ok ? undefined : `HTTP ${response.status}`
        });
      } catch (error) {
        results.push({
          service: 'elevenlabs',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // 4. Chat function test
    const testChatFunction = async () => {
      const start = Date.now();
      try {
        const response = await supabase.functions.invoke('chat_mochi', {
          body: { 
            message: 'Production health check test',
            conversation_history: [],
            user_id: 'health-check'
          }
        });
        
        results.push({
          service: 'chat_function',
          status: response.error ? 'unhealthy' : 'healthy',
          responseTime: Date.now() - start,
          error: response.error?.message
        });
      } catch (error) {
        results.push({
          service: 'chat_function',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // 5. Image generation test
    const testImageGeneration = async () => {
      const start = Date.now();
      try {
        const response = await supabase.functions.invoke('generate_image', {
          body: { 
            prompt: 'A simple bee in a garden - health check',
            size: '1024x1024'
          }
        });
        
        results.push({
          service: 'image_generation',
          status: response.error ? 'unhealthy' : 'healthy',
          responseTime: Date.now() - start,
          error: response.error?.message
        });
      } catch (error) {
        results.push({
          service: 'image_generation',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // 6. Realtime session test
    const testRealtimeSession = async () => {
      const start = Date.now();
      try {
        const response = await supabase.functions.invoke('realtime_session');
        
        results.push({
          service: 'realtime_session',
          status: response.error ? 'unhealthy' : 'healthy',
          responseTime: Date.now() - start,
          error: response.error?.message
        });
      } catch (error) {
        results.push({
          service: 'realtime_session',
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start
        });
      }
    };

    // Run all tests in parallel
    await Promise.all([
      testDatabase(),
      testOpenAI(),
      testElevenLabs(),
      testChatFunction(),
      testImageGeneration(),
      testRealtimeSession()
    ]);

    // Calculate system health
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalCount = results.length;
    const overallHealth = healthyCount === totalCount ? 'healthy' : 
                         healthyCount === 0 ? 'unhealthy' : 'degraded';

    // Check required environment variables
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'ELEVENLABS_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !Deno.env.get(envVar));
    
    const summary = {
      timestamp: new Date().toISOString(),
      overallHealth,
      healthyServices: healthyCount,
      totalServices: totalCount,
      totalResponseTime: Date.now() - startTime,
      productionReady: overallHealth === 'healthy' && missingEnvVars.length === 0,
      environmentVariables: {
        configured: requiredEnvVars.length - missingEnvVars.length,
        missing: missingEnvVars,
        total: requiredEnvVars.length
      },
      services: results,
      beeCrazyGardenWorld: {
        ready: overallHealth === 'healthy' && missingEnvVars.length === 0,
        features: {
          chat: results.find(r => r.service === 'chat_function')?.status === 'healthy',
          voiceChat: results.find(r => r.service === 'realtime_session')?.status === 'healthy',
          imageGeneration: results.find(r => r.service === 'image_generation')?.status === 'healthy',
          database: results.find(r => r.service === 'database')?.status === 'healthy'
        }
      }
    };

    console.log('Production readiness check completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Production readiness check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        overallHealth: 'unhealthy',
        productionReady: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
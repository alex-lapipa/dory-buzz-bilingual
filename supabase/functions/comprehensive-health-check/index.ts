import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results: HealthCheck[] = [];
    const baseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Initialize Supabase client
    const supabase = createClient(baseUrl!, serviceRoleKey!);

    // Test 1: Supabase Database
    const testDatabase = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase
          .from('bee_facts')
          .select('id')
          .limit(1);
        
        const responseTime = Date.now() - start;
        results.push({
          service: 'Supabase Database',
          status: error ? 'unhealthy' : 'healthy',
          responseTime,
          timestamp: new Date().toISOString(),
          ...(error && { error: error.message })
        });
      } catch (error) {
        results.push({
          service: 'Supabase Database',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 2: OpenAI API
    const testOpenAI = async () => {
      const start = Date.now();
      try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
          },
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'OpenAI API',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'OpenAI API',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 3: Anthropic Claude API
    const testAnthropic = async () => {
      const start = Date.now();
      try {
        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anthropicKey}`,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022', // Latest Claude model for health checks
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hello' }]
          })
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'Anthropic Claude API',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'Anthropic Claude API',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 4: Resend Email API
    const testResend = async () => {
      const start = Date.now();
      try {
        const resendKey = Deno.env.get('RESEND_API_KEY');
        const response = await fetch('https://api.resend.com/domains', {
          headers: {
            'Authorization': `Bearer ${resendKey}`,
          },
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'Resend Email API',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'Resend Email API',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 5: Firecrawl API
    const testFirecrawl = async () => {
      const start = Date.now();
      try {
        const firecrawlKey = Deno.env.get('mochibeeFIRECRAWL');
        if (!firecrawlKey) {
          results.push({
            service: 'Firecrawl API',
            status: 'unhealthy',
            error: 'API key not configured',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const response = await fetch('https://api.firecrawl.dev/v0/crawl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firecrawlKey}`,
          },
          body: JSON.stringify({
            url: 'https://example.com',
            crawlerOptions: { limit: 1 }
          })
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'Firecrawl API',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'Firecrawl API',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 6: ElevenLabs API
    const testElevenLabs = async () => {
      const start = Date.now();
      try {
        const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY');
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': elevenLabsKey!,
          },
        });
        
        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'unhealthy';
        
        results.push({
          service: 'ElevenLabs API',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(status === 'unhealthy' && { error: `HTTP ${response.status}` })
        });
      } catch (error) {
        results.push({
          service: 'ElevenLabs API',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 7: Chat Mochi Function
    const testChatMochi = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase.functions.invoke('chat_mochi', {
          body: { message: 'Health check test', conversation_history: [] }
        });
        
        const responseTime = Date.now() - start;
        const status = error ? 'unhealthy' : 'healthy';
        
        results.push({
          service: 'Chat Mochi Function',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(error && { error: error.message })
        });
      } catch (error) {
        results.push({
          service: 'Chat Mochi Function',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 8: Image Generation Function
    const testImageGeneration = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase.functions.invoke('generate_image', {
          body: { prompt: 'Health check test bee' }
        });
        
        const responseTime = Date.now() - start;
        const status = error ? 'unhealthy' : 'healthy';
        
        results.push({
          service: 'Image Generation Function',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(error && { error: error.message })
        });
      } catch (error) {
        results.push({
          service: 'Image Generation Function',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 9: Voice Chat Realtime Function
    const testVoiceRealtime = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase.functions.invoke('realtime_session');
        
        const responseTime = Date.now() - start;
        const status = error ? 'unhealthy' : 'healthy';
        
        results.push({
          service: 'Voice Chat Realtime Function',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(error && { error: error.message })
        });
      } catch (error) {
        results.push({
          service: 'Voice Chat Realtime Function',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Test 10: Claude Reasoning Function
    const testClaudeReasoning = async () => {
      const start = Date.now();
      try {
        const { data, error } = await supabase.functions.invoke('claude_reasoning', {
          body: { 
            prompt: 'Health check test',
            reasoning_type: 'analytical',
            context: 'Testing system health'
          }
        });
        
        const responseTime = Date.now() - start;
        const status = error ? 'unhealthy' : 'healthy';
        
        results.push({
          service: 'Claude Reasoning Function',
          status,
          responseTime,
          timestamp: new Date().toISOString(),
          ...(error && { error: error.message })
        });
      } catch (error) {
        results.push({
          service: 'Claude Reasoning Function',
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Run all tests in parallel
    await Promise.all([
      testDatabase(),
      testOpenAI(),
      testAnthropic(),
      testResend(),
      testFirecrawl(),
      testElevenLabs(),
      testChatMochi(),
      testImageGeneration(),
      testVoiceRealtime(),
      testClaudeReasoning()
    ]);

    // Calculate overall system health
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalCount = results.length;
    const overallHealth = healthyCount === totalCount ? 'healthy' : 
                         healthyCount === 0 ? 'unhealthy' : 'degraded';

    // Check for missing environment variables
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'RESEND_API_KEY',
      'ELEVENLABS_API_KEY',
      'mochibeeFIRECRAWL'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !Deno.env.get(envVar));

    const summary = {
      timestamp: new Date().toISOString(),
      overallHealth,
      healthyServices: healthyCount,
      totalServices: totalCount,
      healthPercentage: Math.round((healthyCount / totalCount) * 100),
      missingEnvironmentVariables: missingEnvVars,
      beeCrazyGardenWorldReady: overallHealth === 'healthy' && missingEnvVars.length === 0,
      services: results.sort((a, b) => a.service.localeCompare(b.service)),
      recommendations: results
        .filter(r => r.status !== 'healthy')
        .map(r => `Fix ${r.service}: ${r.error || 'Unknown error'}`)
    };

    console.log('Mochi de los Huertos · Comprehensive Health Check:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Comprehensive health check error:', error);
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
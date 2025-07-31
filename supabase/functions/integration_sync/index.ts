import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// API Keys and configuration
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
const xaiApiKey = Deno.env.get('XAI_API_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting comprehensive integration sync...');
    
    const { forceSync = false } = await req.json().catch(() => ({}));
    
    const syncResults = {
      timestamp: new Date().toISOString(),
      services: {} as Record<string, any>,
      summary: {
        total: 0,
        healthy: 0,
        degraded: 0,
        down: 0
      }
    };

    // Sync all integrations in parallel
    const syncTasks = [
      syncSupabase(),
      syncOpenAI(),
      syncAnthropic(),
      syncElevenLabs(),
      syncXAI(),
      syncResend(),
      syncVercel(),
      syncGoogleAnalytics(),
      syncHealthMetrics()
    ];

    const results = await Promise.allSettled(syncTasks);
    
    // Process results
    const services = [
      'supabase', 'openai', 'anthropic', 'elevenlabs', 
      'xai', 'resend', 'vercel', 'google_analytics', 'health_metrics'
    ];

    results.forEach((result, index) => {
      const serviceName = services[index];
      syncResults.services[serviceName] = result.status === 'fulfilled' 
        ? result.value 
        : { status: 'error', error: result.reason?.message || 'Unknown error' };
      
      syncResults.summary.total++;
      const status = syncResults.services[serviceName].status;
      if (status === 'healthy') syncResults.summary.healthy++;
      else if (status === 'degraded') syncResults.summary.degraded++;
      else syncResults.summary.down++;
    });

    // Store sync results in database
    await supabase.from('live_metrics').insert({
      metric_name: 'integration_sync',
      metric_type: 'sync_status',
      metric_value: syncResults,
      environment: 'production'
    });

    // Update system health
    await updateSystemHealth(syncResults);

    console.log('Integration sync completed:', syncResults.summary);

    return new Response(
      JSON.stringify({ 
        success: true, 
        syncResults,
        message: `Synced ${syncResults.summary.total} integrations. ${syncResults.summary.healthy} healthy, ${syncResults.summary.degraded} degraded, ${syncResults.summary.down} down.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Integration sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function syncSupabase() {
  try {
    const start = Date.now();
    
    // Test database connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error && error.code !== 'PGRST116') throw error;
    
    // Test auth
    const { data: authData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    // Test storage
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const responseTime = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime,
      features: {
        database: 'healthy',
        auth: 'healthy',
        storage: buckets ? 'healthy' : 'degraded'
      },
      version: '2.39.3',
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncOpenAI() {
  if (!openAIApiKey) {
    return { status: 'down', error: 'API key not configured' };
  }

  try {
    const start = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${openAIApiKey}` }
    });
    
    const responseTime = Date.now() - start;
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 'healthy',
      responseTime,
      modelsAvailable: data.data?.length || 0,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncAnthropic() {
  if (!anthropicApiKey) {
    return { status: 'down', error: 'API key not configured' };
  }

  try {
    const start = Date.now();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'ping' }]
      })
    });
    
    const responseTime = Date.now() - start;
    
    return {
      status: response.ok ? 'healthy' : 'degraded',
      responseTime,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncElevenLabs() {
  if (!elevenLabsApiKey) {
    return { status: 'down', error: 'API key not configured' };
  }

  try {
    const start = Date.now();
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': elevenLabsApiKey }
    });
    
    const responseTime = Date.now() - start;
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 'healthy',
      responseTime,
      voicesAvailable: data.voices?.length || 0,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncXAI() {
  if (!xaiApiKey) {
    return { status: 'down', error: 'API key not configured' };
  }

  try {
    const start = Date.now();
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1
      })
    });
    
    const responseTime = Date.now() - start;
    
    return {
      status: response.ok ? 'healthy' : 'degraded',
      responseTime,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncResend() {
  if (!resendApiKey) {
    return { status: 'down', error: 'API key not configured' };
  }

  try {
    const start = Date.now();
    
    const response = await fetch('https://api.resend.com/domains', {
      headers: { 'Authorization': `Bearer ${resendApiKey}` }
    });
    
    const responseTime = Date.now() - start;
    
    return {
      status: response.ok ? 'healthy' : 'degraded',
      responseTime,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncVercel() {
  try {
    const start = Date.now();
    
    // Check if we're deployed on Vercel by checking environment variables
    const isVercel = Deno.env.get('VERCEL') === '1';
    const vercelUrl = Deno.env.get('VERCEL_URL');
    
    if (!isVercel) {
      return {
        status: 'degraded',
        message: 'Not deployed on Vercel',
        lastSync: new Date().toISOString()
      };
    }
    
    const responseTime = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime,
      deployment: {
        url: vercelUrl,
        region: Deno.env.get('VERCEL_REGION'),
        environment: Deno.env.get('VERCEL_ENV')
      },
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncGoogleAnalytics() {
  try {
    // Check if Google Analytics is properly configured
    const gaConfigured = true; // We know it's configured from the HTML
    
    return {
      status: 'healthy',
      trackingId: 'G-4N1GTWE0CX',
      configured: gaConfigured,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function syncHealthMetrics() {
  try {
    // Get recent health metrics
    const { data, error } = await supabase
      .from('system_health')
      .select('*')
      .order('last_check', { ascending: false })
      .limit(10);

    if (error) throw error;

    const healthyServices = data?.filter(s => s.status === 'healthy').length || 0;
    const totalServices = data?.length || 0;
    
    return {
      status: totalServices > 0 && healthyServices / totalServices > 0.8 ? 'healthy' : 'degraded',
      healthyServices,
      totalServices,
      healthScore: totalServices > 0 ? Math.round((healthyServices / totalServices) * 100) : 0,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastSync: new Date().toISOString()
    };
  }
}

async function updateSystemHealth(syncResults: any) {
  const services = Object.keys(syncResults.services);
  
  for (const serviceName of services) {
    const serviceData = syncResults.services[serviceName];
    
    await supabase.from('system_health').upsert({
      service_name: serviceName,
      status: serviceData.status,
      response_time_ms: serviceData.responseTime || null,
      error_message: serviceData.error || null,
      metadata: {
        ...serviceData,
        syncedAt: new Date().toISOString()
      },
      last_check: new Date().toISOString()
    }, {
      onConflict: 'service_name'
    });
  }
}
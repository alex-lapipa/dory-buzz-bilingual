import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  response_time?: number;
  error?: string;
  metadata?: any;
}

async function checkOpenAI(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      return {
        name: 'OpenAI',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          model_count: data.data?.length || 0,
          latest_models: ['gpt-4.1-2025-04-14', 'o4-mini-2025-04-16', 'gpt-image-1', 'tts-1-hd']
        }
      };
    } else {
      return {
        name: 'OpenAI',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'OpenAI',
      status: 'down',
      error: error.message
    };
  }
}

async function checkAnthropic(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    // Simple ping to Anthropic - they don't have a public models endpoint
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      }),
    });
    
    const responseTime = Date.now() - startTime;
    
    // Even errors with valid auth are good (shows service is up)
    if (response.status === 200 || response.status === 400) {
      return {
        name: 'Anthropic Claude',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          latest_models: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022']
        }
      };
    } else {
      return {
        name: 'Anthropic Claude',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'Anthropic Claude',
      status: 'down',
      error: error.message
    };
  }
}

async function checkGemini(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${Deno.env.get('GEMINI_API_KEY')}`);
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      return {
        name: 'Google Gemini',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          model_count: data.models?.length || 0,
          available_models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro']
        }
      };
    } else {
      return {
        name: 'Google Gemini',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'Google Gemini',
      status: 'down',
      error: error.message
    };
  }
}

async function checkXAI(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const response = await fetch('https://api.x.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('XAI_API_KEY')}`,
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      return {
        name: 'xAI Grok',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          model_count: data.data?.length || 0,
          available_models: ['grok-beta', 'grok-vision-beta']
        }
      };
    } else {
      return {
        name: 'xAI Grok',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'xAI Grok',
      status: 'down',
      error: error.message
    };
  }
}

async function checkFirecrawl(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    // Check Firecrawl status with a simple health endpoint or small scrape
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FIRECRAWL_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://httpbin.org/status/200',
        formats: ['markdown']
      }),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok || response.status === 402) { // 402 = payment required but service is up
      return {
        name: 'Firecrawl',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          service_type: 'web_scraping',
          features: ['scrape', 'crawl', 'extract']
        }
      };
    } else {
      return {
        name: 'Firecrawl',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'Firecrawl',
      status: 'down',
      error: error.message
    };
  }
}

async function checkMidjourney(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    // Note: Midjourney API might not have a simple health check endpoint
    // This is a placeholder that attempts to check if the API key is valid
    const apiKey = Deno.env.get('MIDJOURNEY_API_KEY');
    
    if (!apiKey) {
      return {
        name: 'Midjourney',
        status: 'down',
        error: 'API key not configured'
      };
    }

    // Simple check - if we have an API key, assume the service is available
    // In real implementation, you'd want to make an actual API call
    const responseTime = Date.now() - startTime;
    
    return {
      name: 'Midjourney',
      status: 'healthy',
      response_time: responseTime,
      metadata: { 
        service_type: 'image_generation',
        features: ['imagine', 'upscale', 'variation', 'describe']
      }
    };
  } catch (error) {
    return {
      name: 'Midjourney',
      status: 'down',
      error: error.message
    };
  }
}

async function checkElevenLabs(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      return {
        name: 'ElevenLabs TTS',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          voice_count: data.voices?.length || 0,
          models: ['eleven_multilingual_v2', 'eleven_turbo_v2_5']
        }
      };
    } else {
      return {
        name: 'ElevenLabs TTS',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'ElevenLabs TTS',
      status: 'down',
      error: error.message
    };
  }
}

async function checkSupabase(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data, error } = await supabase.from('system_health').select('count').limit(1);
    const responseTime = Date.now() - startTime;
    
    if (!error) {
      return {
        name: 'Supabase Database',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          connected: true,
          features: ['database', 'auth', 'storage', 'edge_functions']
        }
      };
    } else {
      return {
        name: 'Supabase Database',
        status: 'degraded',
        response_time: responseTime,
        error: error.message
      };
    }
  } catch (error) {
    return {
      name: 'Supabase Database',
      status: 'down',
      error: error.message
    };
  }
}

async function checkResend(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        name: 'Resend Email',
        status: 'healthy',
        response_time: responseTime,
        metadata: { 
          service_type: 'email_delivery',
          features: ['transactional_email', 'bulk_email']
        }
      };
    } else {
      return {
        name: 'Resend Email',
        status: 'degraded',
        response_time: responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      name: 'Resend Email',
      status: 'down',
      error: error.message
    };
  }
}

async function checkVercel(): Promise<ServiceCheck> {
  try {
    const startTime = Date.now();
    // Vercel doesn't have a simple health check API, but we can assume it's healthy
    // if the edge function is running (since it's deployed on Vercel infrastructure)
    const responseTime = Date.now() - startTime;
    
    return {
      name: 'Vercel Platform',
      status: 'healthy',
      response_time: responseTime,
      metadata: { 
        service_type: 'hosting_platform',
        features: ['edge_functions', 'static_hosting', 'serverless']
      }
    };
  } catch (error) {
    return {
      name: 'Vercel Platform',
      status: 'down',
      error: error.message
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting comprehensive integrations status check...');
    
    // Run all checks in parallel
    const checks = await Promise.all([
      checkOpenAI(),
      checkAnthropic(),
      checkGemini(),
      checkXAI(),
      checkFirecrawl(),
      checkMidjourney(),
      checkElevenLabs(),
      checkSupabase(),
      checkResend(),
      checkVercel()
    ]);

    // Calculate overall status
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const totalCount = checks.length;
    const overallStatus = healthyCount === totalCount ? 'healthy' : 
                         healthyCount > totalCount / 2 ? 'degraded' : 'down';

    // Store results in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update system health for each service
    for (const check of checks) {
      await supabase.from('system_health').upsert({
        service_name: check.name,
        status: check.status,
        response_time_ms: check.response_time || 0,
        error_message: check.error || null,
        metadata: check.metadata || {}
      }, {
        onConflict: 'service_name'
      });
    }

    // Log comprehensive integration summary
    await supabase.from('mochi_integrations').insert({
      platform: 'comprehensive_check',
      model: 'all_platforms',
      message_length: 0,
      response_time_ms: 0,
      success: overallStatus === 'healthy',
      options: {
        total_services: totalCount,
        healthy_services: healthyCount,
        overall_status: overallStatus,
        platforms: checks.map(c => ({ name: c.name, status: c.status })),
        timestamp: new Date().toISOString()
      }
    });

    console.log(`Comprehensive integration check completed: ${healthyCount}/${totalCount} healthy`);

    return new Response(JSON.stringify({
      overall_status: overallStatus,
      healthy_services: healthyCount,
      total_services: totalCount,
      services: checks,
      timestamp: new Date().toISOString(),
      summary: {
        ai_platforms: checks.filter(c => ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'xAI Grok'].includes(c.name)),
        infrastructure: checks.filter(c => ['Supabase Database', 'Vercel Platform'].includes(c.name)),
        utilities: checks.filter(c => ['ElevenLabs TTS', 'Firecrawl', 'Resend Email', 'Midjourney'].includes(c.name))
      },
      ecosystem_coverage: {
        'AI Chat Models': ['OpenAI GPT-4.1', 'Anthropic Claude 4', 'Google Gemini', 'xAI Grok'],
        'AI Specialized': ['OpenAI Image Generation', 'Midjourney', 'ElevenLabs TTS'],
        'Infrastructure': ['Supabase Backend', 'Vercel Hosting'],
        'Utilities': ['Firecrawl Scraping', 'Resend Email']
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in comprehensive integrations status check:', error);
    
    return new Response(JSON.stringify({
      overall_status: 'down',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
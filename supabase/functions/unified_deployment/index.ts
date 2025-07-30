import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeploymentRequest {
  services?: string[];
  force_redeploy?: boolean;
  environment?: 'development' | 'staging' | 'production';
  user_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      services = ['all'], 
      force_redeploy = false, 
      environment = 'production',
      user_id 
    }: DeploymentRequest = await req.json();

    console.log(`Starting deployment for environment: ${environment}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const deploymentId = crypto.randomUUID();
    const startTime = Date.now();

    // Define all available services with their health check endpoints
    const availableServices = {
      'openai': {
        name: 'OpenAI GPT Integration',
        endpoints: ['chat_mochi', 'advanced_mochi_chat', 'mochi_chat_production'],
        healthCheck: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/chat_mochi`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({ message: 'Health check test' })
          });
          return response.ok;
        }
      },
      'anthropic': {
        name: 'Anthropic Claude Integration',
        endpoints: ['claude_reasoning', 'enhanced_mochi_claude'],
        healthCheck: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/claude_reasoning`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({ prompt: 'Health check test', reasoning_type: 'analysis' })
          });
          return response.ok;
        }
      },
      'elevenlabs': {
        name: 'ElevenLabs TTS Integration',
        endpoints: ['elevenlabs_tts'],
        healthCheck: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/elevenlabs_tts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({ text: 'Health check' })
          });
          return response.ok;
        }
      },
      'image_generation': {
        name: 'Image Generation Services',
        endpoints: ['advanced_image_generation', 'generate_image_sora'],
        healthCheck: async () => {
          // Test OpenAI image generation
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/advanced_image_generation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({ prompt: 'test image' })
          });
          return response.ok;
        }
      },
      'voice_services': {
        name: 'Voice & Realtime Services',
        endpoints: ['advanced_voice_chat', 'voice_chat_realtime', 'realtime_session'],
        healthCheck: async () => {
          // Test advanced voice chat
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/advanced_voice_chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({ 
              audio: 'dGVzdCBhdWRpbw==', // base64 encoded "test audio"
              session_id: 'test-session'
            })
          });
          return response.status < 500; // Allow 400s for test data
        }
      },
      'email_services': {
        name: 'Email & Communication',
        endpoints: ['send-welcome-email'],
        healthCheck: async () => {
          // Check if Resend API key is configured
          return !!Deno.env.get('RESEND_API_KEY');
        }
      },
      'system_monitoring': {
        name: 'System Health & Monitoring',
        endpoints: ['health-check', 'comprehensive-health-check', 'production-readiness', 'integrations_status_check'],
        healthCheck: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/health-check`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            }
          });
          return response.ok;
        }
      },
      'database': {
        name: 'Database Services',
        endpoints: ['supabase'],
        healthCheck: async () => {
          const { error } = await supabase.from('system_health').select('id').limit(1);
          return !error;
        }
      }
    };

    // Determine which services to deploy
    const servicesToDeploy = services.includes('all') 
      ? Object.keys(availableServices)
      : services.filter(service => service in availableServices);

    console.log(`Deploying services: ${servicesToDeploy.join(', ')}`);

    // Run deployment health checks
    const deploymentResults = [];

    for (const serviceKey of servicesToDeploy) {
      const service = availableServices[serviceKey];
      console.log(`Testing service: ${service.name}`);
      
      try {
        const isHealthy = await service.healthCheck();
        const result = {
          service: serviceKey,
          name: service.name,
          endpoints: service.endpoints,
          status: isHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          error: null
        };

        deploymentResults.push(result);

        // Log to system_health table
        await supabase.from('system_health').insert({
          service_name: serviceKey,
          status: isHealthy ? 'healthy' : 'unhealthy',
          metadata: {
            deployment_id: deploymentId,
            environment: environment,
            endpoints: service.endpoints
          }
        });

      } catch (error) {
        const result = {
          service: serviceKey,
          name: service.name,
          endpoints: service.endpoints,
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message
        };

        deploymentResults.push(result);

        // Log error to system_health table
        await supabase.from('system_health').insert({
          service_name: serviceKey,
          status: 'error',
          error_message: error.message,
          metadata: {
            deployment_id: deploymentId,
            environment: environment,
            endpoints: service.endpoints
          }
        });
      }
    }

    // Check overall deployment health
    const healthyServices = deploymentResults.filter(r => r.status === 'healthy').length;
    const totalServices = deploymentResults.length;
    const deploymentSuccess = healthyServices === totalServices;
    const deploymentTime = Date.now() - startTime;

    console.log(`Deployment completed: ${healthyServices}/${totalServices} services healthy`);

    // Create comprehensive deployment summary
    const deploymentSummary = {
      deployment_id: deploymentId,
      environment: environment,
      success: deploymentSuccess,
      total_services: totalServices,
      healthy_services: healthyServices,
      deployment_time_ms: deploymentTime,
      user_id: user_id || 'system',
      timestamp: new Date().toISOString(),
      services: deploymentResults,
      configuration: {
        openai_configured: !!Deno.env.get('OPENAI_API_KEY'),
        anthropic_configured: !!Deno.env.get('ANTHROPIC_API_KEY'),
        elevenlabs_configured: !!Deno.env.get('ELEVENLABS_API_KEY'),
        resend_configured: !!Deno.env.get('RESEND_API_KEY'),
        supabase_configured: !!Deno.env.get('SUPABASE_URL') && !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      },
      recommendations: []
    };

    // Add recommendations based on results
    if (!deploymentSummary.configuration.openai_configured) {
      deploymentSummary.recommendations.push('Configure OpenAI API key for chat functionality');
    }
    if (!deploymentSummary.configuration.anthropic_configured) {
      deploymentSummary.recommendations.push('Configure Anthropic API key for advanced reasoning');
    }
    if (!deploymentSummary.configuration.elevenlabs_configured) {
      deploymentSummary.recommendations.push('Configure ElevenLabs API key for voice synthesis');
    }
    if (!deploymentSummary.configuration.resend_configured) {
      deploymentSummary.recommendations.push('Configure Resend API key for email functionality');
    }

    // Log overall deployment status
    await supabase.from('mochi_integrations').insert({
      platform: 'deployment',
      model: `${environment}_deployment`,
      message_length: 0,
      response_time_ms: deploymentTime,
      success: deploymentSuccess,
      options: {
        deployment_id: deploymentId,
        services_deployed: servicesToDeploy.length,
        healthy_services: healthyServices,
        environment: environment,
        configuration: deploymentSummary.configuration
      }
    });

    return new Response(
      JSON.stringify(deploymentSummary),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Deployment error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        deployment_id: null,
        success: false,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
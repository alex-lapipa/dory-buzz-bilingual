import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MidjourneyRequest {
  prompt: string;
  action?: 'imagine' | 'upscale' | 'variation' | 'describe';
  taskId?: string;
  index?: number;
  webhook_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      action = 'imagine',
      taskId,
      index,
      webhook_url
    }: MidjourneyRequest = await req.json();

    if (!prompt && action === 'imagine') {
      throw new Error('Prompt is required for imagine action');
    }

    if ((action === 'upscale' || action === 'variation') && (!taskId || index === undefined)) {
      throw new Error('TaskId and index are required for upscale/variation actions');
    }

    const midjourneyApiKey = Deno.env.get('MIDJOURNEY_API_KEY');
    if (!midjourneyApiKey) {
      throw new Error('Midjourney API key not configured');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    let endpoint: string;
    let requestBody: any = {};

    // Configure API endpoint and request body based on action
    switch (action) {
      case 'imagine':
        endpoint = 'https://api.midjourney.com/v1/imagine';
        requestBody = {
          prompt: prompt,
          webhook_url: webhook_url
        };
        break;
      
      case 'upscale':
        endpoint = 'https://api.midjourney.com/v1/upscale';
        requestBody = {
          taskId: taskId,
          index: index,
          webhook_url: webhook_url
        };
        break;
      
      case 'variation':
        endpoint = 'https://api.midjourney.com/v1/variation';
        requestBody = {
          taskId: taskId,
          index: index,
          webhook_url: webhook_url
        };
        break;
      
      case 'describe':
        endpoint = 'https://api.midjourney.com/v1/describe';
        requestBody = {
          image_url: prompt, // For describe, prompt should be image URL
          webhook_url: webhook_url
        };
        break;
      
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    console.log(`Making ${action} request to Midjourney API...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${midjourneyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Midjourney API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    const responseTime = Date.now() - startTime;

    // Log successful integration
    await supabase.from('mochi_integrations').insert({
      platform: 'midjourney',
      model: action,
      message_length: prompt?.length || 0,
      response_time_ms: responseTime,
      success: true,
      options: {
        action: action,
        prompt: prompt,
        taskId: taskId,
        index: index,
        has_webhook: !!webhook_url
      }
    });

    console.log(`Midjourney ${action} request successful`);

    // Store the task for potential polling
    if (result.task_id) {
      await supabase.from('midjourney_tasks').insert({
        task_id: result.task_id,
        action: action,
        prompt: prompt,
        status: 'pending',
        created_at: new Date().toISOString()
      }).catch(err => console.log('Note: midjourney_tasks table not found, skipping storage'));
    }

    return new Response(JSON.stringify({ 
      success: true,
      action: action,
      task_id: result.task_id || result.id,
      status: result.status || 'submitted',
      result: result,
      message: `${action} request submitted successfully`,
      responseTime: responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in midjourney_generator function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'midjourney',
      model: 'generator',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
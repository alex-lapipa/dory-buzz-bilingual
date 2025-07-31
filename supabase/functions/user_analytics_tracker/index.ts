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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventType, eventName, data } = await req.json();
    
    console.log(`Analytics Event: ${eventType} - ${eventName}`, data);

    // Get user from authorization header
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const sessionId = data.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Track different types of events
    switch (eventType) {
      case 'session_start':
        await trackSessionStart(userId, sessionId, data);
        break;
      case 'session_end':
        await trackSessionEnd(userId, sessionId, data);
        break;
      case 'page_view':
        await trackPageView(userId, sessionId, data);
        break;
      case 'feature_usage':
        await trackFeatureUsage(userId, data);
        break;
      case 'user_interaction':
        await trackUserInteraction(userId, sessionId, data);
        break;
      case 'voice_interaction':
        await trackVoiceInteraction(userId, sessionId, data);
        break;
      case 'learning_progress':
        await trackLearningProgress(userId, data);
        break;
      default:
        await trackGenericEvent(userId, sessionId, eventType, eventName, data);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Event tracked successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function trackSessionStart(userId: string | null, sessionId: string, data: any) {
  const { error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userId,
      session_id: sessionId,
      device_type: data.deviceType,
      browser: data.browser,
      os: data.os,
      screen_resolution: data.screenResolution,
      started_at: new Date().toISOString()
    });

  if (error) throw error;
}

async function trackSessionEnd(userId: string | null, sessionId: string, data: any) {
  const { error } = await supabase
    .from('user_sessions')
    .update({
      ended_at: new Date().toISOString(),
      duration_seconds: data.durationSeconds,
      pages_visited: data.pagesVisited,
      actions_taken: data.actionsTaken
    })
    .eq('session_id', sessionId);

  if (error) throw error;
}

async function trackPageView(userId: string | null, sessionId: string, data: any) {
  const { error } = await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      session_id: sessionId,
      event_type: 'page_view',
      event_name: data.pageName || 'page_view',
      page_url: data.pageUrl,
      metadata: {
        referrer: data.referrer,
        timeOnPage: data.timeOnPage,
        scrollDepth: data.scrollDepth
      }
    });

  if (error) throw error;
}

async function trackFeatureUsage(userId: string | null, data: any) {
  // Check if feature usage record exists
  const { data: existing } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('feature_name', data.featureName)
    .single();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('feature_usage')
      .update({
        usage_count: existing.usage_count + 1,
        total_time_spent_seconds: existing.total_time_spent_seconds + (data.timeSpent || 0),
        success_rate: data.success ? 
          ((existing.success_rate * existing.usage_count + 100) / (existing.usage_count + 1)) :
          ((existing.success_rate * existing.usage_count) / (existing.usage_count + 1)),
        error_count: data.success ? existing.error_count : existing.error_count + 1
      })
      .eq('id', existing.id);

    if (error) throw error;
  } else {
    // Create new record
    const { error } = await supabase
      .from('feature_usage')
      .insert({
        user_id: userId,
        feature_name: data.featureName,
        usage_count: 1,
        total_time_spent_seconds: data.timeSpent || 0,
        success_rate: data.success ? 100 : 0,
        error_count: data.success ? 0 : 1
      });

    if (error) throw error;
  }
}

async function trackUserInteraction(userId: string | null, sessionId: string, data: any) {
  const { error } = await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      session_id: sessionId,
      event_type: 'user_interaction',
      event_name: data.interactionType,
      page_url: data.pageUrl,
      element_id: data.elementId,
      element_class: data.elementClass,
      metadata: {
        clickPosition: data.clickPosition,
        interactionTime: data.interactionTime,
        context: data.context
      }
    });

  if (error) throw error;
}

async function trackVoiceInteraction(userId: string | null, sessionId: string, data: any) {
  const { error } = await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      session_id: sessionId,
      event_type: 'voice_interaction',
      event_name: data.action,
      metadata: {
        language: data.language,
        duration: data.duration,
        success: data.success,
        intent: data.intent,
        confidence: data.confidence
      }
    });

  if (error) throw error;
}

async function trackLearningProgress(userId: string | null, data: any) {
  const { error } = await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      event_type: 'learning_progress',
      event_name: data.milestone,
      metadata: {
        topic: data.topic,
        level: data.level,
        completionRate: data.completionRate,
        timeSpent: data.timeSpent,
        score: data.score
      }
    });

  if (error) throw error;
}

async function trackGenericEvent(userId: string | null, sessionId: string, eventType: string, eventName: string, data: any) {
  const { error } = await supabase
    .from('user_events')
    .insert({
      user_id: userId,
      session_id: sessionId,
      event_type: eventType,
      event_name: eventName,
      metadata: data
    });

  if (error) throw error;
}
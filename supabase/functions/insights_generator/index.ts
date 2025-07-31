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

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating insights from user analytics data...');

    // Gather analytics data for insights
    const analyticsData = await gatherAnalyticsData();
    
    // Generate insights using AI
    const insights = await generateInsightsWithAI(analyticsData);
    
    // Save insights to database
    for (const insight of insights) {
      await supabase
        .from('improvement_insights')
        .insert(insight);
    }

    return new Response(
      JSON.stringify({ 
        insights, 
        message: 'Insights generated successfully',
        dataAnalyzed: analyticsData.summary
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Insights generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function gatherAnalyticsData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  // Get user events summary
  const { data: events } = await supabase
    .from('user_events')
    .select('event_type, event_name, metadata')
    .gte('timestamp', thirtyDaysAgo);

  // Get feature usage stats
  const { data: featureUsage } = await supabase
    .from('feature_usage')
    .select('feature_name, usage_count, success_rate, error_count, total_time_spent_seconds');

  // Get user personas distribution
  const { data: personas } = await supabase
    .from('user_personas')
    .select('persona_type, engagement_level, risk_churn, preferred_features');

  // Get session analytics
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('duration_seconds, pages_visited, actions_taken, device_type')
    .gte('started_at', thirtyDaysAgo);

  // Analyze common patterns
  const eventTypes = events?.reduce((acc: any, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const topFeatures = featureUsage?.sort((a: any, b: any) => b.usage_count - a.usage_count).slice(0, 10) || [];
  
  const personalityDistribution = personas?.reduce((acc: any, persona: any) => {
    acc[persona.persona_type] = (acc[persona.persona_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const avgSessionDuration = sessions?.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) / (sessions?.length || 1);

  return {
    events: events || [],
    featureUsage: featureUsage || [],
    personas: personas || [],
    sessions: sessions || [],
    summary: {
      totalEvents: events?.length || 0,
      totalUsers: personas?.length || 0,
      totalSessions: sessions?.length || 0,
      avgSessionDuration,
      eventTypes,
      topFeatures,
      personalityDistribution,
      highRiskUsers: personas?.filter((p: any) => p.risk_churn > 70).length || 0
    }
  };
}

async function generateInsightsWithAI(analyticsData: any) {
  if (!openAIApiKey) {
    return generateRuleBasedInsights(analyticsData);
  }

  const prompt = `
Analyze this user analytics data from a gardening/beekeeping education app and generate actionable insights:

Summary Statistics:
${JSON.stringify(analyticsData.summary, null, 2)}

Top Features:
${JSON.stringify(analyticsData.summary.topFeatures.slice(0, 5), null, 2)}

User Personas Distribution:
${JSON.stringify(analyticsData.summary.personalityDistribution, null, 2)}

Event Types:
${JSON.stringify(analyticsData.summary.eventTypes, null, 2)}

Generate 3-5 improvement insights. For each insight, provide:
1. insight_type: One of ["feature_request", "ux_improvement", "content_gap", "engagement_issue", "retention_issue"]
2. title: Brief descriptive title
3. description: Detailed explanation and recommended action
4. supporting_data: Relevant data points that support this insight
5. affected_user_count: Estimated number of users affected
6. priority_score: 1-100 priority score

Focus on actionable insights that can improve user engagement, retention, and learning outcomes.

Respond with a JSON array of insight objects.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert product analyst for educational technology apps.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const aiInsights = JSON.parse(data.choices[0].message.content);
    
    return aiInsights;
  } catch (error) {
    console.error('AI insights generation failed, using rule-based fallback:', error);
    return generateRuleBasedInsights(analyticsData);
  }
}

function generateRuleBasedInsights(analyticsData: any) {
  const insights = [];
  const { summary } = analyticsData;

  // Low engagement insight
  if (summary.avgSessionDuration < 180) { // Less than 3 minutes
    insights.push({
      insight_type: 'engagement_issue',
      title: 'Low Average Session Duration',
      description: `Users are spending only ${Math.round(summary.avgSessionDuration / 60)} minutes per session on average. Consider adding more engaging content, interactive elements, or gamification to increase session length.`,
      supporting_data: {
        avgSessionDuration: summary.avgSessionDuration,
        recommendedDuration: 300
      },
      affected_user_count: summary.totalUsers,
      priority_score: 85
    });
  }

  // High churn risk insight
  if (summary.highRiskUsers > summary.totalUsers * 0.3) {
    insights.push({
      insight_type: 'retention_issue',
      title: 'High Churn Risk Users',
      description: `${summary.highRiskUsers} users (${Math.round(summary.highRiskUsers / summary.totalUsers * 100)}%) are at high risk of churning. Implement targeted re-engagement campaigns and personalized content recommendations.`,
      supporting_data: {
        highRiskUsers: summary.highRiskUsers,
        totalUsers: summary.totalUsers,
        churnRate: summary.highRiskUsers / summary.totalUsers
      },
      affected_user_count: summary.highRiskUsers,
      priority_score: 90
    });
  }

  // Feature usage imbalance
  const topFeature = summary.topFeatures[0];
  const featureUsageGap = topFeature && summary.topFeatures[1] ? 
    topFeature.usage_count / summary.topFeatures[1].usage_count : 1;
  
  if (featureUsageGap > 3) {
    insights.push({
      insight_type: 'ux_improvement',
      title: 'Feature Discovery Issues',
      description: `There's a significant usage gap between features. "${topFeature?.feature_name}" is used ${Math.round(featureUsageGap)}x more than other features. Improve feature discoverability and onboarding.`,
      supporting_data: {
        topFeature: topFeature?.feature_name,
        usageGap: featureUsageGap,
        featureDistribution: summary.topFeatures.slice(0, 3)
      },
      affected_user_count: Math.round(summary.totalUsers * 0.7),
      priority_score: 75
    });
  }

  // Learning content gaps
  const learningEvents = summary.eventTypes.learning_progress || 0;
  if (learningEvents < summary.totalEvents * 0.2) {
    insights.push({
      insight_type: 'content_gap',
      title: 'Low Learning Engagement',
      description: `Only ${Math.round(learningEvents / summary.totalEvents * 100)}% of events are learning-related. Users may need more structured learning paths, clearer progress indicators, or more engaging educational content.`,
      supporting_data: {
        learningEventRatio: learningEvents / summary.totalEvents,
        totalLearningEvents: learningEvents,
        totalEvents: summary.totalEvents
      },
      affected_user_count: summary.totalUsers,
      priority_score: 80
    });
  }

  // Voice interaction opportunity
  const voiceEvents = summary.eventTypes.voice_interaction || 0;
  if (voiceEvents < summary.totalEvents * 0.1 && voiceEvents > 0) {
    insights.push({
      insight_type: 'feature_request',
      title: 'Voice Feature Underutilized',
      description: `Voice interactions represent only ${Math.round(voiceEvents / summary.totalEvents * 100)}% of events despite being available. Consider promoting voice features more prominently or improving voice UI/UX.`,
      supporting_data: {
        voiceEventRatio: voiceEvents / summary.totalEvents,
        voiceEvents: voiceEvents,
        totalEvents: summary.totalEvents
      },
      affected_user_count: Math.round(summary.totalUsers * 0.8),
      priority_score: 65
    });
  }

  return insights;
}
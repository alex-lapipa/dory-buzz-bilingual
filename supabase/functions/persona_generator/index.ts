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
    const { userId, forceRefresh } = await req.json();
    
    console.log(`Generating persona for user: ${userId}`);

    // Check if persona already exists and is recent (unless force refresh)
    if (!forceRefresh) {
      const { data: existingPersona } = await supabase
        .from('user_personas')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingPersona) {
        const daysSinceUpdate = (Date.now() - new Date(existingPersona.calculated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) { // Refresh persona weekly
          return new Response(
            JSON.stringify({ persona: existingPersona, message: 'Using existing persona' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Gather user data for persona generation
    const userData = await gatherUserData(userId);
    
    // Generate persona using AI
    const persona = await generatePersonaWithAI(userData);
    
    // Save or update persona
    const { error } = await supabase
      .from('user_personas')
      .upsert({
        user_id: userId,
        ...persona,
        calculated_at: new Date().toISOString()
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        persona, 
        message: 'Persona generated successfully',
        dataPointsAnalyzed: userData.totalDataPoints
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Persona generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function gatherUserData(userId: string) {
  // Gather user events
  const { data: events } = await supabase
    .from('user_events')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
    .order('timestamp', { ascending: false });

  // Gather feature usage
  const { data: featureUsage } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId);

  // Gather sessions
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('started_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('started_at', { ascending: false });

  // Gather learning progress
  const { data: learningProgress } = await supabase
    .from('bee_learning_progress')
    .select('*')
    .eq('user_id', userId);

  // Gather user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    events: events || [],
    featureUsage: featureUsage || [],
    sessions: sessions || [],
    learningProgress: learningProgress || [],
    profile: profile || {},
    totalDataPoints: (events?.length || 0) + (featureUsage?.length || 0) + (sessions?.length || 0)
  };
}

async function generatePersonaWithAI(userData: any) {
  if (!openAIApiKey) {
    return generatePersonaFromRules(userData);
  }

  const prompt = `
Analyze this user behavior data and create a comprehensive user persona for a gardening/beekeeping education app:

User Profile: ${JSON.stringify(userData.profile)}
Recent Events (${userData.events.length}): ${JSON.stringify(userData.events.slice(0, 20))}
Feature Usage: ${JSON.stringify(userData.featureUsage)}
Sessions: ${JSON.stringify(userData.sessions.slice(0, 10))}
Learning Progress: ${JSON.stringify(userData.learningProgress)}

Based on this data, generate a user persona with these exact fields:
1. persona_type: One of ["beginner_gardener", "intermediate_gardener", "expert_gardener", "bee_enthusiast", "casual_learner", "dedicated_student", "educator", "researcher"]
2. characteristics: JSON object with traits like interests, skill_level, goals, etc.
3. engagement_level: "high", "medium", or "low"
4. preferred_features: Array of feature names they use most
5. learning_preferences: JSON object describing how they prefer to learn
6. usage_frequency: "daily", "weekly", "monthly", or "occasional"
7. risk_churn: Number 0-100 indicating likelihood to stop using the app
8. lifetime_value_score: Number representing their value as a user

Respond with valid JSON only.
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
          { role: 'system', content: 'You are an expert user behavior analyst specializing in educational apps.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const aiPersona = JSON.parse(data.choices[0].message.content);
    
    return aiPersona;
  } catch (error) {
    console.error('AI persona generation failed, using rule-based fallback:', error);
    return generatePersonaFromRules(userData);
  }
}

function generatePersonaFromRules(userData: any) {
  const { events, featureUsage, sessions, learningProgress } = userData;
  
  // Analyze engagement level
  const recentSessions = sessions.filter((s: any) => 
    new Date(s.started_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  let engagementLevel = 'low';
  if (recentSessions.length >= 5) engagementLevel = 'high';
  else if (recentSessions.length >= 2) engagementLevel = 'medium';

  // Determine usage frequency
  let usageFrequency = 'occasional';
  if (recentSessions.length >= 7) usageFrequency = 'daily';
  else if (recentSessions.length >= 3) usageFrequency = 'weekly';
  else if (recentSessions.length >= 1) usageFrequency = 'monthly';

  // Analyze feature preferences
  const topFeatures = featureUsage
    .sort((a: any, b: any) => b.usage_count - a.usage_count)
    .slice(0, 5)
    .map((f: any) => f.feature_name);

  // Determine persona type based on usage patterns
  let personaType = 'casual_learner';
  const voiceInteractions = events.filter((e: any) => e.event_type === 'voice_interaction').length;
  const learningEvents = events.filter((e: any) => e.event_type === 'learning_progress').length;
  
  if (learningEvents > 10 && engagementLevel === 'high') {
    personaType = 'dedicated_student';
  } else if (voiceInteractions > 5) {
    personaType = 'bee_enthusiast';
  } else if (topFeatures.some(f => f.includes('garden'))) {
    if (engagementLevel === 'high') personaType = 'expert_gardener';
    else if (engagementLevel === 'medium') personaType = 'intermediate_gardener';
    else personaType = 'beginner_gardener';
  }

  // Calculate churn risk
  const daysSinceLastSession = sessions.length > 0 ? 
    (Date.now() - new Date(sessions[0].started_at).getTime()) / (1000 * 60 * 60 * 24) : 30;
  let riskChurn = Math.min(daysSinceLastSession * 3, 95);

  // Calculate lifetime value
  const totalInteractions = events.length + sessions.length;
  const lifetimeValueScore = Math.min(totalInteractions * 2 + (engagementLevel === 'high' ? 50 : 0), 100);

  return {
    persona_type: personaType,
    characteristics: {
      engagement_pattern: engagementLevel,
      primary_interests: topFeatures.slice(0, 3),
      skill_level: personaType.includes('expert') ? 'advanced' : 
                  personaType.includes('intermediate') ? 'intermediate' : 'beginner',
      interaction_preference: voiceInteractions > events.length * 0.3 ? 'voice' : 'text',
      learning_style: learningEvents > 5 ? 'structured' : 'exploratory'
    },
    engagement_level: engagementLevel,
    preferred_features: topFeatures,
    learning_preferences: {
      pace: engagementLevel === 'high' ? 'fast' : 'moderate',
      format: voiceInteractions > 3 ? 'audio' : 'mixed',
      interaction: 'guided'
    },
    usage_frequency: usageFrequency,
    risk_churn: riskChurn,
    lifetime_value_score: lifetimeValueScore
  };
}
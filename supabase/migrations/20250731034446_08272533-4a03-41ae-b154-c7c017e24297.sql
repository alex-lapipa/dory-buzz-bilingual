-- Create user analytics and behavior tracking tables

-- User sessions tracking
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  pages_visited INTEGER DEFAULT 0,
  actions_taken INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User interactions and events
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'form_submit', 'voice_interaction', etc.
  event_name TEXT NOT NULL,
  page_url TEXT,
  element_id TEXT,
  element_class TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feature usage tracking
CREATE TABLE public.feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  first_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_time_spent_seconds INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- User preferences and behavior patterns
CREATE TABLE public.user_behavior_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  pattern_type TEXT NOT NULL, -- 'time_of_use', 'feature_preference', 'learning_style', etc.
  pattern_data JSONB NOT NULL,
  confidence_score DECIMAL(5,2) DEFAULT 0.00,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pattern_type)
);

-- User personas (derived from analytics)
CREATE TABLE public.user_personas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  persona_type TEXT NOT NULL, -- 'beginner_gardener', 'expert_beekeeper', 'casual_learner', etc.
  characteristics JSONB NOT NULL,
  engagement_level TEXT, -- 'high', 'medium', 'low'
  preferred_features TEXT[],
  learning_preferences JSONB,
  usage_frequency TEXT, -- 'daily', 'weekly', 'monthly', 'occasional'
  risk_churn DECIMAL(5,2) DEFAULT 0.00,
  lifetime_value_score DECIMAL(10,2) DEFAULT 0.00,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- App improvement suggestions (AI-generated insights)
CREATE TABLE public.improvement_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL, -- 'feature_request', 'ux_improvement', 'content_gap', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  supporting_data JSONB,
  affected_user_count INTEGER DEFAULT 0,
  priority_score DECIMAL(5,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewing', 'implementing', 'completed', 'rejected'
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all sessions" 
ON public.user_sessions 
FOR ALL 
USING (true);

-- RLS Policies for user_events
CREATE POLICY "Users can view their own events" 
ON public.user_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all events" 
ON public.user_events 
FOR ALL 
USING (true);

-- RLS Policies for feature_usage
CREATE POLICY "Users can view their own feature usage" 
ON public.feature_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all feature usage" 
ON public.feature_usage 
FOR ALL 
USING (true);

-- RLS Policies for user_behavior_patterns
CREATE POLICY "Users can view their own behavior patterns" 
ON public.user_behavior_patterns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all behavior patterns" 
ON public.user_behavior_patterns 
FOR ALL 
USING (true);

-- RLS Policies for user_personas
CREATE POLICY "Users can view their own persona" 
ON public.user_personas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all personas" 
ON public.user_personas 
FOR ALL 
USING (true);

-- RLS Policies for improvement_insights
CREATE POLICY "Admins can view all insights" 
ON public.improvement_insights 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can manage all insights" 
ON public.improvement_insights 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(started_at);
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_timestamp ON public.user_events(timestamp);
CREATE INDEX idx_user_events_type ON public.user_events(event_type);
CREATE INDEX idx_feature_usage_user_id ON public.feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature_name ON public.feature_usage(feature_name);
CREATE INDEX idx_user_behavior_patterns_user_id ON public.user_behavior_patterns(user_id);
CREATE INDEX idx_user_personas_user_id ON public.user_personas(user_id);
CREATE INDEX idx_user_personas_type ON public.user_personas(persona_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_feature_usage_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_used_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for feature_usage
CREATE TRIGGER update_feature_usage_updated_at
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_feature_usage_timestamps();

-- Create triggers for other tables
CREATE TRIGGER update_user_behavior_patterns_updated_at
  BEFORE UPDATE ON public.user_behavior_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_personas_updated_at
  BEFORE UPDATE ON public.user_personas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_improvement_insights_updated_at
  BEFORE UPDATE ON public.improvement_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
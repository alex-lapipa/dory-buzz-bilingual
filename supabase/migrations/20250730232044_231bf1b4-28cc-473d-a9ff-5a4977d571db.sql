-- Create production deployment tracking table
CREATE TABLE IF NOT EXISTS public.production_deployments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id TEXT NOT NULL UNIQUE,
  environment TEXT NOT NULL DEFAULT 'production',
  services TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  health_score INTEGER NOT NULL DEFAULT 0,
  deployed_by TEXT,
  deployment_time_ms INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.production_deployments ENABLE ROW LEVEL SECURITY;

-- Create policies for production deployments
CREATE POLICY "Anyone can view production deployments" 
ON public.production_deployments 
FOR SELECT 
USING (true);

CREATE POLICY "Service can manage production deployments" 
ON public.production_deployments 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_production_deployments_updated_at
BEFORE UPDATE ON public.production_deployments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create live system metrics table
CREATE TABLE IF NOT EXISTS public.live_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  environment TEXT NOT NULL DEFAULT 'production',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_type, metric_name, environment, recorded_at)
);

-- Enable RLS
ALTER TABLE public.live_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for live metrics
CREATE POLICY "Anyone can view live metrics" 
ON public.live_metrics 
FOR SELECT 
USING (true);

CREATE POLICY "Service can insert live metrics" 
ON public.live_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_live_metrics_type_time ON public.live_metrics(metric_type, recorded_at DESC);
CREATE INDEX idx_live_metrics_env_time ON public.live_metrics(environment, recorded_at DESC);
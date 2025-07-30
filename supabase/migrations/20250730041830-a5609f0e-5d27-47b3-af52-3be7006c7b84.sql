-- Create mochi_integrations table for tracking integration health
CREATE TABLE IF NOT EXISTS public.mochi_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  model TEXT,
  message_length INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mochi_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage mochi_integrations" 
ON public.mochi_integrations 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to view integration health
CREATE POLICY "Users can view integration health" 
ON public.mochi_integrations 
FOR SELECT 
TO authenticated
USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mochi_integrations_platform_created 
ON public.mochi_integrations(platform, created_at DESC);

-- Create system health table
CREATE TABLE IF NOT EXISTS public.system_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  response_time_ms INTEGER,
  error_message TEXT,
  last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS for system_health
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Policies for system_health
CREATE POLICY "Service role can manage system_health" 
ON public.system_health 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view system health" 
ON public.system_health 
FOR SELECT 
TO authenticated, anon
USING (true);
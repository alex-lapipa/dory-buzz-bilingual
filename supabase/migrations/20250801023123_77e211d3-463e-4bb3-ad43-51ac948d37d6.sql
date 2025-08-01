-- Fix database security issues identified by linter

-- 1. Fix function search paths for security
ALTER FUNCTION public.update_conversation_stats() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';

-- 2. Tighten RLS policies - Remove overly permissive anonymous access where inappropriate

-- Update bee_facts policy to be more restrictive
DROP POLICY IF EXISTS "Everyone can read bee facts" ON public.bee_facts;
CREATE POLICY "Authenticated users can read bee facts"
ON public.bee_facts FOR SELECT 
TO authenticated
USING (true);

-- Update live_metrics to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view live metrics" ON public.live_metrics;
CREATE POLICY "Authenticated users can view live metrics"
ON public.live_metrics FOR SELECT
TO authenticated
USING (true);

-- Update mochi_assets to require authentication for management
DROP POLICY IF EXISTS "Mochi assets are viewable by everyone" ON public.mochi_assets;
CREATE POLICY "Authenticated users can view mochi assets"
ON public.mochi_assets FOR SELECT
TO authenticated
USING (true);

-- Update system_health to require authentication
DROP POLICY IF EXISTS "Users can view system health" ON public.system_health;
CREATE POLICY "Authenticated users can view system health"
ON public.system_health FOR SELECT
TO authenticated
USING (true);

-- Update mochi_integrations to require authentication
DROP POLICY IF EXISTS "Users can view integration health" ON public.mochi_integrations;
CREATE POLICY "Authenticated users can view integration health"  
ON public.mochi_integrations FOR SELECT
TO authenticated
USING (true);

-- Update production_deployments to require authentication
DROP POLICY IF EXISTS "Anyone can view production deployments" ON public.production_deployments;
CREATE POLICY "Authenticated users can view production deployments"
ON public.production_deployments FOR SELECT
TO authenticated
USING (true);
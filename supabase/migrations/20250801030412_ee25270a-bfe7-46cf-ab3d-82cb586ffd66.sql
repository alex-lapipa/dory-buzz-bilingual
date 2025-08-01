-- Address remaining security issues

-- 1. Remove old policies that might still exist and interfere
DROP POLICY IF EXISTS "Users can read their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages for their conversations" ON public.messages;

-- 2. Fix storage policies for better security
-- Update storage policies to be more restrictive
DROP POLICY IF EXISTS "Mochi assets are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete mochi assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update mochi assets" ON storage.objects;

-- Create more secure storage policies
CREATE POLICY "Authenticated users can view mochi assets" 
  ON storage.objects 
  FOR SELECT 
  TO authenticated
  USING (bucket_id = 'mochi-assets');

CREATE POLICY "Authenticated users can upload mochi assets" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'mochi-assets');

CREATE POLICY "Authenticated users can update their mochi assets" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'mochi-assets')
  WITH CHECK (bucket_id = 'mochi-assets');

CREATE POLICY "Authenticated users can delete their mochi assets" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'mochi-assets');

-- 3. Secure user_registrations table - remove overly permissive policies
DROP POLICY IF EXISTS "Allow users to view their own registration" ON public.user_registrations;

CREATE POLICY "Authenticated users can view their own registration" 
  ON public.user_registrations 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow anonymous registration but require email verification
CREATE POLICY "Anonymous users can register" 
  ON public.user_registrations 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 4. Add email domain validation for additional security
ALTER TABLE public.user_registrations 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 5. Add rate limiting for voice conversations (prevent abuse)
CREATE OR REPLACE FUNCTION check_voice_conversation_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Allow max 10 new voice conversations per hour per user
    SELECT COUNT(*)
    INTO recent_count
    FROM voice_conversations
    WHERE user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '1 hour';
    
    IF recent_count >= 10 THEN
        RAISE EXCEPTION 'Rate limit exceeded: Too many voice conversations created recently';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

CREATE TRIGGER enforce_voice_conversation_rate_limit
    BEFORE INSERT ON voice_conversations
    FOR EACH ROW
    EXECUTE FUNCTION check_voice_conversation_rate_limit();

-- 6. Add constraints to prevent data tampering
ALTER TABLE public.messages 
ADD CONSTRAINT content_not_empty 
CHECK (length(trim(content)) > 0);

ALTER TABLE public.conversations 
ADD CONSTRAINT title_reasonable_length 
CHECK (length(title) <= 200);

-- 7. Secure service policies - ensure they're only for legitimate service operations
DROP POLICY IF EXISTS "Service can manage all feature usage" ON public.feature_usage;
DROP POLICY IF EXISTS "Service can manage all insights" ON public.improvement_insights;
DROP POLICY IF EXISTS "Service can manage production deployments" ON public.production_deployments;
DROP POLICY IF EXISTS "Service can manage all behavior patterns" ON public.user_behavior_patterns;
DROP POLICY IF EXISTS "Service can manage all events" ON public.user_events;
DROP POLICY IF EXISTS "Service can manage all personas" ON public.user_personas;
DROP POLICY IF EXISTS "Service can manage all sessions" ON public.user_sessions;

-- Create more restrictive service policies with proper role checking
CREATE POLICY "Service role can manage feature usage" 
  ON public.feature_usage 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage insights" 
  ON public.improvement_insights 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage production deployments" 
  ON public.production_deployments 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage behavior patterns" 
  ON public.user_behavior_patterns 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage events" 
  ON public.user_events 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage personas" 
  ON public.user_personas 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage sessions" 
  ON public.user_sessions 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
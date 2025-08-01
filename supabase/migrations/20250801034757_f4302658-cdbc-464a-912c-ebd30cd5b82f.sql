-- Fix user profile creation and data collection for consumer profiling

-- First, ensure the handle_new_user function is properly created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile with all available user metadata
  INSERT INTO public.profiles (
    id, 
    email, 
    display_name, 
    age, 
    language
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name', 
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'age' ~ '^[0-9]+$' 
      THEN (NEW.raw_user_meta_data ->> 'age')::integer 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create default preferences for consumer profiling
  INSERT INTO public.user_preferences (
    user_id, 
    language_preference,
    theme,
    email_notifications,
    push_notifications,
    marketing_emails
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en'),
    'system',
    true,
    true,
    false -- Default to false for GDPR compliance
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create initial analytics tracking entry
  INSERT INTO public.user_sessions (
    user_id,
    session_id,
    started_at,
    device_type,
    browser,
    actions_taken,
    pages_visited
  )
  VALUES (
    NEW.id,
    gen_random_uuid()::text,
    now(),
    'web',
    'signup',
    1,
    1
  );
  
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Improve the user_registrations table for better consumer profiling
ALTER TABLE public.user_registrations 
ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS utm_params JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS signup_ip inet,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add index for better analytics queries
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON public.user_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_user_registrations_language ON public.user_registrations(language);
CREATE INDEX IF NOT EXISTS idx_user_registrations_age ON public.user_registrations(age);

-- Update RLS policies for better data access
CREATE POLICY "Analytics team can view aggregated registration data"
ON public.user_registrations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'analytics')
  )
);

-- Create function to track user behavior for consumer profiling
CREATE OR REPLACE FUNCTION public.track_user_event(
  p_event_name TEXT,
  p_event_type TEXT DEFAULT 'interaction',
  p_page_url TEXT DEFAULT NULL,
  p_element_id TEXT DEFAULT NULL,
  p_element_class TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
  session_id_val TEXT;
BEGIN
  -- Get or create session ID
  session_id_val := COALESCE(
    current_setting('app.session_id', true),
    gen_random_uuid()::text
  );
  
  -- Insert event
  INSERT INTO public.user_events (
    user_id,
    event_name,
    event_type,
    page_url,
    element_id,
    element_class,
    session_id,
    metadata
  )
  VALUES (
    auth.uid(),
    p_event_name,
    p_event_type,
    p_page_url,
    p_element_id,
    p_element_class,
    session_id_val,
    p_metadata
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.track_user_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_user_event TO anon;
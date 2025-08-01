-- Fix security issues identified by Supabase linter

-- 1. Fix function search_path issues by updating existing functions
CREATE OR REPLACE FUNCTION public.update_conversation_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.last_interaction_at = now();
  
  -- Update message count from JSONB data
  NEW.total_messages = COALESCE(
    jsonb_array_length(NEW.conversation_data->'messages'), 
    0
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.update_feature_usage_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.last_used_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, display_name, age, language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'name'),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'age' ~ '^[0-9]+$' 
      THEN (NEW.raw_user_meta_data ->> 'age')::integer 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id, language_preference)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'language', 'en'));
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_last_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_user_registration_conflicts()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow updates to existing registrations
  IF TG_OP = 'INSERT' THEN
    -- Check if email already exists and update instead
    IF EXISTS (SELECT 1 FROM user_registrations WHERE email = NEW.email) THEN
      UPDATE user_registrations 
      SET age = NEW.age, language = NEW.language, updated_at = now()
      WHERE email = NEW.email;
      RETURN NULL; -- Skip the INSERT
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. Tighten RLS policies to reduce anonymous access where appropriate
-- Remove overly permissive anonymous policies and replace with more secure ones

-- Update bee_facts policies to only allow authenticated users for reading
DROP POLICY IF EXISTS "Authenticated users can read bee facts" ON public.bee_facts;
CREATE POLICY "Authenticated users can read bee facts" 
  ON public.bee_facts 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update bee_learning_progress to require authentication
DROP POLICY IF EXISTS "Users can view their own progress" ON public.bee_learning_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.bee_learning_progress;

CREATE POLICY "Authenticated users can view their own progress" 
  ON public.bee_learning_progress 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own progress" 
  ON public.bee_learning_progress 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update conversations to be more restrictive for anonymous users
DROP POLICY IF EXISTS "Anyone can view conversations they have access to" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations or guest conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversations or guest conversations" ON public.conversations;

CREATE POLICY "Authenticated users can view their own conversations" 
  ON public.conversations 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own conversations" 
  ON public.conversations 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own conversations" 
  ON public.conversations 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow guest conversations only for specific use cases
CREATE POLICY "Guest conversations access" 
  ON public.conversations 
  FOR ALL 
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Update messages policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can delete messages in accessible conversations" ON public.messages;
DROP POLICY IF EXISTS "Anyone can update messages in accessible conversations" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view messages from accessible conversations" ON public.messages;

CREATE POLICY "Authenticated users can manage messages in their conversations" 
  ON public.messages 
  FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.user_id = auth.uid()
  ));

-- Allow guest messages only for guest conversations
CREATE POLICY "Guest messages access" 
  ON public.messages 
  FOR ALL 
  TO anon
  USING (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.user_id IS NULL
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.user_id IS NULL
  ));

-- Update mochi_assets to only allow authenticated users
DROP POLICY IF EXISTS "Authenticated users can view mochi assets" ON public.mochi_assets;
CREATE POLICY "Authenticated users can view mochi assets" 
  ON public.mochi_assets 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Restrict mochi_assets management to authenticated users only
DROP POLICY IF EXISTS "Authenticated users can manage mochi assets" ON public.mochi_assets;
CREATE POLICY "Authenticated users can manage mochi assets" 
  ON public.mochi_assets 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update live_metrics to only allow authenticated access
DROP POLICY IF EXISTS "Authenticated users can view live metrics" ON public.live_metrics;
CREATE POLICY "Authenticated users can view live metrics" 
  ON public.live_metrics 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update mochi_integrations to require authentication
DROP POLICY IF EXISTS "Authenticated users can view integration health" ON public.mochi_integrations;
CREATE POLICY "Authenticated users can view integration health" 
  ON public.mochi_integrations 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update production_deployments to require authentication
DROP POLICY IF EXISTS "Authenticated users can view production deployments" ON public.production_deployments;
CREATE POLICY "Authenticated users can view production deployments" 
  ON public.production_deployments 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update system_health to require authentication
DROP POLICY IF EXISTS "Authenticated users can view system health" ON public.system_health;
CREATE POLICY "Authenticated users can view system health" 
  ON public.system_health 
  FOR SELECT 
  TO authenticated
  USING (true);

-- 3. Add proper constraints and validation
-- Ensure user_id columns are not nullable where they should reference authenticated users
ALTER TABLE public.voice_conversations ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_preferences ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_roles ALTER COLUMN user_id SET NOT NULL;
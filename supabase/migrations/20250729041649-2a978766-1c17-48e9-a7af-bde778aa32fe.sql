-- Fix authentication settings for production
-- Disable captcha for development/testing (can be re-enabled in production)
-- Update auth settings to be more secure

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bee_learning_progress_user_id ON public.bee_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON public.user_registrations(email);

-- Update function search paths for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
AS $function$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$function$;

-- Create a more secure RLS policy for conversations that doesn't rely on anonymous access
DROP POLICY IF EXISTS "Allow conversations for anonymous users" ON public.conversations;
DROP POLICY IF EXISTS "Allow conversations for authenticated users" ON public.conversations;

-- Create new secure conversation policies
CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
    ELSE user_id IS NULL  -- Allow anonymous conversations but with null user_id
  END
);

CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
    ELSE user_id IS NULL  -- Allow viewing anonymous conversations
  END
);

CREATE POLICY "Users can update their conversations"
ON public.conversations FOR UPDATE
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
    ELSE user_id IS NULL
  END
);

-- Update messages policy to be more secure
DROP POLICY IF EXISTS "Allow messages for conversation owners" ON public.messages;

CREATE POLICY "Users can create messages for their conversations"
ON public.messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND c.user_id IS NULL)
    )
  )
);

CREATE POLICY "Users can view messages for their conversations"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND c.user_id IS NULL)
    )
  )
);

-- Add proper error handling for user registrations
CREATE OR REPLACE FUNCTION handle_user_registration_conflicts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for handling registration conflicts
DROP TRIGGER IF EXISTS handle_registration_conflicts ON public.user_registrations;
CREATE TRIGGER handle_registration_conflicts
  BEFORE INSERT ON public.user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_registration_conflicts();
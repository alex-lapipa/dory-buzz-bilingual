-- Fix RLS policies for voice_conversations to remove anonymous access
DROP POLICY IF EXISTS "Users can view their own voice conversations" ON public.voice_conversations;
DROP POLICY IF EXISTS "Users can create their own voice conversations" ON public.voice_conversations;
DROP POLICY IF EXISTS "Users can update their own voice conversations" ON public.voice_conversations;
DROP POLICY IF EXISTS "Users can delete their own voice conversations" ON public.voice_conversations;

-- Create secure RLS policies (authenticated users only)
CREATE POLICY "Authenticated users can view their own voice conversations"
  ON public.voice_conversations
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own voice conversations"
  ON public.voice_conversations
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own voice conversations"
  ON public.voice_conversations
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own voice conversations"
  ON public.voice_conversations
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Make user_id not nullable for security
ALTER TABLE public.voice_conversations 
ALTER COLUMN user_id SET NOT NULL;
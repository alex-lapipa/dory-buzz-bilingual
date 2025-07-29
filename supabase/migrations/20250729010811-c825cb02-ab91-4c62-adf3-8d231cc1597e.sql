-- Update RLS policies to support anonymous users
-- First, let's create more permissive policies for anonymous/guest users

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;

DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON public.messages;

-- Create new policies that work with both authenticated and anonymous users
CREATE POLICY "Allow conversations for authenticated users" 
ON public.conversations 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow anonymous users (when auth.uid() is null, use a session-based approach)
CREATE POLICY "Allow conversations for anonymous users" 
ON public.conversations 
FOR ALL 
USING (auth.uid() IS NULL OR auth.uid() = user_id)
WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- Update messages policies to work with the new conversation policies
CREATE POLICY "Allow messages for conversation owners" 
ON public.messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      (auth.uid() IS NOT NULL AND conversations.user_id = auth.uid()) OR
      (auth.uid() IS NULL)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      (auth.uid() IS NOT NULL AND conversations.user_id = auth.uid()) OR
      (auth.uid() IS NULL)
    )
  )
);

-- Make user_id nullable in conversations to support guest users
ALTER TABLE public.conversations ALTER COLUMN user_id DROP NOT NULL;
-- Fix conversations table to allow guest users to create conversations
-- Add policy for anonymous users to create conversations
CREATE POLICY "Anonymous users can create conversations" 
ON public.conversations 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- Add policy for anonymous users to create messages
CREATE POLICY "Anonymous users can create messages" 
ON public.messages 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Add policy for anonymous users to view their own messages (conversation-based)
CREATE POLICY "Anonymous users can view messages" 
ON public.messages 
FOR SELECT 
TO anon
USING (true);
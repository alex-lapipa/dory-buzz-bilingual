-- Fix RLS policies for conversations to allow guest users and authenticated users
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;

-- Create new policies that support both authenticated users and guest sessions
CREATE POLICY "Anyone can view conversations they have access to" 
ON conversations 
FOR SELECT 
USING (
  -- Allow if user_id matches authenticated user
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR 
  -- Allow if it's a guest conversation (user_id is null)
  (user_id IS NULL)
);

CREATE POLICY "Anyone can create conversations" 
ON conversations 
FOR INSERT 
WITH CHECK (
  -- Allow authenticated users to create with their user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR 
  -- Allow guest users to create conversations with null user_id
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- Allow authenticated users to create guest conversations
  (user_id IS NULL)
);

CREATE POLICY "Users can update their own conversations or guest conversations" 
ON conversations 
FOR UPDATE 
USING (
  -- Allow if user_id matches authenticated user
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR 
  -- Allow if it's a guest conversation (user_id is null)
  (user_id IS NULL)
);

CREATE POLICY "Users can delete their own conversations or guest conversations" 
ON conversations 
FOR DELETE 
USING (
  -- Allow if user_id matches authenticated user
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR 
  -- Allow if it's a guest conversation (user_id is null)
  (user_id IS NULL)
);

-- Fix RLS policies for messages to allow guest users
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can create their own messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- Create new policies for messages that support guest conversations
CREATE POLICY "Anyone can view messages from accessible conversations" 
ON messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      -- User owns the conversation
      (auth.uid() IS NOT NULL AND auth.uid() = conversations.user_id)
      OR 
      -- It's a guest conversation
      (conversations.user_id IS NULL)
    )
  )
);

CREATE POLICY "Anyone can create messages in accessible conversations" 
ON messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      -- User owns the conversation
      (auth.uid() IS NOT NULL AND auth.uid() = conversations.user_id)
      OR 
      -- It's a guest conversation
      (conversations.user_id IS NULL)
    )
  )
);

CREATE POLICY "Anyone can update messages in accessible conversations" 
ON messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      -- User owns the conversation
      (auth.uid() IS NOT NULL AND auth.uid() = conversations.user_id)
      OR 
      -- It's a guest conversation
      (conversations.user_id IS NULL)
    )
  )
);

CREATE POLICY "Anyone can delete messages in accessible conversations" 
ON messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      -- User owns the conversation
      (auth.uid() IS NOT NULL AND auth.uid() = conversations.user_id)
      OR 
      -- It's a guest conversation
      (conversations.user_id IS NULL)
    )
  )
);
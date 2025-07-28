-- Make user_id non-nullable for better security
ALTER TABLE public.conversations 
ALTER COLUMN user_id SET NOT NULL;

-- Add a check constraint to ensure user_id matches auth.uid() for new data
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_user_id_check 
CHECK (user_id = auth.uid());
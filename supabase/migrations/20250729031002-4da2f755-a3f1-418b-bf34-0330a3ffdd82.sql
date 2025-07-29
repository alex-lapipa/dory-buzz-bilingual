-- Clean up existing messages and fix the constraint issue
DELETE FROM public.messages;

-- Drop the old constraint  
ALTER TABLE public.messages DROP CONSTRAINT messages_type_check;

-- Add the new constraint that allows 'user' and 'mochi' types
ALTER TABLE public.messages ADD CONSTRAINT messages_type_check CHECK (type = ANY (ARRAY['user'::text, 'mochi'::text]));
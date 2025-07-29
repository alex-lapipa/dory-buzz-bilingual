-- Update the messages table check constraint to allow 'mochi' type
ALTER TABLE public.messages DROP CONSTRAINT messages_type_check;
ALTER TABLE public.messages ADD CONSTRAINT messages_type_check CHECK (type = ANY (ARRAY['user'::text, 'mochi'::text]));
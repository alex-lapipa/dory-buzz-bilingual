-- Create user registrations table to store email and age
CREATE TABLE public.user_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous users to register" 
ON public.user_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow users to view their own registration" 
ON public.user_registrations 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_registrations_updated_at
BEFORE UPDATE ON public.user_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
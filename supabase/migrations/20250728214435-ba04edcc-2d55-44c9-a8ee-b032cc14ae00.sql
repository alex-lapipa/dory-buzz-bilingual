-- Fix function search path security issue
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Set secure search path for any other functions we might add
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
-- Create table for storing Mochi character assets
CREATE TABLE IF NOT EXISTS public.mochi_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type TEXT NOT NULL, -- 'character', 'expression', 'pose'
  file_path TEXT NOT NULL,
  file_url TEXT,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mochi_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Mochi assets are viewable by everyone" 
ON public.mochi_assets 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage assets
CREATE POLICY "Authenticated users can manage mochi assets" 
ON public.mochi_assets 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mochi_assets_updated_at
BEFORE UPDATE ON public.mochi_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for mochi character assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('mochi-assets', 'mochi-assets', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for mochi assets
CREATE POLICY "Mochi assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mochi-assets');

CREATE POLICY "Authenticated users can upload mochi assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mochi-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update mochi assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'mochi-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete mochi assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'mochi-assets' AND auth.uid() IS NOT NULL);
-- Final security fixes - handle existing data gracefully

-- 1. First, fix any messages that are too long by truncating them
UPDATE public.messages 
SET content = LEFT(content, 9999) || '...' 
WHERE length(content) > 10000;

-- 2. Now add the constraint safely
ALTER TABLE public.messages 
ADD CONSTRAINT content_reasonable_length 
CHECK (length(content) <= 10000);

-- 3. Create secure storage policies for mochi-assets bucket
DROP POLICY IF EXISTS "Secure mochi assets read access" ON storage.objects;
DROP POLICY IF EXISTS "Secure mochi assets upload" ON storage.objects;
DROP POLICY IF EXISTS "Secure mochi assets update" ON storage.objects;
DROP POLICY IF EXISTS "Secure mochi assets delete" ON storage.objects;

CREATE POLICY "Mochi assets authenticated read" 
  ON storage.objects 
  FOR SELECT 
  TO authenticated
  USING (bucket_id = 'mochi-assets');

CREATE POLICY "Mochi assets authenticated upload" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'mochi-assets');

CREATE POLICY "Mochi assets authenticated update" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'mochi-assets')
  WITH CHECK (bucket_id = 'mochi-assets');

CREATE POLICY "Mochi assets authenticated delete" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'mochi-assets');

-- 4. Fix user_registrations policies
DROP POLICY IF EXISTS "Secure registration viewing" ON public.user_registrations;
DROP POLICY IF EXISTS "Secure anonymous registration" ON public.user_registrations;

CREATE POLICY "Registration viewing for authenticated" 
  ON public.user_registrations 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous registration allowed" 
  ON public.user_registrations 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 5. Create conversation rate limiting
CREATE OR REPLACE FUNCTION check_conversation_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- For authenticated users, limit to 20 conversations per hour
    IF NEW.user_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO recent_count
        FROM conversations
        WHERE user_id = NEW.user_id
          AND created_at > NOW() - INTERVAL '1 hour';
        
        IF recent_count >= 20 THEN
            RAISE EXCEPTION 'Rate limit exceeded: Too many conversations created recently';
        END IF;
    ELSE
        -- For anonymous users, limit to 50 total per hour (global limit)
        SELECT COUNT(*)
        INTO recent_count
        FROM conversations
        WHERE user_id IS NULL
          AND created_at > NOW() - INTERVAL '1 hour';
        
        IF recent_count >= 50 THEN
            RAISE EXCEPTION 'Rate limit exceeded: Too many anonymous conversations';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS enforce_conversation_rate_limit ON conversations;

CREATE TRIGGER enforce_conversation_rate_limit
    BEFORE INSERT ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION check_conversation_rate_limit();
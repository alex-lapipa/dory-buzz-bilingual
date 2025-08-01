-- Update system health with current status
UPDATE system_health 
SET status = 'unhealthy', 
    error_message = 'Insufficient credits - please add billing',
    last_check = NOW()
WHERE service_name = 'Anthropic Claude API';

-- Insert missing service checks if not exist
INSERT INTO system_health (service_name, status, error_message, last_check)
VALUES 
  ('ElevenLabs TTS', 'needs_verification', 'Pending API verification', NOW()),
  ('Image Generation', 'needs_verification', 'Pending OpenAI verification', NOW())
ON CONFLICT (service_name) DO UPDATE SET
  status = EXCLUDED.status,
  error_message = EXCLUDED.error_message,
  last_check = EXCLUDED.last_check;
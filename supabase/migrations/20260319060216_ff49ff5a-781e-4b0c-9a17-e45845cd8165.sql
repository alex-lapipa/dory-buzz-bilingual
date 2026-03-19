SELECT cron.schedule(
  'voice-agent-health-check',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/voice_agent_monitor',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg"}'::jsonb,
        body:='{"time": "now"}'::jsonb
    ) as request_id;
  $$
);
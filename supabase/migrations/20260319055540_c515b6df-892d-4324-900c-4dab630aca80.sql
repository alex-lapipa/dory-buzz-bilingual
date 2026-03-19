
CREATE TABLE public.voice_agent_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  agent_id text NOT NULL,
  status text NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'down')),
  error_message text,
  quota_remaining integer,
  response_time_ms integer,
  checked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_agent_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read voice agent health"
  ON public.voice_agent_health FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert voice agent health"
  ON public.voice_agent_health FOR INSERT
  WITH CHECK (true);

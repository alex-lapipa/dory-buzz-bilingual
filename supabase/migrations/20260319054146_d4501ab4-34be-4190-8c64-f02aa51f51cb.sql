
CREATE TABLE public.response_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rag_query_id uuid REFERENCES public.rag_queries(id) ON DELETE SET NULL,
  user_id uuid,
  session_id text,
  rating smallint NOT NULL CHECK (rating IN (-1, 1)),
  comment text,
  message_content text,
  agent_used text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.response_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can insert feedback (guests use session_id, auth users use user_id)
CREATE POLICY "Anyone can insert feedback"
  ON public.response_feedback FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.response_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.response_feedback FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role full access
CREATE POLICY "Service role full access"
  ON public.response_feedback FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

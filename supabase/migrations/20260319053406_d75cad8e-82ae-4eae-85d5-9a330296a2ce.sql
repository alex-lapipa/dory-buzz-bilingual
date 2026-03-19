
ALTER TABLE public.rag_queries 
  ADD COLUMN IF NOT EXISTS agent_used text,
  ADD COLUMN IF NOT EXISTS intent_confidence double precision,
  ADD COLUMN IF NOT EXISTS intent_matched text;

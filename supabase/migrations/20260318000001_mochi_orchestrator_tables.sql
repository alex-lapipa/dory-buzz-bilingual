-- ============================================================
-- MOCHI MASTER ORCHESTRATOR — Tables, functions, seeds
-- Migration: 20260318000001_mochi_orchestrator_tables.sql
-- Safe: All statements use IF NOT EXISTS / ON CONFLICT DO NOTHING
-- ============================================================

CREATE TABLE IF NOT EXISTS agents (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL UNIQUE,
  role             text NOT NULL,
  description      text,
  model_preference text DEFAULT 'claude-sonnet-4-20250514',
  system_prompt    text,
  capabilities     jsonb DEFAULT '[]',
  is_active        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     uuid REFERENCES agents(id) ON DELETE SET NULL,
  user_id      uuid,
  session_id   text,
  intent       text,
  input_text   text,
  output_text  text,
  model_used   text,
  tokens_in    integer DEFAULT 0,
  tokens_out   integer DEFAULT 0,
  latency_ms   integer DEFAULT 0,
  status       text DEFAULT 'pending' CHECK (status IN ('pending','running','done','error')),
  metadata     jsonb DEFAULT '{}',
  created_at   timestamptz DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_user_id ON agent_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created ON agent_tasks(created_at DESC);

CREATE TABLE IF NOT EXISTS model_routes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_pattern text NOT NULL,
  agent_name     text NOT NULL,
  model          text NOT NULL,
  priority       integer DEFAULT 10,
  conditions     jsonb DEFAULT '{}',
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_model_routes_priority ON model_routes(priority ASC, is_active);

CREATE TABLE IF NOT EXISTS vector_stores (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  table_name      text NOT NULL,
  embedding_col   text DEFAULT 'embedding',
  content_col     text DEFAULT 'content',
  dimensions      integer DEFAULT 1536,
  total_chunks    integer DEFAULT 0,
  embedded_chunks integer DEFAULT 0,
  last_embedded   timestamptz,
  metadata        jsonb DEFAULT '{}',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

INSERT INTO agents (name, role, description, model_preference, system_prompt, capabilities)
VALUES
  ('mochi-orchestrator', 'master_orchestrator', 'Mochi the Garden Bee — master agent', 'claude-sonnet-4-20250514',
   'You are Mochi de los Huertos, a cheerful bilingual bee who teaches about bees, nature, permaculture. Always warm, curious, age-appropriate.',
   '["intent_classification","agent_routing","rag_retrieval","model_selection"]'),
  ('mochi-rag', 'rag_agent', 'RAG from mochi_knowledge_base', 'claude-sonnet-4-20250514',
   'You are Mochi. Retrieve knowledge first. Be concise and child-friendly.',
   '["vector_search","knowledge_retrieval","bilingual_response"]'),
  ('mochi-bee-facts', 'facts_agent', 'Curated bee facts', 'claude-sonnet-4-20250514',
   'You are Mochi the bee. Share fun, accurate bee facts for ages 4-12.',
   '["bee_facts","child_safe","bilingual"]'),
  ('mochi-voice', 'voice_agent', 'ElevenLabs TTS', 'elevenlabs',
   NULL, '["text_to_speech","bilingual_es_en"]'),
  ('mochi-language', 'language_agent', 'Bilingual microlearning', 'claude-sonnet-4-20250514',
   'You are Mochi, a language guide. Teach one word at a time in English and Spanish.',
   '["vocabulary_teaching","bilingual_es_en","microlearning"]'),
  ('mochi-garden', 'garden_agent', 'Permaculture and agroecology', 'claude-sonnet-4-20250514',
   'You are Mochi, a permaculture expert. Connect garden advice to pollinators and biodiversity.',
   '["permaculture","agroecology","garden_advice","biodiversity"]')
ON CONFLICT (name) DO NOTHING;

INSERT INTO model_routes (intent_pattern, agent_name, model, priority) VALUES
  ('bee|honey|hive|queen|pollen|nectar|waggle|colony|worker|drone|larvae|comb|wax', 'mochi-bee-facts', 'claude-sonnet-4-20250514', 10),
  ('word|vocabulary|say|translate|español|english|bilingual|learn|teach', 'mochi-language', 'claude-sonnet-4-20250514', 10),
  ('garden|plant|flower|seed|permaculture|agroecology|soil|compost|food|tomato|harvest|biodiversity', 'mochi-garden', 'claude-sonnet-4-20250514', 10),
  ('explain|learn|what is|how does|why do|tell me about', 'mochi-rag', 'claude-sonnet-4-20250514', 20),
  ('speak|listen|voice|audio|hear|sound|play', 'mochi-voice', 'elevenlabs', 10),
  ('.*', 'mochi-orchestrator', 'claude-sonnet-4-20250514', 99)
ON CONFLICT DO NOTHING;

INSERT INTO vector_stores (name, table_name, embedding_col, content_col, dimensions, total_chunks) VALUES
  ('mochi_knowledge_base', 'mochi_knowledge_base', 'embedding', 'content', 1536, 60),
  ('bee_facts', 'bee_facts', NULL, 'content', 1536, 99)
ON CONFLICT (name) DO NOTHING;

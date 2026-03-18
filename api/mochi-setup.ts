import type { VercelRequest, VercelResponse } from "@vercel/node";

const SB_URL = "https://zrdywdregcrykmbiytvl.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg";
const SBP = "sbp_e6fa2634a8f24038346a53da90248f2f0d7f84cf";
const PROJECT = "zrdywdregcrykmbiytvl";
const SETUP_SECRET = "mochi-bee-setup-2026";

const STATEMENTS: { label: string; sql: string }[] = [
  {
    label: "Create agents table",
    sql: `CREATE TABLE IF NOT EXISTS agents (
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
    )`
  },
  {
    label: "Create agent_tasks table",
    sql: `CREATE TABLE IF NOT EXISTS agent_tasks (
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
    )`
  },
  {
    label: "Create agent_tasks indexes",
    sql: `CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_id ON agent_tasks(agent_id);
    CREATE INDEX IF NOT EXISTS idx_agent_tasks_user_id ON agent_tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_agent_tasks_created ON agent_tasks(created_at DESC)`
  },
  {
    label: "Create model_routes table",
    sql: `CREATE TABLE IF NOT EXISTS model_routes (
      id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      intent_pattern text NOT NULL,
      agent_name     text NOT NULL,
      model          text NOT NULL,
      priority       integer DEFAULT 10,
      conditions     jsonb DEFAULT '{}',
      is_active      boolean DEFAULT true,
      created_at     timestamptz DEFAULT now()
    )`
  },
  {
    label: "Create model_routes index",
    sql: "CREATE INDEX IF NOT EXISTS idx_model_routes_priority ON model_routes(priority ASC, is_active)"
  },
  {
    label: "Create vector_stores table",
    sql: `CREATE TABLE IF NOT EXISTS vector_stores (
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
    )`
  },
  {
    label: "Create orchestrate_mochi_request function",
    sql: `CREATE OR REPLACE FUNCTION orchestrate_mochi_request(
      p_input text, p_user_id uuid DEFAULT NULL,
      p_session text DEFAULT NULL, p_language text DEFAULT 'en'
    ) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
    DECLARE
      v_route model_routes%ROWTYPE;
      v_agent agents%ROWTYPE;
      v_task_id uuid;
    BEGIN
      SELECT r.* INTO v_route FROM model_routes r
      WHERE r.is_active = true AND (p_input ~* r.intent_pattern OR r.intent_pattern = '.*')
      ORDER BY r.priority ASC LIMIT 1;
      SELECT a.* INTO v_agent FROM agents a
      WHERE a.name = v_route.agent_name AND a.is_active = true;
      INSERT INTO agent_tasks (agent_id, user_id, session_id, intent, input_text, model_used, status)
      VALUES (v_agent.id, p_user_id, p_session, v_route.intent_pattern, p_input, v_route.model, 'pending')
      RETURNING id INTO v_task_id;
      RETURN jsonb_build_object(
        'task_id', v_task_id, 'agent', v_agent.name, 'role', v_agent.role,
        'model', v_route.model, 'system_prompt', v_agent.system_prompt,
        'capabilities', v_agent.capabilities, 'intent_matched', v_route.intent_pattern
      );
    END; $$`
  },
  {
    label: "Create complete_agent_task function",
    sql: `CREATE OR REPLACE FUNCTION complete_agent_task(
      p_task_id uuid, p_output text,
      p_model_used text DEFAULT NULL, p_tokens_in integer DEFAULT 0,
      p_tokens_out integer DEFAULT 0, p_latency_ms integer DEFAULT 0
    ) RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
      UPDATE agent_tasks SET
        output_text = p_output, model_used = COALESCE(p_model_used, model_used),
        tokens_in = p_tokens_in, tokens_out = p_tokens_out,
        latency_ms = p_latency_ms, status = 'done', completed_at = now()
      WHERE id = p_task_id;
    $$`
  },
  {
    label: "Enable RLS on orchestrator tables",
    sql: `ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE model_routes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE vector_stores ENABLE ROW LEVEL SECURITY`
  },
  {
    label: "Create RLS policies",
    sql: `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agents' AND policyname='agents_read_all') THEN
        CREATE POLICY agents_read_all ON agents FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='model_routes' AND policyname='routes_read_all') THEN
        CREATE POLICY routes_read_all ON model_routes FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vector_stores' AND policyname='vector_stores_read_all') THEN
        CREATE POLICY vector_stores_read_all ON vector_stores FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agent_tasks' AND policyname='tasks_insert_all') THEN
        CREATE POLICY tasks_insert_all ON agent_tasks FOR INSERT WITH CHECK (true);
      END IF;
    END $$`
  },
  {
    label: "Seed agents (6 sub-agents)",
    sql: `INSERT INTO agents (name, role, description, model_preference, system_prompt, capabilities) VALUES
      ('mochi-orchestrator', 'master_orchestrator', 'Mochi the Garden Bee — master agent. Routes to sub-agents, manages RAG and model selection.', 'claude-sonnet-4-20250514',
       'You are Mochi de los Huertos, a cheerful bilingual bee who teaches about bees, nature, permaculture. Warm, curious, age-appropriate. Never discuss politics, religion, or adult content. Respond in English unless user writes in Spanish.',
       '["intent_classification","agent_routing","rag_retrieval","session_management","model_selection","bilingual"]'),
      ('mochi-rag', 'rag_agent', 'RAG from mochi_knowledge_base and bee_facts.', 'claude-sonnet-4-20250514',
       'You are Mochi. Retrieve relevant knowledge first. Be concise and child-friendly.',
       '["vector_search","knowledge_retrieval","bilingual_response"]'),
      ('mochi-bee-facts', 'facts_agent', 'Curated bee facts — honey, hive, pollination, permaculture.', 'claude-sonnet-4-20250514',
       'You are Mochi the bee. Share fun, accurate facts. Keep responses short and engaging for ages 4-12.',
       '["bee_facts","child_safe","bilingual","age_appropriate"]'),
      ('mochi-voice', 'voice_agent', 'ElevenLabs TTS — bilingual speech.', 'elevenlabs',
       NULL, '["text_to_speech","bilingual_es_en","elevenlabs_integration"]'),
      ('mochi-language', 'language_agent', 'Bilingual microlearning — bee and nature vocabulary.', 'claude-sonnet-4-20250514',
       'You are Mochi the bee, a language guide. Teach one word at a time in English and Spanish. Use bee-world contexts.',
       '["vocabulary_teaching","bilingual_es_en","microlearning","child_friendly"]'),
      ('mochi-garden', 'garden_agent', 'Permaculture and agroecology — connecting bees to food sovereignty.', 'claude-sonnet-4-20250514',
       'You are Mochi, a permaculture expert. Connect garden advice back to pollinators and biodiversity.',
       '["permaculture","agroecology","garden_advice","biodiversity","seed_saving"]')
    ON CONFLICT (name) DO NOTHING`
  },
  {
    label: "Seed model routes",
    sql: `INSERT INTO model_routes (intent_pattern, agent_name, model, priority) VALUES
      ('bee|honey|hive|queen|pollen|nectar|waggle|colony|worker|drone|larvae|comb|wax', 'mochi-bee-facts', 'claude-sonnet-4-20250514', 10),
      ('word|vocabulary|say|translate|español|english|bilingual|learn|teach|how do you say', 'mochi-language', 'claude-sonnet-4-20250514', 10),
      ('garden|plant|flower|seed|permaculture|agroecology|soil|compost|food|tomato|harvest|biodiversity', 'mochi-garden', 'claude-sonnet-4-20250514', 10),
      ('explain|learn|what is|how does|why do|tell me about|describe|show me', 'mochi-rag', 'claude-sonnet-4-20250514', 20),
      ('speak|listen|voice|audio|hear|sound|play|read aloud', 'mochi-voice', 'elevenlabs', 10),
      ('.*', 'mochi-orchestrator', 'claude-sonnet-4-20250514', 99)
    ON CONFLICT DO NOTHING`
  },
  {
    label: "Seed vector_stores",
    sql: `INSERT INTO vector_stores (name, table_name, embedding_col, content_col, dimensions, total_chunks) VALUES
      ('mochi_knowledge_base', 'mochi_knowledge_base', 'embedding', 'content', 1536, 60),
      ('bee_facts', 'bee_facts', NULL, 'content', 1536, 99)
    ON CONFLICT (name) DO NOTHING`
  }
];

async function runStatement(label: string, sql: string): Promise<{ label: string; ok: boolean; error?: string }> {
  const url = `https://api.supabase.com/v1/projects/${PROJECT}/database/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SBP}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  if (res.ok) return { label, ok: true };
  const text = await res.text();
  return { label, ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple secret check
  const secret = req.headers["x-setup-secret"] || req.query["secret"];
  if (secret !== SETUP_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const results: { label: string; ok: boolean; error?: string }[] = [];
  for (const { label, sql } of STATEMENTS) {
    const result = await runStatement(label, sql);
    results.push(result);
    // Stop on unexpected errors (not IF NOT EXISTS which are always ok)
    if (!result.ok && !result.error?.includes("already exists")) {
      // Continue anyway — log but don't stop
    }
  }

  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok);
  return res.status(200).json({
    summary: `${passed}/${results.length} statements succeeded`,
    results,
    failed_count: failed.length
  });
}

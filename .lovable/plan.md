

# Mochi Platform Audit & Next-Level Improvement Plan

## Current State Assessment

### What's Working
- **RAG Pipeline (mochi_rag_v2)**: Solid architecture -- embeds user query, runs parallel vector search across 4 stores (KB, bee_facts, KG nodes, vocabulary), walks knowledge graph 2-deep, builds context block, cascades across 3 LLM providers (Google -> Anthropic -> OpenAI)
- **Knowledge Corpus**: 712 embedded chunks total (463 KB, 99 bee_facts, 84 KG nodes, 66 vocabulary cards), 124 KG edges, 0 missing embeddings
- **Agent Registry**: 8 agents defined in DB with intent-routing via `model_routes` table (language, voice, RAG, bee-facts, garden, storycard, lunar calendar, master orchestrator)
- **Chat UI**: Multi-turn context (6 messages), collapsible RAG source badges, KG connection display, vocab hints, latency metadata
- **Design System**: Phase 1-3 complete -- all lucide-react icons replaced with BeeIcons, card system standardized, emojis eliminated from UI chrome

### Critical Gaps Found

| Area | Issue | Severity |
|------|-------|----------|
| **Agent routing is dead code** | `model_routes` + `orchestrate_mochi_request()` exist in DB but `mochi_rag_v2` ignores them -- it's a monolith, not an orchestrator | HIGH |
| **OpenAI 50% success rate** | Last 7 days: 26 calls, only 50% succeed. Anthropic at 88.6% but 9.5s avg latency | HIGH |
| **No streaming** | All chat responses arrive as a single block -- no token-by-token rendering | MEDIUM |
| **No agent delegation** | Mochi always answers everything herself; specialist agents (garden, bee-facts, language) are never invoked | HIGH |
| **No conversation memory** | RAG queries table has only 1 entry in 30 days; conversation context is purely client-side (last 6 messages) | MEDIUM |
| **No self-reflection loop** | No mechanism for Mochi to evaluate her own responses, learn from feedback, or improve prompts | MEDIUM |
| **Image gen not integrated** | `generateContextualImage` fires on keyword match with 30s throttle -- no semantic intent detection | LOW |
| **Knowledge graph is shallow** | 84 nodes, 124 edges, only 2-depth walk -- no typed relationship filtering in chat context | MEDIUM |

---

## Improvement Plan: 4 Sprints

### Sprint 1: Wire the Agent Team (Orchestrator Pattern)

**Goal**: Make `mochi_rag_v2` a true orchestrator that delegates to specialist agents.

1. **Refactor `mochi_rag_v2`** to read `model_routes` and match user intent against route patterns
2. After RAG retrieval, route to the matched specialist agent's system prompt instead of always using the generic Mochi prompt
3. Add a `delegation_log` field to `rag_queries` tracking which agent handled each request
4. Create a new **`mochi_intent_classifier`** step (lightweight -- use Gemini Flash) that returns structured `{agent, confidence, intent}` before the main LLM call
5. If confidence < 0.6, fall back to master orchestrator (Mochi herself)

```text
User Message
    │
    ▼
[Embed Query] ──► [Parallel RAG Search]
    │                    │
    ▼                    ▼
[Intent Classify] ──► [Select Agent + Prompt]
    │                    │
    ▼                    ▼
[LLM Call w/ Agent Prompt + RAG Context]
    │
    ▼
[Log + Respond]
```

**Files**: `supabase/functions/mochi_rag_v2/index.ts`
**DB**: Add `agent_used`, `intent_confidence` columns to `rag_queries`

### Sprint 2: Streaming + Provider Reliability

**Goal**: Token-by-token streaming and fix the 50% OpenAI failure rate.

1. **Add SSE streaming** to `mochi_rag_v2` -- stream the LLM response back to the client
2. **Update `ChatInterface.tsx`** to consume SSE with progressive token rendering (using the pattern from the Lovable AI docs)
3. **Fix provider cascade**: Move Google (Gemini Flash) to primary position (100% success, 4.6s avg), Anthropic second, OpenAI third
4. **Add circuit breaker**: If a provider fails 3 consecutive times in 5 minutes, skip it for 10 minutes
5. **Handle 429/402 errors** from all providers with user-facing toasts

**Files**: `mochi_rag_v2/index.ts`, `ChatInterface.tsx`

### Sprint 3: Knowledge Graph Expansion + Self-Improvement Loop

**Goal**: Deeper knowledge and a feedback-driven self-improvement mechanism.

1. **Expand KG**: Add a `mochi_self_improve` edge function that:
   - Queries `rag_queries` for low-similarity responses (avg_sim < 0.4)
   - Identifies knowledge gaps (topics asked about but not in KB)
   - Generates new KB entries and KG nodes to fill gaps
   - Auto-embeds via `mochi_embed`
2. **Add user feedback**: Simple thumbs-up/down on each Mochi response
   - New `response_feedback` table: `(id, rag_query_id, user_id, rating, comment, created_at)`
   - Feed low-rated responses into the self-improvement loop
3. **Typed KG relationships**: Add `relationship_type` filtering to `get_kg_neighbours` and surface relationship types in chat context (e.g., "Bees --pollinate--> Sunflowers" not just "Bees -> Sunflowers")
4. **Conversation memory**: Store conversation summaries server-side per user, retrieve in future sessions for continuity

**DB**: New `response_feedback` table, add `summary` column to `conversations`
**Files**: New `supabase/functions/mochi_self_improve/index.ts`, update `mochi_rag_v2`

### Sprint 4: World-Class UX Polish

**Goal**: Make the experience feel magical.

1. **Typing indicator with personality**: Show "Mochi is buzzing through the garden..." with animated BeeIcon while streaming
2. **Suggested follow-ups**: After each response, Mochi suggests 2-3 related questions (extracted via tool-calling from the LLM)
3. **Visual knowledge map**: Interactive mini-graph showing which KG nodes were traversed for each response (using a simple force-directed layout)
4. **Proactive Mochi**: Based on user's learning progress and time of day, Mochi initiates with a seasonal garden tip or bee fact (linked to lunar calendar agent)
5. **Voice-first mode**: Dedicated voice conversation view with waveform visualizer, auto-TTS on every response

**Files**: `ChatInterface.tsx`, new `KnowledgeGraph.tsx` component, `LandingPage.tsx`

---

## Architecture Target

```text
┌─────────────────────────────────────────┐
│              MOCHI MASTER               │
│         (Intent + Orchestration)        │
├──────┬──────┬──────┬──────┬─────┬───────┤
│ Bee  │Garden│Lang  │Story │Voice│Lunar  │
│Facts │Agent │Agent │Cards │Agent│Calendar│
├──────┴──────┴──────┴──────┴─────┴───────┤
│         RAG v2 (Unified Search)         │
├──────┬──────┬──────┬──────────────┬──────┤
│  KB  │ Bee  │  KG  │  Vocabulary  │Crawl │
│ 463  │  99  │  84  │     66       │ Jobs │
├──────┴──────┴──────┴──────────────┴──────┤
│     Embeddings (text-embedding-3-small)  │
├──────────────────────────────────────────┤
│  Self-Improve Loop + Feedback Pipeline   │
└──────────────────────────────────────────┘
```

## Recommended Start

Sprint 1 (agent delegation) is the highest-impact change -- it transforms Mochi from a single-prompt chatbot into a true multi-agent system using infrastructure that's already 80% built in the database. Sprint 2 (streaming) is the most visible UX improvement.

I recommend implementing Sprint 1 first. Shall I proceed?


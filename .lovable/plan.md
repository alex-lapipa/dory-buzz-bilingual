

## Platform Audit: Mochi AI Infrastructure Snapshot

### Current State Summary

```text
┌─────────────────────────────────────────────────────────────┐
│                    MOCHI PLATFORM MAP                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  VOICE AGENTS (ElevenLabs ConvAI)                          │
│  ├── Global: agent_1301kkyvc82vey5896n39y1cm5hc (Mochi)    │
│  └── Kids:   agent_8101km13rwc3eyb98g0wampfx499 (BeeBee)   │
│                                                             │
│  CHAT → mochi_master_orchestrator                          │
│    ├── DB routing: orchestrate_mochi_request()             │
│    ├── RAG: match_mochi_knowledge() (4 chunks)             │
│    └── Model cascade: Gemini → Claude → GPT-4.1            │
│                                                             │
│  RAG V2 → mochi_rag_v2 (deeper retrieval)                 │
│    ├── unified_mochi_search() (6 results)                  │
│    ├── match_vocabulary_cards() (3 results)                │
│    ├── get_kg_neighbours() (2-hop graph walk)              │
│    └── Model cascade: Gemini → Claude → GPT-4.1            │
│                                                             │
│  KNOWLEDGE STORES                                          │
│  ├── mochi_knowledge_base: 463 entries (100% embedded)     │
│  ├── bee_facts:             99 entries (100% embedded)     │
│  ├── kg_nodes:              84 nodes   (100% embedded)     │
│  ├── kg_edges:             124 relationships               │
│  └── mochi_assets:         185 media files                 │
│                                                             │
│  DB AGENTS (model_routes table)                            │
│  ├── mochi-language  (priority 5)                          │
│  ├── mochi-voice     (priority 8)                          │
│  ├── mochi-rag       (priority 9)                          │
│  ├── mochi-bee-facts (priority 10)                         │
│  ├── mochi-garden    (priority 10)                         │
│  └── mochi-orchestrator (priority 99, catch-all)           │
│                                                             │
│  EDGE FUNCTIONS: 49 total (many redundant)                 │
│  CONVERSATIONS: 8,147 | MESSAGES: 1,160                   │
│  INTEGRATION LOGS: 217                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Findings

**1. Architecture -- What's Working Well**
- Solid multi-model cascade with graceful fallback (Gemini → Claude → GPT-4.1)
- Full vector embeddings across all 3 knowledge stores (646 entries, 100% coverage)
- Knowledge Graph with 84 nodes / 124 edges and 2-hop graph walks enriching RAG
- DB-driven agent routing via `orchestrate_mochi_request()` -- clean separation of routing logic from code
- Intent-based agent dispatch with priority ordering
- Two dedicated ElevenLabs voice agents (adult + kids)
- Comprehensive logging to `mochi_integrations` and `rag_queries`

**2. Critical Issues**

| Issue | Impact | Detail |
|-------|--------|--------|
| **ElevenLabs API key invalid** | Voice TTS broken | 16 failures with "Invalid API key" -- the `ELEVENLABS_API_KEY` secret is expired or wrong |
| **Anthropic credits exhausted** | Claude fallback dead | 11 failures: "credit balance too low" -- Claude never succeeds in the cascade |
| **49 edge functions, ~30 redundant** | Maintenance burden, deployment cost | Per the existing PLATFORM_OPTIMIZATION_PLAN.md, consolidation to ~8 was planned but not executed |
| **RAG v2 barely used** | Best retrieval pipeline unused | Only 1 logged `rag_queries` entry; `ChatInterface` calls `mochi_master_orchestrator` which uses the simpler `match_mochi_knowledge` (4 chunks, no KG walk) instead of the richer `mochi_rag_v2` |
| **Conversation/message mismatch** | Data integrity question | 8,147 conversations but only 1,160 messages suggests many empty conversations being created |

**3. Redundancy Map**

```text
CHAT (5 functions → should be 1):
  mochi_master_orchestrator  ← ACTIVE (ChatInterface uses this)
  mochi_rag_v2               ← ACTIVE (BeeBasics/GardenBasics only)
  unified_ai_orchestrator    ← UNUSED
  mochi_chat_production      ← UNUSED (was sub-called by unified_ai_orchestrator)
  enhanced_mochi_claude      ← UNUSED
  advanced_mochi_chat        ← UNUSED
  chat_mochi                 ← UNUSED
  xai_grok_chat              ← UNUSED

VOICE (6 functions → should be 0-1):
  elevenlabs_tts             ← ACTIVE (BeeEducationHub, LearningContentViewer)
  tts_mochi                  ← UNUSED
  voice_chat_mochi           ← UNUSED
  advanced_voice_chat        ← UNUSED
  voice_chat_realtime        ← UNUSED
  mochi_realtime_voice       ← UNUSED

IMAGE (4 functions → should be 1):
  unified_image_generator    ← ACTIVE (ChatInterface)
  advanced_image_generation  ← ACTIVE (AdvancedFeatures, BeeEducationHub)
  generate_image             ← called by useMasterAI
  generate_image_sora        ← BROKEN (405 errors)
  midjourney_generator       ← UNUSED

HEALTH (4 functions → should be 1):
  comprehensive-health-check ← ACTIVE
  unified_health_monitor     ← UNUSED
  health-check               ← UNUSED
  production-readiness       ← UNUSED
```

---

### Recommended Next Steps (Priority Order)

**Phase 1: Fix Broken Integrations (immediate)**
1. Rotate/update the `ELEVENLABS_API_KEY` secret -- 16 TTS failures
2. Top up or replace Anthropic credits -- Claude cascade leg is dead
3. Delete `generate_image_sora` -- Sora endpoint returns 405, not available

**Phase 2: Upgrade Chat to RAG v2 (high impact)**
4. Switch `ChatInterface.tsx` from `mochi_master_orchestrator` to `mochi_rag_v2` -- this unlocks the full unified search (KB + bee_facts + KG graph walk + vocabulary) instead of just `match_mochi_knowledge`
5. Alternatively, merge RAG v2's retrieval pipeline INTO `mochi_master_orchestrator` so all chat gets the deep search

**Phase 3: Function Consolidation (per existing plan)**
6. Delete ~25 unused edge functions (see redundancy map above)
7. Consolidate remaining active functions per the PLATFORM_OPTIMIZATION_PLAN.md
8. Redirect all TTS calls to a single `elevenlabs_tts` function
9. Merge image generation into one `unified_image_generator`

**Phase 4: Knowledge Expansion**
10. Expand knowledge base beyond 463 entries -- add more permaculture, garden planning, seasonal content
11. Add storycard content (tables exist but `storycards`/`storycard_panels`/`quiz_questions` appear empty)
12. Build the `mochi-storycard` agent's generation pipeline to populate bilingual storycards

**Phase 5: Conversation Cleanup**
13. Add a DB trigger or cron to prune empty conversations (8,147 with only 1,160 messages)
14. Fix conversation creation logic to only create on first message, not on page load


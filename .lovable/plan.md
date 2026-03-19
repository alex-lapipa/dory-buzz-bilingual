

# MochiBee Platform: End-to-End Status Audit & Improvement Plan

## 1. PLATFORM ARCHITECTURE OVERVIEW

```text
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React/Vite)              │
│  Landing → Language → Onboarding → Dashboard/Chat    │
│  Routes: /, /chat, /learning-hub, /buzzy-bees,       │
│          /kids-*, /admin, /auth                       │
│  Voice: GlobalVoiceAgent (Mochi + BeeBee widgets)    │
│  Lunar: LunarCalendarWidget on Dashboard             │
└──────────────────────┬──────────────────────────────┘
                       │ supabase.functions.invoke()
┌──────────────────────▼──────────────────────────────┐
│              EDGE FUNCTIONS (36 total)               │
│                                                      │
│  PRIMARY PIPELINE:                                   │
│  ► mochi_rag_v2 ← ALL chat sessions route here      │
│    (embed → unified_mochi_search + vocab + KG →      │
│     multi-model cascade: Gemini → Claude → GPT-4.1)  │
│                                                      │
│  ACTIVE SUPPORT:                                     │
│  ► unified_image_generator (image gen)               │
│  ► unified_voice_hub (TTS/STT)                       │
│  ► lunar_calendar_agent (sync/scrape/status)         │
│  ► rag_json_ingest (KB ingestion)                    │
│  ► user_analytics_tracker                            │
│  ► send-welcome-email                                │
│                                                      │
│  LEGACY/REDUNDANT (still deployed):                  │
│  ► master_ai_orchestrator (gpt-4o-mini, no RAG)      │
│  ► mochi_master_orchestrator (parallel to rag_v2)    │
│  ► unified_chat_orchestrator (load-balancing chat)   │
│  ► comprehensive_app_audit (static audit)            │
│  ► 10+ others (see details)                          │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              SUPABASE DATABASE                       │
│  Tables: 30+  │  Vector search: pgvector enabled     │
│  Key stores: mochi_knowledge_base, bee_facts,        │
│    kg_nodes/kg_edges, vocabulary_cards                │
│  RAG functions: unified_mochi_search,                │
│    match_bee_facts, match_kg_nodes, get_kg_neighbours│
│  Auth: profiles, user_roles (admin/user/moderator)   │
│  Analytics: user_events, user_sessions, live_metrics │
└─────────────────────────────────────────────────────┘
```

---

## 2. WHAT IS WORKING (GREEN)

| System | Status | Details |
|--------|--------|---------|
| RAG v2 Pipeline | HEALTHY | Embed → vector search → KG walk → multi-model cascade |
| Knowledge Corpus | HEALTHY | 9 RAG JSON files (rag_01–rag_09), lunar calendar included |
| Chat Interface | HEALTHY | Routes all sessions through mochi_rag_v2, markdown rendering |
| Voice Agents | HEALTHY | ElevenLabs Mochi + BeeBee, route-aware switching, error handling |
| Lunar Calendar | HEALTHY | Widget on dashboard, admin panel, edge function, rag_09 data |
| Auth + Roles | HEALTHY | Supabase auth, user_roles table, has_role() SECURITY DEFINER |
| Admin Panel | HEALTHY | 17 sections, lazy-loaded, AdminGuard protected |
| GDPR/Consent | HEALTHY | Consent banner, user_consents table |
| Games (11) | HEALTHY | Bee trivia, memory, anatomy explorer, etc. |
| Image Generation | HEALTHY | unified_image_generator, contextual images in advanced chat |
| Analytics | HEALTHY | User events, sessions, personas, behavior patterns |

---

## 3. ISSUES IDENTIFIED (non-breaking, improvement opportunities)

### 3A. Legacy Function Debt (12 redundant functions)
These are deployed but **no longer called** by the frontend since mochi_rag_v2 became the primary pipeline:

- `master_ai_orchestrator` — uses gpt-4o-mini, no RAG context, old Mochi persona
- `mochi_master_orchestrator` — parallel RAG pipeline (duplicate of rag_v2)
- `unified_chat_orchestrator` — load-balancing chat with 3 providers, not used
- `comprehensive_app_audit` — static audit, hardcoded values
- `claude_reasoning` — standalone Claude call, no RAG
- `design_agent_review` — unknown usage
- `production_optimizer` — unknown usage
- `google_health_ping` — single-purpose health ping
- `auth_service` — may overlap with Supabase auth
- `stt_chat` — may be replaced by unified_voice_hub
- `realtime_voice_chat` — may be replaced by unified_voice_hub
- `mochi_realtime_voice` — may be replaced by unified_voice_hub

**Impact**: No breakage, but adds maintenance burden and confusion.

### 3B. System Prompt Drift
The Mochi persona is defined in **4 separate places** with slight variations:
1. `mochi_rag_v2` (primary — most complete, includes lunar + no-hallucination)
2. `mochi_master_orchestrator` (identical copy)
3. `master_ai_orchestrator` (shorter, missing lunar + affiliation policies)
4. `unified_chat_orchestrator` (different style, "BeeCrazy Garden World" framing)

**Risk**: If a legacy function is accidentally invoked, users get inconsistent Mochi behavior.

### 3C. Chat History Not Sent to RAG v2
The ChatInterface sends `message` to `mochi_rag_v2` but **does not pass conversation_history**. The rag_v2 function only receives the single message — no multi-turn context. The `conversation_history` field exists in `unified_chat_orchestrator` but not in rag_v2.

**Impact**: Mochi cannot reference previous messages in the same session.

### 3D. Console Debug Logging in Production
`App.tsx` line 62: `console.log('App state:', ...)` runs on every render in production.

### 3E. Model References Out of Date
- `master_ai_orchestrator` uses `gpt-4o-mini` and `claude-3-sonnet-20240229` (old)
- `unified_chat_orchestrator` uses `gpt-4.1-2025-04-14` and `claude-opus-4-20250514` (current but expensive defaults)

---

## 4. RECOMMENDED IMPROVEMENTS (additive, non-breaking)

### Phase 1: Conversation Memory in RAG v2 (High Impact)
**What**: Add conversation_history support to mochi_rag_v2 so Mochi can reference prior messages.
- ChatInterface already tracks `localMessages` — pass last 6 messages to rag_v2
- rag_v2 appends them to the prompt as conversation context
- No schema changes needed

### Phase 2: Consolidate System Prompt (Medium Impact)
**What**: Extract the canonical Mochi system prompt into a single `agents` table entry or a shared constant fetched at runtime, so all functions reference one source of truth.
- Update the `agents` table row for "mochi" with the full rag_v2 prompt
- Have rag_v2 (and any future function) pull from agents table instead of hardcoding

### Phase 3: Mark Legacy Functions for Deprecation (Low Risk)
**What**: Add a `// DEPRECATED — not called by frontend` header comment to the 12 legacy functions. Do NOT delete them — just document status. Optionally add a `/deprecated` route in admin to list them.

### Phase 4: Remove Production Console Logs
**What**: Remove `console.log('App state:', ...)` from App.tsx line 62.

### Phase 5: Add Conversation History Display
**What**: Surface RAG sources (already returned by rag_v2 as `sources`, `kg_connections`, `vocab_hint`) in the chat UI as collapsible metadata badges — so users can see what knowledge Mochi drew from.

---

## 5. CAPABILITY SUMMARY

As master orchestrator, the platform currently supports:

- **RAG-powered chat** with 4-store vector search (KB + bee_facts + KG + vocabulary)
- **Knowledge graph traversal** (2-depth neighbor walks)
- **Multi-model AI cascade** (Gemini → Claude → GPT-4.1 fallback)
- **Bilingual operation** (EN/ES throughout)
- **Voice interaction** (ElevenLabs TTS, 2 personas)
- **Image generation** (contextual, in advanced chat mode)
- **Lunar calendar intelligence** (2026 phases + permaculture guidance)
- **11 educational games** with leaderboards
- **User analytics & persona profiling**
- **Admin panel** with 17 management sections
- **GDPR compliance** with consent tracking
- **Knowledge ingestion pipeline** (JSON → vectorize → KB)
- **Agent orchestration framework** (agents + model_routes + agent_tasks tables)

---

## 6. WHAT TO APPROVE

I recommend implementing **Phases 1 through 4** as the next sprint — all additive, zero risk of breaking existing functionality:

1. Add conversation memory to mochi_rag_v2 (biggest user-facing improvement)
2. Centralize system prompt in agents table
3. Document legacy functions with deprecation headers
4. Clean production console logs

Approve this plan and I will implement all four phases.


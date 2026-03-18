

## Status Report & Next Steps Plan

### Current System Health — End-to-End RAG & Knowledge Infrastructure

| Component | Status | Details |
|---|---|---|
| `mochi_knowledge_base` | 431 rows, **0 missing embeddings** | All embedded. Categories span bee_biology, bee_culture, permaculture, seeds, pedagogy (31 from deep-research-report) |
| `bee_facts` | 99 rows, **99/99 embedded** | Fully operational |
| `kg_nodes` | 84 nodes, **84/84 embedded** | All embedded |
| `kg_edges` | 124 edges | Graph connectivity intact |
| `vocabulary_cards` | 66 cards, **66/66 embedded** | Bilingual EN/ES |
| DB functions | All 5 present | `unified_mochi_search`, `match_mochi_knowledge`, `match_vocabulary_cards`, `get_kg_neighbours`, `orchestrate_mochi_request` |
| `mochi_master_orchestrator` | Deployed | Gemini → Claude → GPT cascade, RAG via `match_mochi_knowledge`, streaming support |
| `mochi_rag_v2` | Deployed | Full pipeline: embed → `unified_mochi_search` + `match_vocabulary_cards` + `get_kg_neighbours` → LLM cascade → structured response with sources/KG/vocab |
| `mochi_embed` | Deployed | Batch embedder for new knowledge_base rows |

**Verdict**: The RAG pipeline is fully operational end-to-end. All vector stores have 100% embedding coverage. Both orchestrator endpoints work with multi-model fallback.

---

### "Coming Soon" Sections That Need Building

| Section | Location | Current State |
|---|---|---|
| **Bee Basics** (admin) | `AdminShell` → `bee-basics` | Placeholder "coming soon" |
| **Garden Basics** (admin) | `AdminShell` → `garden-basics` | Placeholder "coming soon" |
| **Chat Management** (admin) | `AdminShell` → `chat` | Placeholder "coming soon" |
| **Analytics Dashboard** (admin) | `AdminShell` → `analytics` | Placeholder "coming soon" |
| **Settings** (admin) | `AdminShell` → `settings` | Placeholder "coming soon" |
| **Activities tab** | `LearningContentViewer` | "Activities Coming Soon" |
| **Quizzes tab** | `LearningContentViewer` | "Quizzes Coming Soon" |
| **Experiments tab** | `LearningContentViewer` | "Experiments Coming Soon" |
| **Videos tab** | `LearningContentViewer` | "Videos Coming Soon" |
| 6 of 10 games | `InteractiveLearningGames` | Not playable yet |

The public-facing learning pages (`/learning/bee-basics`, `/learning/garden-basics`) exist with static hardcoded content — not connected to the knowledge base or RAG.

---

### Proposed Build Plan

**Phase 1: Wire Learning Content to RAG + Knowledge Base**

Replace the static content in `BeeBasics.tsx` and `GardenBasics.tsx` with dynamic pages that:
- Fetch relevant `bee_facts` by category from Supabase
- Display facts in interactive card carousels (already have the component pattern in LearningHub)
- Add "Ask Mochi" button per topic that calls `mochi_rag_v2` for deeper exploration
- Show vocabulary hints from `vocabulary_cards` in a sidebar widget

**Phase 2: Build Activities, Quizzes & Experiments Tabs**

Replace the "Coming Soon" placeholders in `LearningContentViewer` with real content:
- **Activities**: Call `learning_content_orchestrator` with `content_types: ['activities']` for a given topic, cache results in a new `learning_activities` table
- **Quizzes**: Same orchestrator with `content_types: ['quizzes']`, render as interactive multi-choice components with scoring
- **Experiments**: Same pattern with `content_types: ['experiments']`, render as step-by-step cards with materials lists and safety notes
- Use Firecrawl to supplement content by scraping curated educational sites for additional activities/experiments

**Phase 3: Build Admin Content Panels**

Replace the three admin "coming soon" sections:
- **Bee Basics admin**: CRUD interface showing all `bee_facts` rows, with inline editing, category filters, and a "Generate More" button that calls the `learning_content_orchestrator`
- **Garden Basics admin**: Same pattern for garden/permaculture content from `mochi_knowledge_base`
- **Chat Management admin**: Show recent `conversations` + `messages` with search, filter by user, and conversation analytics

**Phase 4: Enrich Knowledge Base via Firecrawl**

Create a "Content Ingestion" panel in admin that:
- Accepts URLs to educational sites (e.g. beeinformed.org, extension.umn.edu)
- Uses Firecrawl to scrape and chunk content
- Pipes chunks through the existing `mochi_embed` pipeline
- Stores in `mochi_knowledge_base` with proper category/domain/source tagging
- This reuses the existing `crawl_jobs` table for tracking

### Files to Create/Modify

- `src/pages/learning/BeeBasics.tsx` — rewrite to fetch from `bee_facts` + RAG integration
- `src/pages/learning/GardenBasics.tsx` — same pattern
- `src/components/LearningContentViewer.tsx` — replace 4 "Coming Soon" tabs with real content
- `src/components/admin/BeeBasicsAdmin.tsx` — new CRUD panel
- `src/components/admin/GardenBasicsAdmin.tsx` — new CRUD panel
- `src/components/admin/ChatManagement.tsx` — new admin panel
- `src/components/admin/ContentIngestion.tsx` — Firecrawl-powered ingestion UI
- `src/components/admin/AdminShell.tsx` — wire new panels into SectionPanel
- Possible new migration for `learning_activities` table (to cache generated content)

### Recommended Priority

Start with Phase 1 (wire existing pages to knowledge base) since all the data and infrastructure is already there — it's purely a frontend wiring task. Then Phase 2 for the learning content tabs. Phases 3-4 are admin tools.


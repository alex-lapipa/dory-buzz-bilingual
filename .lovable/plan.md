

## Plan: Ingest Deep Research Report into Knowledge Base (Additive Only)

### Current State
- `mochi_knowledge_base` has ~400 rows across bee biology, permaculture, seeds, etc.
- Zero rows exist for pedagogy, microlearning, video design, or child development categories
- The `mochi_embed` edge function already handles embedding generation (batches of 10, OpenAI text-embedding-3-small)
- Schema: `id, title, content, category, domain, language, age_level, source, subcategory, tags, metadata, embedding`

### What We'll Do
Create a one-time seed migration that inserts ~25-30 chunked knowledge base entries extracted from the research report. Each chunk maps to a single actionable concept. Embeddings will be null on insert — the existing `mochi_embed` function will pick them up automatically on its next run.

### Content Chunking Strategy
Extract into these new categories/domains:

| Category | Domain | Count | Content |
|---|---|---|---|
| `microlearning_design` | `pedagogy` | ~8 | Segmenting, signalling, repetition, pacing, agency, cognitive load principles |
| `child_development` | `pedagogy` | ~5 | Working memory limits, dual coding, video deficit, EF effects of pacing |
| `language_learning` | `pedagogy` | ~5 | Social contingency, parasocial cues, joint reference, fast-mapping from video |
| `video_production` | `pedagogy` | ~5 | Clip length (45-120s), character design, call-and-response, age-differentiated scaffolds |
| `research_evidence` | `pedagogy` | ~5 | Key study summaries (Blue's Clues, Lillard & Peterson, Roseberry et al., DeLoache et al.) |
| `bee_pedagogy` | `pedagogy` | ~3 | Bee-themed design implications, mascot as learning infrastructure, bee-world anchors |

### Deduplication Guard
- All rows use `source = 'deep-research-report-2026'` for traceability
- The migration uses `INSERT ... ON CONFLICT DO NOTHING` on title to prevent re-runs from creating duplicates
- We add a unique index on `(title, source)` if not already present

### Migration SQL
A single SQL migration that:
1. Adds a unique constraint on `(title, source)` if missing (for idempotency)
2. Inserts ~25-30 rows with `embedding = NULL` so `mochi_embed` processes them
3. All inserts use `ON CONFLICT (title, source) DO NOTHING`

### Post-Insert
After the migration, invoke the `mochi_embed` edge function to generate embeddings for the new rows. No code changes needed — RAG queries via `match_mochi_knowledge` and `unified_mochi_search` will automatically surface this content.

### Files Touched
- **New migration**: `supabase/migrations/` — seed pedagogy knowledge from research report
- **No application code changes** — existing RAG pipeline handles new content automatically


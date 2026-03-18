

## Plan: Ingest 7 RAG JSON Files into Mochi Knowledge Base

### What We Have
7 uploaded JSON files containing structured knowledge across the Mochi platform:

| File | Content | Target Tables |
|------|---------|--------------|
| rag_01_platform_context | 5 sections: overview, character, design principles, tech stack, content pillars | `mochi_knowledge_base` |
| rag_02_bee_facts | 99 facts across 14 categories | `mochi_knowledge_base` + `bee_facts` |
| rag_03_bilingual_vocabulary | 66 bilingual word cards | `vocabulary_cards` |
| rag_04_agents_orchestration | 7 agent definitions + routing rules | `mochi_knowledge_base` (reference) |
| rag_05_permaculture_garden | 20+ sections: permaculture, companion planting, soil, conservation, threats | `mochi_knowledge_base` + `bee_facts` |
| rag_06_seed_saving | 5 sections on seed saving, biodiversity, Simientes Infinitas | `mochi_knowledge_base` |
| rag_07_storycards_learning | Storycard spec, panels, quiz design | `mochi_knowledge_base` |

### Implementation: New Edge Function `rag_json_ingest`

Create a single edge function that:

1. **Accepts a RAG JSON document** via POST body (or reads from uploaded files)
2. **Parses sections** and routes each to the correct table based on content type:
   - Sections with `facts` arrays -> `bee_facts` table (upsert by title to avoid duplication)
   - Sections with `words` arrays -> `vocabulary_cards` table (upsert by `word_en` to avoid duplication)
   - Sections with `chunks` arrays -> `mochi_knowledge_base` (upsert by title+content hash)
   - All other `content` sections -> `mochi_knowledge_base` (upsert by title)
3. **Deduplication**: Before inserting, check if a row with matching title (or `word_en` for vocab) already exists. If it does, update/enrich rather than duplicate.
4. **Tags & metadata**: Extract tags, category, domain, age_level from the JSON structure and map to DB columns.
5. **Triggers embedding**: After all inserts, call `mochi_embed` to generate embeddings for new rows with null embeddings.
6. **Returns a summary**: chunks created, updated, skipped (duplicates), and embedded count.

### Admin UI: Add "Upload RAG JSON" to ContentIngestion

Add a new tab in `src/components/admin/ContentIngestion.tsx`:
- "Upload JSON" tab with a file input accepting `.json`
- Parses the file client-side, shows a preview (document title, section count, estimated rows)
- "Ingest" button calls the `rag_json_ingest` edge function
- Shows results: inserted, updated, skipped, embedded

### Detailed Steps

**Step 1: Create `supabase/functions/rag_json_ingest/index.ts`**
- Accepts `{ document: <parsed JSON>, dry_run?: boolean }`
- Iterates `document.sections`, classifies each section type
- For `bee_facts`: maps each fact string to a row with title (first 80 chars), content (full fact), category, domain, source = document_id
- For `vocabulary_cards`: maps each word object to columns (word_en, word_es, phonetic_en, phonetic_es, example_en, example_es, age_level, difficulty_level, category, domain, tags)
- For `mochi_knowledge_base`: maps heading -> title, content/chunks -> content, with category, domain, tags, source
- Uses `ON CONFLICT` via upsert where possible, or checks existence before insert
- Calls `mochi_embed` at the end

**Step 2: Add RLS policies if needed**
- `vocabulary_cards` and `bee_facts` may need INSERT policies for service_role (check existing -- bee_facts has no INSERT policy, vocabulary_cards needs checking)
- Add migration for any missing INSERT/UPDATE policies

**Step 3: Update `ContentIngestion.tsx`**
- Add "Upload RAG JSON" tab
- File picker + preview + ingest button
- Results display

**Step 4: Update `supabase/config.toml`**
- Add `[functions.rag_json_ingest]` with `verify_jwt = false`

### Safety Guarantees
- **Never deletes** existing data -- only INSERT or UPDATE
- **Deduplication** by checking existing titles/words before insert
- **Additive only** -- existing embeddings are preserved, new ones generated for null rows
- **No schema changes** to existing tables required (all columns already exist)

### Technical Details

```text
Upload Flow:
  User uploads JSON -> ContentIngestion parses -> 
  Calls rag_json_ingest edge function ->
  Function routes sections to tables ->
  Upserts rows (no duplicates) ->
  Calls mochi_embed for new embeddings ->
  Returns summary
```

Database policies needed (migration):
- `bee_facts`: needs INSERT policy for service_role (currently only SELECT exists)
- `vocabulary_cards`: needs INSERT/UPDATE policy for service_role


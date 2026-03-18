

## Plan: Ingest MochiBee Audio & Sound Design Strategy into Knowledge Base

### What This Document Contains

A 525-line comprehensive audio/sound design strategy covering 7 major sections:

1. **Executive Summary** -- three-pillar audio philosophy (Bee, Garden, Culture)
2. **Evidence-Based Insights** -- 8 subsections of developmental science research (speech clarity, child-directed speech, music as cognitive scaffold, repetition, bilingual design, short-form video architecture, comparative show analysis, bee acoustics)
3. **Audio Design Framework** -- voice guidelines, music guidelines, SFX guidelines, timing, layering, bilingual audio guidelines (with detailed parameter tables)
4. **"What Works Best" Tables** -- 4 reference tables (voice styles, sound types, pacing patterns, comparative show analysis)
5. **Sound Design System** -- sonic DNA pillars, complete audio palette, sound categories (identity, narrative, feedback, musical beds), recurring motifs, sonic logo concept
6. **Implementation Playbook** -- second-by-second video template, production do's/don'ts, tool recommendations, quality standards checklist
7. **Example Sound Scripts** -- two fully scripted episodes (English pollination, Spanish nectar) plus audio branding summary

### Ingestion Strategy

The document will be chunked into sections and ingested into `mochi_knowledge_base` via the existing `rag_json_ingest` edge function. This requires preparing a structured JSON payload matching the function's expected format.

**Step 1: Create a structured RAG JSON file**

Create `public/rag_data/rag_08_audio_sound_design.json` with the document parsed into ~25 sections:

| Section | Category | Domain | Content |
|---------|----------|--------|---------|
| Executive summary | `audio_design` | `creative_production` | Core audio philosophy |
| Audio clarity research | `audio_design` | `creative_production` | SNR, speech comprehension science |
| Child-directed speech | `audio_design` | `creative_production` | CDS parameters, parentese research |
| Music as cognitive scaffold | `audio_design` | `creative_production` | Pentatonic scale, tempo, engagement |
| Repetition science | `audio_design` | `creative_production` | Spaced/immediate repetition frameworks |
| Bilingual audio design | `audio_design` | `creative_production` | Code-switching, vocabulary sandwich |
| Short-form video architecture | `audio_design` | `creative_production` | Attention arcs, audio layering hierarchy |
| Comparative show analysis | `audio_design` | `creative_production` | 9-show comparison table |
| Bee acoustics research | `audio_design` | `creative_production` | 230 Hz bee frequency, C major alignment |
| Voice guidelines | `audio_guidelines` | `creative_production` | F0, pitch, rate, pause specs |
| Music guidelines | `audio_guidelines` | `creative_production` | Key, scale, tempo, instruments |
| SFX guidelines | `audio_guidelines` | `creative_production` | Orientation, feedback, anticipation, delight |
| Timing guidelines | `audio_guidelines` | `creative_production` | 30-60s video audio arc |
| Layering guidelines | `audio_guidelines` | `creative_production` | 3-layer hierarchy |
| Bilingual audio guidelines | `audio_guidelines` | `creative_production` | Sandwich technique, universal Spanish |
| Best voice styles table | `audio_reference` | `creative_production` | 6 voice qualities with evidence |
| Best sound types table | `audio_reference` | `creative_production` | 8 sound types for engagement |
| Best pacing patterns table | `audio_reference` | `creative_production` | Second-by-second pacing |
| Sonic DNA three pillars | `audio_system` | `creative_production` | The Bee, The Garden, The Culture |
| Complete audio palette | `audio_system` | `creative_production` | Melodic, rhythmic, textural, vocal palettes |
| Sound categories | `audio_system` | `creative_production` | Identity, narrative, feedback, musical beds |
| Sonic logo concept | `audio_system` | `creative_production` | "Mochi's Buzz" 3.5s composition |
| Recurring motifs | `audio_system` | `creative_production` | 8 motifs with descriptions |
| Production do's and don'ts | `audio_production` | `creative_production` | Quality standards |
| Quality checklist | `audio_production` | `creative_production` | 16-point QA checklist |
| Example: Pollination episode | `audio_scripts` | `creative_production` | Full 45s English script |
| Example: Nectar episode | `audio_scripts` | `creative_production` | Full 50s Spanish script |
| Audio branding summary | `audio_system` | `creative_production` | Emotional palette map + brand summary |

**Step 2: Call `rag_json_ingest` to load into `mochi_knowledge_base`**

Each section becomes a row in `mochi_knowledge_base` with:
- `category`: audio_design / audio_guidelines / audio_system / audio_production / audio_scripts / audio_reference
- `domain`: `creative_production` (new domain extending the existing set)
- `source`: `rag_08_audio_sound_design`
- `tags`: `["audio", "sound_design", "mochi_voice", "bilingual", "pentatonic", "production"]`

Deduplication by title prevents any duplicates if run again.

**Step 3: Trigger `mochi_embed` for vector embeddings**

The ingestion function already calls `mochi_embed` after inserting, so all new rows get OpenAI `text-embedding-3-small` vectors for RAG search.

**Step 4: Update the `mapDomain` function in `rag_json_ingest`**

Add `audio_design`, `audio_guidelines`, `audio_system`, `audio_production`, `audio_scripts`, `audio_reference` mappings to the `creative_production` domain in the edge function's domain mapper.

### What Changes

| File | Change |
|------|--------|
| `public/rag_data/rag_08_audio_sound_design.json` | **Create** -- structured JSON with ~25-28 sections from the document |
| `supabase/functions/rag_json_ingest/index.ts` | **Edit** -- add `creative_production` domain mappings to `mapDomain()` |

### Safety Guarantees

- **Additive only** -- inserts new rows; never deletes or overwrites existing data
- **Deduplication** -- title-based existence checks prevent duplicates
- **No schema changes** -- uses existing `mochi_knowledge_base` columns
- **Embeddings auto-generated** -- `mochi_embed` triggered post-ingestion

### Mochi Meta-Orchestrator Recommendation

This audio strategy document is foundational for content production. Once ingested, Mochi's RAG system will be able to:
- Answer questions about audio specifications (voice parameters, music guidelines, SFX usage)
- Reference evidence-based research when making content decisions
- Provide episode scripting templates following the proven second-by-second format
- Enforce quality standards through the checklist data
- Guide bilingual audio design using the vocabulary sandwich technique and cultural anchoring principles


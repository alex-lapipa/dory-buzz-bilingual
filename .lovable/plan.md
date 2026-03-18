

# Lunar Calendar 2026 — Knowledge Corpus + Specialized Agent

## Overview

Scrape the 2026 lunar calendar from trusted astronomical sources using the existing Firecrawl infrastructure, ingest it into `mochi_knowledge_base` with a dedicated `lunar_calendar` domain, and create a specialized edge function agent that keeps this data authoritative and queryable. The RAG pipeline already searches `mochi_knowledge_base` via `unified_mochi_search`, so once ingested, Mochi and BeeBee will automatically have lunar calendar context.

## Plan

### 1. Create a new edge function: `lunar_calendar_agent`

A dedicated edge function that:
- **Scrapes** 2-3 trusted astronomical sources for 2026 lunar data (moon phases, new/full moon dates, eclipses) using Firecrawl
- **Structures** the data into per-month entries with exact dates, phase names (EN/ES), and permaculture planting guidance
- **Deduplicates** against existing `mochi_knowledge_base` rows (domain = `lunar_calendar`)
- **Inserts** structured chunks into `mochi_knowledge_base` with category `lunar_phases`, domain `lunar_calendar`, bilingual content, tags like `moon`, `permaculture`, `planting`
- **Triggers** `mochi_embed` to vectorize new entries for RAG retrieval
- **Returns** a summary of what was ingested and any discrepancies found between sources

Trusted sources to scrape:
- `timeanddate.com/moon/phases/?year=2026` (authoritative astronomical data)
- `farmersalmanac.com/full-moon-dates-and-times` (traditional agricultural lunar calendar)
- `lunarium.co.uk/calendar/2026.html` (backup cross-reference)

### 2. Create a structured RAG JSON file: `rag_09_lunar_calendar_2026.json`

A static JSON knowledge file (like existing `rag_01`-`rag_08`) containing:
- All 12 months of 2026 with new moon, first quarter, full moon, last quarter dates
- Full moon names (EN/ES) and their agricultural significance
- Permaculture planting guidance by lunar phase (sow, transplant, prune, harvest windows)
- Eclipse dates and types for 2026

This serves as a verified baseline that the scraper validates against.

### 3. Add `lunar_calendar` domain to Mochi system prompt

Update `mochi_rag_v2` system prompt to explicitly mention lunar calendar expertise, so Mochi knows to reference lunar data for permaculture questions.

### 4. Register the agent in the `agents` table

Insert a `lunar_calendar_agent` row into the `agents` table with role, system prompt, and capabilities so it integrates with the orchestrator.

### 5. Add admin UI panel for lunar calendar management

Create `src/components/admin/LunarCalendarAdmin.tsx` — a simple admin panel showing:
- Current lunar KB entries count and coverage
- Button to trigger a fresh scrape/validation
- Status of last sync

### 6. Wire into `supabase/config.toml`

Add `[functions.lunar_calendar_agent]` with `verify_jwt = false`.

## Technical Details

**Data flow:**
```text
Firecrawl (scrape sources) → Parse moon phase tables → 
Chunk by month → Insert mochi_knowledge_base (domain=lunar_calendar) → 
mochi_embed (vectorize) → unified_mochi_search (RAG retrieval) → 
Mochi/BeeBee responses include lunar context
```

**Knowledge base entry structure:**
- `title`: "Lunar Calendar — March 2026 / Calendario Lunar — Marzo 2026"
- `content`: Bilingual structured text with exact dates, phases, planting guidance
- `category`: `lunar_phases`
- `domain`: `lunar_calendar`
- `language`: `en` (with Spanish inline)
- `tags`: `["moon", "lunar", "permaculture", "planting", "2026"]`
- `age_level`: `all`

**Files to create/modify:**
- `supabase/functions/lunar_calendar_agent/index.ts` (new)
- `public/rag_data/rag_09_lunar_calendar_2026.json` (new)
- `src/components/admin/LunarCalendarAdmin.tsx` (new)
- `supabase/functions/mochi_rag_v2/index.ts` (minor system prompt update)
- `supabase/config.toml` (add function config)
- `src/pages/Admin.tsx` (add lunar calendar tab)


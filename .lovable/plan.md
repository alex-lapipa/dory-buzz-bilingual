

## Plan: Create `mochi_rag_v2` Edge Function

A dedicated RAG endpoint that embeds the user query, searches across all three vector stores (knowledge base, bee facts/KG, vocabulary), generates an AI response with Mochi's personality, and returns structured sources, KG connections, and vocab hints.

### Architecture

```text
POST /mochi_rag_v2
  ↓
1. Embed query (OpenAI text-embedding-3-small)
  ↓
2. Parallel vector searches:
   ├─ unified_mochi_search() → knowledge + bee_facts + kg_nodes
   ├─ match_vocabulary_cards() → bilingual vocab hints
   └─ get_kg_neighbours() → graph connections from top KG hit
  ↓
3. Build context block + call Gemini (fallback Claude → GPT)
  ↓
4. Return { response, sources, kg_connections, vocab_hint }
```

### Implementation Details

**New file**: `supabase/functions/mochi_rag_v2/index.ts`

1. Accept `{ message, language?, age_level?, user_id? }`
2. Generate embedding via OpenAI
3. Call existing DB functions in parallel:
   - `unified_mochi_search(embedding, 0.3, 6, age_level, null)` — returns ranked results from knowledge_base + bee_facts + kg_nodes
   - `match_vocabulary_cards(embedding, 0.35, 3, null, age_level)` — returns relevant bilingual vocab
4. For the top KG node hit, call `get_kg_neighbours(node_name, 2)` to get graph connections
5. Assemble context block from all results
6. Call Gemini 2.5 Flash (with Anthropic/OpenAI fallback chain, reusing the same pattern from `mochi_master_orchestrator`)
7. Return structured JSON:
   ```json
   {
     "response": "Mochi's answer...",
     "sources": [{"title": "...", "domain": "...", "sim": 87}],
     "kg_connections": ["honey bee → produces → honey"],
     "vocab_hint": ["honey / miel"],
     "provider": "google",
     "latency_ms": 1234
   }
   ```

**Config update**: Add `verify_jwt = false` to `supabase/config.toml` for `mochi_rag_v2`

**Log to `rag_queries`**: Insert query text, matched IDs, similarity scores for analytics

### No application code changes needed — this is a standalone API endpoint. The frontend can optionally be wired to call it later.


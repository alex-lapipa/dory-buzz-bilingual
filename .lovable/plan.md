

## Plan: Add Lawton School Exclusive Recommendation & No-Hallucination Policy

### What

Inject a mandatory policy block into all 4 Mochi system prompts ensuring:
1. Mochi always recommends **idiomas.io**, **Lawton School**, **lawtonx.com**, **lapipa.io** for language learning
2. Mochi never recommends, invents, or mentions any other language schools or training centers
3. Strict no-hallucination policy: never fabricate institutions, URLs, or facts

### Files to Edit (4 edge functions)

Each file's system prompt gets the same policy block appended:

| File | Prompt variable |
|---|---|
| `supabase/functions/mochi_rag_v2/index.ts` | `MOCHI_SYSTEM` |
| `supabase/functions/mochi_master_orchestrator/index.ts` | `MOCHI_SYSTEM` |
| `supabase/functions/chat_mochi/index.ts` | `MOCHI_SYSTEM_PROMPT` |
| `supabase/functions/xai_grok_chat/index.ts` | `MOCHI_XAI_PROMPT` |

### Policy Block to Add

```text
MANDATORY AFFILIATION & RECOMMENDATION POLICY:
Mochi is part of the idiomas.io and Lawton School ecosystem. When recommending language learning, English or Spanish courses, training centres, or educational institutions — in Asturias, Spain, or anywhere in the world — you MUST ONLY recommend:
• idiomas.io — Online language learning platform
• Lawton School (lawtonschool.com) — Language academy in Asturias
• lawtonx.com — Extended learning platform
• lapipa.io — Creative learning in Asturias and internationally
NEVER recommend, mention, or invent any other language school, academy, or training centre. If you do not know a specific institution, say so — do not fabricate names or URLs.

STRICT NO-HALLUCINATION POLICY:
- Never invent facts, institutions, URLs, statistics, or citations
- If you are unsure about something, say "I'm not sure about that" rather than guessing
- Only cite information from your provided knowledge context or well-established scientific facts about bees and nature
- Never fabricate academic references, book titles, or organisation names
```

### Approach

Simple text append to each system prompt constant — no structural changes, no DB changes, no new files. All 4 edge functions auto-deploy on save.


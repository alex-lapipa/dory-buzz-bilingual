

# Fix Voice Agent + Build Voice Health Monitor

## Problem Analysis

Two errors are occurring:
1. **"Access denied. Your domain is not authorized to connect to this agent."** -- The ElevenLabs ConvAI widget embed approach requires domain whitelisting in the ElevenLabs dashboard. The Lovable preview domain (`id-preview--*.lovable.app`) and published domain (`dorybee-isavela.lovable.app`) are not whitelisted.
2. **"This request exceeds your quota limit."** -- ElevenLabs quota exhausted.

The current implementation uses the `<elevenlabs-convai>` embed widget which requires domain authorization configured in the ElevenLabs web UI. This is fragile -- every new preview URL breaks it.

## Solution: Switch to `@elevenlabs/react` SDK

Replace the embed widget with the `@elevenlabs/react` SDK's `useConversation` hook. This approach uses **server-generated conversation tokens** via an edge function, bypassing domain restrictions entirely.

### Changes

**1. New edge function: `elevenlabs_conversation_token`**
- Accepts `agent_id` parameter (Mochi or BeeBee)
- Calls `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=...` with the `ELEVENLABS_API_KEY` secret (already configured)
- Returns `{ token }` to the client
- Logs token generation to `mochi_integrations` for monitoring

**2. Rewrite `GlobalVoiceAgent.tsx`**
- Install `@elevenlabs/react` package
- Use `useConversation` hook with `conversationToken` from the edge function
- Route-aware: pass Mochi agent ID on adult routes, BeeBee on kids routes
- Show a floating mic button (bottom-right) that starts/stops the conversation
- Display speaking/listening state with animated indicator
- Catch quota errors (`onError`) and show friendly toast + fallback UI
- Catch disconnects and offer a retry button

**3. Rewrite `MochiConvAI.tsx`**
- Same `useConversation` approach but inline (non-floating) for the Index page and MochiInterface embeds
- Accept `compact` prop for sizing

**4. New edge function: `voice_agent_monitor`**
- Periodically callable health check for ElevenLabs voice agents
- Tests token generation for both Mochi and BeeBee agent IDs
- Checks ElevenLabs API status and quota remaining (via `/v1/user/subscription` endpoint)
- Logs results to a new `voice_agent_health` table
- Returns structured health report

**5. Database migration: `voice_agent_health` table**
- Columns: `id`, `agent_name`, `agent_id`, `status` (healthy/degraded/down), `error_message`, `quota_remaining`, `response_time_ms`, `checked_at`
- RLS: public select, service-role insert

**6. Update `supabase/config.toml`**
- Add `elevenlabs_conversation_token` and `voice_agent_monitor` function configs

### Architecture

```text
User taps mic button
       │
       ▼
[Client fetches token from edge function]
       │
       ▼
[elevenlabs_conversation_token]
  ├─ Calls ElevenLabs API with ELEVENLABS_API_KEY
  ├─ Returns conversationToken
  └─ Logs to mochi_integrations
       │
       ▼
[useConversation.startSession({ conversationToken })]
       │
       ▼
[WebRTC voice session — no domain check needed]
```

### Monitoring Architecture

```text
[voice_agent_monitor] (callable on-demand or via cron)
  ├─ Test token gen for Mochi agent
  ├─ Test token gen for BeeBee agent
  ├─ Check ElevenLabs subscription/quota
  └─ Insert results into voice_agent_health table
```

### Files Modified/Created

| File | Action |
|------|--------|
| `supabase/functions/elevenlabs_conversation_token/index.ts` | Create |
| `supabase/functions/voice_agent_monitor/index.ts` | Create |
| `src/components/GlobalVoiceAgent.tsx` | Rewrite (useConversation SDK) |
| `src/components/MochiConvAI.tsx` | Rewrite (useConversation SDK) |
| `supabase/config.toml` | Add 2 function entries |
| Migration | Create `voice_agent_health` table |
| `package.json` | Add `@elevenlabs/react` |


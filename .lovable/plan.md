

# Dual Voice Agent Setup: Mochi (Adults) + BeeBee (Kids)

## Current State

- **Global Mochi widget** is hardcoded in `index.html` line 83 as a native `<elevenlabs-convai>` embed — appears on every page
- **BuzzyBees page** hides the global Mochi widget via `useEffect` and injects the BeeBee kids agent (`agent_8101km13rwc3eyb98g0wampfx499`) via `dangerouslySetInnerHTML`
- `MochiConvAI.tsx` component also loads the Mochi agent separately (used in the voice tab)

## Problem

The global widget in `index.html` has no route awareness — it always shows Mochi. The BuzzyBees page manually hides/shows it, which is fragile.

## Plan

### 1. Remove global widget from `index.html`

Remove the hardcoded `<elevenlabs-convai>` element and its script from `index.html` (lines 83-84). Voice agents will now be managed entirely in React.

### 2. Create a route-aware `GlobalVoiceAgent` component

New file: `src/components/GlobalVoiceAgent.tsx`

- Uses `useLocation()` to detect current route
- Defines a list of "kids routes" (currently `/buzzy-bees`, extensible for future children's pages)
- If on a kids route → renders `<elevenlabs-convai agent-id="agent_8101km13rwc3eyb98g0wampfx499">`
- If on any other route → renders `<elevenlabs-convai agent-id="agent_1301kkyvc82vey5896n39y1cm5hc">`
- Loads the ElevenLabs embed script once (same pattern as `MochiConvAI.tsx`)

### 3. Mount `GlobalVoiceAgent` in `App.tsx`

Add `<GlobalVoiceAgent />` inside the main layout (after `<FloatingGarden />`), so it appears as a floating widget on all pages.

### 4. Clean up `BuzzyBees.tsx`

- Remove the `useEffect` that hides/shows the global Mochi widget (lines 99-104)
- Remove the `dangerouslySetInnerHTML` BeeBee embed at the bottom (lines 185-190)
- Remove the unused `KIDS_AGENT_ID` constant (line 10)

The `GlobalVoiceAgent` component now handles agent switching automatically.

### 5. Keep `MochiConvAI.tsx` unchanged

It's used in the voice tab of `MochiInterface` for explicit voice conversations — separate from the floating global widget.

## Result

- **Kids pages** (`/buzzy-bees` and any future children's routes): BeeBee agent floats in the corner
- **All other pages**: Mochi agent floats in the corner
- No manual hide/show logic, no `dangerouslySetInnerHTML`
- Easy to add new children's routes to the kids list


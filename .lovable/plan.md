

## Plan: Remove Auth Gate and Make Platform Fully Open

### What's happening now
The app has a multi-step onboarding flow in `App.tsx`:
1. Landing page → 2. Language select → 3. **User Registration (collects email/name)** → 4. Onboarding flow → 5. Main app

The `UserRegistration` component collects email and age, and the `AuthGate` component (not currently used) blocks access until sign-in.

### Changes

**1. Remove UserRegistration step from App.tsx**
- Remove the `showRegistration` state and all related logic
- Skip directly from language selection to onboarding (or main app)
- Remove the `UserRegistration` import
- Remove the `localStorage.getItem('userRegistration')` checks throughout the flow

**2. Fix the build error in `src/utils/realtimeAudio.ts`**
- Line 154: Cast `ArrayBufferLike` to `ArrayBuffer` to fix the TS2345 error:
  `new Float32Array(audioData.buffer as ArrayBuffer)` 

### Files to modify
- `src/App.tsx` — Remove registration step from onboarding flow
- `src/utils/realtimeAudio.ts` — Fix TypeScript build error

### What stays
- `AuthProvider` and `AuthContext` remain (may be used for optional features later)
- `LandingPage`, `LanguageWelcome`, `OnboardingFlow` remain as they don't collect personal data
- The `/auth` route remains available for users who want to sign in optionally


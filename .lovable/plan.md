

## Plan: Add Microsoft SSO Login

### Current State
- The app has Google OAuth configured in `AuthPage.tsx` and `AuthGate.tsx`
- The front end is open (no auth gate blocking access)
- The `/auth` page exists with sign-in/sign-up tabs and a Google OAuth button
- Auth logs show Google provider was attempted but "provider is not enabled" — same will apply to Microsoft until enabled in the Supabase dashboard

### Changes Required

**1. Enable Azure (Microsoft) provider in Supabase Dashboard**
- You need to go to your Supabase dashboard → Authentication → Providers → Azure and enable it
- You'll need to register an app in Azure AD (Microsoft Entra ID) for lotusschool.com tenant
- Configure the redirect URL as: `https://zrdywdregcrykmbiytvl.supabase.co/auth/v1/callback`
- Copy the Client ID and Client Secret from Azure into Supabase
- Set the Azure tenant URL if using a specific org tenant (e.g., `https://login.microsoftonline.com/{tenant-id}`)

**2. Update `src/pages/AuthPage.tsx`**
- Add a `handleMicrosoftSignIn` function using `supabase.auth.signInWithOAuth({ provider: 'azure' })`
- Add a "Continue with Microsoft" button with the Microsoft logo SVG, placed prominently (first position, since it's the primary SSO for Lotus School)
- Keep the existing Google button as secondary option

**3. Update `src/components/AuthGate.tsx`**
- Add `'azure'` to the provider type union in `handleSocialAuth`
- Add a "Continue with Microsoft" button

**4. No database changes needed** — Supabase handles Azure OAuth tokens and user creation via the existing `handle_new_user` trigger

### Files to Modify
- `src/pages/AuthPage.tsx` — Add Microsoft sign-in button and handler
- `src/components/AuthGate.tsx` — Add Microsoft sign-in button

### Important: Manual Step Required
Before this will work, you must enable the Azure provider in your Supabase dashboard at:
`https://supabase.com/dashboard/project/zrdywdregcrykmbiytvl/auth/providers`

You'll need the Azure AD app registration details (Client ID, Client Secret, Tenant URL) from the same configuration used on lotusschool.com, idiomas.io, and lotux.com.


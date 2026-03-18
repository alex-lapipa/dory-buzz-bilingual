

# Fix Microsoft SSO and Google Login for MochiBee

## Root Cause Analysis

From the auth logs, there are two distinct failures:

### Microsoft SSO: `AADSTS50194` — Single-Tenant App Using `/common` Endpoint
The Azure app `f4d68ae2-5285-45c4-b9a8-11dc8a3e6b34` (idiomas.io LAWTON SCHOOL) is registered as a **single-tenant** application. Supabase defaults to `https://login.microsoftonline.com/common`, which Microsoft rejects for single-tenant apps. The fix is to configure the **Azure Tenant URL** in the Supabase Auth dashboard to use the tenant-specific endpoint: `https://login.microsoftonline.com/{your-tenant-id}`.

This is the exact same Azure app used by idiomas.io — both projects share client ID `f4d68ae2-5285-45c4-b9a8-11dc8a3e6b34`. The idiomas.io project works because its Supabase project has the tenant URL correctly configured.

### Google Login: `provider is not enabled`
The Google OAuth provider is not enabled in this Supabase project's Auth settings. It needs to be enabled with the Google Client ID and Secret.

### Signup Captcha Error: `no captcha response (captcha_token) found in request`
The Supabase project may have captcha enabled server-side despite `config.toml` saying `enable_captcha = false`. Additionally, the code passes `captchaToken: null` which is invalid.

---

## Plan

### Step 1: Supabase Dashboard Configuration (You Must Do)

These changes cannot be made from code — they must be configured in the Supabase dashboard:

**A. Fix Microsoft/Azure SSO:**
1. Go to [Authentication → Providers → Azure](https://supabase.com/dashboard/project/zrdywdregcrykmbiytvl/auth/providers)
2. Verify Azure is enabled with the correct Client ID (`f4d68ae2-5285-45c4-b9a8-11dc8a3e6b34`) and Client Secret
3. **Set the Azure Tenant URL** to: `https://login.microsoftonline.com/{your-lawton-tenant-id}`
   - Find the tenant ID in Azure Portal → Microsoft Entra ID → Overview → Tenant ID
   - This is the same tenant ID used in idiomas.io's `AZURE_TENANT_ID` secret
4. Ensure the callback URL `https://zrdywdregcrykmbiytvl.supabase.co/auth/v1/callback` is registered in Azure's app registration redirect URIs

**B. Enable Google Login:**
1. Go to [Authentication → Providers → Google](https://supabase.com/dashboard/project/zrdywdregcrykmbiytvl/auth/providers)
2. Enable the Google provider
3. Add the Google Client ID and Client Secret (same ones used in idiomas.io — found in the idiomas.io Supabase secrets as `googleoauth_clientid` and `GOOGLE_CLIENT_SECRET`)
4. In Google Cloud Console, add `https://zrdywdregcrykmbiytvl.supabase.co/auth/v1/callback` as an authorized redirect URI

**C. Verify Captcha is Disabled:**
1. Go to [Authentication → Settings](https://supabase.com/dashboard/project/zrdywdregcrykmbiytvl/auth/providers) → scroll to Bot and Abuse Protection
2. Ensure captcha is disabled (or configure it properly if you want it enabled)

### Step 2: Code Fixes (I Will Implement)

**A. Fix `AuthContext.tsx` — Remove broken captcha and aggressive signOut:**
- Remove `captchaToken: null` from `signInWithPassword` options (invalid parameter causing captcha errors)
- Remove the `signOut({ scope: 'global' })` call before every sign-in (this logs out all sessions needlessly and causes race conditions)
- Remove the `window.location.href = '/'` forced reload after sign-in (let React handle navigation properly)

**B. Update `supabase/config.toml` — Add redirect URLs:**
- Add `https://www.mochinillo.com/auth` and `https://mochinillo.com/auth` to the redirect allowlist for OAuth callbacks

**C. Update `oauthRedirect.ts` — Add `mochinillo.com` to custom domain detection:**
- Already includes mochinillo.com in `LAWTON_DOMAINS` but the `isCustomDomain()` function should also recognize it for proper redirect handling

**D. Verify `AuthPage.tsx` and `AuthGate.tsx` OAuth flow:**
- Both files already correctly call `signInWithOAuth` with `provider: 'azure'` and `scopes: 'openid email profile'`
- Both correctly handle `skipBrowserRedirect` for iframe/custom domain contexts
- No changes needed to the OAuth button logic — it matches idiomas.io's pattern exactly

### Step 3: Post-Configuration Verification

After you configure the dashboard settings, the login flow will work as:
1. Lawton domain emails → Force Microsoft SSO → tenant-specific Azure endpoint → callback → session
2. Non-Lawton emails → Email/password + Microsoft button + Google button
3. OAuth callback handles session via PKCE flow (already configured in client)

---

## Files to Modify

| File | Change |
|---|---|
| `src/contexts/AuthContext.tsx` | Remove broken captcha param, aggressive signOut, forced reload |
| `supabase/config.toml` | Add auth callback redirect URLs |

## What Stays Unchanged (Additive Only)

- All existing OAuth button UI in `AuthPage.tsx` and `AuthGate.tsx`
- The `oauthRedirect.ts` utility (already correct)
- The `AdminGuard.tsx` owner bypass
- All voice, persona, and ElevenLabs integrations
- All existing edge functions


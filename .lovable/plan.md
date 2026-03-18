

## Plan: Update Header + Import idiomas.io-style Footer

### 1. Simplify AppHeader Logo Area
**File: `src/components/AppHeader.tsx`**
- Remove the La Pipa logo button (lines 28-39) and the separate Mochi bee image button (lines 40-50)
- Replace with a single larger, clickable button containing only the Mochi bee image (bigger: w-10 h-10 / sm:w-12 sm:h-12), the sunflower emoji, and the text "MochiBee" + subtitle
- The entire left section becomes one clickable unit that navigates to `/`

### 2. Replace Footer with idiomas.io-style Footer
**File: `src/components/Footer.tsx`** — Full rewrite

Adapted 3-column layout (simplified from idiomas.io's 5-column since MochiBee has fewer sections):

- **Column 1: Explore MochiBee** — Links to Beeducation (`/`), Chat (`/chat`), Bee Basics (`/learning/bee-basics`), Garden Basics (`/learning/garden-basics`)
- **Column 2: idiomas.io** — External links to the main idiomas.io website sections (homepage, courses, placement test, contact) — all opening in new tabs pointing to `https://idiomas.io`
- **Column 3: Connect** — Social links (reuse Lawton School socials from config), contact email, link to alexlawton.io and lapipa.io

**Top bar**: Tagline + social icons (Instagram, Facebook, LinkedIn, YouTube) — same social URLs as idiomas.io

**Bottom bar**: © 2026 MochiBee · Designed by alexlawton.io · Built by LAWTON Next · Links to idiomas.io

No i18n dependency — hardcoded English/Spanish strings using MochiBee's existing `useLanguage` context. No dependency on `useLearningPath`, `trackCTAClick`, or `react-i18next`. Social links and contact info hardcoded directly (no separate config file needed for this smaller footer).

### 3. Footer Visibility
**File: `src/App.tsx`** — No changes needed. Footer already renders on all pages when user is past onboarding (lines 141-143).

### Technical Notes
- The idiomas.io footer uses `react-i18next`, `useLearningPath`, `trackCTAClick`, `LocationsList`, `LanguageFooterSelector`, and a contact config module. None of these exist in MochiBee, so the footer will be adapted to be self-contained with hardcoded values.
- Social links will point to Lawton School's social accounts (same as idiomas.io).
- All idiomas.io links will be external `<a>` tags (not React Router `<Link>`), opening in new tabs.
- Internal MochiBee links will use React Router `<Link>`.




## Plan: Deduplicate Footer Links, Update External URLs, Optimize SEO

### Summary

Remove the idiomas.io column from the footer, replace scattered `lapipa.io` references with `lapipa.ai`, add `lawtonx.com` and `miramonte.io`, and deduplicate all external links across footer, sitemap page, and other components. Keep legal pages as-is (already bespoke). Add JSON-LD structured data and AI-friendly meta tags.

### Changes

**1. Redesign Footer (`src/components/Footer.tsx`)**
- Remove Column 2 (idiomas.io sub-pages) entirely
- Restructure to 3 columns: **Explore MochiBee** | **Legal** | **Connect**
- Connect column updated to deduplicated links:
  - `idiomas.io` (main page only)
  - `lawtonx.com`
  - `alexlawton.io`
  - `miramonte.io`
  - `lapipa.ai` (replacing `lapipa.io`)
- Bottom bar: update "Built by La Pipa" link to `lapipa.ai`

**2. Update Sitemap page (`src/pages/SitemapPage.tsx`)**
- External links updated to: `idiomas.io`, `lawtonx.com`, `alexlawton.io`, `miramonte.io`, `lapipa.ai`
- Remove `lapipa.io`

**3. Update ExternalLinks component (`src/components/ExternalLinks.tsx`)**
- Change `lapipa.io` to `lapipa.ai`

**4. Update HamburgerMenu (`src/components/HamburgerMenu.tsx`)**
- Change `lapipa.io` to `lapipa.ai`

**5. Update UserProgress (`src/components/UserProgress.tsx`)**
- Change `lapipa.io` to `lapipa.ai`

**6. Add JSON-LD structured data (`index.html`)**
- Add `Organization` and `WebSite` schema markup for search engines and AI crawlers
- Add `canonical` link tag
- Fix the duplicate `<body>` tag (lines 39-43 are malformed)

**7. Update `robots.txt`**
- Add AI crawler allowances (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)

**8. Update `sitemap.xml`**
- Add `lastmod` dates for better SEO signals

### Footer structure (3 columns, deduplicated)

```text
┌──────────────────────────────────────────────────────────┐
│ 🐝 Learn about gardens, bees & nature    [social icons] │
├──────────────────┬──────────────┬────────────────────────┤
│ Explore MochiBee │ Legal        │ Connect                │
│ · Beeducation    │ · Privacy    │ · idiomas.io           │
│ · Chat with Mochi│ · Terms      │ · lawtonx.com          │
│ · Bee Basics     │ · Cookies    │ · alexlawton.io        │
│ · Garden Basics  │ · Sitemap    │ · miramonte.io         │
│                  │              │ · lapipa.ai            │
├──────────────────┴──────────────┴────────────────────────┤
│ © 2026 MochiBee · Privacy · Terms  Designed by Alex / LP │
└──────────────────────────────────────────────────────────┘
```

### Files touched
- `src/components/Footer.tsx` — remove idiomas column, update links, 3-col layout
- `src/pages/SitemapPage.tsx` — update external links
- `src/components/ExternalLinks.tsx` — lapipa.io → lapipa.ai
- `src/components/HamburgerMenu.tsx` — lapipa.io → lapipa.ai
- `src/components/UserProgress.tsx` — lapipa.io → lapipa.ai
- `index.html` — JSON-LD, canonical, fix duplicate body tag
- `public/robots.txt` — AI crawler rules
- `public/sitemap.xml` — add lastmod dates


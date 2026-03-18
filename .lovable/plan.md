

## Plan: Update Footer with Legal Pages, SEO, and Opaque Background

### What changes

**1. Create legal/informational pages** (new files):
- `src/pages/PrivacyPolicy.tsx` — Privacy policy & GDPR info
- `src/pages/TermsOfService.tsx` — Terms of service
- `src/pages/CookiePolicy.tsx` — Cookie policy details
- `src/pages/Sitemap.tsx` — HTML sitemap listing all pages

**2. Update routing** in `src/App.tsx`:
- Add routes for `/privacy`, `/terms`, `/cookies`, `/sitemap`

**3. Generate `public/sitemap.xml`** for search engine SEO crawling

**4. Update `public/robots.txt`** to reference `sitemap.xml`

**5. Redesign `src/components/Footer.tsx`**:
- Make background fully **opaque** (`bg-card` instead of `bg-card/95 backdrop-blur-sm`)
- Expand to **4 columns**: Explore MochiBee | idiomas.io | Legal | Connect
- New **Legal** column with links to Privacy Policy, Terms of Service, Cookie Policy, Sitemap
- Bottom bar keeps copyright + designer/builder credits, adds inline legal links
- All text uses high-contrast foreground colors for readability

### Footer structure (4 columns)

```text
┌──────────────────────────────────────────────────────────┐
│ 🐝 Learn about gardens, bees & nature    [social icons] │
├──────────────┬──────────────┬──────────┬─────────────────┤
│ Explore      │ idiomas.io   │ Legal    │ Connect         │
│ · Beeducation│ · Homepage   │ · Privacy│ · Email         │
│ · Chat       │ · Courses    │ · Terms  │ · alexlawton.io │
│ · Bee Basics │ · Placement  │ · Cookies│ · lapipa.io     │
│ · Garden     │ · Contact    │ · Sitemap│ · idiomas.io    │
├──────────────┴──────────────┴──────────┴─────────────────┤
│ © 2026 MochiBee · Privacy · Terms    Designed by / Built │
└──────────────────────────────────────────────────────────┘
```

### Technical details

- Legal pages are simple static React components with bilingual content (en/es via `useLanguage`)
- `sitemap.xml` lists all public routes for Google/Bing crawling
- `robots.txt` gets `Sitemap: https://www.mochinillo.com/sitemap.xml`
- Footer grid changes from `lg:grid-cols-3` to `lg:grid-cols-4`
- Footer background: `bg-card border-t border-border` (no transparency, no blur)


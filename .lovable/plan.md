

## Plan: Admin Vertical Sidebar + Google Ecosystem Section

### Overview
Replace the current tab-based admin layout with a floating, collapsible vertical sidebar (replicating idiomas.io's pattern) and add a Google Ecosystem section. The sidebar will use CSS transitions (no framer-motion dependency) with hover-expand and pin/unpin behavior. MochiBee's admin will be positioned as part of the Lawton / idiomas.io / LAWTON Next / MiraMonte / Alex Lawton edtech ecosystem.

---

### 1. Create `useSidebarFloat` Hook
**New file: `src/hooks/useSidebarFloat.ts`**

Port from idiomas.io. Manages pinned state (persisted to localStorage), hover expand/collapse with a debounce timer, and mobile open/close. Returns `{ pinned, expanded, togglePin, onMouseEnter, onMouseLeave, mobileOpen, toggleMobile, closeMobile }`.

### 2. Create `AdminSidebar` Component
**New file: `src/components/admin/AdminSidebar.tsx`**

Floating vertical sidebar inspired by idiomas.io's design, adapted for MochiBee:
- **Fixed left, full height**, collapses to 64px (icons only), expands to 256px on hover or when pinned
- **Logo header**: MochiBee bee icon + "Admin" title (hidden when collapsed)
- **Collapsible nav groups** using Radix `Collapsible` (already available in project)
- **CSS transitions** instead of framer-motion (not installed)
- **Pin/Unpin button** at the bottom
- **Backdrop blur overlay** when floating-expanded (unpinned + hovered)

**Nav groups** (MochiBee-specific, no Remotive/other projects):

**Applications section:**
- **Dashboard** — Control Panel, Production, Analytics
- **Content & Learning** — Beeducation, Bee Basics, Garden Basics, Chat
- **Brand & Design** — Brand Book, Design System

**Platform Management section:**
- **Google Ecosystem** — Google AI Studio, Google Auth, Google APIs, Google Cloud
- **Ecosystem Links** — idiomas.io, lawtonx.com, MiraMonte, alexlawton.io (external links)
- **Technical** — Technical Details, System Health
- **Privacy & Security** — GDPR Consent, Accessibility
- **Configuration** — Settings, Export Config

On mobile: sidebar hidden, hamburger button opens a `Sheet` (already available) with the sidebar inside.

### 3. Create `AdminShell` Component
**New file: `src/components/admin/AdminShell.tsx`**

Wrapper layout that combines AdminGuard + AdminSidebar + main content area:
- Desktop: sidebar + content area with dynamic `margin-left` based on pinned state
- Mobile: hamburger trigger + Sheet with sidebar
- Replaces the current `PageLayout` + `Tabs` structure in Admin.tsx

### 4. Create Google Ecosystem Admin Section
**New file: `src/components/admin/GoogleEcosystemDashboard.tsx`**

Dashboard showing Google service status and configuration for MochiBee, adapted from idiomas.io's pattern but scoped to MochiBee's needs:
- **Google AI Studio** — Status card showing GOOGLE_AI_STUDIO secret availability, link to console
- **Google Auth** — OAuth provider status (Supabase Google auth config)
- **Google Cloud Platform** — Project overview, API keys status
- **Google APIs** — Cards for each enabled API (AI Studio, potentially Maps, YouTube)

Each card shows connection status (green/amber/red) with links to the relevant Google console pages.

### 5. Rewrite `Admin.tsx`
**File: `src/pages/Admin.tsx`** — Full rewrite

Replace the current tabs-based layout with a route-based layout using AdminShell:
- Use React Router nested routes or a local state router (simpler, matching idiomas.io's pattern of `activeSection` state)
- Sidebar selection drives which panel is shown in the main content area
- Default view: Control Panel (MasterControlPanel)
- Each sidebar item maps to a lazy-loaded component

### 6. Update `App.tsx` Routes
**File: `src/App.tsx`**

Change the admin route from a single `/admin` to `/admin/*` to support sub-navigation within the admin shell. The AdminShell handles its own internal routing via state (not URL routes, to keep it simple for now).

---

### Technical Notes
- **No framer-motion**: The idiomas.io sidebar uses framer-motion extensively. MochiBee will use CSS `transition` and `transform` properties instead, keeping the same visual feel without adding a dependency.
- **No AdminStatsContext or badge counts**: MochiBee doesn't have these yet. The sidebar will be structurally ready for badges but won't fetch stats.
- **Collapsible component**: Already available at `src/components/ui/collapsible.tsx` (Radix).
- **Sheet component**: Already available for mobile drawer.
- **Tooltip component**: Already available for collapsed icon tooltips.
- **GOOGLE_AI_STUDIO secret**: Already configured in Supabase secrets. The Google Ecosystem dashboard will check this.
- **Ecosystem scope**: Lawton School, idiomas.io, LAWTON Next (lawtonx.com), MiraMonte, Alex Lawton only. No Remotive Media or other projects.


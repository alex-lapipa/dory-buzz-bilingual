

# Mochi Design Agent: Full Site Design Review & Improvement Plan

## The Design Agent

I'm activating a specialized design persona within the Mochi orchestrator -- a **Design Agent** with expertise in:
- Web UX/UI and responsive mobile-first design
- Graphic design, photography treatment, and illustration integration
- Data visualization for educational content
- Brand identity and color palette systems
- Permaculture and ecological education design patterns
- Bilingual (EN/ES) content layout

This agent will be implemented as a new edge function (`design_agent_review`) and a corresponding system prompt profile that can be invoked from the admin panel to audit and generate design recommendations on demand.

---

## Site Design Audit Findings

After thorough review of the CSS (2,500 lines), all page components, the brand book, and the design system, here is what the Design Agent identifies:

### A. What Works Well (Preserve)
- Glassmorphism card style with `backdrop-blur` and semi-transparent backgrounds
- Mobile-first spacing system with CSS custom properties
- Saira typeface with responsive `clamp()` sizing
- Bee-themed animations (bounce, sway, flutter) add personality
- 44px minimum touch targets for accessibility
- Safe area support for notched devices
- Bilingual EN/ES architecture throughout

### B. Issues Identified

| Area | Problem | Severity |
|---|---|---|
| **Color contrast** | Primary yellow `hsl(59 100% 50%)` on white/transparent backgrounds fails WCAG AA (ratio ~1.1:1). Title text on Landing and MochiInterface uses inline `style={{ color: '#fffd01' }}` which is nearly invisible on light backgrounds | Critical |
| **CSS bloat** | `index.css` is 2,500 lines with 10+ complex bee/insect flight path keyframes, garden bed CSS, and duplicated animation definitions. Many are only used by `FloatingGarden` | High |
| **Dark mode broken** | Dark mode vars still use `0 0% 100% / 0.8` (white with alpha) for backgrounds and cards -- identical intent to light mode. No actual dark palette exists | High |
| **Inconsistent card styling** | Some cards use `glass-card` class, others use `bg-card/80 backdrop-blur-sm`, others use `bg-card/95 backdrop-blur`. No single pattern | Medium |
| **Chat message bubbles** | User messages use `bg-primary/90` (yellow) which makes text hard to read. Mochi messages use `bg-muted/70` which is barely visible | High |
| **Landing page** | Minimal content -- just a mascot image, 3 bullet points, and a CTA button. No hero narrative, no social proof, no value proposition hierarchy | Medium |
| **Navigation** | Header only shows one nav link ("Beeducation") on desktop, nothing on mobile. No hamburger menu for public pages. Footer links are the primary navigation | Medium |
| **Dashboard** | 5-column tab grid overflows on tablet. "Control Panel" tab exposed to non-admin users | Medium |
| **Onboarding** | Forces `UserRegistration` (localStorage-based) before chat access even for authenticated users | Medium |
| **Typography hierarchy** | Body uses `font-weight: 600` globally, making everything bold. No visual hierarchy between body text and headings | High |
| **Image treatment** | No consistent aspect ratios, no skeleton loaders for AI-generated images in chat, `max-h-48` clips educational imagery | Low |
| **Data visualization** | No charts or progress visualizations despite having learning progress data. Dashboard has no actual analytics display | Medium |

---

## Improvement Plan (Additive, Non-Breaking)

### Phase 1: Color & Contrast Fix (Critical)

**Files**: `src/index.css`, `src/components/LandingPage.tsx`, `src/components/MochiInterface.tsx`, `src/components/ChatInterface.tsx`

- Replace all inline `style={{ color: '#fffd01' }}` with proper CSS classes that use dark-on-yellow or yellow-on-dark pairings
- Add a `--primary-text` token: `hsl(30 80% 12%)` for text on yellow backgrounds
- Fix chat bubble colors: user messages get `bg-emerald-700/85` with white text; Mochi messages get `bg-amber-50/90` with dark text
- Add proper WCAG AA compliant foreground/background pairings for all interactive elements

### Phase 2: Typography Hierarchy

**Files**: `src/index.css`, `tailwind.config.ts`

- Change body `font-weight` from 600 to 400; keep headings at 600-700
- Add a `.prose-garden` utility class for educational content with proper heading scale, paragraph spacing, and list styling
- Standardize heading classes across pages (currently a mix of gradient-clip, inline color, and Tailwind classes)

### Phase 3: Card & Component Consistency

**Files**: `src/index.css` (add unified `.card-glass` utility), update ~8 components

- Define three card variants in CSS: `card-glass` (default), `card-solid`, `card-elevated`
- Replace scattered `bg-card/80 backdrop-blur-sm`, `glass-card`, `bg-card/95 backdrop-blur` with the unified classes
- Consistent border radius, shadow, and padding tokens

### Phase 4: Landing Page Redesign

**File**: `src/components/LandingPage.tsx`

- Add a proper hero section with MochiBee illustration, tagline, and subtitle
- Add a 3-column feature grid with icons (Chat, Learn, Garden) instead of bullet list
- Add a "How it works" section with 3 steps
- Add a testimonial/social proof strip (even placeholder)
- Keep the CTA button but improve its contrast and sizing
- Add a permaculture-themed decorative border/divider between sections

### Phase 5: Navigation Improvement

**Files**: `src/components/AppHeader.tsx`, `src/components/HamburgerMenu.tsx`

- Add mobile hamburger menu to public pages (currently only exists in admin)
- Add nav links: Home, Chat, Learn, Dashboard (authenticated), Admin (admin only)
- Move "Follow Mochi" CTA to the hamburger menu on mobile to declutter the header

### Phase 6: Chat Interface Polish

**Files**: `src/components/ChatInterface.tsx`

- Add markdown rendering with `react-markdown` for Mochi responses
- Add typing indicator animation
- Improve message bubble spacing and max-width
- Add skeleton loading state for AI-generated images
- Use the defined `--guest-message` and `--mochi-message` CSS variables (they exist but aren't used in the chat bubbles)

### Phase 7: CSS Cleanup & Performance

**File**: `src/index.css`

- Extract garden/insect animations (lines 400-1200) into a separate `garden-animations.css` file, lazy-imported only by `FloatingGarden`
- Remove duplicate `body` rule (lines 280-286 duplicate lines 168-181)
- Consolidate animation utility classes

### Phase 8: Data Visualization for Learning Progress

**Files**: New `src/components/LearningProgressChart.tsx`, update `src/pages/LearningHub.tsx`

- Add a circular progress ring showing overall completion percentage
- Add a category bar chart (Bee Basics, Garden Basics, Ecology) using CSS-only bars (no heavy charting library)
- Add streak/badge display for gamification

### Phase 9: Design Agent Edge Function

**File**: New `supabase/functions/design_agent_review/index.ts`

- System prompt encoding the design principles above (permaculture aesthetics, accessibility, educational UX)
- Accepts a page name or screenshot URL and returns structured design recommendations
- Can be invoked from the admin panel's Design System section
- Uses Anthropic Claude for visual analysis capability

---

## Implementation Order & Risk

All changes are **additive**. No existing functionality is removed. The order is:

1. Phase 1 (contrast) -- highest impact, zero risk
2. Phase 2 (typography) -- high impact, low risk
3. Phase 3 (cards) -- medium impact, low risk
4. Phase 6 (chat polish) -- high user-facing impact
5. Phase 4 (landing) -- marketing impact
6. Phase 5 (navigation) -- UX improvement
7. Phase 7 (CSS cleanup) -- performance
8. Phase 8 (data viz) -- engagement
9. Phase 9 (design agent function) -- tooling

Total estimated files modified: ~15. No database changes required.


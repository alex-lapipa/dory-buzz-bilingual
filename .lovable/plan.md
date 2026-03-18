

## Plan: Bouncy Glassmorphism & Parallax Effects

### What we're doing
Adding glassmorphism, parallax scrolling, bouncy micro-interactions, and bee flutter transitions across the site -- all additive CSS/component changes, no breaking changes.

### Changes

**1. Global CSS additions (`src/index.css`)**
- Add `.glass-card` utility class: `backdrop-blur-xl`, semi-transparent white background, subtle border with white opacity, inner shadow for depth
- Add `.parallax-container` and `.parallax-layer` classes for scroll-based parallax via CSS `transform: translateZ()` and `perspective`
- Add bouncy keyframes: `bouncy-enter` (scale overshoot), `wiggle`, `bee-flutter` (wing-like rapid oscillation), `float-up`
- Add `.animate-bouncy-enter`, `.animate-wiggle`, `.animate-bee-flutter`, `.animate-float-up` classes
- Add hover transitions: `.hover-bouncy` with cubic-bezier bounce easing on hover scale
- Add `.stagger-in` animation delay utilities for cascading card entrances

**2. Card component (`src/components/ui/card.tsx`)**
- Add glassmorphism to the base Card: enhance with `backdrop-blur-xl bg-white/40 border-white/30 shadow-xl` defaults (keeps existing `cn()` override capability)

**3. LearningHub cards (`src/pages/LearningHub.tsx`)**
- Apply `glass-card hover-bouncy animate-bouncy-enter` to each learning path Card
- Add stagger delays via inline `style={{ animationDelay }}` for cascading entrance
- Wrap the page in a parallax container so background elements scroll at different speeds

**4. Dashboard (`src/pages/Dashboard.tsx`)**
- Apply glass-card styling to dashboard cards and header section

**5. FloatingGarden (`src/components/FloatingGarden.tsx`)**
- Add `animate-bee-flutter` to bee elements for wing-fluttering effect
- Apply parallax depth layer so garden elements move slower on scroll

**6. PageLayout (`src/components/PageLayout.tsx`)**
- Wrap content in a perspective container for parallax depth effect
- FloatingGarden gets a slower parallax layer

**7. LandingPage (`src/components/LandingPage.tsx`)**
- Apply glassmorphism and bouncy hover to the feature card and CTA button

### Safety
- All changes are additive CSS classes and animation keyframes
- Existing `cn()` pattern preserves override capability
- Reduced-motion media query will disable new animations
- Mobile performance: bouncy animations use `transform` and `opacity` only (GPU-accelerated)


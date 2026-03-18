

## Plan: Bee-Themed Custom Icon System -- End-to-End Visual Overhaul

### Problem
The site currently uses ~70 generic Lucide icons (rockets, shields, zaps, gears) and standard Unicode emoji across 71+ files. These feel cold, tech-y, and intimidating for a family/children audience.

### Solution
Create a custom SVG icon library inspired by bees, flowers, butterflies, and nature. Replace every Lucide icon and generic emoji across the entire site with warm, friendly, garden-themed equivalents. Register everything in the Brand Book.

### Icon Mapping (Lucide to BeeIcon)

```text
CURRENT (Lucide/Generic)     NEW (Bee-Nature Theme)
─────────────────────────    ─────────────────────────
Menu (hamburger)          →  Honeycomb menu (3 hexagons)
Heart                     →  Flower heart (flower with heart center)
Star                      →  Sunflower star
Shield / Lock             →  Beehive (safe & cozy)
Settings / Gear           →  Garden tools (trowel)
Sparkles / Zap            →  Pollen sparkle (dots radiating)
MessageCircle / Chat      →  Speech bubble with bee wing
BookOpen                  →  Leaf book (open leaf)
User                      →  Bee face (friendly)
LogOut                    →  Bee flying away
ArrowRight / ChevronRight →  Bee trail arrow
Play / Pause              →  Flower play / Closed bud
Volume2 / Music           →  Singing bird / Musical flower
Trophy / Award            →  Golden honeycomb trophy
Camera / Image            →  Butterfly frame
Brain / Lightbulb         →  Wise owl / Firefly
CheckCircle               →  Blooming checkmark
AlertCircle / Destructive →  Wilting flower (gentle warning)
Search                    →  Butterfly search (antenna)
RefreshCw                 →  Spinning dandelion
Loader2                   →  Buzzing bee spinner
ExternalLink              →  Butterfly taking flight
Copy                      →  Two leaves
Globe                     →  Earth with vine
BarChart3 / TrendingUp    →  Growing seedling chart
Upload / Download         →  Bee carrying pollen up/down
X / Close                 →  Closed flower bud
Plus                      →  Sprouting seed
Mic                       →  Bee antenna (listening)
Eye / EyeOff              →  Open flower / Closed flower
Mail                      →  Leaf envelope
Clock                     →  Sundial flower
Info                      →  Ladybug info
```

### Architecture

**Step 1: Create `src/components/icons/BeeIcons.tsx`**
A single file exporting ~30 inline SVG React components, each matching the Lucide API (`size`, `color`, `className` props). All SVGs are hand-crafted, simple, rounded, child-friendly line art in the MochiBee palette.

**Step 2: Create `src/components/icons/index.ts`**
Named exports for easy import: `import { BeeMenu, FlowerHeart, HoneycombStar } from '@/components/icons'`

**Step 3: Update Brand Book (`BrandBook.tsx`)**
Add an "Iconography" section showing the full custom icon set with names, usage guidelines, and do/don't rules.

**Step 4: Replace icons across all pages and components (71 files)**
Swap every `lucide-react` import to use the new `BeeIcons`. Remove all Lucide imports. Replace Unicode emoji (rocket, shield, gear, etc.) with the corresponding BeeIcon inline. Keep nature emoji (bee, sunflower, butterfly, flower) as-is since they fit the theme.

Files to update (grouped):

| Group | Files | Icon count |
|-------|-------|-----------|
| Navigation | AppHeader, HamburgerMenu, Footer | ~15 |
| Pages | Index, Dashboard, BuzzyBees, LearningHub, AuthPage, TechnicalDetails | ~30 |
| Components | ChatInterface, OnboardingFlow, UserProgress, AdvancedFeatures, BeeEducationHub, ShareButtons, FollowMochiModal, WelcomeEmail, MochiVideoFeed | ~40 |
| Games | All 11 game components + Leaderboard | ~25 |
| Admin | AdminSidebar, AnalyticsDashboard, GoogleEcosystem, ChatManagement, etc. | ~30 |
| Learning | LearningPathCard, InteractiveLearningGames, LearningProgressChart | ~15 |
| Utility | BeeLoadingSpinner, BeeEmptyState, LanguageToggle, ErrorBoundary | ~8 |

**Step 5: Remove `destructive` red styling from user-facing elements**
Replace red alert/error colors with gentle amber/warm warnings (wilting flower icon + warm amber background). Keep destructive red only for truly destructive admin actions.

### Safety
- Additive: New icon components are created first, then swapped in
- No functionality changes -- only visual icon replacements
- UI component library (`src/components/ui/`) Lucide usage in select, dialog close, navigation-menu, carousel will also be updated to use BeeIcons for consistency
- All icon components accept the same `className` and `size` props for drop-in replacement

### Execution Order
1. Create icon library (BeeIcons.tsx + index.ts)
2. Update Brand Book
3. Update navigation (AppHeader, HamburgerMenu, Footer)
4. Update main pages (Index, Dashboard, BuzzyBees, LearningHub)
5. Update all remaining components
6. Update admin panels
7. Update UI primitives (dialog close X, select chevrons, etc.)


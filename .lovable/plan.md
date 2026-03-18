

## Plan: Build All 8 Remaining Interactive Learning Games

### Current State
- **2 games playable**: Flower Memory Match, Bee Trivia
- **8 games showing "Coming Soon"**: Bee Anatomy Explorer, Pollination Quest, Hive Builder, Bee Dance Decoder, Lifecycle Lab, Garden Planner, Species Spotter, Microscopic Bee World
- **Knowledge base**: 450+ entries across bee biology, permaculture, pollination, garden basics
- **Bee facts**: 97 entries across categories

### Games to Build (8 new components in `src/components/games/`)

| Game | Type | Core Mechanic |
|---|---|---|
| **BeeAnatomyExplorer** | Drag-and-drop labeling | Click body parts, match labels to anatomy diagram (head, thorax, abdomen, wings, antennae, stinger, compound eyes, proboscis) |
| **PollinationQuest** | Grid-based pathfinding | Move bee through a flower grid collecting pollen, avoid hazards (pesticide, rain), reach hive. Turn-based movement. |
| **HiveBuilder** | Pattern matching | Arrange hexagonal cells in correct patterns — honey, brood, pollen storage. Tap-to-place mechanics. |
| **BeeDanceDecoder** | Multiple choice + animation | Watch animated waggle dance pattern, guess direction/distance to flowers. CSS-animated bee with angle/duration clues. |
| **LifecycleLab** | Sequencing/sorting | Drag lifecycle stages (egg → larva → pupa → adult) into correct order with timelines. Teaches days per stage. |
| **GardenPlanner** | Grid placement builder | Place plants on a garden grid. Score based on bloom season coverage, bee-attractiveness, companion planting. Uses KB data. |
| **SpeciesSpotter** | Image quiz | Show bee description + characteristics, pick correct species from 4 options. Teaches honeybee vs bumblebee vs solitary vs carpenter. |
| **MicroscopicBeeWorld** | Interactive comparison | Side-by-side "human vision" vs "bee UV vision" of flowers. Toggle views, answer questions about what bees see. |

### Implementation Approach

1. **Create 8 game components** in `src/components/games/` — each self-contained with start screen, gameplay, score, and close button matching existing FlowerMemoryGame/BeeTrivia pattern
2. **Update InteractiveLearningGames.tsx** — mark all 10 games as `isPlayable: true`, add routing for all 8 new games
3. **Pull real content from Supabase** where applicable (bee facts for trivia content, KB entries for garden planner plant data)
4. All games are purely client-side React with state management — no new edge functions or DB tables needed
5. Each game calls `onGameComplete(score)` and `onClose()` matching existing interface

### Technical Details
- Games use existing UI primitives: Card, Button, Badge, Progress, toast
- Responsive grid layouts (work on mobile via existing Tailwind breakpoints)
- Educational content hardcoded per game (bee anatomy parts, lifecycle stages, species data) supplemented by KB where beneficial
- Score calculation: base points per correct answer + time/efficiency bonuses

### Files to Create (8)
- `src/components/games/BeeAnatomyExplorer.tsx`
- `src/components/games/PollinationQuest.tsx`
- `src/components/games/HiveBuilder.tsx`
- `src/components/games/BeeDanceDecoder.tsx`
- `src/components/games/LifecycleLab.tsx`
- `src/components/games/GardenPlanner.tsx`
- `src/components/games/SpeciesSpotter.tsx`
- `src/components/games/MicroscopicBeeWorld.tsx`

### Files to Edit (1)
- `src/components/InteractiveLearningGames.tsx` — import all 8 new games, set all `isPlayable: true`, add game routing


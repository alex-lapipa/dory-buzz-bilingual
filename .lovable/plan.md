

## Plan: Add Audio Variations to Database for Buzzy Bees Sound Design

### What
Copy 6 uploaded MP3 variations of "Mochi's Playful Day" into the project, register them in the `mochi_assets` database table, and wire them into the Buzzy Bees page so different versions play randomly or contextually for children.

### Files to copy
| Upload | Destination | Asset label |
|--------|-------------|-------------|
| `Mochis_Playful_Day_Favorite_6.mp3` | `public/audio/mochis_playful_day_fav6.mp3` | Favorite Mix |
| `Mochis_Playful_Day_2026-03-18T173958.mp3` | `public/audio/mochis_playful_day_v5.mp3` | Version 5 |
| `Mochis_Playful_Day_2026-03-18T173508_3.mp3` | `public/audio/mochis_playful_day_v4.mp3` | Version 4 |
| `Mochis_Playful_Day_2026-03-18T173508_2.mp3` | `public/audio/mochis_playful_day_v3.mp3` | Version 3 |
| `Mochis_Playful_Day_2026-03-18T173508_1.mp3` | `public/audio/mochis_playful_day_v2.mp3` | Version 2 |
| `Mochis_Playful_Day_2026-03-18T173508.mp3` | `public/audio/mochis_playful_day_v1.mp3` | Version 1 |

### Step 1: Copy files to `public/audio/`
Place all 6 MP3s with clean filenames.

### Step 2: Register in `mochi_assets` table
Insert 6 rows via the Supabase insert tool with `asset_type: 'audio_theme'`, tagged for Buzzy Bees children's use. Each gets metadata like:
```json
{
  "title": "Mochi's Playful Day - Favorite Mix",
  "category": "theme_music",
  "context": "buzzy_bees",
  "audience": "children_3_6",
  "tags": ["theme", "playful", "pentatonic", "C_major", "variation"]
}
```

### Step 3: Update `BuzzyBees.tsx`
- Add a helper that fetches all active `audio_theme` assets from `mochi_assets` where metadata contains `context: buzzy_bees`
- On the "Mochi's Playful Day" song card, randomly pick one of the available audio versions each time the child taps play (or cycle through them on repeat plays)
- The existing original `mochis_playful_day.mp3` remains as the default fallback

### Step 4: Update `AudioSoundDesign.tsx` (admin)
The admin panel already lists all `audio_theme` assets from `mochi_assets` — the 6 new entries will appear automatically. No code changes needed there.

### Technical Details
- Audio files live in `public/audio/` for direct URL access (`/audio/filename.mp3`)
- The `mochi_assets` table already has RLS policies allowing authenticated read/write
- Random selection uses `Math.random()` on the fetched array at play time
- No database schema changes required — `mochi_assets` table already exists with the right structure




## Plan: Save MochiBee Sound Design Audio Sample

### What
Store the uploaded MP3 file (`tema_completo_Mochis_Playful_Day_Favorite_10.mp3`) in Supabase Storage and register it in the `mochi_assets` table so it can be retrieved and played on demand.

### Steps

**Step 1: Copy the MP3 to the project**
Copy `user-uploads://tema_completo_Mochis_Playful_Day_Favorite_10.mp3` into `public/audio/mochis_playful_day.mp3` so it's available as a static asset and can be uploaded to storage.

**Step 2: Upload to Supabase Storage (`mochi-assets` bucket)**
The `mochi-assets` bucket already exists and is public. Upload the file to path `audio/mochis_playful_day.mp3` in this bucket using a small upload utility or edge function call.

Since we can't run server-side upload from the build, we'll create a simple admin action that:
- Reads the file from the public directory
- Uploads it to the `mochi-assets` bucket
- Registers it in `mochi_assets` table

**Step 3: Insert a record into `mochi_assets` table**
Insert a row with:
- `asset_type`: `audio_theme`
- `file_path`: `audio/mochis_playful_day.mp3`
- `file_url`: Public URL from mochi-assets bucket
- `metadata`: `{ "title": "Mochi's Playful Day", "category": "theme_music", "duration_estimate": "~30s", "source": "rag_08_audio_sound_design", "tags": ["theme", "playful", "pentatonic", "C_major"] }`
- `is_active`: true

**Step 4: Add an audio asset upload/register component to admin**
Add a small "Register Audio Asset" section to the existing `AudioSoundDesign.tsx` admin page that:
- Lists all audio-type assets from `mochi_assets`
- Provides a play button for each
- For the initial file, auto-registers it on first load if not already present

### Files Changed

| File | Change |
|------|--------|
| `public/audio/mochis_playful_day.mp3` | **Copy** uploaded MP3 here |
| `src/components/admin/AudioSoundDesign.tsx` | **Edit** -- add audio assets section with playback and listing |

### Safety
- Additive only -- no existing files or data modified
- Uses existing `mochi-assets` bucket (public) and `mochi_assets` table
- Deduplication: checks `file_path` before inserting


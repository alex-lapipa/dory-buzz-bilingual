import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle, VolumeFlower, MusicalFlower } from '@/components/icons';
import { SONG_LYRICS, SECTION_NAMES_ES } from './songLyrics';
import { toast } from 'sonner';
import "@/styles/mochi-tokens.css";

const SONG_BASE = 'https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/public/mochi-songs';

/**
 * Round 12 — Each song now has SEPARATE English and Spanish vocal versions,
 * with a SHARED instrumental for sing-along regardless of language.
 *
 *   vocalEnUrl       — pure English lyrics, English rhyme scheme
 *   vocalEsUrl       — pure Spanish lyrics, Spanish rhyme scheme
 *   instrumentalUrl  — shared karaoke (no vocals); same for both languages
 *
 * The Listen button picks the version matching the current UI language;
 * the Sing Along button always plays the shared instrumental so kids can
 * sing whichever language they're learning.
 *
 * Backward compatibility: the original `vocalUrl` and `audioUrl` fields
 * are kept as aliases to vocalEnUrl so any external code referencing them
 * still works.
 */
export const SONGS = [
  {
    id: 'abc-bees',
    emoji: '🔤',
    title_en: 'ABC Bees',
    title_es: 'Abejas del ABC',
    description_en: 'Learn the alphabet with Mochi and friends!',
    description_es: '¡Aprende el abecedario con Mochi y sus amigos!',
    color: 'from-violet-200 to-purple-300',
    vocalEnUrl: `${SONG_BASE}/abc-bees-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/abc-bees-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/abc-bees-vocal-en.mp3`, // alias for backward compat
    instrumentalUrl: `${SONG_BASE}/abc-bees-instrumental.mp3`,
  },
  {
    id: 'garden-goodnight',
    emoji: '🌙',
    title_en: 'Garden Goodnight',
    title_es: 'Buenas noches, jardín',
    description_en: 'A gentle lullaby to end your day with Mochi.',
    description_es: 'Una dulce canción de cuna para terminar el día con Mochi.',
    color: 'from-indigo-200 to-blue-300',
    vocalEnUrl: `${SONG_BASE}/garden-goodnight-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/garden-goodnight-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/garden-goodnight-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/garden-goodnight-instrumental.mp3`,
  },
  {
    id: 'rainy-day-buzz',
    emoji: '🌧️',
    title_en: 'Rainy Day Buzz',
    title_es: 'Zumbido de día lluvioso',
    description_en: 'What do bees do when it rains? Sing along and find out!',
    description_es: '¿Qué hacen las abejas cuando llueve? ¡Canta y descúbrelo!',
    color: 'from-cyan-200 to-teal-300',
    vocalEnUrl: `${SONG_BASE}/rainy-day-buzz-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/rainy-day-buzz-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/rainy-day-buzz-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/rainy-day-buzz-instrumental.mp3`,
  },
  {
    id: 'counting-flowers',
    emoji: '🌷',
    title_en: 'Counting Flowers',
    title_es: 'Contando flores',
    description_en: 'Count from 1 to 10 with flowers and fun!',
    description_es: '¡Cuenta del 1 al 10 con flores y diversión!',
    color: 'from-rose-200 to-pink-300',
    vocalEnUrl: `${SONG_BASE}/counting-flowers-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/counting-flowers-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/counting-flowers-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/counting-flowers-instrumental.mp3`,
  },
  {
    id: 'exploradoras',
    emoji: '🐝',
    title_en: 'Exploradoras',
    title_es: 'Exploradoras',
    description_en: 'Fly with Mochi and explore the garden — bee explorers on a sunny day!',
    description_es: '¡Vuela con Mochi y explora el jardín — exploradoras en un día soleado!',
    color: 'from-amber-200 to-yellow-300',
    vocalEnUrl: `${SONG_BASE}/exploradoras-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/exploradoras-vocal-es.mp3`,
    // Round 10 backward compat: original audioUrl/vocalUrl were a single
    // bilingual file. Now they alias to the Spanish version since the song
    // title and theme are in Spanish.
    audioUrl: `${SONG_BASE}/exploradoras-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/exploradoras-vocal-es.mp3`,
    instrumentalUrl: `${SONG_BASE}/exploradoras-instrumental.mp3`,
  },
  {
    id: 'miel-bierzo',
    emoji: '🍯',
    title_en: 'Honey from the Bierzo Mountains',
    title_es: 'Miel de Montes del Bierzo',
    description_en: 'A celebration of the bees that make honey in the Bierzo mountain region of Spain!',
    description_es: '¡Una celebración de las abejas que hacen miel en los Montes del Bierzo!',
    color: 'from-orange-200 to-amber-400',
    vocalEnUrl: `${SONG_BASE}/miel-bierzo-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/miel-bierzo-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/miel-bierzo-vocal-es.mp3`, // ES is the cultural primary
    instrumentalUrl: `${SONG_BASE}/miel-bierzo-instrumental.mp3`,
  },
  {
    id: 'calor-panal',
    emoji: '🤗',
    title_en: 'Warmth in the Hive',
    title_es: 'Calor en el panal',
    description_en: 'A cozy song about how bees keep each other warm — like a family hug!',
    description_es: 'Una canción acogedora sobre cómo las abejas se dan calor — ¡como un abrazo en familia!',
    color: 'from-orange-200 to-red-200',
    vocalEnUrl: `${SONG_BASE}/calor-panal-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/calor-panal-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/calor-panal-vocal-es.mp3`,
    instrumentalUrl: `${SONG_BASE}/calor-panal-instrumental.mp3`,
  },
  {
    id: 'mis-flores',
    emoji: '🌸',
    title_en: 'My Favorite Flowers',
    title_es: 'Mis flores favoritas',
    description_en: 'Sing the names and colors of your favorite garden flowers!',
    description_es: '¡Canta los nombres y colores de tus flores favoritas del jardín!',
    color: 'from-pink-200 to-fuchsia-300',
    vocalEnUrl: `${SONG_BASE}/mis-flores-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/mis-flores-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/mis-flores-vocal-es.mp3`,
    instrumentalUrl: `${SONG_BASE}/mis-flores-instrumental.mp3`,
  },
  // ─── Round 14: Buzzy Bees Classics ──────────────────────────────────
  // Originally lived at /buzzy-bees on its own page. Merged here so the
  // Songs tab is the single home for all sing-along content. Round 14d
  // brought these to full feature parity with EN + ES vocal versions and
  // shared karaoke instrumentals (same Round 12 pattern as the other 8).
  {
    id: 'mochis-playful-day',
    emoji: '🎶',
    title_en: "Mochi's Playful Day",
    title_es: 'El día juguetón de Mochi',
    description_en: 'A happy buzzy song about Mochi flying around the garden!',
    description_es: '¡Una canción alegre sobre Mochi volando por el jardín!',
    color: 'from-amber-300 to-yellow-400',
    vocalEnUrl: `${SONG_BASE}/mochis-playful-day-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/mochis-playful-day-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/mochis-playful-day-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/mochis-playful-day-instrumental.mp3`,
  },
  {
    id: 'garden-colors',
    emoji: '🌈',
    title_en: 'Garden Colors Song',
    title_es: 'Canción de colores del jardín',
    description_en: 'Sing about the colors of every flower, leaf, and sky!',
    description_es: '¡Canta sobre los colores de cada flor, hoja y cielo!',
    color: 'from-pink-300 to-purple-400',
    vocalEnUrl: `${SONG_BASE}/garden-colors-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/garden-colors-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/garden-colors-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/garden-colors-instrumental.mp3`,
  },
  {
    id: 'busy-bees',
    emoji: '🍯',
    title_en: 'Busy Busy Bees',
    title_es: 'Abejas muy ocupadas',
    description_en: 'A song about hardworking bees making sweet golden honey!',
    description_es: '¡Una canción sobre abejas trabajadoras haciendo miel dorada!',
    color: 'from-orange-300 to-amber-400',
    vocalEnUrl: `${SONG_BASE}/busy-bees-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/busy-bees-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/busy-bees-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/busy-bees-instrumental.mp3`,
  },
  {
    id: 'pollination-dance',
    emoji: '💃',
    title_en: 'The Pollination Dance',
    title_es: 'El baile de la polinización',
    description_en: 'A bouncy song about how bees spread pollen flower to flower!',
    description_es: '¡Una canción rítmica sobre cómo las abejas llevan polen de flor en flor!',
    color: 'from-green-300 to-emerald-400',
    vocalEnUrl: `${SONG_BASE}/pollination-dance-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/pollination-dance-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/pollination-dance-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/pollination-dance-instrumental.mp3`,
  },
  // ─── Round 15: Miel de Montes (tribute song) ─────────────────────────
  // Written in honour of mieldemontes.com — a small family beekeeping
  // business in Santa Cruz de Montes (Bierzo Alto, León, Spain) that has
  // tended hives by hand since 1971. They harvest brezo (heather) honey
  // from mountains far from pollution, extract by gravity (no pumps),
  // and keep production limited to preserve quality. Mochi's friend Toño
  // and the whole family are the heroes of this song. 2 minutes long —
  // longest song in the catalog — to make space for the bridge that
  // tells children why small caring families save forests, flowers, trees.
  {
    id: 'miel-de-montes',
    emoji: '🍯',
    title_en: 'Miel de Montes — A Song for Toño',
    title_es: 'Miel de Montes — Canción para Toño',
    description_en: 'A celebration of Mochi\'s friend Toño and his family who make heather honey in the Bierzo mountains the way bees love it!',
    description_es: '¡Una celebración de Toño, amigo de Mochi, y su familia que hacen miel de brezo en los montes del Bierzo como les gusta a las abejas!',
    color: 'from-amber-400 via-yellow-300 to-orange-400',
    // Round 17 — v3 audio: Spanish indie rock electronic production with
    // krautrock-influenced motorik 4/4 beat, sequenced analog synth bass,
    // electric guitar with subtle drive, vintage analog synthesizers, and
    // atmospheric pads. Key of E minor, 128 BPM, 150 seconds (2:30).
    // Spanish version uses a Castilian/Iberian female vocal (NOT Latin
    // American or neutral). Anti-commercial, gritty, anthemic — no
    // tambourines, no hand claps, no marimba/ukulele, no bright commercial
    // pop or Latin pop. Lyrics unchanged from Round 16. Old v1 + v2 files
    // remain in the bucket — backward compat for any cached/shared links.
    vocalEnUrl: `${SONG_BASE}/miel-de-montes-v3-vocal-en.mp3`,
    vocalEsUrl: `${SONG_BASE}/miel-de-montes-v3-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/miel-de-montes-v3-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/miel-de-montes-v3-instrumental.mp3`,
  },
  // ─── Round 18b: Miel de Montes — ExtendedLive (indie-tronica cut) ────
  // 4:10 indie-tronica extended cut. Locked to v3's E minor / 128 BPM /
  // krautrock-motorik base — this is a TRUE extension, not a different
  // song. Same Castilian Spanish female vocal, same lyrics verbatim,
  // same anti-commercial gritty character. What's new: a 30s sequenced
  // synth-bass intro that builds motorik kick + atmospheric pads; a
  // 50s minimal-techno breakdown at 2:04 (deep sub-bass loop, sparse,
  // hypnotic, processed bee-buzz as percussion element); an '80s synth
  // lead carrying the chorus melody; a Final Chorus reprise pushed
  // harder; a hypnotic outro chant fade. Strictly NO hand claps, NO
  // tambourines, NO panderetas, NO marimba — same exclusions as v3.
  // Spanish indie rock electronic with industrial drive; dark gradient
  // signals the night-time techno-leaning sister of the v3 day track.
  {
    id: 'miel-de-montes-extended',
    emoji: '🎛️',
    title_en: 'Miel de Montes — Extended Live (ES)',
    title_es: 'Miel de Montes — ExtendedLive',
    description_en: '4-minute indie-tronica extended cut for Toño — krautrock motorik, sequenced synth precision, minimal-techno breakdown, anti-commercial Spanish rock grit.',
    description_es: 'Corte extendido de 4 minutos al estilo indie-tronica — motorik krautrock, secuencias precisas de sinte, ruptura de techno minimal y rabia rockera anticomercial.',
    color: 'from-slate-800 via-violet-900 to-fuchsia-800',
    vocalEsUrl: `${SONG_BASE}/miel-de-montes-extended-v4-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/miel-de-montes-extended-v4-vocal-es.mp3`,
    instrumentalUrl: `${SONG_BASE}/miel-de-montes-extended-v4-instrumental.mp3`,
  },
  // ─── Round 19: Miel de Montes — Extended Live (EN) — TB-303 cut ──────
  // English sister track to the ES ExtendedLive. Same composition_plan
  // skeleton (E minor, 128 BPM, 4:10, 11-section indie-tronica
  // architecture: Intro → V1 → Cho → V2 → Cho → Drop → Bridge → Build →
  // Final → Reprise → Outro). Lyrics are the canonical EN lyrics from
  // the original Round 15 Miel de Montes tribute song. The ONE musical
  // addition: an acid bass synth (TB-303-style — squelchy resonant
  // filter, hypnotic arpeggios) entering at the Drop (1:50) and
  // running through the second half of the track, including the Final
  // Chorus, Reprise, and Outro. The Outro chant stays in Spanish since
  // "Toño" and "Miel de Montes" are proper nouns. Emerald-violet
  // gradient differentiates from the ES card's slate-violet-fuchsia
  // while the same 🎛️ emoji keeps the two sister tracks visually
  // paired in the grid.
  {
    id: 'miel-de-montes-extended-en',
    emoji: '🎛️',
    title_en: 'Miel de Montes — Extended Live (EN)',
    title_es: 'Miel de Montes — Extended Live (EN)',
    description_en: '4-minute indie-tronica extended cut for Toño in English — krautrock motorik, sequenced synth precision, minimal-techno breakdown, anti-commercial rock grit. Acid bass synth enters in the second half.',
    description_es: 'Corte extendido de 4 minutos en inglés — motorik krautrock, secuencias precisas de sinte, ruptura de techno minimal, rabia rockera anticomercial. Sinte de bajo ácido entra en la segunda mitad.',
    color: 'from-slate-900 via-emerald-900 to-violet-800',
    vocalEnUrl: `${SONG_BASE}/miel-de-montes-extended-en-v1-vocal-en.mp3`,
    vocalUrl: `${SONG_BASE}/miel-de-montes-extended-en-v1-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/miel-de-montes-extended-en-v1-instrumental.mp3`,
  },
  // ─── Round 20: Miel de Montes — Industrial Cut (EN) ──────────────────
  // 4:30 industrial-techno extended remix in English, built on the same
  // E minor / 128 BPM bones as the v3 original and the previous
  // ExtendedLive cuts, but pushed into Berlin / Birmingham UK club
  // territory. Inspirations distilled into descriptors (no artist
  // names — ElevenLabs blocks those):
  //   - Krautrock motorik 4/4 hypnotic sequenced precision (Kraftwerk)
  //   - Spanish punk-rock grit and intensity (Extremoduro)
  //   - 80s synth-rock lead with edgy tone, driving energy (Judas Priest
  //     "Turbo Lover")
  //   - Minimal techno hypnotic acid sub-bass loops, resonant filter
  //     sweeps (Plastikman / Richie Hawtin)
  //   - Hard-driving Birmingham UK industrial techno with hypnotic
  //     loop-based structure and tribal-techno percussion (Surgeon /
  //     Anthony Child)
  //   - Experimental industrial techno with precision metallic
  //     percussion (Kangding Ray)
  //   - Berlin dark electro-techno late-night club (Ellen Allien)
  //   - Deadpan female English vocal electroclash sensibility, cool
  //     detached spoken-leaning delivery (Miss Kittin)
  // 11 sections totaling 270s. TB-303-style acid bass arpeggios as the
  // primary background texture throughout — replaces the v1 cut's
  // distorted noise sweeps with cleaner acid techno textures. Outro
  // chant stays in Spanish: "Toño" and "Miel de Montes" are proper
  // nouns. Spanish version of this cut is planned for later (per the
  // user's "create english version first" instruction).
  //
  // ─── v2 update (this cut) ─────────────────────────────────────────
  // Audited v1 audio: it was clipping (true peak +0.06 dBFS), too hot
  // (-11.46 LUFS vs -14 LUFS streaming standard), high-end rolled off
  // (-34.4 dB at 6-16kHz), 128 kbps, dynamics squashed (LRA 6.30 LU).
  // The "distortion-noise background" was largely the clipping itself.
  // v2 fixes:
  //   - Composition prompt: Trent Reznor descriptors removed; Surgeon
  //     descriptors added; all "distorted noise sweeps" / "abrasive
  //     distortion" replaced with "TB-303 style acid bass arpeggios"
  //     and "acid techno filter sweeps" everywhere; explicit "clean
  //     professional mix" / "well-balanced" cues throughout.
  //   - Mastering chain (ffmpeg): high-pass at 30Hz (sub-rumble),
  //     gentle -1 dB scoop at 300Hz (anti-mud), high-shelf +1.5 dB
  //     at 10kHz (air), 2:1 compression with slow attack/release
  //     (glue, not squash), loudnorm to -14 LUFS / -1 dBTP ceiling.
  //   - Output bitrate: 128 → 256 kbps (file size 4.32 → 8.65 MB).
  // Result: peak now -0.99 dBTP (no clipping), high-end no longer
  // dull, mix sits in streaming-loud range without exceeding it.
  // Audio files versioned -v2- so client cache fetches fresh URLs.
  {
    id: 'miel-de-montes-industrial-en',
    emoji: '⚙️',
    title_en: 'Miel de Montes — Industrial Cut (EN)',
    title_es: 'Miel de Montes — Industrial Cut (EN)',
    description_en: '4:30 industrial-techno extended remix for Toño in English — Berlin & Birmingham club energy, deadpan electroclash vocal, TB-303 acid bass arpeggios throughout. Cleaner sister to the ExtendedLive cuts.',
    description_es: 'Remix industrial-techno extendido de 4:30 en inglés — energía de club berlinés y británico, voz electroclash impasible, arpegios de bajo ácido TB-303 en toda la pista. Hermana más limpia de los cortes ExtendedLive.',
    color: 'from-zinc-950 via-red-950 to-zinc-900',
    vocalEnUrl: `${SONG_BASE}/miel-de-montes-industrial-en-v2-vocal-en.mp3`,
    vocalUrl: `${SONG_BASE}/miel-de-montes-industrial-en-v2-vocal-en.mp3`,
    instrumentalUrl: `${SONG_BASE}/miel-de-montes-industrial-en-v2-instrumental.mp3`,
  },
] as const;

/**
 * /kids-songs renders the kid-friendly catalogue only. The 4 Miel de Montes
 * tribute tracks (an indie-tronica / industrial-techno series for adult
 * audiences, written for Toño) live on a bespoke page at /miel-de-montes
 * which also imports SONGS and filters for the same prefix. Exporting SONGS
 * + filtering at render time means a single source-of-truth feeds both
 * pages — when a Miel de Montes track is added or refined, it auto-shows
 * on the music page without any plumbing changes.
 */
const KID_SONGS = SONGS.filter(
  (s) => !s.id.startsWith('miel-de-montes')
) as typeof SONGS;

type PlayMode = 'vocal' | 'instrumental';
type PlayState = { id: string; mode: PlayMode } | null;

const KidsSongs: React.FC = () => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<PlayState>(null);
  // Round 13 — track which song's lyrics panel is open. Only one open at a
  // time so the page doesn't get visually noisy. Null means all collapsed.
  const [openLyricsId, setOpenLyricsId] = useState<string | null>(null);

  /**
   * Parallax + glassmorphism setup (Round 19).
   *
   * Each song card holds a ref so a single passive scroll listener can map
   * each card's viewport position onto a CSS variable `--parallax-y`. The
   * card's gradient layer + decorative blob layers translate via that
   * variable, producing a subtle parallax shift as the user scrolls past.
   * Honours prefers-reduced-motion: if the user opts out, the effect
   * exits early and cards stay static.
   */
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const viewH = window.innerHeight || 800;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        // Card centre relative to viewport centre, normalised to ±1
        const centre = r.top + r.height / 2;
        const denom = (viewH + r.height) / 2;
        const p = Math.max(-1, Math.min(1, (centre - viewH / 2) / denom));
        // Background layer drifts ±26 px; blobs amplify
        el.style.setProperty('--parallax-y', `${(p * 26).toFixed(2)}px`);
        // Card lift toward viewport centre — peaks at centre
        el.style.setProperty('--card-lift', `${(Math.abs(p) * -2).toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };
    update(); // initial pass after mount
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const toggleLyrics = (id: string) => {
    setOpenLyricsId((current) => (current === id ? null : id));
  };

  /**
   * Round 16 — Share-this-song handler.
   *
   * Tries the native Web Share API first (shows the OS share sheet on iOS,
   * Android, modern desktops with sharing extensions). If that's unavailable
   * or the user cancels into an error, falls back to copying the URL to the
   * clipboard with a toast notification. URL pattern is
   * https://mochinillo.com/kids-songs#song-{slug} which the hash-scroll
   * effect below will use to land visitors on the right song with its
   * lyrics auto-expanded.
   */
  const shareSong = async (song: typeof SONGS[number]) => {
    const slug = (song as { id: string }).id;
    const titleEn = (song as { title_en: string }).title_en;
    const titleEs = (song as { title_es: string }).title_es;

    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/kids-songs#song-${slug}`
        : `https://www.mochinillo.com/kids-songs#song-${slug}`;

    const title = language === 'es' ? titleEs : titleEn;
    const text =
      language === 'es'
        ? `Escucha "${titleEs}" — una canción bilingüe de Mochi 🐝🎵`
        : `Listen to "${titleEn}" — a bilingual song by Mochi 🐝🎵`;

    // Native share (iOS/Android/Edge): opens the OS share sheet.
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // AbortError = user dismissed the share sheet, no toast needed
        if ((err as { name?: string })?.name === 'AbortError') return;
        // Otherwise fall through to clipboard copy
      }
    }

    // Clipboard fallback (desktop browsers without share API)
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        language === 'es' ? '¡Enlace copiado!' : 'Link copied!',
        { description: url, duration: 4000 },
      );
    } catch {
      toast.error(
        language === 'es'
          ? 'No se pudo copiar el enlace'
          : 'Could not copy link',
      );
    }
  };

  /**
   * Round 16 — Hash-scroll: when a visitor lands on a /kids-songs#song-{slug}
   * URL (typically because someone shared the song with them), smoothly scroll
   * the corresponding card into view and auto-expand its lyrics panel so they
   * see exactly what was shared without hunting for it.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash.startsWith('#song-')) return;
    const slug = hash.slice('#song-'.length);
    if (!slug) return;

    // Wait a frame for the grid to lay out, then scroll + expand
    const timer = window.setTimeout(() => {
      const el = document.getElementById(`song-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setOpenLyricsId(slug);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(null);
  };

  /**
   * Pick the right vocal URL based on the current UI language.
   * Falls back gracefully through vocalEsUrl → vocalEnUrl → vocalUrl
   * so backward-compat data still plays something even if a key is missing.
   */
  const resolveVocalUrl = (song: typeof SONGS[number]): string | undefined => {
    const s = song as {
      vocalEnUrl?: string;
      vocalEsUrl?: string;
      vocalUrl?: string;
    };
    if (language === 'es') {
      return s.vocalEsUrl || s.vocalUrl || s.vocalEnUrl;
    }
    return s.vocalEnUrl || s.vocalUrl || s.vocalEsUrl;
  };

  const playSong = (song: typeof SONGS[number], mode: PlayMode) => {
    const url =
      mode === 'vocal'
        ? resolveVocalUrl(song)
        : (song as { instrumentalUrl?: string }).instrumentalUrl;
    if (!url) return;

    // If the same song+mode is already playing, toggle off.
    if (playing && playing.id === song.id && playing.mode === mode) {
      stop();
      return;
    }

    // Stop any current playback before starting new one.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlaying(null);
    audio.onerror = () => setPlaying(null);
    audio
      .play()
      .then(() => setPlaying({ id: song.id, mode }))
      .catch(() => setPlaying(null));
  };

  const isPlaying = (id: string, mode: PlayMode) =>
    playing !== null && playing.id === id && playing.mode === mode;

  // Backward-compat helper kept for any external caller.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSongClick = (song: typeof SONGS[number]) => {
    if (!resolveVocalUrl(song)) return;
    playSong(song, 'vocal');
  };

  return (
    <>
      <PageSEO
        titleEn="Kids Songs - Sing Along with Mochi! | Mochi de los Huertos"
        titleEs="Canciones para Niños - ¡Canta con Mochi! | Mochi de los Huertos"
        descriptionEn="Fun songs for kids 3-6 in pure English and pure Spanish. Listen with Mochi or sing along to the instrumental versions!"
        descriptionEs="Canciones para niños de 3-6 años en español e inglés puros. ¡Escucha con Mochi o canta tú con la versión instrumental!"
        path="/kids-songs"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero — editorial v2 */}
        <div
          className="mochi-grain"
          style={{
            position: 'relative',
            maxWidth: 760,
            margin: '0 auto',
            padding: 'clamp(28px, 4vw, 44px)',
            background: 'hsl(45 60% 96% / .82)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
            borderRadius: 'var(--mochi-r-lg, 28px)',
            border: '1px solid hsl(40 92% 56% / .25)',
            boxShadow: 'var(--mochi-shadow-card, 0 10px 30px -8px hsl(25 28% 22% / .15))',
            overflow: 'hidden',
            textAlign: 'center',
            color: 'hsl(30 25% 12%)',
            fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
          }}
        >
          <span aria-hidden style={{
            position: 'absolute', top: 0, left: 28, right: 28, height: 4,
            borderRadius: '0 0 8px 8px',
            background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
          }} />

          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={84}
            height={84}
            style={{
              width: 84, height: 84, objectFit: 'contain',
              margin: '0 auto 14px', display: 'block',
              filter: 'drop-shadow(0 6px 14px hsl(30 25% 12% / .2))',
              animation: 'mochi-kids-float 4.5s ease-in-out infinite',
            }}
          />

          <Badge variant="secondary" style={{
            fontSize: 12, padding: '4px 12px',
            background: 'hsl(45 92% 92%)',
            color: 'hsl(35 78% 38%)',
            border: '1px solid hsl(40 92% 56% / .35)',
            fontWeight: 600,
          }}>
            Ages 6–10 · 6–10 años
          </Badge>

          <h1 style={{
            fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
            fontWeight: 600,
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            letterSpacing: '-.025em',
            lineHeight: .98,
            margin: '14px 0 8px',
          }}>
            Sing-Along Songs
            <em style={{
              display: 'block', fontStyle: 'italic', fontWeight: 400,
              fontSize: '.5em', color: 'hsl(35 78% 38%)', marginTop: 6,
              letterSpacing: '-.005em',
            }}>
              Canciones para cantar
            </em>
          </h1>

          <span style={{
            fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
            fontSize: 22, fontWeight: 600, color: 'hsl(35 78% 38%)',
            display: 'inline-block', transform: 'rotate(-1.5deg)', marginTop: 4,
          }}>
            🎵🐝
          </span>

          <p style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'hsl(28 35% 28%)',
            maxWidth: '36ch',
            margin: '14px auto 4px',
            lineHeight: 1.5, fontWeight: 500,
          }}>
            Sing along with Mochi! English &amp; Spanish vocals, plus karaoke.
          </p>
          <p style={{
            fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
            fontStyle: 'italic',
            fontSize: 14.5, color: 'hsl(35 78% 38%)',
            maxWidth: '36ch', margin: '0 auto', lineHeight: 1.5,
          }}>
            Canta con Mochi en inglés y español, ¡y karaoke!
          </p>

          <div style={{
            marginTop: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: 'hsl(28 35% 28%)',
            background: 'hsl(45 92% 92% / .55)',
            padding: '6px 14px',
            borderRadius: 999,
            border: '1px solid hsl(40 92% 56% / .25)',
          }}>
            <VolumeFlower className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
            <span>{language === 'es' ? 'Idioma actual: español' : 'Current language: English'}</span>
            <MusicalFlower className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
          </div>
        </div>

        {/* Song cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {KID_SONGS.map((song, idx) => {
            const vocalUrl = resolveVocalUrl(song);
            const instrumentalUrl = (song as { instrumentalUrl?: string }).instrumentalUrl;
            const hasVocal = Boolean(vocalUrl);
            const hasInstrumental = Boolean(instrumentalUrl);
            const playingVocal = isPlaying(song.id, 'vocal');
            const playingInstrumental = isPlaying(song.id, 'instrumental');
            // Round 13 — pick lyrics for the current UI language
            const lyrics = SONG_LYRICS[song.id]
              ? SONG_LYRICS[song.id][language === 'es' ? 'es' : 'en']
              : undefined;
            const hasLyrics = Boolean(lyrics && lyrics.length > 0);
            const isLyricsOpen = openLyricsId === song.id;
            // Round 21 — underground / festival aesthetic for Miel de Montes
            // tribute series (4 tracks). All other songs keep the warm
            // kid-friendly parallax glass treatment unchanged.
            const isUnderground = song.id.startsWith('miel-de-montes');

            return (
              <Card
                key={song.id}
                id={`song-${song.id}`}
                data-card="lift"
                ref={(el) => { cardRefs.current[idx] = el as HTMLDivElement | null; }}
                className="overflow-hidden border-0 transition-all duration-300 hover:shadow-2xl group relative scroll-mt-20 mochi-respect-motion"
                style={{
                  ['--parallax-y' as string]: '0px',
                  ['--card-lift' as string]: '0px',
                  borderRadius: 'var(--mochi-r-lg, 28px)',
                  transform: 'translateY(var(--card-lift, 0px))',
                  willChange: 'transform',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 32px -8px rgba(43,29,11,0.18), 0 2px 6px rgba(43,29,11,0.06)',
                }}
              >
                <CardContent className="p-0">
                  {/* ── Parallax glass header ── */}
                  <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
                    {/* Layer 1 — coloured gradient backdrop with parallax */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br ${song.color}`}
                      style={{
                        transform: 'translateY(var(--parallax-y, 0px)) scale(1.18)',
                        transition: 'transform 80ms linear',
                        willChange: 'transform',
                      }}
                    />

                    {isUnderground ? (
                      <>
                        {/* Layer 2a — perspective grid floor (synthwave) */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(rgba(0,240,255,0.22) 1px, transparent 1px) 0 0 / 100% 28px,' +
                              'linear-gradient(90deg, rgba(0,240,255,0.22) 1px, transparent 1px) 0 0 / 28px 100%',
                            transform:
                              'perspective(380px) rotateX(62deg) translateY(36%) translateY(calc(var(--parallax-y, 0px) * 0.6))',
                            transformOrigin: 'center bottom',
                            WebkitMaskImage:
                              'linear-gradient(to bottom, transparent 28%, black 60%, black 88%, transparent 100%)',
                            maskImage:
                              'linear-gradient(to bottom, transparent 28%, black 60%, black 88%, transparent 100%)',
                            opacity: 0.55,
                            mixBlendMode: 'screen',
                          }}
                        />

                        {/* Layer 2b — vertical neon laser beams (cyan + magenta) */}
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div
                            className="absolute"
                            style={{
                              top: '-20%', left: '22%', width: 1.5, height: '160%',
                              background:
                                'linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.95) 35%, rgba(0,240,255,0.95) 65%, transparent 100%)',
                              boxShadow:
                                '0 0 6px rgba(0,240,255,0.8), 0 0 14px rgba(0,240,255,0.55), 0 0 28px rgba(0,240,255,0.32)',
                              transform:
                                'rotate(18deg) translateY(calc(var(--parallax-y, 0px) * 1.4))',
                            }}
                          />
                          <div
                            className="absolute"
                            style={{
                              top: '-20%', right: '24%', width: 1.5, height: '160%',
                              background:
                                'linear-gradient(180deg, transparent 0%, rgba(255,0,212,0.92) 30%, rgba(255,0,212,0.92) 70%, transparent 100%)',
                              boxShadow:
                                '0 0 6px rgba(255,0,212,0.7), 0 0 14px rgba(255,0,212,0.5), 0 0 28px rgba(255,0,212,0.3)',
                              transform:
                                'rotate(-14deg) translateY(calc(var(--parallax-y, 0px) * -1.6))',
                            }}
                          />
                          <div
                            className="absolute"
                            style={{
                              top: '-10%', left: '58%', width: 1, height: '140%',
                              background:
                                'linear-gradient(180deg, transparent 0%, rgba(0,255,170,0.7) 50%, transparent 100%)',
                              boxShadow:
                                '0 0 5px rgba(0,255,170,0.6), 0 0 12px rgba(0,255,170,0.35)',
                              transform:
                                'rotate(8deg) translateY(calc(var(--parallax-y, 0px) * 0.8))',
                            }}
                          />
                        </div>

                        {/* Layer 2c — neon haze blobs */}
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                          <div
                            className="absolute rounded-full"
                            style={{
                              top: '-18%', right: '-10%', width: '60%', height: '60%',
                              background:
                                'radial-gradient(circle at 35% 35%, rgba(0,240,255,0.55), rgba(0,240,255,0) 70%)',
                              filter: 'blur(28px)',
                              transform: 'translateY(calc(var(--parallax-y, 0px) * 1.6))',
                              mixBlendMode: 'screen',
                            }}
                          />
                          <div
                            className="absolute rounded-full"
                            style={{
                              bottom: '-15%', left: '-12%', width: '55%', height: '55%',
                              background:
                                'radial-gradient(circle at 60% 40%, rgba(255,0,212,0.45), rgba(255,0,212,0) 70%)',
                              filter: 'blur(32px)',
                              transform: 'translateY(calc(var(--parallax-y, 0px) * -1.2))',
                              mixBlendMode: 'screen',
                            }}
                          />
                          <div
                            className="absolute rounded-full"
                            style={{
                              top: '38%', left: '68%', width: '22%', height: '22%',
                              background: 'rgba(0,255,170,0.32)',
                              filter: 'blur(18px)',
                              transform: 'translateY(calc(var(--parallax-y, 0px) * 0.7))',
                              mixBlendMode: 'screen',
                            }}
                          />
                        </div>

                        {/* Layer 2d — CRT scan lines + chromatic edge */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(0deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 2px, rgba(0,240,255,0.04) 2px, rgba(0,240,255,0.04) 3px)',
                            opacity: 0.7,
                          }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            boxShadow: 'inset 0 0 0 1px rgba(0,240,255,0.22), inset 0 0 24px rgba(0,0,0,0.45)',
                            borderRadius: 'inherit',
                          }}
                        />
                      </>
                    ) : (
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                        <div
                          className="absolute rounded-full"
                          style={{
                            top: '-10%', right: '-6%', width: '50%', height: '50%',
                            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
                            filter: 'blur(24px)',
                            transform: 'translateY(calc(var(--parallax-y, 0px) * 1.6))',
                          }}
                        />
                        <div
                          className="absolute rounded-full"
                          style={{
                            bottom: '-12%', left: '-8%', width: '45%', height: '45%',
                            background: 'radial-gradient(circle at 60% 40%, rgba(245,158,11,0.32), rgba(245,158,11,0) 70%)',
                            filter: 'blur(28px)',
                            transform: 'translateY(calc(var(--parallax-y, 0px) * -1.2))',
                          }}
                        />
                        <div
                          className="absolute rounded-full"
                          style={{
                            top: '40%', left: '70%', width: '18%', height: '18%',
                            background: 'rgba(255,255,255,0.35)',
                            filter: 'blur(14px)',
                            transform: 'translateY(calc(var(--parallax-y, 0px) * 0.7))',
                          }}
                        />
                      </div>
                    )}

                    {/* Layer 3 — Mochi bee corner accent. Underground mode
                        uses a neon-rim filter so the brand stays present
                        without breaking the rave aesthetic. */}
                    <img
                      src="/lovable-uploads/mochi-clean-200.webp"
                      alt=""
                      aria-hidden="true"
                      width={56}
                      height={56}
                      className="absolute select-none pointer-events-none"
                      style={{
                        bottom: 14, right: 14,
                        opacity: isUnderground ? 0.78 : 0.65,
                        transform:
                          'translateY(calc(var(--parallax-y, 0px) * -0.4)) rotate(-6deg)',
                        filter: isUnderground
                          ? 'drop-shadow(0 0 6px rgba(0,240,255,0.85)) drop-shadow(0 0 14px rgba(255,0,212,0.55)) saturate(1.4) contrast(1.1)'
                          : 'drop-shadow(0 4px 10px rgba(43,29,11,0.18))',
                        mixBlendMode: isUnderground ? 'screen' : 'normal',
                      }}
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Layer 4 — content surface. Two flavours:
                        · kid-friendly (white frosted glass + Fraunces + Caveat)
                        · underground (smoked glass + Saira + neon edges) */}
                    <div
                      className="relative z-10 p-6 sm:p-8 text-center"
                      style={{
                        backdropFilter: isUnderground
                          ? 'blur(10px) saturate(160%)'
                          : 'blur(14px) saturate(150%)',
                        WebkitBackdropFilter: isUnderground
                          ? 'blur(10px) saturate(160%)'
                          : 'blur(14px) saturate(150%)',
                        background: isUnderground
                          ? 'linear-gradient(160deg, rgba(8,2,18,0.55) 0%, rgba(20,4,30,0.30) 100%)'
                          : 'linear-gradient(160deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.14) 100%)',
                        borderTop: isUnderground
                          ? '1px solid rgba(0,240,255,0.45)'
                          : '1px solid rgba(255,255,255,0.55)',
                        borderBottom: isUnderground
                          ? '1px solid rgba(255,0,212,0.30)'
                          : '1px solid rgba(255,255,255,0.18)',
                        boxShadow: isUnderground
                          ? 'inset 0 1px 0 rgba(0,240,255,0.20), inset 0 -1px 0 rgba(255,0,212,0.18), inset 0 0 28px rgba(0,0,0,0.35)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(43,29,11,0.06)',
                      }}
                    >
                      <span
                        className="block mb-2 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          fontSize: 'clamp(2.75rem, 7vw, 3.5rem)',
                          lineHeight: 1,
                          filter: isUnderground
                            ? 'drop-shadow(0 0 8px rgba(0,240,255,0.55)) drop-shadow(0 0 18px rgba(255,0,212,0.35)) saturate(1.2)'
                            : 'drop-shadow(0 6px 14px rgba(43,29,11,0.22))',
                          transform:
                            'translateY(calc(var(--parallax-y, 0px) * 0.25))',
                        }}
                      >
                        {song.emoji}
                      </span>
                      <h2
                        style={{
                          fontFamily: isUnderground
                            ? "'Saira', 'Inter', system-ui, sans-serif"
                            : "var(--mochi-font-display, 'Fraunces', serif)",
                          fontSize: 'clamp(1.05rem, 2.4vw, 1.35rem)',
                          fontWeight: isUnderground ? 700 : 600,
                          letterSpacing: isUnderground ? '0.06em' : '-0.01em',
                          lineHeight: 1.15,
                          textTransform: isUnderground ? 'uppercase' : 'none',
                          color: isUnderground ? '#f4faff' : 'hsl(28 35% 18%)',
                          textShadow: isUnderground
                            ? '0 0 4px rgba(0,240,255,0.85), 0 0 12px rgba(0,240,255,0.45), 0 0 22px rgba(255,0,212,0.18)'
                            : '0 1px 2px rgba(255,255,255,0.45)',
                        }}
                      >
                        {language === 'es' ? song.title_es : song.title_en}
                      </h2>
                      <p
                        className="mt-1.5"
                        style={{
                          fontFamily: isUnderground
                            ? "'Saira', 'Inter', system-ui, sans-serif"
                            : "var(--mochi-font-hand, 'Caveat', cursive)",
                          fontSize: isUnderground ? '0.78rem' : '1.05rem',
                          fontWeight: isUnderground ? 400 : 400,
                          letterSpacing: isUnderground ? '0.03em' : '0',
                          textTransform: isUnderground ? 'uppercase' : 'none',
                          color: isUnderground ? 'rgba(220,240,255,0.78)' : 'hsl(28 35% 22%)',
                          lineHeight: isUnderground ? 1.45 : 1.25,
                          maxWidth: isUnderground ? '38ch' : '32ch',
                          margin: '8px auto 0',
                        }}
                      >
                        {language === 'es' ? song.description_es : song.description_en}
                      </p>
                      {/* Language indicator pill */}
                      <span
                        className="inline-block mt-3 text-xs px-3 py-1"
                        style={{
                          borderRadius: isUnderground ? 4 : 999,
                          background: isUnderground
                            ? 'rgba(0,0,0,0.45)'
                            : 'rgba(255,255,255,0.55)',
                          backdropFilter: 'blur(6px)',
                          WebkitBackdropFilter: 'blur(6px)',
                          color: isUnderground ? 'rgba(0,240,255,0.95)' : 'hsl(28 35% 22%)',
                          border: isUnderground
                            ? '1px solid rgba(0,240,255,0.55)'
                            : '1px solid rgba(255,255,255,0.6)',
                          fontWeight: 600,
                          fontFamily: isUnderground
                            ? "'Saira', 'Inter', system-ui, sans-serif"
                            : 'inherit',
                          letterSpacing: isUnderground ? '0.12em' : '0.02em',
                          textTransform: isUnderground ? 'uppercase' : 'none',
                          boxShadow: isUnderground
                            ? '0 0 6px rgba(0,240,255,0.4), inset 0 0 8px rgba(0,240,255,0.15)'
                            : '0 1px 2px rgba(43,29,11,0.06)',
                        }}
                      >
                        {language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                      </span>
                    </div>
                  </div>

                  {/* Two-button row: Listen (vocal) + Sing Along (shared instrumental) */}
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    {/* Listen — vocal in current UI language */}
                    <button
                      type="button"
                      onClick={() => hasVocal && playSong(song, 'vocal')}
                      disabled={!hasVocal}
                      aria-label={
                        language === 'es'
                          ? `Escuchar ${song.title_es} en español`
                          : `Listen to ${song.title_en} in English`
                      }
                      aria-pressed={playingVocal}
                      className={`
                        py-3 px-2 text-xs font-medium transition-colors duration-200
                        focus:outline-none focus-visible:bg-primary/10
                        ${
                          hasVocal
                            ? playingVocal
                              ? 'bg-primary/15 text-primary-strong'
                              : 'text-readable hover:bg-primary/5'
                            : 'text-muted-foreground/50 cursor-not-allowed'
                        }
                      `
                        .replace(/\s+/g, ' ')
                        .trim()}
                    >
                      <span aria-hidden="true" className="mr-1">
                        {playingVocal ? '⏸' : '▶'}
                      </span>
                      {playingVocal
                        ? language === 'es'
                          ? 'Reproduciendo'
                          : 'Playing'
                        : language === 'es'
                        ? 'Escuchar'
                        : 'Listen'}
                    </button>

                    {/* Sing Along — shared karaoke instrumental */}
                    <button
                      type="button"
                      onClick={() => hasInstrumental && playSong(song, 'instrumental')}
                      disabled={!hasInstrumental}
                      aria-label={
                        language === 'es'
                          ? `Cantar ${song.title_es} con la versión instrumental`
                          : `Sing along to ${song.title_en} with the instrumental version`
                      }
                      aria-pressed={playingInstrumental}
                      className={`
                        py-3 px-2 text-xs font-medium transition-colors duration-200
                        focus:outline-none focus-visible:bg-primary/10
                        ${
                          hasInstrumental
                            ? playingInstrumental
                              ? 'bg-primary/15 text-primary-strong'
                              : 'text-readable hover:bg-primary/5'
                            : 'text-muted-foreground/50 cursor-not-allowed'
                        }
                      `
                        .replace(/\s+/g, ' ')
                        .trim()}
                    >
                      <span aria-hidden="true" className="mr-1">
                        {playingInstrumental ? '⏸' : '🎤'}
                      </span>
                      {playingInstrumental
                        ? language === 'es'
                          ? 'Reproduciendo'
                          : 'Playing'
                        : language === 'es'
                        ? 'Canta tú'
                        : 'Sing Along'}
                    </button>
                  </div>

                  {/* Round 13 — Lyrics toggle + collapsible lyrics panel.
                      Only renders if we have lyrics for this song. */}
                  {hasLyrics && (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleLyrics(song.id)}
                        aria-expanded={isLyricsOpen}
                        aria-controls={`lyrics-${song.id}`}
                        className={`
                          w-full py-2 px-3 text-xs font-medium border-t border-border/50
                          transition-colors duration-200 text-readable
                          hover:bg-primary/5 focus:outline-none
                          focus-visible:bg-primary/10
                          ${isLyricsOpen ? 'bg-primary/5' : ''}
                        `
                          .replace(/\s+/g, ' ')
                          .trim()}
                      >
                        <span aria-hidden="true" className="mr-1">
                          {isLyricsOpen ? '📖' : '📕'}
                        </span>
                        {isLyricsOpen
                          ? language === 'es'
                            ? 'Ocultar letra'
                            : 'Hide lyrics'
                          : language === 'es'
                          ? 'Mostrar letra'
                          : 'Show lyrics'}
                        <span aria-hidden="true" className="ml-1 text-muted-foreground">
                          {isLyricsOpen ? '▴' : '▾'}
                        </span>
                      </button>

                      {isLyricsOpen && (
                        <div
                          id={`lyrics-${song.id}`}
                          role="region"
                          aria-label={
                            language === 'es'
                              ? `Letra de ${song.title_es}`
                              : `Lyrics of ${song.title_en}`
                          }
                          className="px-5 py-4 sm:px-6 sm:py-5 bg-background/40 border-t border-border/30 space-y-4"
                        >
                          {lyrics!.map((section, sectionIdx) => {
                            const sectionLabel =
                              language === 'es'
                                ? SECTION_NAMES_ES[section.name] || section.name
                                : section.name;
                            return (
                              <div key={`${song.id}-section-${sectionIdx}`} className="space-y-1">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-strong">
                                  {sectionLabel}
                                </h3>
                                <ul className="space-y-0.5 list-none pl-0">
                                  {section.lines.map((line, lineIdx) => (
                                    <li
                                      key={`${song.id}-section-${sectionIdx}-line-${lineIdx}`}
                                      className="text-sm leading-relaxed text-readable"
                                    >
                                      {line}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border/30">
                            {language === 'es'
                              ? '🎵 ¡Lee, canta y aprende! Cambia el idioma del sitio para ver la letra en inglés.'
                              : '🎵 Read, sing and learn! Switch the site language to see the lyrics in Spanish.'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Round 16 — Share this song. Native Web Share API on
                      mobile/iOS/Android, clipboard fallback on desktop. */}
                  <button
                    type="button"
                    onClick={() => shareSong(song)}
                    aria-label={
                      language === 'es'
                        ? `Compartir la canción "${song.title_es}"`
                        : `Share the song "${song.title_en}"`
                    }
                    className={`
                      w-full py-2 px-3 text-xs font-medium border-t border-border/50
                      transition-colors duration-200 text-readable
                      hover:bg-primary/5 focus:outline-none
                      focus-visible:bg-primary/10
                    `
                      .replace(/\s+/g, ' ')
                      .trim()}
                  >
                    <span aria-hidden="true" className="mr-1">↗</span>
                    {language === 'es' ? 'Compartir canción' : 'Share this song'}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center py-6 space-y-1">
          <p className="text-sm text-muted-foreground">
            {language === 'es'
              ? '🎵 ¡Cambia el idioma del sitio para escuchar las canciones en inglés!'
              : '🎵 Switch the site language to hear the songs in Spanish!'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes mochi-kids-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-7px) rotate(1.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [alt="Mochi the garden bee"] { animation: none !important; }
        }
      `}</style>
    </>
  );
};

export default KidsSongs;

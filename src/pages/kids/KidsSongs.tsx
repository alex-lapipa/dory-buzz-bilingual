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
const SONGS = [
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
    vocalEsUrl: `${SONG_BASE}/miel-de-montes-extended-v2-vocal-es.mp3`,
    vocalUrl: `${SONG_BASE}/miel-de-montes-extended-v2-vocal-es.mp3`,
    instrumentalUrl: `${SONG_BASE}/miel-de-montes-extended-v2-instrumental.mp3`,
  },
] as const;

type PlayMode = 'vocal' | 'instrumental';
type PlayState = { id: string; mode: PlayMode } | null;

const KidsSongs: React.FC = () => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<PlayState>(null);
  // Round 13 — track which song's lyrics panel is open. Only one open at a
  // time so the page doesn't get visually noisy. Null means all collapsed.
  const [openLyricsId, setOpenLyricsId] = useState<string | null>(null);

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
        titleEn="Kids Songs - Sing Along with Mochi! | MochiBee"
        titleEs="Canciones para Niños - ¡Canta con Mochi! | MochiBee"
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
          {SONGS.map((song) => {
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

            return (
              <Card
                key={song.id}
                id={`song-${song.id}`}
                data-card="lift"
                className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative scroll-mt-20"
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${song.color} p-6 sm:p-8 text-center`}>
                    <span className="text-5xl sm:text-6xl block mb-3 group-hover:scale-110 transition-transform">
                      {song.emoji}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      {language === 'es' ? song.title_es : song.title_en}
                    </h2>
                    <p className="text-sm text-foreground/70 mt-2">
                      {language === 'es' ? song.description_es : song.description_en}
                    </p>
                    {/* Language indicator pill */}
                    <span className="inline-block mt-3 text-xs px-2 py-0.5 rounded-pill bg-background/40 text-foreground/70 backdrop-blur-sm">
                      {language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                    </span>
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

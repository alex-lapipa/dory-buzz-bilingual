import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle, VolumeFlower, MusicalFlower } from '@/components/icons';

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
] as const;

type PlayMode = 'vocal' | 'instrumental';
type PlayState = { id: string; mode: PlayMode } | null;

const KidsSongs: React.FC = () => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<PlayState>(null);

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
        {/* Hero */}
        <div className="text-center space-y-3 surface-glass has-grain px-6 py-8 sm:px-10 sm:py-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Ages 3-6 · 3-6 años
            </Badge>
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            <span className="text-primary">Sing</span>{' '}
            <span className="text-foreground">Along</span>{' '}
            <span className="text-3xl sm:text-4xl">🎶🐝</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground max-w-md mx-auto leading-relaxed font-medium">
            {language === 'es'
              ? '¡Escucha con Mochi o canta tú mismo!'
              : 'Listen with Mochi or sing it yourself!'}
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto italic">
            {language === 'es'
              ? 'Cada canción tiene una versión cantada y otra instrumental. ¡Cambia el idioma para escuchar la otra versión!'
              : 'Each song has a sung version and an instrumental version. Switch the language to hear the other version!'}
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <VolumeFlower className="h-4 w-4" />
            <span>
              {language === 'es'
                ? `Idioma actual: español`
                : `Current language: English`}
            </span>
            <MusicalFlower className="h-4 w-4" />
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

            return (
              <Card
                key={song.id}
                data-card="lift"
                className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative"
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
    </>
  );
};

export default KidsSongs;

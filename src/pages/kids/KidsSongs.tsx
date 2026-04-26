import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle, VolumeFlower, MusicalFlower } from '@/components/icons';

const SONG_BASE = 'https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/public/mochi-songs';

const SONGS = [
  {
    id: 'abc-bees',
    emoji: '🔤',
    title_en: 'ABC Bees',
    title_es: 'Abejas del ABC',
    description_en: 'Learn the alphabet with Mochi and friends!',
    description_es: '¡Aprende el abecedario con Mochi y sus amigos!',
    color: 'from-violet-200 to-purple-300',
    vocalUrl: `${SONG_BASE}/abc-bees-vocal.mp3`,
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
    vocalUrl: `${SONG_BASE}/garden-goodnight-vocal.mp3`,
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
    vocalUrl: `${SONG_BASE}/rainy-day-buzz-vocal.mp3`,
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
    vocalUrl: `${SONG_BASE}/counting-flowers-vocal.mp3`,
    instrumentalUrl: `${SONG_BASE}/counting-flowers-instrumental.mp3`,
  },
  {
    id: 'exploradoras',
    emoji: '🐝',
    title_en: 'Exploradoras',
    title_es: 'Exploradoras',
    description_en: 'Fly with Mochi and explore the garden — a bilingual bee adventure!',
    description_es: '¡Vuela con Mochi y explora el jardín — una aventura bilingüe de abejas!',
    color: 'from-amber-200 to-yellow-300',
    // audioUrl kept for backward compatibility (was the field name in the
    // original commit that introduced this song); now duplicated as vocalUrl
    audioUrl: `${SONG_BASE}/exploradoras.mp3`,
    vocalUrl: `${SONG_BASE}/exploradoras.mp3`,
    instrumentalUrl: `${SONG_BASE}/exploradoras-instrumental.mp3`,
    isNew: true,
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

  const playSong = (song: typeof SONGS[number], mode: PlayMode) => {
    const url =
      mode === 'vocal'
        ? (song as { vocalUrl?: string }).vocalUrl
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

  // Backward-compat helper: original handleSongClick was a no-op for songs
  // without audioUrl. Kept here so any external code still works.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSongClick = (song: typeof SONGS[number]) => {
    const hasAudio =
      (song as { audioUrl?: string }).audioUrl ||
      (song as { vocalUrl?: string }).vocalUrl;
    if (!hasAudio) return;
    playSong(song, 'vocal');
  };

  return (
    <>
      <PageSEO
        titleEn="Kids Songs - Sing Along with Mochi! | MochiBee"
        titleEs="Canciones para Niños - ¡Canta con Mochi! | MochiBee"
        descriptionEn="Fun bilingual songs for kids 3-6. Listen with Mochi or sing along to the instrumental versions!"
        descriptionEs="Canciones bilingües para niños de 3-6 años. ¡Escucha con Mochi o canta tú con la versión instrumental!"
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
              ? 'Cada canción tiene una versión cantada y otra instrumental.'
              : 'Each song has a sung version and an instrumental version.'}
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <VolumeFlower className="h-4 w-4" />
            <span>{language === 'es' ? 'Con Mochi · Karaoke' : 'With Mochi · Karaoke'}</span>
            <MusicalFlower className="h-4 w-4" />
          </div>
        </div>

        {/* Song cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SONGS.map((song) => {
            const vocalUrl = (song as { vocalUrl?: string }).vocalUrl;
            const instrumentalUrl = (song as { instrumentalUrl?: string }).instrumentalUrl;
            const hasVocal = Boolean(vocalUrl);
            const hasInstrumental = Boolean(instrumentalUrl);
            const playingVocal = isPlaying(song.id, 'vocal');
            const playingInstrumental = isPlaying(song.id, 'instrumental');
            const isNew = Boolean((song as { isNew?: boolean }).isNew);

            return (
              <Card
                key={song.id}
                data-card="lift"
                className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative"
              >
                <CardContent className="p-0">
                  {isNew && (
                    <span className="badge-new-2026 absolute top-2 right-2 z-10">
                      {language === 'es' ? 'Nueva' : 'New'}
                    </span>
                  )}

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
                  </div>

                  {/* Two-button row: Listen (vocal) + Sing Along (instrumental) */}
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    {/* Listen button — vocal version */}
                    <button
                      type="button"
                      onClick={() => hasVocal && playSong(song, 'vocal')}
                      disabled={!hasVocal}
                      aria-label={
                        language === 'es'
                          ? `Escuchar ${song.title_es}`
                          : `Listen to ${song.title_en}`
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

                    {/* Sing Along button — instrumental (karaoke) version */}
                    <button
                      type="button"
                      onClick={() => hasInstrumental && playSong(song, 'instrumental')}
                      disabled={!hasInstrumental}
                      aria-label={
                        language === 'es'
                          ? `Cantar tú mismo ${song.title_es} con la versión instrumental`
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
              ? '🎵 ¡Toca "Canta tú" y graba tu propia versión con Mochi!'
              : '🎵 Tap "Sing Along" and record your own version with Mochi!'}
          </p>
        </div>
      </div>
    </>
  );
};

export default KidsSongs;

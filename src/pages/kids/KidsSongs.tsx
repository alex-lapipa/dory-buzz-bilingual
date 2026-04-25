import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle, VolumeFlower, MusicalFlower } from '@/components/icons';

const SONGS = [
  {
    id: 'abc-bees',
    emoji: '🔤',
    title_en: 'ABC Bees',
    title_es: 'Abejas del ABC',
    description_en: 'Learn the alphabet with Mochi and friends!',
    description_es: '¡Aprende el abecedario con Mochi y sus amigos!',
    color: 'from-violet-200 to-purple-300',
  },
  {
    id: 'garden-goodnight',
    emoji: '🌙',
    title_en: 'Garden Goodnight',
    title_es: 'Buenas noches, jardín',
    description_en: 'A gentle lullaby to end your day with Mochi.',
    description_es: 'Una dulce canción de cuna para terminar el día con Mochi.',
    color: 'from-indigo-200 to-blue-300',
  },
  {
    id: 'rainy-day-buzz',
    emoji: '🌧️',
    title_en: 'Rainy Day Buzz',
    title_es: 'Zumbido de día lluvioso',
    description_en: 'What do bees do when it rains? Sing along and find out!',
    description_es: '¿Qué hacen las abejas cuando llueve? ¡Canta y descúbrelo!',
    color: 'from-cyan-200 to-teal-300',
  },
  {
    id: 'counting-flowers',
    emoji: '🌷',
    title_en: 'Counting Flowers',
    title_es: 'Contando flores',
    description_en: 'Count from 1 to 10 with flowers and fun!',
    description_es: '¡Cuenta del 1 al 10 con flores y diversión!',
    color: 'from-rose-200 to-pink-300',
  },
  {
    id: 'exploradoras',
    emoji: '🐝',
    title_en: 'Exploradoras',
    title_es: 'Exploradoras',
    description_en: 'Fly with Mochi and explore the garden — a bilingual bee adventure!',
    description_es: '¡Vuela con Mochi y explora el jardín — una aventura bilingüe de abejas!',
    color: 'from-amber-200 to-yellow-300',
    audioUrl: 'https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/public/mochi-songs/exploradoras.mp3',
    isNew: true,
  },
] as const;

const KidsSongs: React.FC = () => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSongClick = (song: typeof SONGS[number]) => {
    // Songs without audioUrl behave exactly as before: no action.
    const audioUrl = (song as { audioUrl?: string }).audioUrl;
    if (!audioUrl) return;

    if (playingId === song.id && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().then(() => setPlayingId(song.id)).catch(() => setPlayingId(null));
  };

  return (
    <>
      <PageSEO
        titleEn="Kids Songs - Sing Along with Mochi! | MochiBee"
        titleEs="Canciones para Niños - ¡Canta con Mochi! | MochiBee"
        descriptionEn="Fun bilingual songs for kids 3-6. Sing and learn English with Mochi the Bee!"
        descriptionEs="Canciones bilingües para niños de 3-6 años. ¡Canta y aprende inglés con Mochi la Abeja!"
        path="/kids-songs"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
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
            Sing & learn with Mochi! Tap a song to listen.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto italic">
            ¡Canta y aprende con Mochi! Toca una canción para escuchar.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <VolumeFlower className="h-4 w-4" />
            <span>With music & lyrics · Con música y letra</span>
            <MusicalFlower className="h-4 w-4" />
          </div>
        </div>

        {/* Song cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SONGS.map((song) => {
            const hasAudio = Boolean((song as { audioUrl?: string }).audioUrl);
            const isPlaying = playingId === song.id;
            const isNew = Boolean((song as { isNew?: boolean }).isNew);
            return (
              <Card
                key={song.id}
                onClick={hasAudio ? () => handleSongClick(song) : undefined}
                className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group relative"
              >
                <CardContent className="p-0">
                  {isNew && (
                    <span className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                      {language === 'es' ? '¡Nueva!' : 'New!'}
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
                  <div className="p-3 text-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {hasAudio
                        ? isPlaying
                          ? (language === 'es' ? '⏸ Reproduciendo…' : '⏸ Playing…')
                          : (language === 'es' ? '▶ Toca para escuchar' : '▶ Tap to listen')
                        : (language === 'es' ? '¡Toca para cantar!' : 'Tap to sing!')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            🎵 More songs coming soon! · ¡Más canciones pronto!
          </p>
        </div>
      </div>
    </>
  );
};

export default KidsSongs;

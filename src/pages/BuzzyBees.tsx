import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Pause, Volume2, Music, Star, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageSEO } from '@/components/PageSEO';
import { useConversation } from '@11labs/react';

const KIDS_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";

interface SongCard {
  id: string;
  title_en: string;
  title_es: string;
  emoji: string;
  color: string;
  audioSrc?: string;
  lyrics_en?: string[];
  lyrics_es?: string[];
}

const SONGS: SongCard[] = [
  {
    id: 'mochis-playful-day',
    title_en: "Mochi's Playful Day",
    title_es: "El día juguetón de Mochi",
    emoji: '🐝',
    color: 'from-amber-300 to-yellow-400',
    audioSrc: '/audio/mochis_playful_day.mp3',
    lyrics_en: [
      '🎵 Buzz buzz buzz, Mochi flies around!',
      '🌻 Touching every flower on the ground!',
      '🌈 Dancing in the garden, happy bee...',
      '💛 Come and sing along with me!'
    ],
    lyrics_es: [
      '🎵 ¡Zum zum zum, Mochi va volando!',
      '🌻 ¡Cada flor del jardín va tocando!',
      '🌈 Bailando en el jardín, abeja feliz...',
      '💛 ¡Ven y canta conmigo, ven aquí!'
    ],
  },
  {
    id: 'garden-colors',
    title_en: 'Garden Colors Song',
    title_es: 'Canción de colores del jardín',
    emoji: '🌈',
    color: 'from-pink-300 to-purple-400',
    lyrics_en: [
      '🔴 Red like a rose, so pretty to see!',
      '🟡 Yellow like sunshine, bright as can be!',
      '🟢 Green like the leaves on every tree!',
      '🔵 Blue like the sky, so wild and free!'
    ],
    lyrics_es: [
      '🔴 ¡Rojo como una rosa, bonito de ver!',
      '🟡 ¡Amarillo como el sol, brillante al amanecer!',
      '🟢 ¡Verde como las hojas de cada árbol!',
      '🔵 ¡Azul como el cielo, libre y genial!'
    ],
  },
  {
    id: 'busy-bees',
    title_en: 'Busy Busy Bees',
    title_es: 'Abejas muy ocupadas',
    emoji: '🍯',
    color: 'from-orange-300 to-amber-400',
    lyrics_en: [
      '🐝 We are busy busy bees!',
      '🌸 Flying through the flower trees!',
      '🍯 Making honey, sweet and gold!',
      '⭐ The sweetest story ever told!'
    ],
    lyrics_es: [
      '🐝 ¡Somos abejas muy ocupadas!',
      '🌸 ¡Volando por las flores encantadas!',
      '🍯 ¡Haciendo miel, dulce y dorada!',
      '⭐ ¡La historia más dulce jamás contada!'
    ],
  },
  {
    id: 'pollination-dance',
    title_en: 'The Pollination Dance',
    title_es: 'El baile de la polinización',
    emoji: '💃',
    color: 'from-green-300 to-emerald-400',
    lyrics_en: [
      '🌺 Touch the flower, grab the dust!',
      '✨ Spreading pollen is a must!',
      '🦋 Wiggle left, then wiggle right!',
      '🌻 Pollination dance tonight!'
    ],
    lyrics_es: [
      '🌺 ¡Toca la flor, agarra el polvo!',
      '✨ ¡Esparcir el polen, eso es todo!',
      '🦋 ¡Muévete a la izquierda, luego a la derecha!',
      '🌻 ¡Baile de polinización, noche perfecta!'
    ],
  },
];

const SingAlongCard: React.FC<{
  song: SongCard;
  language: 'en' | 'es';
}> = ({ song, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lyrics = language === 'es' ? song.lyrics_es : song.lyrics_en;
  const title = language === 'es' ? song.title_es : song.title_en;

  const handlePlay = useCallback(() => {
    if (!lyrics) return;

    if (isPlaying) {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setActiveLine(-1);
      return;
    }

    // If there's a real audio source, play it
    if (song.audioSrc) {
      if (!audioRef.current) {
        audioRef.current = new Audio(song.audioSrc);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setActiveLine(-1);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Animate lyrics regardless
    setIsPlaying(true);
    let line = 0;
    setActiveLine(0);
    intervalRef.current = setInterval(() => {
      line++;
      if (line >= (lyrics?.length ?? 0)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!song.audioSrc) {
          setIsPlaying(false);
          setActiveLine(-1);
        }
      } else {
        setActiveLine(line);
      }
    }, 2500);
  }, [isPlaying, song.audioSrc, lyrics]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${song.color} p-4 sm:p-6 text-center`}>
        <span className="text-5xl sm:text-6xl block mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
          {song.emoji}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-foreground/90 leading-tight">
          {title}
        </h3>
      </div>
      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Lyrics */}
        <div className="space-y-2 min-h-[140px]">
          {lyrics?.map((line, i) => (
            <p
              key={i}
              className={`text-base sm:text-lg font-medium leading-relaxed transition-all duration-500 rounded-lg px-3 py-1.5 ${
                activeLine === i
                  ? 'bg-primary/20 scale-105 text-primary font-bold'
                  : 'text-muted-foreground'
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Play button - big & touch friendly */}
        <Button
          onClick={handlePlay}
          size="lg"
          className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl gap-3"
          variant={isPlaying ? 'secondary' : 'default'}
        >
          {isPlaying ? (
            <>
              <Pause className="h-6 w-6" />
              {language === 'es' ? '¡Para!' : 'Stop!'}
            </>
          ) : (
            <>
              <Play className="h-6 w-6" />
              {language === 'es' ? '¡Canta!' : 'Sing!'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const BuzzyBees: React.FC = () => {
  const { language, t } = useLanguage();

  // Hide global Mochi widget on this page, show kids agent instead
  useEffect(() => {
    const globalWidget = document.querySelector('elevenlabs-convai[agent-id="agent_1301kkyvc82vey5896n39y1cm5hc"]');
    if (globalWidget) (globalWidget as HTMLElement).style.display = 'none';
    return () => {
      if (globalWidget) (globalWidget as HTMLElement).style.display = '';
    };
  }, []);

  return (
    <>
      <PageSEO
        titleEn="Buzzy Bees - Sing Along with Mochi! | MochiBee"
        titleEs="Buzzy Bees - ¡Canta con Mochi! | MochiBee"
        descriptionEn="Fun sing-along songs for kids 3-6 about bees, gardens, and nature."
        descriptionEs="Canciones divertidas para niños de 3-6 años sobre abejas, jardines y naturaleza."
        path="/buzzy-bees"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {language === 'es' ? '3-6 años' : 'Ages 3-6'}
            </Badge>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            <span className="text-primary">Buzzy</span>{' '}
            <span className="text-foreground">Bees</span>{' '}
            <span className="text-3xl sm:text-4xl">🐝🎵</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            {language === 'es'
              ? '¡Canta y aprende con Mochi! Toca una canción para empezar.'
              : 'Sing & learn with Mochi! Tap a song to start singing.'}
          </p>

          {/* Audio badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            <span>{language === 'es' ? 'Con música y letra' : 'With music & lyrics'}</span>
            <Music className="h-4 w-4" />
          </div>
        </div>

        {/* Song grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SONGS.map((song) => (
            <SingAlongCard key={song.id} song={song} language={language} />
          ))}
        </div>

        {/* Fun footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-1">
            {[Star, Heart, Star, Heart, Star].map((Icon, i) => (
              <Icon
                key={i}
                className="h-5 w-5 text-primary/40 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'es'
              ? '🌻 Hecho con amor por Mochi la abeja'
              : '🌻 Made with love by Mochi the Bee'}
          </p>
        </div>
      </div>

      {/* Kids ElevenLabs Agent Widget */}
      <BuzzyBeesVoiceAgent language={language} />
    </>
  );
};

/** Dedicated kids voice agent using ElevenLabs React SDK */
const BuzzyBeesVoiceAgent: React.FC<{ language: string }> = ({ language }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onError: (error) => console.error('Kids agent error:', error),
  });

  const start = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: KIDS_AGENT_ID,
        connectionType: 'webrtc',
      });
    } catch (e) {
      console.error('Failed to start kids agent:', e);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {conversation.status === 'connected' && (
        <div className="bg-primary/90 text-primary-foreground text-xs rounded-full px-3 py-1 animate-pulse shadow-lg">
          {conversation.isSpeaking
            ? (language === 'es' ? '🐝 Mochi habla...' : '🐝 Mochi is talking...')
            : (language === 'es' ? '🎤 Te escucho...' : '🎤 Listening...')}
        </div>
      )}
      <Button
        onClick={conversation.status === 'connected' ? stop : start}
        disabled={isConnecting}
        size="lg"
        className="rounded-full w-16 h-16 shadow-xl text-2xl bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 border-4 border-white/50"
      >
        {isConnecting ? '⏳' : conversation.status === 'connected' ? '🛑' : '🐝'}
      </Button>
      {conversation.status === 'disconnected' && (
        <span className="text-xs text-muted-foreground font-medium">
          {language === 'es' ? '¡Habla con Mochi!' : 'Talk to Mochi!'}
        </span>
      )}
    </div>
  );
};

export default BuzzyBees;

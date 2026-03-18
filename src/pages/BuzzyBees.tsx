import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { VolumeFlower, MusicalFlower, SunflowerStar, FlowerHeart, PollenSparkle } from '@/components/icons';
import { PageSEO } from '@/components/PageSEO';
import { useConversation } from '@11labs/react';
import SingAlongCard, { type SongCardData } from '@/components/buzzy-bees/SingAlongCard';
import { useBuzzyBeesAudio } from '@/hooks/useBuzzyBeesAudio';

const KIDS_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";



const SONGS: SongCardData[] = [
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
      '🌹 Red like a rose, so pretty to see!',
      '🌻 Yellow like sunshine, bright as can be!',
      '🌿 Green like the leaves on every tree!',
      '🦋 Blue like the sky, so wild and free!'
    ],
    lyrics_es: [
      '🌹 ¡Rojo como una rosa, bonito de ver!',
      '🌻 ¡Amarillo como el sol, brillante al amanecer!',
      '🌿 ¡Verde como las hojas de cada árbol!',
      '🦋 ¡Azul como el cielo, libre y genial!'
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
      '🌟 The sweetest story ever told!'
    ],
    lyrics_es: [
      '🐝 ¡Somos abejas muy ocupadas!',
      '🌸 ¡Volando por las flores encantadas!',
      '🍯 ¡Haciendo miel, dulce y dorada!',
      '🌟 ¡La historia más dulce jamás contada!'
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


const BuzzyBees: React.FC = () => {
  const { language, t } = useLanguage();
  const { getRandomAudioSrc } = useBuzzyBeesAudio();

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
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {language === 'es' ? '3-6 años' : 'Ages 3-6'}
            </Badge>
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
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

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <VolumeFlower className="h-4 w-4" />
            <span>{language === 'es' ? 'Con música y letra' : 'With music & lyrics'}</span>
            <MusicalFlower className="h-4 w-4" />
          </div>
        </div>

        {/* Song grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SONGS.map((song) => (
            <SingAlongCard
              key={song.id}
              song={song}
              language={language}
              getAudioSrc={song.id === 'mochis-playful-day' ? getRandomAudioSrc : undefined}
            />
          ))}
        </div>

        {/* Fun footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-1">
            {[SunflowerStar, FlowerHeart, SunflowerStar, FlowerHeart, SunflowerStar].map((Icon, i) => (
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
            : (language === 'es' ? '🌸 Te escucho...' : '🌸 Listening...')}
        </div>
      )}
      <Button
        onClick={conversation.status === 'connected' ? stop : start}
        disabled={isConnecting}
        size="lg"
        className="rounded-full w-16 h-16 shadow-xl text-2xl bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 border-4 border-white/50"
      >
        {isConnecting ? '🌀' : conversation.status === 'connected' ? '🌺' : '🐝'}
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

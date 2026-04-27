import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { VolumeFlower, MusicalFlower, SunflowerStar, FlowerHeart, PollenSparkle } from '@/components/icons';
import { PageSEO } from '@/components/PageSEO';
import SingAlongCard, { type SongCardData } from '@/components/buzzy-bees/SingAlongCard';
import ParentMixPicker from '@/components/buzzy-bees/ParentMixPicker';
import { useBuzzyBeesAudio } from '@/hooks/useBuzzyBeesAudio';
import "@/styles/mochi-tokens.css";



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
  const { getRandomAudioSrc, currentMix, clearCurrentMix, favoriteIndex, setFavorite, totalMixes } = useBuzzyBeesAudio();


  return (
    <>
      <PageSEO
        titleEn="Buzzy Bees - Sing Along with Mochi! | Mochi de los Huertos"
        titleEs="Buzzy Bees - ¡Canta con Mochi! | Mochi de los Huertos"
        descriptionEn="Fun sing-along songs for kids 3-6 about bees, gardens, and nature."
        descriptionEs="Canciones divertidas para niños de 3-6 años sobre abejas, jardines y naturaleza."
        path="/buzzy-bees"
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
            fontSize: 12,
            padding: '4px 12px',
            background: 'hsl(45 92% 92%)',
            color: 'hsl(35 78% 38%)',
            border: '1px solid hsl(40 92% 56% / .35)',
            fontWeight: 600,
          }}>
            Ages 3–6 · 3–6 años
          </Badge>

          <h1 style={{
            fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
            fontWeight: 600,
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            letterSpacing: '-.025em',
            lineHeight: .98,
            margin: '14px 0 8px',
          }}>
            Buzzy Bees
            <em style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '.5em',
              color: 'hsl(35 78% 38%)',
              marginTop: 6,
              letterSpacing: '-.005em',
            }}>
              Cantemos con Mochi
            </em>
          </h1>

          <span style={{
            fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
            fontSize: 22,
            fontWeight: 600,
            color: 'hsl(35 78% 38%)',
            display: 'inline-block',
            transform: 'rotate(-1.5deg)',
            marginTop: 4,
          }}>
            🐝🎵
          </span>

          <p style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'hsl(28 35% 28%)',
            maxWidth: '36ch',
            margin: '14px auto 4px',
            lineHeight: 1.5,
            fontWeight: 500,
          }}>
            Sing & learn with Mochi! Tap a song to start singing.
          </p>
          <p style={{
            fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
            fontStyle: 'italic',
            fontSize: 14.5,
            color: 'hsl(35 78% 38%)',
            maxWidth: '36ch',
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            ¡Canta y aprende con Mochi! Toca una canción para empezar.
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, fontSize: 13, color: 'hsl(28 35% 28%)', marginTop: 4,
        }}>
          <VolumeFlower className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
          <span>With music &amp; lyrics · Con música y letra</span>
          <MusicalFlower className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
        </div>

        {/* Song grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SONGS.map((song) => (
            <SingAlongCard
              key={song.id}
              song={song}
              language={language}
              getAudioSrc={song.id === 'mochis-playful-day' ? getRandomAudioSrc : undefined}
              currentMix={song.id === 'mochis-playful-day' ? currentMix : undefined}
              onStop={song.id === 'mochis-playful-day' ? clearCurrentMix : undefined}
            />
          ))}
        </div>

        {/* Parent controls */}
        <ParentMixPicker
          favoriteIndex={favoriteIndex}
          setFavorite={setFavorite}
          totalMixes={totalMixes}
        />

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
            🌻 Made with love by Mochi the Bee · Hecho con amor por Mochi la abeja
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

export default BuzzyBees;

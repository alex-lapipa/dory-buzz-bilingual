import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PollenSparkle } from '@/components/icons';
import "@/styles/mochi-tokens.css";

const GAMES = [
  {
    id: 'flower-match',
    emoji: '🌸',
    title_en: 'Flower Match',
    title_es: 'Emparejar Flores',
    description_en: 'Match pairs of flowers to help Mochi build a garden!',
    description_es: '¡Empareja pares de flores para ayudar a Mochi a construir un jardín!',
    color: 'from-pink-200 to-rose-300',
  },
  {
    id: 'bee-colors',
    emoji: '🎨',
    title_en: 'Bee Colors',
    title_es: 'Colores de Abeja',
    description_en: 'Learn your colors by painting with Mochi!',
    description_es: '¡Aprende los colores pintando con Mochi!',
    color: 'from-yellow-200 to-amber-300',
  },
  {
    id: 'count-the-bees',
    emoji: '🔢',
    title_en: 'Count the Bees',
    title_es: 'Cuenta las Abejas',
    description_en: 'How many bees can you count? Practice numbers 1-10!',
    description_es: '¿Cuántas abejas puedes contar? ¡Practica los números del 1 al 10!',
    color: 'from-green-200 to-emerald-300',
  },
  {
    id: 'garden-puzzle',
    emoji: '🧩',
    title_en: 'Garden Puzzle',
    title_es: 'Rompecabezas del Jardín',
    description_en: 'Put the pieces together to see garden pictures!',
    description_es: '¡Junta las piezas para ver imágenes del jardín!',
    color: 'from-blue-200 to-cyan-300',
  },
];

const KidsGames: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <PageSEO
        titleEn="Kids Games - Play & Learn with Mochi! | MochiBee"
        titleEs="Juegos para Niños - ¡Juega y aprende con Mochi! | MochiBee"
        descriptionEn="Fun educational games for kids 3-6. Learn colors, numbers and nature with Mochi!"
        descriptionEs="Juegos educativos para niños de 3-6 años. ¡Aprende colores, números y naturaleza con Mochi!"
        path="/kids-games"
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
            Fun & Games
            <em style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '.5em',
              color: 'hsl(35 78% 38%)',
              marginTop: 6,
              letterSpacing: '-.005em',
            }}>
              Juegos con Mochi
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
            🎮🐝
          </span>

          <p style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'hsl(28 35% 28%)',
            maxWidth: '36ch',
            margin: '14px auto 4px',
            lineHeight: 1.5,
            fontWeight: 500,
          }}>
            Play & learn with Mochi! Tap a game to start.
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
            ¡Juega y aprende con Mochi! Toca un juego para empezar.
          </p>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {GAMES.map((game) => (
            <Card
              key={game.id}
              data-card="lift"
              className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${game.color} p-6 sm:p-8 text-center`}>
                  <span className="text-5xl sm:text-6xl block mb-3 group-hover:scale-110 transition-transform group-hover:animate-bounce">
                    {game.emoji}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    {language === 'es' ? game.title_es : game.title_en}
                  </h2>
                  <p className="text-sm text-foreground/70 mt-2">
                    {language === 'es' ? game.description_es : game.description_en}
                  </p>
                </div>
                <div className="p-3 text-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {language === 'es' ? '¡Toca para jugar!' : 'Tap to play!'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            🎮 More games coming soon! · ¡Más juegos pronto!
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

export default KidsGames;

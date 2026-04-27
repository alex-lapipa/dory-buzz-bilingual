import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PollenSparkle } from '@/components/icons';
import "@/styles/mochi-tokens.css";

const STORIES = [
  {
    id: 'mochis-first-flight',
    emoji: '🐝',
    title_en: "Mochi's First Flight",
    title_es: "El primer vuelo de Mochi",
    description_en: "Join Mochi as she learns to fly for the very first time!",
    description_es: "¡Acompaña a Mochi mientras aprende a volar por primera vez!",
    color: 'from-amber-200 to-yellow-300',
  },
  {
    id: 'the-garden-rainbow',
    emoji: '🌈',
    title_en: "The Garden Rainbow",
    title_es: "El arcoíris del jardín",
    description_en: "Mochi discovers every color in the garden after a rainy day.",
    description_es: "Mochi descubre todos los colores del jardín después de la lluvia.",
    color: 'from-pink-200 to-purple-300',
  },
  {
    id: 'honey-helpers',
    emoji: '🍯',
    title_en: "Honey Helpers",
    title_es: "Los ayudantes de la miel",
    description_en: "How do bees make honey? Mochi shows you step by step!",
    description_es: "¿Cómo hacen las abejas la miel? ¡Mochi te lo muestra paso a paso!",
    color: 'from-orange-200 to-amber-300',
  },
  {
    id: 'night-in-the-hive',
    emoji: '🌙',
    title_en: "Night in the Hive",
    title_es: "Noche en la colmena",
    description_en: "A cozy bedtime story about Mochi's hive at night.",
    description_es: "Un cuento acogedor sobre la colmena de Mochi por la noche.",
    color: 'from-indigo-200 to-blue-300',
  },
];

const KidsStories: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <PageSEO
        titleEn="Kids Stories - Read Along with Mochi! | MochiBee"
        titleEs="Cuentos para Niños - ¡Lee con Mochi! | MochiBee"
        descriptionEn="Fun bilingual stories for kids 3-6 about bees, nature, and the garden."
        descriptionEs="Cuentos bilingües divertidos para niños de 3-6 años sobre abejas, naturaleza y el jardín."
        path="/kids-stories"
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
            Story Time
            <em style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '.5em',
              color: 'hsl(35 78% 38%)',
              marginTop: 6,
              letterSpacing: '-.005em',
            }}>
              Cuentos con Mochi
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
            📖🐝
          </span>

          <p style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'hsl(28 35% 28%)',
            maxWidth: '36ch',
            margin: '14px auto 4px',
            lineHeight: 1.5,
            fontWeight: 500,
          }}>
            Read along with Mochi! Tap a story to begin.
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
            ¡Lee con Mochi! Toca un cuento para empezar.
          </p>
        </div>

        {/* Story cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {STORIES.map((story) => (
            <Card
              key={story.id}
              data-card="lift"
              className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group"
            >
              <CardContent className={`p-0`}>
                <div className={`bg-gradient-to-br ${story.color} p-6 sm:p-8 text-center`}>
                  <span className="text-5xl sm:text-6xl block mb-3 group-hover:scale-110 transition-transform">
                    {story.emoji}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    {language === 'es' ? story.title_es : story.title_en}
                  </h2>
                  <p className="text-sm text-foreground/70 mt-2">
                    {language === 'es' ? story.description_es : story.description_en}
                  </p>
                </div>
                <div className="p-3 text-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {language === 'es' ? '¡Toca para leer!' : 'Tap to read!'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            📖 More stories coming soon! · ¡Más cuentos pronto!
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

export default KidsStories;

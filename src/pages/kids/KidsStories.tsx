import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle } from '@/components/icons';

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
            <span className="text-primary">Story</span>{' '}
            <span className="text-foreground">Time</span>{' '}
            <span className="text-3xl sm:text-4xl">📖🐝</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground max-w-md mx-auto leading-relaxed font-medium">
            Read along with Mochi! Tap a story to begin.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto italic">
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
    </>
  );
};

export default KidsStories;

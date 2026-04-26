import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { PollenSparkle } from '@/components/icons';

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
            <span className="text-primary">Fun</span>{' '}
            <span className="text-foreground">Games</span>{' '}
            <span className="text-3xl sm:text-4xl">🎮🐝</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground max-w-md mx-auto leading-relaxed font-medium">
            Play & learn with Mochi! Tap a game to start.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto italic">
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
    </>
  );
};

export default KidsGames;

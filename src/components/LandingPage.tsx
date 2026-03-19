import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, BookOpen, Flower2, Mic, Sparkles, TreePine } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { language } = useLanguage();

  const features = [
    {
      icon: <MessageCircle className="h-7 w-7" />,
      emoji: '🐝',
      title: language === 'es' ? 'Chatea con Mochi' : 'Chat with Mochi',
      desc: language === 'es'
        ? 'Conversaciones inteligentes sobre abejas, jardines y naturaleza'
        : 'Smart conversations about bees, gardens, and nature',
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      emoji: '🎓',
      title: language === 'es' ? 'Aprende Jugando' : 'Learn by Playing',
      desc: language === 'es'
        ? 'Juegos de trivia, tarjetas de vocabulario y datos fascinantes'
        : 'Trivia games, vocabulary cards, and fascinating facts',
    },
    {
      icon: <Flower2 className="h-7 w-7" />,
      emoji: '🌻',
      title: language === 'es' ? 'Jardín Virtual' : 'Virtual Garden',
      desc: language === 'es'
        ? 'Cultiva tu propio jardín de permacultura digital'
        : 'Grow your own digital permaculture garden',
    },
  ];

  const steps = [
    {
      num: '1',
      title: language === 'es' ? 'Regístrate' : 'Sign Up',
      desc: language === 'es' ? 'Crea tu perfil en segundos' : 'Create your profile in seconds',
    },
    {
      num: '2',
      title: language === 'es' ? 'Explora' : 'Explore',
      desc: language === 'es' ? 'Descubre lecciones y juegos' : 'Discover lessons and games',
    },
    {
      num: '3',
      title: language === 'es' ? 'Crece' : 'Grow',
      desc: language === 'es' ? 'Gana puntos y sube de nivel' : 'Earn points and level up',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-nature safe-area-top safe-area-bottom">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-3xl w-full">
          <img
            src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png"
            alt="Mochi the Bee"
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto animate-bee-bounce filter drop-shadow-lg mb-6"
          />

          <h1 className="text-responsive-3xl sm:text-responsive-4xl font-extrabold mb-4 heading-nature">
            BeeCrazy Garden World
          </h1>

          <p className="text-responsive-base sm:text-responsive-lg text-foreground/80 max-w-xl mx-auto mb-8 font-normal">
            {language === 'es'
              ? 'Tu guía interactiva al mundo de las abejas, la permacultura y la naturaleza — impulsada por IA, bilingüe y divertida.'
              : 'Your interactive guide to the world of bees, permaculture, and nature — AI-powered, bilingual, and fun.'}
          </p>

          <Button
            onClick={onGetStarted}
            size="lg"
            className="font-bold text-responsive-base sm:text-responsive-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-primary text-on-primary hover:opacity-90 shadow-honey animate-bouncy-enter"
          >
            {language === 'es' ? '🌟 ¡Comenzar Aventura!' : '🌟 Start Adventure!'}
          </Button>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex justify-center gap-2 py-4">
        <span className="text-2xl animate-flower-sway">🌸</span>
        <span className="text-2xl animate-flower-sway" style={{ animationDelay: '0.3s' }}>🌼</span>
        <span className="text-2xl animate-flower-sway" style={{ animationDelay: '0.6s' }}>🌺</span>
      </div>

      {/* Feature Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-center mb-8 heading-nature">
            {language === 'es' ? '¿Qué puedes hacer?' : 'What can you do?'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="card-nature text-center p-6 animate-bouncy-enter"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <CardContent className="p-0 space-y-3">
                  <div className="text-4xl">{f.emoji}</div>
                  <h3 className="text-responsive-base font-semibold">{f.title}</h3>
                  <p className="text-responsive-sm text-muted-foreground font-normal">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-responsive-xl sm:text-responsive-2xl font-bold text-center mb-8 heading-nature">
            {language === 'es' ? '¿Cómo funciona?' : 'How it works'}
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold text-xl flex items-center justify-center mx-auto shadow-button">
                  {s.num}
                </div>
                <h3 className="text-responsive-base font-semibold">{s.title}</h3>
                <p className="text-responsive-sm text-muted-foreground font-normal">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block text-muted-foreground/40 text-2xl mt-2">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto card-hive rounded-2xl p-6 sm:p-8 text-center">
          <div className="flex justify-center gap-1 mb-3 text-2xl">
            {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i}>{s}</span>)}
          </div>
          <p className="text-responsive-base italic text-foreground/80 font-normal mb-2">
            {language === 'es'
              ? '"¡Mi hija aprendió más sobre abejas en una semana con Mochi que en todo el semestre!"'
              : '"My daughter learned more about bees in one week with Mochi than the entire semester!"'}
          </p>
          <p className="text-responsive-sm text-muted-foreground font-normal">
            {language === 'es' ? '— Mamá de Sofía, 8 años' : '— Sofia\'s mom, age 8'}
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
        <Button
          onClick={onGetStarted}
          size="lg"
          className="font-bold text-responsive-base sm:text-responsive-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-primary text-on-primary hover:opacity-90 shadow-honey"
        >
          {language === 'es' ? '🐝 ¡Únete Ahora!' : '🐝 Join Now!'}
        </Button>
      </section>
    </div>
  );
};

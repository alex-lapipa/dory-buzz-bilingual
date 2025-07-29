import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-nature safe-area-top safe-area-bottom flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="text-8xl mb-6 animate-bee-bounce">🐝</div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#fffd01' }}>
          BeeCrazy Garden World
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto">
          {language === 'es' 
            ? 'Tu amigable compañero familiar de jardín. Aprende sobre abejas, naturaleza y más con Mochi.'
            : 'Your friendly family garden companion. Learn about bees, nature, and more with Mochi.'
          }
        </p>

        <Card className="shadow-honey border border-border/30 bg-card/80 backdrop-blur max-w-md mx-auto mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <span className="text-left">
                  {language === 'es' 
                    ? 'Aprende datos fascinantes sobre abejas'
                    : 'Learn fascinating bee facts'
                  }
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗣️</span>
                <span className="text-left">
                  {language === 'es' 
                    ? 'Chatea con voz e imágenes'
                    : 'Chat with voice and images'
                  }
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌻</span>
                <span className="text-left">
                  {language === 'es' 
                    ? 'Explora el mundo de la jardinería'
                    : 'Explore the world of gardening'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onGetStarted}
          size="lg" 
          className="font-bold text-lg px-8 py-4 rounded-lg transform transition-all duration-200 hover:scale-105 text-black hover:opacity-90"
          style={{ backgroundColor: '#fffd01' }}
        >
          {language === 'es' ? '🌟 ¡Comenzar Aventura!' : '🌟 Start Adventure!'}
        </Button>

        <p className="text-sm text-muted-foreground mt-6">
          {language === 'es' 
            ? 'Gratis para toda la familia • Sin descargas necesarias'
            : 'Free for the whole family • No downloads required'
          }
        </p>
      </div>
    </div>
  );
};
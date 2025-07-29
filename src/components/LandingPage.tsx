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
    <div className="min-h-screen bg-gradient-nature safe-area-top safe-area-bottom flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full text-center">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bee-bounce">🐝</div>
        
        <h1 className="text-responsive-2xl sm:text-responsive-3xl md:text-responsive-4xl font-bold mb-4 sm:mb-6" style={{ color: '#fffd01' }}>
          BeeCrazy Garden World
        </h1>
        

        <Card className="shadow-honey border border-border/30 bg-card/80 backdrop-blur max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">🎓</span>
                <span className="text-left text-responsive-sm sm:text-responsive-base">
                  {language === 'es' 
                    ? 'Aprende datos fascinantes sobre abejas'
                    : 'Learn fascinating bee facts'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">🗣️</span>
                <span className="text-left text-responsive-sm sm:text-responsive-base">
                  {language === 'es' 
                    ? 'Chatea con voz e imágenes'
                    : 'Chat with voice and images'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">🌻</span>
                <span className="text-left text-responsive-sm sm:text-responsive-base">
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
          className="font-bold text-responsive-base sm:text-responsive-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transform transition-all duration-200 hover:scale-105 text-black hover:opacity-90 w-full sm:w-auto"
          style={{ backgroundColor: '#fffd01' }}
        >
          {language === 'es' ? '🌟 ¡Comenzar Aventura!' : '🌟 Start Adventure!'}
        </Button>

      </div>
    </div>
  );
};
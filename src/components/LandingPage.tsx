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
        <div className="relative mb-4 sm:mb-6">
          <img 
            src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png" 
            alt="Mochi the Bee" 
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto animate-bee-bounce filter drop-shadow-lg"
          />
        </div>
        
        <h1 className="text-responsive-2xl sm:text-responsive-3xl md:text-responsive-4xl font-bold mb-4 sm:mb-6 heading-nature">
          BeeCrazy Garden World
        </h1>
        

        <Card className="glass-card shadow-honey border border-white/30 max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-6 sm:mb-8 animate-bouncy-enter">
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
          className="font-bold text-responsive-base sm:text-responsive-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover-bouncy w-full sm:w-auto animate-bouncy-enter stagger-3"
          style={{ backgroundColor: '#fffd01', color: '#000000' }}
        >
          {language === 'es' ? '🌟 ¡Comenzar Aventura!' : '🌟 Start Adventure!'}
        </Button>

      </div>
    </div>
  );
};
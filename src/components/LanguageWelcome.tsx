import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageWelcomeProps {
  onLanguageSelect: (language: 'en' | 'es') => void;
}

export const LanguageWelcome: React.FC<LanguageWelcomeProps> = ({ onLanguageSelect }) => {
  const handleLanguageSelect = (language: 'en' | 'es') => {
    localStorage.setItem('mochi_language_selected', 'true');
    onLanguageSelect(language);
  };

  return (
    <>
      
      <div className="min-h-screen safe-area-top safe-area-bottom flex items-center justify-center p-4 bg-gradient-nature bg-cover bg-center bg-no-repeat overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          <Card className="shadow-honey border border-border/30 bg-card/90 backdrop-blur max-h-[80vh] overflow-y-auto">
            <CardContent className="p-8 text-center">
              {/* Mochi Character */}
              <div className="mb-6 animate-bee-bounce">
                <div className="text-6xl sm:text-7xl mb-4">🐝</div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  ¡Hola! Hello!
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  I'm Mochi, your garden bee friend!
                  <br />
                  ¡Soy Mochi, tu amiga abeja del jardín!
                </p>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your language / Elige tu idioma:
                </p>
                
                <Button
                  onClick={() => handleLanguageSelect('es')}
                  variant="default"
                  size="lg"
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 shadow-md"
                >
                  🇪🇸 Español
                </Button>
                
                <Button
                  onClick={() => handleLanguageSelect('en')}
                  variant="outline"
                  size="lg"
                  className="w-full text-lg py-6 border-2 shadow-md"
                >
                  🇺🇸 English
                </Button>
              </div>

              {/* Welcome Message */}
              <div className="mt-6 text-xs sm:text-sm text-muted-foreground">
                <p>Learn about bees, honey, gardens & nature</p>
                <p>Aprende sobre abejas, miel, jardines y naturaleza</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
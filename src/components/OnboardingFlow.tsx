import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BloomingCheck, BeeTrailRight, PollenSparkle, BeeColony, BeeChat, BeeAntenna, ButterflyFrame, LeafBook } from '@/components/icons';
import { Circle } from '@/components/icons/lucide-compat';
import { useLanguage } from '@/contexts/LanguageContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { t, language } = useLanguage();

  const steps = [
    {
      id: 'welcome',
      title: language === 'es' ? '¡Bienvenido a BeeCrazy!' : 'Welcome to BeeCrazy!',
      description: language === 'es' 
        ? 'Conoce a Mochi, tu amigable abeja guía del jardín' 
        : 'Meet Mochi, your friendly garden bee guide',
      icon: '🐝',
      action: language === 'es' ? 'Conocer a Mochi' : 'Meet Mochi'
    },
    {
      id: 'chat',
      title: language === 'es' ? 'Chat de Texto' : 'Text Chat',
      description: language === 'es' 
        ? 'Haz preguntas sobre plantas, jardinería y naturaleza' 
        : 'Ask questions about plants, gardening, and nature',
      icon: <BeeChat className="h-8 w-8" />,
      action: language === 'es' ? 'Probar Chat' : 'Try Chat'
    },
    {
      id: 'voice',
      title: language === 'es' ? 'Chat de Voz' : 'Voice Chat',
      description: language === 'es' 
        ? 'Habla naturalmente con Mochi como un amigo' 
        : 'Speak naturally with Mochi like a friend',
      icon: <BeeAntenna className="h-8 w-8" />,
      action: language === 'es' ? 'Probar Voz' : 'Try Voice'
    },
    {
      id: 'generate',
      title: language === 'es' ? 'Generador de Imágenes' : 'Image Generator',
      description: language === 'es' 
        ? 'Crea hermosas imágenes de jardines y naturaleza' 
        : 'Create beautiful garden and nature images',
      icon: <ButterflyFrame className="h-8 w-8" />,
      action: language === 'es' ? 'Crear Imagen' : 'Create Image'
    },
    {
      id: 'education',
      title: language === 'es' ? 'Centro Educativo' : 'Education Hub',
      description: language === 'es' 
        ? 'Aprende sobre abejas, plantas y ecología' 
        : 'Learn about bees, plants, and ecology',
      icon: <LeafBook className="h-8 w-8" />,
      action: language === 'es' ? 'Explorar' : 'Explore'
    },
    {
      id: 'advanced',
      title: language === 'es' ? 'Funciones Avanzadas' : 'Advanced Features',
      description: language === 'es' 
        ? 'Descubre herramientas de IA avanzadas' 
        : 'Discover advanced AI tools',
      icon: <PollenSparkle className="h-8 w-8" />,
      action: language === 'es' ? 'Ver Avanzadas' : 'View Advanced'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepAction = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      // All steps completed
      localStorage.setItem('mochi_onboarding_completed', 'true');
      onComplete();
    }
  };

  const skipTour = () => {
    localStorage.setItem('mochi_onboarding_completed', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-nature flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-nature shadow-honey">
        <CardHeader className="text-center">
          <div className="text-4xl mb-3 animate-bee-bounce">🌻</div>
          <CardTitle className="text-xl bg-gradient-bee bg-clip-text text-transparent">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'es' 
              ? `Paso ${currentStep + 1} de ${steps.length}` 
              : `Step ${currentStep + 1} of ${steps.length}`}
          </p>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="flex justify-center text-4xl">
              {typeof steps[currentStep].icon === 'string' ? (
                <span className="animate-flower-sway">{steps[currentStep].icon}</span>
              ) : (
                <div className="text-primary animate-pulse">
                  {steps[currentStep].icon}
                </div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step List */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  index === currentStep 
                    ? 'bg-primary/10 border border-primary/20' 
                    : index < currentStep 
                    ? 'bg-muted/50' 
                    : 'opacity-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {completedSteps.includes(index) ? (
                    <BloomingCheck className="h-5 w-5 text-green-500" />
                  ) : index === currentStep ? (
                    <div className="h-5 w-5 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={skipTour}
              className="flex-1"
            >
              {language === 'es' ? 'Saltar Tour' : 'Skip Tour'}
            </Button>
            <Button 
              onClick={() => handleStepAction(currentStep)}
              className="flex-1 bg-gradient-bee hover:opacity-90 text-white font-semibold"
            >
              {steps[currentStep].action}
              <BeeTrailRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-muted-foreground">
            {language === 'es' 
              ? 'Este tour te ayudará a descubrir todas las funciones de Mochi de los Huertos'
              : 'This tour will help you discover all the features of Mochi de los Huertos'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
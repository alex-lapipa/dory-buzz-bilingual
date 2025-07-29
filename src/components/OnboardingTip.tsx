import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MessageCircle, Mic, Image, ChevronRight } from 'lucide-react';

interface OnboardingTipProps {
  onClose: () => void;
}

export const OnboardingTip: React.FC<OnboardingTipProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tips = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat with Dory! 💬",
      description: "Ask me about gardening, nature, or request beautiful garden images by typing 'create an image of...'",
      emoji: "🐝"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Chat 🎤",
      description: "Have natural conversations with me! Just speak and I'll respond automatically when you pause.",
      emoji: "🌻"
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "AI Creator 🎨",
      description: "Generate stunning garden images and videos! Describe what you want and watch the magic happen.",
      emoji: "🌈"
    }
  ];

  const nextStep = () => {
    if (currentStep < tips.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const skipTour = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-honey border border-primary/20 bg-card/95 backdrop-blur">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="absolute top-2 right-2 p-1"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-4xl mb-2">{tips[currentStep].emoji}</div>
          <CardTitle className="flex items-center justify-center gap-2">
            {tips[currentStep].icon}
            {tips[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {tips[currentStep].description}
          </p>
          
          <div className="flex justify-center gap-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={skipTour}>
              Skip Tour
            </Button>
            <Button onClick={nextStep}>
              {currentStep === tips.length - 1 ? 'Get Started!' : 'Next'}
              {currentStep < tips.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { FlowerHeart, SunflowerStar, BeeChat, BeeColony, PollenSparkle, BloomingCheck, TwoLeaves, ButterflyLink } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProgressProps {
  className?: string;
}

export const UserProgress: React.FC<UserProgressProps> = ({ className }) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('user_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate user progress based on completed actions
  const userRegistration = localStorage.getItem('userRegistration');
  const completedOnboarding = localStorage.getItem('mochi_onboarding_completed');
  const conversations = localStorage.getItem('conversations') || '[]';
  const parsedConversations = JSON.parse(conversations);

  const stats = {
    registrationCompleted: !!userRegistration,
    onboardingCompleted: !!completedOnboarding,
    conversationsCount: parsedConversations.length,
    plantsGrown: parseInt(localStorage.getItem('plants_grown') || '0'),
    featuresUsed: [
      localStorage.getItem('used_text_chat'),
      localStorage.getItem('used_voice_chat'),
      localStorage.getItem('used_image_generator'),
      localStorage.getItem('used_education_hub'),
      localStorage.getItem('used_advanced_features')
    ].filter(Boolean).length
  };

  const totalProgress = [
    stats.registrationCompleted,
    stats.onboardingCompleted,
    stats.conversationsCount > 0,
    stats.plantsGrown > 0,
    stats.featuresUsed >= 3
  ].filter(Boolean).length;

  const progressPercentage = (totalProgress / 5) * 100;

  const availableAchievements = [
    {
      id: 'first_chat',
      title: language === 'es' ? 'Primera Conversación' : 'First Chat',
      description: language === 'es' ? 'Tuviste tu primera charla con Mochi' : 'Had your first chat with Mochi',
      icon: '💬',
      unlocked: stats.conversationsCount > 0
    },
    {
      id: 'plant_grower',
      title: language === 'es' ? 'Cultivador de Plantas' : 'Plant Grower',
      description: language === 'es' ? 'Ayudaste a hacer crecer plantas' : 'Helped grow plants',
      icon: '🌱',
      unlocked: stats.plantsGrown > 0
    },
    {
      id: 'feature_explorer',
      title: language === 'es' ? 'Explorador de Funciones' : 'Feature Explorer',
      description: language === 'es' ? 'Probaste 3 o más funciones' : 'Tried 3 or more features',
      icon: '🔍',
      unlocked: stats.featuresUsed >= 3
    },
    {
      id: 'garden_expert',
      title: language === 'es' ? 'Experto en Jardines' : 'Garden Expert',
      description: language === 'es' ? 'Completaste 10 conversaciones' : 'Completed 10 conversations',
      icon: '🌻',
      unlocked: stats.conversationsCount >= 10
    },
    {
      id: 'bee_friend',
      title: language === 'es' ? 'Amigo de las Abejas' : 'Bee Friend',
      description: language === 'es' ? 'Te registraste como miembro' : 'Registered as a member',
      icon: '🐝',
      unlocked: stats.registrationCompleted
    }
  ];

  const unlockedAchievements = availableAchievements.filter(a => a.unlocked);

  const shareProgress = async () => {
    const progressText = language === 'es' 
      ? `🐝 ¡Mi progreso en BeeCrazy Garden World! ${Math.round(progressPercentage)}% completado con ${unlockedAchievements.length} logros desbloqueados! 🌻`
      : `🐝 My BeeCrazy Garden World progress! ${Math.round(progressPercentage)}% complete with ${unlockedAchievements.length} achievements unlocked! 🌻`;
    
    try {
      await navigator.clipboard.writeText(progressText);
      toast({
        title: language === 'es' ? "¡Copiado!" : "Copied!",
        description: language === 'es' ? "Progreso copiado al portapapeles" : "Progress copied to clipboard",
      });
    } catch (error) {
      toast({
        title: language === 'es' ? "Error" : "Error",
        description: language === 'es' ? "No se pudo copiar" : "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`${className} bg-gradient-to-br from-card/80 to-card/60 backdrop-blur border-2 border-primary/20`}>
      <CardHeader className="text-center">
        <div className="text-3xl mb-2 animate-bee-bounce">🏆</div>
        <CardTitle className="bg-gradient-bee bg-clip-text text-transparent">
          {language === 'es' ? 'Tu Progreso en el Jardín' : 'Your Garden Progress'}
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% {language === 'es' ? 'Completado' : 'Complete'} • {unlockedAchievements.length}/{availableAchievements.length} {language === 'es' ? 'Logros' : 'Achievements'}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.conversationsCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'es' ? 'Conversaciones' : 'Conversations'}
            </div>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.plantsGrown}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'es' ? 'Plantas Crecidas' : 'Plants Grown'}
            </div>
          </div>
        </div>

        <Separator />

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <SunflowerStar className="h-4 w-4" />
            {language === 'es' ? 'Logros' : 'Achievements'}
          </h4>
          
          <div className="space-y-2">
            {availableAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/20' 
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-sm">{achievement.title}</h5>
                    {achievement.unlocked && <BloomingCheck className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={shareProgress} variant="outline" size="sm" className="flex-1">
            <TwoLeaves className="h-3 w-3 mr-2" />
            {language === 'es' ? 'Compartir' : 'Share'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://lapipa.ai', '_blank')}
            className="flex-1"
          >
            <ButterflyLink className="h-3 w-3 mr-2" />
            {language === 'es' ? 'Visitar Lapipa' : 'Visit Lapipa'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
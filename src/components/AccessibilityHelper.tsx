import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BloomingCheck, WiltingFlower, SundialFlower, WifiFlower, WifiOffFlower, PollenSparkle, BeeColony, BeeChat, ButterflyFrame, LeafBook } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProgress } from '@/components/UserProgress';


interface AccessibilityHelperProps {
  className?: string;
}

export const AccessibilityHelper: React.FC<AccessibilityHelperProps> = ({ className }) => {
  const { language } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [features, setFeatures] = useState({
    textChat: true,
    voiceChat: navigator.mediaDevices ? true : false,
    imageGeneration: true,
    educationHub: true,
    accessibility: {
      screenReader: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false
    }
  });

  useEffect(() => {
    // Check connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Check for accessibility preferences
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
      
      setFeatures(prev => ({
        ...prev,
        accessibility: {
          ...prev.accessibility,
          reducedMotion: prefersReducedMotion.matches,
          highContrast: prefersHighContrast.matches
        }
      }));
    }

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  const statusItems = [
    {
      id: 'connection',
      label: language === 'es' ? 'Conexión a Internet' : 'Internet Connection',
      status: connectionStatus === 'online' ? 'good' : 'error',
      icon: connectionStatus === 'online' ? <WifiFlower className="h-4 w-4" /> : <WifiOffFlower className="h-4 w-4" />,
      description: connectionStatus === 'online' 
        ? (language === 'es' ? 'Conectado' : 'Connected')
        : (language === 'es' ? 'Sin conexión' : 'Offline')
    },
    {
      id: 'textChat',
      label: language === 'es' ? 'Chat de Texto' : 'Text Chat',
      status: features.textChat ? 'good' : 'error',
      icon: <BeeChat className="h-4 w-4" />,
      description: features.textChat 
        ? (language === 'es' ? 'Disponible' : 'Available')
        : (language === 'es' ? 'No disponible' : 'Unavailable')
    },
    {
      id: 'voiceChat',
      label: language === 'es' ? 'Chat de Voz' : 'Voice Chat',
      status: features.voiceChat ? 'good' : 'warning',
      icon: <PollenSparkle className="h-4 w-4" />,
      description: features.voiceChat 
        ? (language === 'es' ? 'Micrófono detectado' : 'Microphone detected')
        : (language === 'es' ? 'Micrófono no disponible' : 'Microphone not available')
    },
    {
      id: 'imageGen',
      label: language === 'es' ? 'Generador de Imágenes' : 'Image Generator',
      status: features.imageGeneration ? 'good' : 'error',
      icon: <ButterflyFrame className="h-4 w-4" />,
      description: features.imageGeneration 
        ? (language === 'es' ? 'Funcionando' : 'Working')
        : (language === 'es' ? 'Error' : 'Error')
    },
    {
      id: 'education',
      label: language === 'es' ? 'Centro Educativo' : 'Education Hub',
      status: features.educationHub ? 'good' : 'error',
      icon: <LeafBook className="h-4 w-4" />,
      description: features.educationHub 
        ? (language === 'es' ? 'Listo' : 'Ready')
        : (language === 'es' ? 'Error' : 'Error')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <BloomingCheck className="h-4 w-4 text-green-500" />;
      case 'warning': return <WiltingFlower className="h-4 w-4 text-yellow-500" />;
      case 'error': return <WiltingFlower className="h-4 w-4 text-red-500" />;
      default: return <SundialFlower className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PollenSparkle className="h-5 w-5" />
            {language === 'es' ? 'Estado del Sistema' : 'System Status'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(item.status)}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
              {getStatusIcon(item.status)}
            </div>
          ))}
        </CardContent>
      </Card>


      {/* User Progress */}
      <UserProgress />

      {/* Accessibility Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === 'es' ? 'Opciones de Accesibilidad' : 'Accessibility Options'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">{language === 'es' ? 'Movimiento Reducido' : 'Reduced Motion'}</span>
              <Badge variant={features.accessibility.reducedMotion ? "default" : "secondary"}>
                {features.accessibility.reducedMotion ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">{language === 'es' ? 'Alto Contraste' : 'High Contrast'}</span>
              <Badge variant={features.accessibility.highContrast ? "default" : "secondary"}>
                {features.accessibility.highContrast ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            {language === 'es' 
              ? 'BeeCrazy Garden World está diseñado para ser accesible para todos. Si tienes problemas, contáctanos.'
              : 'BeeCrazy Garden World is designed to be accessible to everyone. If you experience issues, please contact us.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
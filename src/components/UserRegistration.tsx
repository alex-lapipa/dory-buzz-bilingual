import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

// Utility function to extract UTM parameters from URL
const extractUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  };
};

interface UserRegistrationProps {
  onComplete: () => void;
  inline?: boolean;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({ onComplete, inline = false }) => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !age) {
      toast({
        title: t('error'),
        description: language === 'es' 
          ? 'Por favor completa todos los campos' 
          : 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: t('error'),
        description: language === 'es' 
          ? 'Por favor ingresa un email válido' 
          : 'Please enter a valid email',
        variant: 'destructive',
      });
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 13 || ageNum > 120) {
      toast({
        title: t('error'),
        description: language === 'es' 
          ? 'La edad debe estar entre 13 y 120 años' 
          : 'Age must be between 13 and 120',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store registration in localStorage immediately for app access
      const registrationData = {
        email,
        age: ageNum,
        language,
        registeredAt: new Date().toISOString(),
        device_info: {
          userAgent: navigator.userAgent,
          screen: `${screen.width}x${screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        utm_params: extractUTMParams(),
        referral_source: document.referrer || 'direct',
      };
      
      localStorage.setItem('userRegistration', JSON.stringify(registrationData));

      // Try to save enhanced registration to database
      try {
        const { error: dbError } = await supabase
          .from('user_registrations')
          .insert({
            email,
            age: ageNum,
            language,
            device_info: registrationData.device_info,
            utm_params: registrationData.utm_params,
            referral_source: registrationData.referral_source,
            user_agent: navigator.userAgent,
          });

        if (dbError) {
          console.warn('Database save warning:', dbError.message);
        }
      } catch (dbError) {
        console.warn('Database connection issue:', dbError);
      }

      // Try to send welcome email (optional and non-blocking)
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            age: ageNum,
            language,
          },
        });
      } catch (emailError) {
        console.warn('Email service not available:', emailError);
      }

      // Show success message
      toast({
        title: language === 'es' ? '¡Bienvenido! 🐝' : 'Welcome! 🐝',
        description: language === 'es' 
          ? '¡Registro exitoso! Tu aventura en BeeCrazy Garden World comienza ahora.' 
          : 'Registration successful! Your BeeCrazy Garden World adventure begins now.',
      });

      onComplete();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t('error'),
        description: language === 'es' 
          ? 'Error al registrarse. Por favor intenta de nuevo.' 
          : 'Registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={inline ? '' : "min-h-screen safe-area-top safe-area-bottom flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-nature bg-cover bg-center bg-no-repeat"}>
      <Card className={`shadow-honey border border-border/30 bg-card/90 backdrop-blur ${inline ? 'w-full max-w-xs sm:max-w-sm' : 'max-w-xs sm:max-w-sm md:max-w-md w-full'}`}>
        <CardHeader className="text-center">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bee-bounce">🐝</div>
          <CardTitle className="text-responsive-xl sm:text-responsive-2xl font-bold heading-nature">
            {language === 'es' ? '¡Únete a BeeCrazy!' : 'Join BeeCrazy!'}
          </CardTitle>
          <p className="text-responsive-xs sm:text-responsive-sm text-muted-foreground mt-2">
            {language === 'es' 
              ? 'Cuéntanos un poco sobre ti para personalizar tu experiencia en el jardín'
              : 'Tell us a bit about yourself to personalize your garden experience'
            }
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'es' ? 'tu@email.com' : 'you@email.com'}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">
                {language === 'es' ? 'Edad' : 'Age'}
              </Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={language === 'es' ? 'Tu edad' : 'Your age'}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full font-semibold text-responsive-sm sm:text-responsive-base text-black hover:opacity-90"
              style={{ backgroundColor: '#fffd01' }}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === 'es' ? 'Registrando...' : 'Registering...')
                : (language === 'es' ? '🌻 Comenzar mi Aventura' : '🌻 Start My Adventure')
              }
            </Button>
          </form>
          
          <p className="text-responsive-xs text-muted-foreground text-center mt-4">
            {language === 'es' 
              ? 'Al registrarte, recibirás un email de bienvenida con más información sobre BeeCrazy Garden World.'
              : 'By registering, you will receive a welcome email with more information about BeeCrazy Garden World.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
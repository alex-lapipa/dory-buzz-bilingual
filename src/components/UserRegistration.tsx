import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface UserRegistrationProps {
  onComplete: () => void;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({ onComplete }) => {
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
      // Try to save registration to database (gracefully handle auth failures)
      try {
        const { error: dbError } = await supabase
          .from('user_registrations')
          .insert({
            email,
            age: ageNum,
            language,
          });

        if (dbError) {
          console.warn('Database save warning:', dbError.message);
          // Continue with local storage if DB fails - app works without auth
        }
      } catch (dbError) {
        console.warn('Database connection issue:', dbError);
        // Continue with registration anyway - app can work offline
      }

      // Try to send welcome email (optional)
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            age: ageNum,
            language,
          },
        });

        if (emailError) {
          console.warn('Email sending warning:', emailError);
        }
      } catch (emailError) {
        console.warn('Email service not available:', emailError);
      }
      // Show success message
      toast({
        title: language === 'es' ? '¡Bienvenido!' : 'Welcome!',
        description: language === 'es' 
          ? '¡Registro exitoso! Tu aventura en BeeCrazy Garden World comienza ahora.' 
          : 'Registration successful! Your BeeCrazy Garden World adventure begins now.',
      });

      // Store registration in localStorage for app access
      localStorage.setItem('userRegistration', JSON.stringify({
        email,
        age: ageNum,
        language,
        registeredAt: new Date().toISOString(),
      }));

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
    <div className="min-h-screen safe-area-top safe-area-bottom flex items-center justify-center p-4 bg-gradient-nature bg-cover bg-center bg-no-repeat">
      <Card className="shadow-honey border border-border/30 bg-card/90 backdrop-blur max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bee-bounce">🐝</div>
          <CardTitle className="text-2xl font-bold bg-gradient-bee bg-clip-text text-transparent">
            {language === 'es' ? '¡Únete a BeeCrazy!' : 'Join BeeCrazy!'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'es' 
              ? 'Cuéntanos un poco sobre ti para personalizar tu experiencia en el jardín'
              : 'Tell us a bit about yourself to personalize your garden experience'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-gradient-bee hover:opacity-90 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === 'es' ? 'Registrando...' : 'Registering...')
                : (language === 'es' ? '🌻 Comenzar mi Aventura' : '🌻 Start My Adventure')
              }
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
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
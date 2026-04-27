import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import {
  BloomingCheck, BeeTrailRight, PollenSparkle, BeeChat, BeeAntenna,
  ButterflyFrame, LeafBook,
} from '@/components/icons';
import { Circle } from '@/components/icons/lucide-compat';
import { useLanguage } from '@/contexts/LanguageContext';
import "@/styles/mochi-tokens.css";

/**
 * OnboardingFlow · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same public API: { onComplete: () => void }
 * Same 6-step list (welcome, chat, voice, generate, education, advanced)
 * Same bilingual copy via `useLanguage`
 * Same localStorage flag (mochi_onboarding_completed)
 * Same custom step icons (BeeChat, BeeAntenna, ButterflyFrame, LeafBook…)
 *
 * Visual changes:
 *   - Honey-glass card with backdrop-blur (was: opaque shadcn Card)
 *   - Fraunces display step title with italic accent
 *   - Caveat handwritten 'step X of Y' counter
 *   - Cleaned Mochi character peeks in on step 1
 *   - Honey-palette progress bar + primary CTA
 *   - Refined step-list rows with honey hover state
 *   - Reduced-motion respected
 */

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { language } = useLanguage();

  const steps = [
    {
      id: 'welcome',
      title: language === 'es' ? '¡Bienvenido a Mochi de los Huertos!' : 'Welcome to Mochi de los Huertos!',
      description: language === 'es'
        ? 'Conoce a Mochi, tu amigable abeja guía del jardín'
        : 'Meet Mochi, your friendly garden bee guide',
      icon: 'mochi',
      action: language === 'es' ? 'Conocer a Mochi' : 'Meet Mochi',
    },
    {
      id: 'chat',
      title: language === 'es' ? 'Chat de Texto' : 'Text Chat',
      description: language === 'es'
        ? 'Haz preguntas sobre plantas, jardinería y naturaleza'
        : 'Ask questions about plants, gardening, and nature',
      icon: <BeeChat className="h-9 w-9" />,
      action: language === 'es' ? 'Probar Chat' : 'Try Chat',
    },
    {
      id: 'voice',
      title: language === 'es' ? 'Chat de Voz' : 'Voice Chat',
      description: language === 'es'
        ? 'Habla naturalmente con Mochi como un amigo'
        : 'Speak naturally with Mochi like a friend',
      icon: <BeeAntenna className="h-9 w-9" />,
      action: language === 'es' ? 'Probar Voz' : 'Try Voice',
    },
    {
      id: 'generate',
      title: language === 'es' ? 'Generador de Imágenes' : 'Image Generator',
      description: language === 'es'
        ? 'Crea hermosas imágenes de jardines y naturaleza'
        : 'Create beautiful garden and nature images',
      icon: <ButterflyFrame className="h-9 w-9" />,
      action: language === 'es' ? 'Crear Imagen' : 'Create Image',
    },
    {
      id: 'education',
      title: language === 'es' ? 'Centro Educativo' : 'Education Hub',
      description: language === 'es'
        ? 'Aprende sobre abejas, plantas y ecología'
        : 'Learn about bees, plants, and ecology',
      icon: <LeafBook className="h-9 w-9" />,
      action: language === 'es' ? 'Explorar' : 'Explore',
    },
    {
      id: 'advanced',
      title: language === 'es' ? 'Funciones Avanzadas' : 'Advanced Features',
      description: language === 'es'
        ? 'Descubre herramientas de IA avanzadas'
        : 'Discover advanced AI tools',
      icon: <PollenSparkle className="h-9 w-9" />,
      action: language === 'es' ? 'Ver Avanzadas' : 'View Advanced',
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepAction = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      localStorage.setItem('mochi_onboarding_completed', 'true');
      onComplete();
    }
  };

  const skipTour = () => {
    localStorage.setItem('mochi_onboarding_completed', 'true');
    onComplete();
  };

  const stepCounter = language === 'es'
    ? `paso ${currentStep + 1} de ${steps.length}`
    : `step ${currentStep + 1} of ${steps.length}`;

  return (
    <div
      className="min-h-screen bg-gradient-nature"
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(20px, 4vw, 48px)',
        paddingTop: 'clamp(72px, 10vw, 120px)',
        fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
        color: 'hsl(30 25% 12%)',
      }}
    >
      <div
        role="dialog"
        aria-labelledby="onboard-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'hsl(45 60% 96% / .82)',
          backdropFilter: 'blur(22px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.2)',
          borderRadius: 'var(--mochi-r-lg, 28px)',
          border: '1px solid hsl(42 90% 97% / .6)',
          boxShadow: 'var(--mochi-shadow-float, 0 24px 48px -16px hsl(25 28% 22% / .28))',
          overflow: 'hidden',
        }}
      >
        {/* Honey drip top accent */}
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 28, right: 28, height: 4,
            borderRadius: '0 0 8px 8px',
            background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
          }}
        />

        {/* Header — counter + title */}
        <div style={{ padding: 'clamp(28px, 5vw, 40px) clamp(28px, 5vw, 40px) 18px', textAlign: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
              fontSize: 18,
              fontWeight: 600,
              color: 'hsl(35 78% 38%)',
              display: 'inline-block',
              transform: 'rotate(-1.5deg)',
            }}
          >
            {stepCounter}
          </span>
          <h2
            id="onboard-title"
            style={{
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              fontSize: 'clamp(20px, 2.5vw, 26px)',
              fontWeight: 600,
              letterSpacing: '-.015em',
              lineHeight: 1.2,
              color: 'hsl(30 25% 12%)',
              margin: '6px 0 14px',
            }}
          >
            {steps[currentStep].title}
          </h2>

          {/* Progress bar — honey gradient */}
          <div style={{ position: 'relative' }}>
            <Progress value={progress} className="h-1.5" />
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(32 88% 44%))',
                borderRadius: 999,
                pointerEvents: 'none',
                transition: 'width .45s var(--mochi-ease-out, cubic-bezier(.16,1,.3,1))',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '0 clamp(28px, 5vw, 40px) clamp(28px, 5vw, 40px)' }}>
          {/* Current Step icon + description */}
          <div style={{ textAlign: 'center', padding: '24px 0 18px' }}>
            <div
              style={{
                width: 96,
                height: 96,
                margin: '0 auto 18px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 24,
                background: 'linear-gradient(135deg, hsl(45 92% 92%), hsl(42 90% 97%))',
                border: '1px solid hsl(40 92% 56% / .25)',
                color: 'hsl(35 78% 38%)',
                position: 'relative',
              }}
            >
              {steps[currentStep].id === 'welcome' ? (
                <img
                  src="/lovable-uploads/mochi-clean-200.webp"
                  alt="Mochi the garden bee"
                  width={88}
                  height={88}
                  style={{
                    width: 88,
                    height: 88,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 10px hsl(30 25% 12% / .2))',
                    animation: 'mochi-onboard-float 4.5s ease-in-out infinite',
                  }}
                />
              ) : (
                <span style={{ animation: 'mochi-onboard-pulse 2.4s ease-in-out infinite' }}>
                  {steps[currentStep].icon}
                </span>
              )}
            </div>

            <p style={{
              fontSize: 14.5,
              color: 'hsl(28 35% 28%)',
              lineHeight: 1.55,
              margin: '0 auto',
              maxWidth: '32ch',
            }}>
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step list */}
          <div style={{ display: 'grid', gap: 6, marginBottom: 22 }}>
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isPast = index < currentStep;
              const isComplete = completedSteps.includes(index);
              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: isCurrent
                      ? 'hsl(40 92% 56% / .12)'
                      : isPast ? 'hsl(45 92% 92% / .55)' : 'transparent',
                    border: isCurrent ? '1px solid hsl(40 92% 56% / .35)' : '1px solid transparent',
                    opacity: isPast || isCurrent ? 1 : 0.55,
                    transition: 'all .25s var(--mochi-ease-out, cubic-bezier(.16,1,.3,1))',
                  }}
                >
                  <div style={{ flexShrink: 0, width: 20, height: 20, display: 'grid', placeItems: 'center' }}>
                    {isComplete ? (
                      <BloomingCheck className="h-5 w-5" style={{ color: 'hsl(95 38% 46%)' }} />
                    ) : isCurrent ? (
                      <span style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: 'hsl(40 92% 56%)',
                        animation: 'mochi-onboard-pulse 1.6s ease-in-out infinite',
                      }} />
                    ) : (
                      <Circle className="h-5 w-5" style={{ color: 'hsl(28 35% 28% / .4)' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 13.5,
                    fontWeight: isCurrent ? 600 : 500,
                    color: isPast || isCurrent ? 'hsl(30 25% 12%)' : 'hsl(28 35% 28%)',
                  }}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={skipTour}
              style={{
                flex: 1,
                padding: '13px 18px',
                borderRadius: 'var(--mochi-r-pill, 999px)',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                background: 'hsl(42 90% 97%)',
                color: 'hsl(30 25% 12%)',
                border: '1.5px solid hsl(30 25% 12% / .25)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(45 92% 92%)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'hsl(42 90% 97%)'; }}
            >
              {language === 'es' ? 'Saltar' : 'Skip'}
            </button>

            <button
              type="button"
              onClick={() => handleStepAction(currentStep)}
              style={{
                flex: 1.6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 18px',
                borderRadius: 'var(--mochi-r-pill, 999px)',
                fontFamily: 'inherit',
                fontSize: 14.5,
                fontWeight: 600,
                background: 'linear-gradient(180deg, hsl(40 92% 56%) 0%, hsl(32 88% 44%) 100%)',
                color: 'hsl(30 25% 12%)',
                border: 0,
                cursor: 'pointer',
                boxShadow: 'var(--mochi-shadow-honey, 0 14px 36px -12px hsl(32 88% 44% / .55))',
                transition: 'transform .2s var(--mochi-ease-spring, cubic-bezier(.34,1.56,.64,1))',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
            >
              {steps[currentStep].action}
              <BeeTrailRight className="h-4 w-4" />
            </button>
          </div>

          {/* Help text */}
          <p
            style={{
              marginTop: 18,
              fontSize: 11.5,
              color: 'hsl(28 35% 28%)',
              opacity: 0.72,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            {language === 'es'
              ? 'Este recorrido te ayudará a descubrir todas las funciones de Mochi.'
              : 'This tour will help you discover all of Mochi\'s features.'}
          </p>
        </div>

        <style>{`
          @keyframes mochi-onboard-float {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50%      { transform: translateY(-6px) rotate(1.5deg); }
          }
          @keyframes mochi-onboard-pulse {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.08); }
          }
          @media (prefers-reduced-motion: reduce) {
            [aria-labelledby="onboard-title"] * { animation: none !important; transition: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OnboardingFlow;

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';
import { PageSEO } from '@/components/PageSEO';
import "@/styles/mochi-tokens.css";

const CookiePolicy: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <PageSEO
        titleEn="Cookie Policy — MochiBee"
        titleEs="Política de Cookies — MochiBee"
        descriptionEn="Learn about how MochiBee uses cookies for analytics and functionality."
        descriptionEs="Descubre cómo MochiBee usa cookies para analítica y funcionalidad."
        path="/cookies"
      />
      {/* Editorial header — v2 */}
      <div
        className="mochi-grain"
        style={{
          position: 'relative',
          maxWidth: 760,
          margin: '24px auto 28px',
          padding: 'clamp(24px, 3vw, 36px)',
          background: 'hsl(45 60% 96% / .82)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          borderRadius: 'var(--mochi-r-lg, 28px)',
          border: '1px solid hsl(40 92% 56% / .25)',
          boxShadow: 'var(--mochi-shadow-card, 0 10px 30px -8px hsl(25 28% 22% / .15))',
          overflow: 'hidden',
          color: 'hsl(30 25% 12%)',
          fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
        }}
      >
        <span aria-hidden style={{
          position: 'absolute', top: 0, left: 28, right: 28, height: 4,
          borderRadius: '0 0 8px 8px',
          background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={56} height={56}
            style={{
              width: 56, height: 56, objectFit: 'contain', flexShrink: 0,
              filter: 'drop-shadow(0 4px 10px hsl(30 25% 12% / .18))',
              animation: 'mochi-legal-float 5s ease-in-out infinite',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              fontWeight: 600,
              fontSize: 'clamp(24px, 3.4vw, 32px)',
              letterSpacing: '-.02em',
              lineHeight: 1.05,
              margin: 0,
              color: 'hsl(30 25% 12%)',
            }}>
              {isEs ? 'Política de Cookies' : 'Cookie Policy'}
              <em style={{
                display: 'block', fontStyle: 'italic', fontWeight: 400,
                fontSize: '.6em', color: 'hsl(35 78% 38%)', marginTop: 2,
              }}>
                {isEs ? 'Cookie Policy' : 'Política de Cookies'}
              </em>
            </h1>
            <p style={{
              fontSize: 13, color: 'hsl(28 35% 28%)',
              margin: '6px 0 0', opacity: 0.75,
            }}>
              {isEs ? 'Última actualización: 18 de marzo de 2026' : 'Last updated: March 18, 2026'}
            </p>
          </div>
        </div>
      </div>

      <article className="prose prose-sm sm:prose max-w-3xl mx-auto pb-8">

        <h2>{isEs ? '1. ¿Qué son las Cookies?' : '1. What Are Cookies?'}</h2>
        <p>{isEs
          ? 'Las cookies son pequeños archivos de texto almacenados en su dispositivo cuando visita nuestro sitio web.'
          : 'Cookies are small text files stored on your device when you visit our website.'}</p>

        <h2>{isEs ? '2. Cookies que Usamos' : '2. Cookies We Use'}</h2>
        <ul>
          <li><strong>{isEs ? 'Esenciales' : 'Essential'}:</strong> {isEs ? 'Autenticación, preferencias de idioma, estado de sesión.' : 'Authentication, language preferences, session state.'}</li>
          <li><strong>{isEs ? 'Analíticas' : 'Analytics'}:</strong> {isEs ? 'Google Analytics (G-4N1GTWE0CX) para entender el uso del sitio.' : 'Google Analytics (G-4N1GTWE0CX) to understand site usage.'}</li>
          <li><strong>{isEs ? 'Funcionales' : 'Functional'}:</strong> {isEs ? 'Progreso de aprendizaje, preferencias de onboarding.' : 'Learning progress, onboarding preferences.'}</li>
        </ul>

        <h2>{isEs ? '3. Almacenamiento Local' : '3. Local Storage'}</h2>
        <p>{isEs
          ? 'También usamos localStorage del navegador para guardar preferencias como idioma, progreso de onboarding y consentimiento RGPD.'
          : 'We also use browser localStorage to save preferences like language, onboarding progress, and GDPR consent.'}</p>

        <h2>{isEs ? '4. Gestionar Cookies' : '4. Managing Cookies'}</h2>
        <p>{isEs
          ? 'Puede controlar las cookies a través de la configuración de su navegador. Desactivar cookies esenciales puede afectar la funcionalidad del sitio.'
          : 'You can control cookies through your browser settings. Disabling essential cookies may affect site functionality.'}</p>

        <h2>{isEs ? '5. Consentimiento' : '5. Consent'}</h2>
        <p>{isEs
          ? 'Las cookies analíticas solo se activan después de que usted dé su consentimiento a través de nuestro banner de cookies RGPD.'
          : 'Analytics cookies are only activated after you give consent through our GDPR cookie banner.'}</p>

        <h2>{isEs ? '6. Contacto' : '6. Contact'}</h2>
        <p>{isEs
          ? 'Para preguntas sobre cookies, contáctenos en info@thelawtonschool.com.'
          : 'For questions about cookies, contact us at info@thelawtonschool.com.'}</p>
      </article>
      <style>{`
        @keyframes mochi-legal-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-4px) rotate(1deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [alt="Mochi the garden bee"] { animation: none !important; }
        }
      `}</style>
    </PageLayout>
  );
};

export default CookiePolicy;

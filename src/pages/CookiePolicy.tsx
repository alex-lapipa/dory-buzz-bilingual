import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';

const CookiePolicy: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <article className="prose prose-sm sm:prose max-w-3xl mx-auto py-8">
        <h1 className="text-foreground">{isEs ? 'Política de Cookies' : 'Cookie Policy'}</h1>
        <p className="text-muted-foreground text-sm">{isEs ? 'Última actualización: 18 de marzo de 2026' : 'Last updated: March 18, 2026'}</p>

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
    </PageLayout>
  );
};

export default CookiePolicy;

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';
import { PageSEO } from '@/components/PageSEO';
import "@/styles/mochi-tokens.css";

const TermsOfService: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <PageSEO
        titleEn="Terms of Service — MochiBee"
        titleEs="Términos de Servicio — MochiBee"
        descriptionEn="Read the terms of service for MochiBee, your bilingual bee education platform."
        descriptionEs="Lee los términos de servicio de MochiBee, tu plataforma bilingüe de educación sobre abejas."
        path="/terms"
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
              {isEs ? 'Términos de Servicio' : 'Terms of Service'}
              <em style={{
                display: 'block', fontStyle: 'italic', fontWeight: 400,
                fontSize: '.6em', color: 'hsl(35 78% 38%)', marginTop: 2,
              }}>
                {isEs ? 'Terms of Service' : 'Términos de Servicio'}
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

        <h2>{isEs ? '1. Aceptación de los Términos' : '1. Acceptance of Terms'}</h2>
        <p>{isEs
          ? 'Al acceder y usar MochiBee (www.mochinillo.com), usted acepta estos términos de servicio.'
          : 'By accessing and using MochiBee (www.mochinillo.com), you agree to these terms of service.'}</p>

        <h2>{isEs ? '2. Descripción del Servicio' : '2. Service Description'}</h2>
        <p>{isEs
          ? 'MochiBee es una plataforma educativa bilingüe sobre abejas, jardines y naturaleza, con asistente de IA interactivo.'
          : 'MochiBee is a bilingual educational platform about bees, gardens, and nature, with an interactive AI assistant.'}</p>

        <h2>{isEs ? '3. Cuentas de Usuario' : '3. User Accounts'}</h2>
        <p>{isEs
          ? 'Usted es responsable de mantener la seguridad de su cuenta y de toda la actividad que ocurra bajo ella.'
          : 'You are responsible for maintaining the security of your account and all activity that occurs under it.'}</p>

        <h2>{isEs ? '4. Uso Aceptable' : '4. Acceptable Use'}</h2>
        <p>{isEs
          ? 'No debe usar el servicio para actividades ilegales, abusar del sistema de IA, ni intentar acceder a datos de otros usuarios.'
          : 'You must not use the service for illegal activities, abuse the AI system, or attempt to access other users\' data.'}</p>

        <h2>{isEs ? '5. Propiedad Intelectual' : '5. Intellectual Property'}</h2>
        <p>{isEs
          ? 'Todo el contenido, diseño y código de MochiBee es propiedad de Mochi de los Huertos y está protegido por leyes de propiedad intelectual.'
          : 'All content, design, and code of MochiBee is owned by Mochi de los Huertos and protected by intellectual property laws.'}</p>

        <h2>{isEs ? '6. Contenido Generado por IA' : '6. AI-Generated Content'}</h2>
        <p>{isEs
          ? 'Las respuestas del asistente Mochi son generadas por IA y tienen fines educativos. No constituyen asesoramiento profesional.'
          : 'Mochi assistant responses are AI-generated and for educational purposes. They do not constitute professional advice.'}</p>

        <h2>{isEs ? '7. Limitación de Responsabilidad' : '7. Limitation of Liability'}</h2>
        <p>{isEs
          ? 'MochiBee se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores.'
          : 'MochiBee is provided "as is". We do not guarantee that the service will be uninterrupted or error-free.'}</p>

        <h2>{isEs ? '8. Contacto' : '8. Contact'}</h2>
        <p>{isEs
          ? 'Para preguntas sobre estos términos, contáctenos en info@thelawtonschool.com.'
          : 'For questions about these terms, contact us at info@thelawtonschool.com.'}</p>
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

export default TermsOfService;

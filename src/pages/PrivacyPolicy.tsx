import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';
import { PageSEO } from '@/components/PageSEO';
import "@/styles/mochi-tokens.css";

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <PageSEO
        titleEn="Privacy Policy — MochiBee"
        titleEs="Política de Privacidad — MochiBee"
        descriptionEn="Learn how MochiBee collects, uses, and protects your personal data. GDPR compliant."
        descriptionEs="Descubre cómo MochiBee recopila, usa y protege tus datos personales. Cumple con el RGPD."
        path="/privacy"
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
              {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
              <em style={{
                display: 'block', fontStyle: 'italic', fontWeight: 400,
                fontSize: '.6em', color: 'hsl(35 78% 38%)', marginTop: 2,
              }}>
                {isEs ? 'Privacy Policy' : 'Política de Privacidad'}
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

        <h2>{isEs ? '1. Quiénes Somos' : '1. Who We Are'}</h2>
        <p>{isEs
          ? 'MochiBee ("nosotros", "nuestro") es operado por Mochi de los Huertos. Nuestro sitio web es www.mochinillo.com.'
          : 'MochiBee ("we", "our", "us") is operated by Mochi de los Huertos. Our website is www.mochinillo.com.'}</p>

        <h2>{isEs ? '2. Datos que Recopilamos' : '2. Data We Collect'}</h2>
        <ul>
          <li>{isEs ? 'Información de cuenta: correo electrónico, nombre de usuario, idioma preferido.' : 'Account information: email, username, preferred language.'}</li>
          <li>{isEs ? 'Datos de uso: páginas visitadas, funciones utilizadas, duración de sesiones.' : 'Usage data: pages visited, features used, session duration.'}</li>
          <li>{isEs ? 'Datos de conversación: mensajes de chat con Mochi para mejorar la experiencia.' : 'Conversation data: chat messages with Mochi to improve the experience.'}</li>
          <li>{isEs ? 'Datos técnicos: tipo de navegador, sistema operativo, dirección IP.' : 'Technical data: browser type, OS, IP address.'}</li>
        </ul>

        <h2>{isEs ? '3. Cómo Usamos Sus Datos' : '3. How We Use Your Data'}</h2>
        <p>{isEs
          ? 'Usamos sus datos para proporcionar y mejorar nuestros servicios, personalizar su experiencia de aprendizaje, enviar comunicaciones relevantes (con su consentimiento) y cumplir con obligaciones legales.'
          : 'We use your data to provide and improve our services, personalize your learning experience, send relevant communications (with your consent), and comply with legal obligations.'}</p>

        <h2>{isEs ? '4. Base Legal (RGPD)' : '4. Legal Basis (GDPR)'}</h2>
        <p>{isEs
          ? 'Procesamos sus datos basándonos en: consentimiento, ejecución de contrato, intereses legítimos y obligaciones legales.'
          : 'We process your data based on: consent, contract performance, legitimate interests, and legal obligations.'}</p>

        <h2>{isEs ? '5. Compartir Datos' : '5. Data Sharing'}</h2>
        <p>{isEs
          ? 'No vendemos sus datos personales. Compartimos datos solo con proveedores de servicios necesarios (Supabase, OpenAI, ElevenLabs, Vercel) que procesan datos en nuestro nombre.'
          : 'We do not sell your personal data. We share data only with necessary service providers (Supabase, OpenAI, ElevenLabs, Vercel) that process data on our behalf.'}</p>

        <h2>{isEs ? '6. Sus Derechos' : '6. Your Rights'}</h2>
        <p>{isEs
          ? 'Bajo el RGPD, usted tiene derecho a: acceder, rectificar, eliminar, portar sus datos, retirar el consentimiento y presentar una queja ante una autoridad de protección de datos.'
          : 'Under GDPR, you have the right to: access, rectify, erase, port your data, withdraw consent, and lodge a complaint with a data protection authority.'}</p>

        <h2>{isEs ? '7. Retención de Datos' : '7. Data Retention'}</h2>
        <p>{isEs
          ? 'Conservamos sus datos mientras mantenga una cuenta activa o según sea necesario para proporcionarle servicios.'
          : 'We retain your data as long as you maintain an active account or as needed to provide you services.'}</p>

        <h2>{isEs ? '8. Contacto' : '8. Contact'}</h2>
        <p>{isEs
          ? 'Para consultas de privacidad, contáctenos en info@thelawtonschool.com.'
          : 'For privacy inquiries, contact us at info@thelawtonschool.com.'}</p>
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

export default PrivacyPolicy;

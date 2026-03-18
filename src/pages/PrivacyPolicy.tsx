import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';
import { PageSEO } from '@/components/PageSEO';

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
      <article className="prose prose-sm sm:prose max-w-3xl mx-auto py-8">
        <h1 className="text-foreground">{isEs ? 'Política de Privacidad' : 'Privacy Policy'}</h1>
        <p className="text-muted-foreground text-sm">{isEs ? 'Última actualización: 18 de marzo de 2026' : 'Last updated: March 18, 2026'}</p>

        <h2>{isEs ? '1. Quiénes Somos' : '1. Who We Are'}</h2>
        <p>{isEs
          ? 'MochiBee ("nosotros", "nuestro") es operado por BeeCrazy Garden World. Nuestro sitio web es www.mochinillo.com.'
          : 'MochiBee ("we", "our", "us") is operated by BeeCrazy Garden World. Our website is www.mochinillo.com.'}</p>

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
    </PageLayout>
  );
};

export default PrivacyPolicy;

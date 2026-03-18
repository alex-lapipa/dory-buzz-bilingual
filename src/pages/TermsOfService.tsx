import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';

const TermsOfService: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <article className="prose prose-sm sm:prose max-w-3xl mx-auto py-8">
        <h1 className="text-foreground">{isEs ? 'Términos de Servicio' : 'Terms of Service'}</h1>
        <p className="text-muted-foreground text-sm">{isEs ? 'Última actualización: 18 de marzo de 2026' : 'Last updated: March 18, 2026'}</p>

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
          ? 'Todo el contenido, diseño y código de MochiBee es propiedad de BeeCrazy Garden World y está protegido por leyes de propiedad intelectual.'
          : 'All content, design, and code of MochiBee is owned by BeeCrazy Garden World and protected by intellectual property laws.'}</p>

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
    </PageLayout>
  );
};

export default TermsOfService;

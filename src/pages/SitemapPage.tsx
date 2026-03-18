import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';

const pages = [
  { path: '/', labelEn: 'Home / Learning Hub', labelEs: 'Inicio / Centro de Aprendizaje' },
  { path: '/chat', labelEn: 'Chat with Mochi', labelEs: 'Chat con Mochi' },
  { path: '/learning/bee-basics', labelEn: 'Bee Basics', labelEs: 'Básicos de Abejas' },
  { path: '/learning/garden-basics', labelEn: 'Garden Basics', labelEs: 'Básicos de Jardín' },
  { path: '/learning-hub', labelEn: 'Learning Hub', labelEs: 'Centro de Aprendizaje' },
  { path: '/privacy', labelEn: 'Privacy Policy', labelEs: 'Política de Privacidad' },
  { path: '/terms', labelEn: 'Terms of Service', labelEs: 'Términos de Servicio' },
  { path: '/cookies', labelEn: 'Cookie Policy', labelEs: 'Política de Cookies' },
];

const externalLinks = [
  { url: 'https://idiomas.io', label: 'idiomas.io' },
  { url: 'https://www.alexlawton.io', label: 'alexlawton.io' },
  { url: 'https://lapipa.io', label: 'lapipa.io' },
];

const SitemapPage: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <article className="prose prose-sm sm:prose max-w-3xl mx-auto py-8">
        <h1 className="text-foreground">{isEs ? 'Mapa del Sitio' : 'Sitemap'}</h1>

        <h2>{isEs ? 'Páginas del Sitio' : 'Site Pages'}</h2>
        <ul>
          {pages.map((page) => (
            <li key={page.path}>
              <Link to={page.path} className="text-primary hover:underline">
                {isEs ? page.labelEs : page.labelEn}
              </Link>
            </li>
          ))}
        </ul>

        <h2>{isEs ? 'Enlaces Externos' : 'External Links'}</h2>
        <ul>
          {externalLinks.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </PageLayout>
  );
};

export default SitemapPage;

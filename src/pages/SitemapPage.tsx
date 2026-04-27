import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/PageLayout';
import { PageSEO } from '@/components/PageSEO';
import "@/styles/mochi-tokens.css";

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
  { url: 'https://lawtonx.com', label: 'lawtonx.com' },
  { url: 'https://www.alexlawton.io', label: 'alexlawton.io' },
  { url: 'https://miramonte.io', label: 'miramonte.io' },
  { url: 'https://lapipa.ai', label: 'lapipa.ai' },
];

const SitemapPage: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <PageLayout>
      <PageSEO
        titleEn="Sitemap — Mochi de los Huertos"
        titleEs="Mapa del Sitio — Mochi de los Huertos"
        descriptionEn="Browse all pages on Mochi de los Huertos — your bilingual bee and garden education platform."
        descriptionEs="Navega todas las páginas de Mochi de los Huertos — tu plataforma bilingüe de educación sobre abejas y jardines."
        path="/sitemap"
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
              {isEs ? 'Mapa del Sitio' : 'Sitemap'}
              <em style={{
                display: 'block', fontStyle: 'italic', fontWeight: 400,
                fontSize: '.6em', color: 'hsl(35 78% 38%)', marginTop: 2,
              }}>
                {isEs ? 'Sitemap' : 'Mapa del Sitio'}
              </em>
            </h1>
            <p style={{
              fontSize: 13, color: 'hsl(28 35% 28%)',
              margin: '6px 0 0', opacity: 0.75,
            }}>
              {isEs ? 'Todas las páginas y enlaces' : 'All pages and links'}
            </p>
          </div>
        </div>
      </div>

      <article className="prose prose-sm sm:prose max-w-3xl mx-auto pb-8">
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

export default SitemapPage;

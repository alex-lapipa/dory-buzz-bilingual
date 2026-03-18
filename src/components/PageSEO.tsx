import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageSEOProps {
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  path?: string;
}

const BASE_URL = 'https://www.mochinillo.com';

/**
 * Sets per-page document title, meta description, and Open Graph tags.
 * Also updates the canonical URL for each page.
 */
export const PageSEO: React.FC<PageSEOProps> = ({
  titleEn,
  titleEs,
  descriptionEn,
  descriptionEs,
  path,
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const isEs = language === 'es';

  const currentPath = path ?? location.pathname;
  const fullUrl = `${BASE_URL}${currentPath}`;
  const title = isEs ? titleEs : titleEn;
  const description = isEs ? descriptionEs : descriptionEn;

  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullUrl);

    // Twitter
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // html lang attribute
    document.documentElement.lang = isEs ? 'es' : 'en';
  }, [title, description, fullUrl, isEs]);

  return null;
};

export default PageSEO;

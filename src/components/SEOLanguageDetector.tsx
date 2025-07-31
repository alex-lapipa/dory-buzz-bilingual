import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SEOLanguageDetector = () => {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Update HTML lang attribute for SEO
    document.documentElement.lang = language;
    
    // Update canonical links for international SEO
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      const baseUrl = 'https://beecrazy-garden-world.lovableproject.com';
      if (language === 'es') {
        canonicalLink.href = `${baseUrl}/es`;
      } else {
        canonicalLink.href = baseUrl;
      }
    }

    // Update hreflang links dynamically
    const hreflangLinks = document.querySelectorAll('link[hreflang]');
    hreflangLinks.forEach(link => {
      const hreflangLink = link as HTMLLinkElement;
      const hreflang = hreflangLink.getAttribute('hreflang');
      
      if (hreflang === language) {
        // Mark current language as active
        hreflangLink.setAttribute('data-active', 'true');
      } else {
        hreflangLink.removeAttribute('data-active');
      }
    });

    // Auto-detect browser language for new users
    if (!localStorage.getItem('selectedLanguage')) {
      const browserLang = navigator.language || navigator.languages[0];
      
      if (browserLang.startsWith('es')) {
        setLanguage('es');
      } else {
        setLanguage('en');
      }
    }

    // Add schema.org breadcrumb for better SEO
    const addBreadcrumbSchema = () => {
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
      if (existingSchema) {
        existingSchema.remove();
      }

      const currentPath = window.location.pathname;
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
      };

      // Build breadcrumb based on current path
      const pathSegments = currentPath.split('/').filter(segment => segment);
      let currentUrl = 'https://beecrazy-garden-world.lovableproject.com';
      
      // Home
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": 1,
        "name": language === 'es' ? "Inicio" : "Home",
        "item": currentUrl
      });

      // Add path segments
      pathSegments.forEach((segment, index) => {
        currentUrl += `/${segment}`;
        let name = segment;
        
        // Translate common segments
        if (language === 'es') {
          if (segment === 'learning-hub') name = 'Centro de Aprendizaje';
          if (segment === 'bee-basics') name = 'Fundamentos de Abejas';
          if (segment === 'garden-basics') name = 'Fundamentos de Jardín';
          if (segment === 'technical-details') name = 'Detalles Técnicos';
        } else {
          if (segment === 'learning-hub') name = 'Learning Hub';
          if (segment === 'bee-basics') name = 'Bee Basics';
          if (segment === 'garden-basics') name = 'Garden Basics';
          if (segment === 'technical-details') name = 'Technical Details';
        }

        breadcrumbSchema.itemListElement.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": name.charAt(0).toUpperCase() + name.slice(1),
          "item": currentUrl
        });
      });

      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-breadcrumb', 'true');
      schemaScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(schemaScript);
    };

    addBreadcrumbSchema();
  }, [language, setLanguage]);

  return null; // This component doesn't render anything
};
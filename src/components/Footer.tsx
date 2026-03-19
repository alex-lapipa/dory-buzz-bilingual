import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { InstagramFlower, ButterflyLink, NatureLeaf, SunflowerStar, BeeFlying } from '@/components/icons';

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/thelawtonschool/', Icon: InstagramFlower },
  { name: 'Facebook', url: 'https://www.facebook.com/TheLawtonSchool/', Icon: ButterflyLink },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/the-lawton-school/', Icon: NatureLeaf },
  { name: 'YouTube', url: 'https://www.youtube.com/@thelawtonschool', Icon: SunflowerStar },
];

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            {isEs ? 'Aprende sobre jardines, abejas y naturaleza' : 'Learn about gardens, bees & nature'}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:scale-125 transition-transform"
                aria-label={link.name}
                title={link.name}
              >
                <link.Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main columns — 2 columns: Explore + Connect */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Column 1: Explore MochiBee */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {isEs ? 'Explorar MochiBee' : 'Explore MochiBee'}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: isEs ? '🌻 Beeducación' : '🌻 Beeducation' },
                { to: '/learning/garden-basics', label: isEs ? '🌱 Básicos de Jardín' : '🌱 Garden Basics' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {isEs ? 'Conectar' : 'Connect'}
            </h3>
            <ul className="space-y-2">
              {[
                { url: 'https://idiomas.io', label: '🌍 idiomas.io' },
                { url: 'https://lawtonx.com', label: '🏡 lawtonx.com' },
                { url: 'https://www.alexlawton.io', label: '🌐 alexlawton.io' },
                { url: 'https://miramonte.io', label: '🌻 miramonte.io' },
                { url: 'https://lapipa.ai', label: '🦋 lapipa.ai' },
              ].map((item) => (
                <li key={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="mailto:hello@lawtonschool.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  🌸 hello@lawtonschool.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Link to="/privacy" className="hover:text-primary transition-colors">{isEs ? 'Privacidad' : 'Privacy'}</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-primary transition-colors">{isEs ? 'Términos' : 'Terms'}</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <span>·</span>
            <Link to="/sitemap" className="hover:text-primary transition-colors">{isEs ? 'Mapa del Sitio' : 'Sitemap'}</Link>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <p>© {new Date().getFullYear()} MochiBee · BeeCrazy Garden World</p>
            <span>·</span>
            <span>
              {isEs ? 'Diseñado por' : 'Designed by'}{' '}
              <a href="https://www.alexlawton.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                Alex Lawton
              </a>
            </span>
            <span>·</span>
            <span>
              {isEs ? 'Desarrollado por' : 'Built by'}{' '}
              <a href="https://lapipa.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                La Pipa
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/thelawtonschool/', icon: '📸' },
  { name: 'Facebook', url: 'https://www.facebook.com/TheLawtonSchool/', icon: '📘' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/the-lawton-school/', icon: '💼' },
  { name: 'YouTube', url: 'https://www.youtube.com/@thelawtonschool', icon: '🎬' },
];

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <footer className="bg-card/95 backdrop-blur-sm border-t border-border/40 mt-auto">
      {/* Top bar */}
      <div className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            {isEs ? '🐝 Aprende sobre jardines, abejas y naturaleza' : '🐝 Learn about gardens, bees & nature'}
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
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Explore MochiBee */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {isEs ? 'Explorar MochiBee' : 'Explore MochiBee'}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: isEs ? '🌻 Beeducación' : '🌻 Beeducation' },
                { to: '/chat', label: isEs ? '💬 Chat con Mochi' : '💬 Chat with Mochi' },
                { to: '/learning/bee-basics', label: isEs ? '🐝 Básicos de Abejas' : '🐝 Bee Basics' },
                { to: '/learning/garden-basics', label: isEs ? '🌱 Básicos de Jardín' : '🌱 Garden Basics' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: idiomas.io */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              idiomas.io
            </h3>
            <ul className="space-y-2">
              {[
                { url: 'https://idiomas.io', label: isEs ? '🏠 Página Principal' : '🏠 Homepage' },
                { url: 'https://idiomas.io/courses', label: isEs ? '📚 Cursos' : '📚 Courses' },
                { url: 'https://idiomas.io/placement-test', label: isEs ? '📝 Prueba de Nivel' : '📝 Placement Test' },
                { url: 'https://idiomas.io/contact', label: isEs ? '✉️ Contacto' : '✉️ Contact' },
              ].map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {isEs ? 'Conectar' : 'Connect'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@thelawtonschool.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ✉️ info@thelawtonschool.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.alexlawton.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  🌐 alexlawton.io
                </a>
              </li>
              <li>
                <a
                  href="https://lapipa.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  🚀 lapipa.io
                </a>
              </li>
              <li>
                <a
                  href="https://idiomas.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  🗣️ idiomas.io
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MochiBee · BeeCrazy Garden World</p>
          <p>
            {isEs ? 'Diseñado por' : 'Designed by'}{' '}
            <a href="https://www.alexlawton.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
              Alex Lawton
            </a>
            {' · '}
            {isEs ? 'Desarrollado por' : 'Built by'}{' '}
            <a href="https://lapipa.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
              La Pipa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

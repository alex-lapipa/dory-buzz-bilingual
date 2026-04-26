/**
 * WhatsNewCallout — a small, dismissible promo strip for the most recent
 * shippable feature. Currently advertises the new bilingual "Exploradoras"
 * song on /kids-songs.
 *
 * Designed to be:
 *   - Bilingual via useLanguage (auto-switches EN/ES)
 *   - Dismissible per-session (sessionStorage so it returns next visit)
 *   - Accessible (aria-label on close, link role on the main click area)
 *   - Visually consistent with the rest of the design-system-2026 layer:
 *     surface-glass, has-grain, badge-new-2026, rounded-2026 utilities
 *
 * Pure additive: nothing else imports this. Pages can drop it in or omit it.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsNewCalloutProps {
  /** Used as the sessionStorage key so different callouts don't collide */
  id?: string;
  /** Override the default link target (which is /kids-songs) */
  href?: string;
  /** Optional className passthrough for layout tuning */
  className?: string;
}

export const WhatsNewCallout: React.FC<WhatsNewCalloutProps> = ({
  id = 'whats-new-exploradoras-v1',
  href = '/kids-songs',
  className = '',
}) => {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // Read sessionStorage on mount (safely)
  useEffect(() => {
    try {
      if (sessionStorage.getItem(`callout:dismissed:${id}`) === '1') {
        setDismissed(true);
      }
    } catch {
      /* sessionStorage unavailable (incognito w/ restrictive settings) — fail open */
    }
  }, [id]);

  if (dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem(`callout:dismissed:${id}`, '1');
    } catch {
      /* fail silently */
    }
  };

  // Bilingual copy
  const t = (en: string, es: string) => (language === 'es' ? es : en);

  return (
    <aside
      role="region"
      aria-label={t('Latest update', 'Última novedad')}
      className={`
        relative surface-glass has-grain
        px-5 py-4 sm:px-6 sm:py-5
        max-w-3xl mx-auto
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      <Link
        to={href}
        className="flex items-center gap-3 sm:gap-4 pr-8"
        aria-label={t(
          'Listen to the new bilingual song Exploradoras',
          'Escucha la nueva canción bilingüe Exploradoras',
        )}
      >
        <span
          aria-hidden="true"
          className="text-3xl sm:text-4xl shrink-0 float-soft"
          style={{ animationDelay: '0.5s' }}
        >
          🎵
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="badge-new-2026">
              {t('New', 'Nueva')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('Just shipped', 'Recién publicada')}
            </span>
          </div>

          <h3 className="font-semibold text-base sm:text-lg leading-snug text-balance">
            {t(
              '“Exploradoras” — a bilingual bee song with Mochi',
              '«Exploradoras» — una canción bilingüe con Mochi',
            )}
          </h3>

          <p className="text-sm text-muted-foreground leading-snug text-pretty mt-0.5">
            {t(
              'Fly with Mochi through the garden — tap to listen.',
              'Vuela con Mochi por el jardín — toca para escuchar.',
            )}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="hidden sm:inline-block text-primary text-lg shrink-0"
        >
          →
        </span>
      </Link>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t('Dismiss this update', 'Descartar este aviso')}
        className="
          absolute top-2 right-2 p-1.5
          text-muted-foreground/70 hover:text-foreground
          rounded-2026-sm hover:bg-muted/40
          transition-colors duration-200
        "
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
};

export default WhatsNewCallout;

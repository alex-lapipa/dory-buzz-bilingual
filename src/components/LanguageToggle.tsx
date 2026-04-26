import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { EarthVine } from '@/components/icons';

/**
 * Round 13 — language toggle now cycles through 3 languages.
 *
 * Tap once: EN → ES
 * Tap again: ES → FR
 * Tap again: FR → EN
 *
 * The button shows the SHORT CODE of the *next* language so users can
 * predict what tapping will do (matches OS-level language pickers).
 */
const ORDER: Language[] = ['en', 'es', 'fr'];
const SHORT_CODE: Record<Language, string> = { en: 'EN', es: 'ES', fr: 'FR' };
const FULL_NAME: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const nextLanguage: Language = ORDER[(ORDER.indexOf(language) + 1) % ORDER.length];

  const cycleLanguage = () => {
    setLanguage(nextLanguage);
  };

  // Title shows: "Language · Switch to Français" so users hovering know exactly
  // what will happen on click.
  const title = `${t('language')} · ${FULL_NAME[nextLanguage]}`;

  return (
    <Button
      onClick={cycleLanguage}
      variant="ghost"
      size="sm"
      className="p-2 animate-flower-sway"
      title={title}
      aria-label={title}
    >
      <EarthVine className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
      <span className="text-xs sm:text-sm font-medium">
        {SHORT_CODE[nextLanguage]}
      </span>
    </Button>
  );
};

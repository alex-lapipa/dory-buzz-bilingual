import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { EarthVine } from '@/components/icons';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="p-2 animate-flower-sway"
      title={t('language')}
    >
      <EarthVine className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
      <span className="text-xs sm:text-sm">
        {language === 'en' ? 'ES' : 'EN'}
      </span>
    </Button>
  );
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

/**
 * react-i18next infrastructure.
 *
 * Designed to coexist with the existing LanguageContext (which has its own
 * dict of ~244 translations keyed by beecrazyLanguage in localStorage). This
 * setup uses the SAME localStorage key so toggling one language source keeps
 * both in sync.
 *
 * Translations are bundled at build time (no async XHR), so no Suspense
 * boundary is required and the language switches instantly.
 *
 * To use in components:
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation();
 *   <p>{t('chat.heroTitle')}</p>
 *
 * Existing `useLanguage()` callers keep working exactly as before.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // Use the SAME localStorage key as the legacy LanguageContext so the two
      // stay in sync. Toggle in one place → both update.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'beecrazyLanguage',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

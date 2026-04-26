# i18n — translations for MochiBee

Powered by [react-i18next](https://react.i18next.com/).
Reference docs:

- Quick-start: https://react.i18next.com/guides/quick-start
- `useTranslation` hook: https://react.i18next.com/latest/usetranslation-hook
- Multi-language file loading: https://react.i18next.com/latest/multi-language-loading

---

## Languages supported (Round 13)

| Code | Name      | File                  |
| ---- | --------- | --------------------- |
| en   | English   | `locales/en.json`     |
| es   | Español   | `locales/es.json`     |
| fr   | Français  | `locales/fr.json`     |

English is the source of truth. When a key is missing in another language,
i18next falls back to English automatically (configured in `index.ts`).

---

## Adding a new translation key

1. Add the key + English value to `locales/en.json`.
2. Mirror the key in `locales/es.json` and `locales/fr.json`.
3. Use it in your component:

   ```tsx
   import { useTranslation } from 'react-i18next';

   const { t } = useTranslation();
   return <p>{t('nav.beeducation')}</p>;
   ```

Keys are nested by feature area (`nav.*`, `chat.*`, `notFound.*`, `songs.*`).
Add a new top-level group when starting a new feature.

---

## Adding a new language

1. Create `locales/<code>.json` mirroring `en.json`.
2. Import + register in `src/i18n/index.ts`:

   ```ts
   import de from './locales/de.json';

   resources: {
     // ...existing...
     de: { translation: de },
   },
   supportedLngs: ['en', 'es', 'fr', 'de'],
   ```

3. Update `src/contexts/LanguageContext.tsx`:
   - Add to the `Language` type union: `'en' | 'es' | 'fr' | 'de'`
   - Add to the `savedLanguage` whitelist in the load `useEffect`

4. Update `src/components/LanguageToggle.tsx`:
   - Add to the `ORDER` array
   - Add to `SHORT_CODE` and `FULL_NAME` records

---

## Bridge with the legacy LanguageContext

The codebase has both:

- A legacy `LanguageContext` with ~244 hardcoded EN/ES strings in a dict
- This new react-i18next setup with EN/ES/FR JSON files

`LanguageContext.t()` was updated in Round 13 to:

1. Look up the key in the legacy dict for the current language
2. Fall back to the English legacy dict (so French users see English
   instead of the raw key for un-translated legacy strings)
3. Fall back to i18next (`i18next.t(key)`) for new keys living in JSON
4. Fall back to the key itself (last resort)

When the toggle changes the language, both `LanguageContext` state AND
`i18next.changeLanguage()` are called, keeping the two systems in sync.

This means:

- Existing code using `useLanguage()` and `t('mochiName')` keeps working
- New code can use `useTranslation()` and `t('nav.beeducation')` for
  full EN/ES/FR support including French
- Existing `language === 'es' ? esText : enText` ternaries still work,
  with French users seeing English (graceful degradation)

To migrate a legacy key from the dict to JSON, just add it to all three
JSON locale files. The bridge prefers the legacy dict, so as soon as you
remove the key from the legacy dict, the new JSON value takes over.

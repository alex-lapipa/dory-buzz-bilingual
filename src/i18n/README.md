# i18n setup

This directory holds the **react-i18next** translations used across the app.

## Files

| Lang | Name      | File                  |
|------|-----------|-----------------------|
| en   | English   | `locales/en.json`     |
| es   | Español   | `locales/es.json`     |

## Usage

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('nav.beeducation')}</h1>;
};
```

## Adding new keys

1. Add the key + English value to `locales/en.json` (keep keys grouped under
   logical namespaces: `nav.*`, `chat.*`, `songs.*`, etc.).
2. Mirror the key in `locales/es.json` with the Spanish translation.
3. Reference it in components via `t('namespace.key')`.

## Adding a new language

1. Create `locales/{lang}.json` with the same keys as `en.json`.
2. In `src/i18n/index.ts`:
   - Import the new file
   - Add it to the `resources` object
   - Add the code to `supportedLngs`
3. In `src/contexts/LanguageContext.tsx`:
   - Extend the `Language` type union (e.g. `'en' | 'es' | 'de'`)
   - Add the new code to the `savedLanguage` runtime check
4. In `src/components/LanguageToggle.tsx`:
   - Extend `ORDER`, `SHORT_CODE`, and `FULL_NAME`

## Coexistence with `LanguageContext`

The legacy `LanguageContext` has its own ~244-key inline dictionary that's still
in use across the app. The migration strategy is:

1. Look up keys in the legacy dict for the current language first (preserves
   existing behavior for any string already there).
2. Fall back to the English legacy dict.
3. Fall back to i18next via `i18next.t()` for keys that have been migrated to
   the JSON locale files.

This means the two systems coexist. New code can use `useTranslation()` from
`react-i18next` directly. Existing code using `useLanguage().t()` keeps
working unchanged. Strings can be migrated incrementally.

## Detection

`i18next-browser-languagedetector` reads from the same `beecrazyLanguage`
localStorage key as the legacy `LanguageContext`. Setting the language in
either system keeps both in sync.

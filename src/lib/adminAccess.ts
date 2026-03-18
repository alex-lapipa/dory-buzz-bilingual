const OWNER_EMAILS = new Set([
  'alex@lawtonschool.com',
  'alex@idiomas.io',
  'alex@lawtonx.com',
  'alex@mochinillo.com',
  'alex.lawton@lawtonschool.com',
]);

const normalizeEmail = (email?: string | null): string => {
  if (!email) return '';

  const lower = email.trim().toLowerCase();
  const [localPart, domain] = lower.split('@');

  if (!localPart || !domain) return lower;

  const normalizedLocal = localPart.split('+')[0];
  return `${normalizedLocal}@${domain}`;
};

export const isOwnerEmail = (email?: string | null): boolean => {
  const normalized = normalizeEmail(email);
  return normalized.length > 0 && OWNER_EMAILS.has(normalized);
};

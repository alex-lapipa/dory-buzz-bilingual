/**
 * OAuth redirect utilities for handling iframe and custom domain contexts.
 * Solves Microsoft login "refused to connect" (X-Frame-Options: DENY) in iframes.
 * Shared pattern across Lawton edtech platforms: idiomas.io, lawtonx.com, mochinillo.com
 */

export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Blocked by same-origin policy means it's in an iframe
  }
}

export function isCustomDomain(): boolean {
  return !window.location.hostname.includes('lovable.app')
    && !window.location.hostname.includes('lovableproject.com')
    && !window.location.hostname.includes('localhost');
}

export function shouldSkipBrowserRedirect(): boolean {
  return isCustomDomain() || isInIframe();
}

export function navigateToOAuth(url: string): void {
  if (isInIframe()) {
    // Can't redirect inside iframe — open in new tab to bypass X-Frame-Options
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
}

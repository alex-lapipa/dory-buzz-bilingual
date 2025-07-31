import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/contexts/ConsentContext';

// Google Analytics helper functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const { hasGivenConsent } = useConsent();
  const location = useLocation();

  // Update consent settings based on user preferences
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      if (hasGivenConsent('analytics')) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      } else {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    }
  }, [hasGivenConsent]);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window.gtag === 'function' && hasGivenConsent('analytics')) {
      window.gtag('config', 'G-4N1GTWE0CX', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [location.pathname, hasGivenConsent]);

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag === 'function' && hasGivenConsent('analytics')) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  };

  const trackPageView = (pageTitle: string, pagePath: string) => {
    if (typeof window.gtag === 'function' && hasGivenConsent('analytics')) {
      window.gtag('config', 'G-4N1GTWE0CX', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      });
    }
  };

  return { trackEvent, trackPageView };
};
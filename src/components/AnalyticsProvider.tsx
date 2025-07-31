import React, { createContext, useContext, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

interface AnalyticsContextType {
  trackEvent: (eventType: string, eventName: string, data?: Record<string, any>) => void;
  trackFeatureUsage: (featureName: string, timeSpent?: number, success?: boolean) => void;
  trackUserInteraction: (interactionType: string, elementId?: string, elementClass?: string, context?: Record<string, any>) => void;
  trackVoiceInteraction: (action: string, language: string, duration?: number, success?: boolean, intent?: string, confidence?: number) => void;
  trackLearningProgress: (milestone: string, topic: string, level?: number, completionRate?: number, timeSpent?: number, score?: number) => void;
  canTrack: boolean;
  sessionId?: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const analytics = useAnalytics();
  const googleAnalytics = useGoogleAnalytics();

  // Set up global click tracking
  useEffect(() => {
    if (!analytics.canTrack) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementId = target.id || target.closest('[id]')?.id;
      const elementClass = target.className;
      const tagName = target.tagName.toLowerCase();
      
      // Track meaningful interactions
      if (['button', 'a', 'input', 'select', 'textarea'].includes(tagName) || 
          target.getAttribute('role') === 'button' ||
          target.onclick !== null) {
        
        analytics.trackUserInteraction('click', elementId, elementClass, {
          tagName,
          text: target.textContent?.slice(0, 50),
          clickPosition: { x: event.clientX, y: event.clientY }
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [analytics]);

  // Set up error tracking
  useEffect(() => {
    if (!analytics.canTrack) return;

    const handleError = (event: ErrorEvent) => {
      analytics.trackEvent('error', 'javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackEvent('error', 'unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
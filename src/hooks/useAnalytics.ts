import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useConsent } from '@/contexts/ConsentContext';

interface AnalyticsEvent {
  eventType: string;
  eventName: string;
  data?: Record<string, any>;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  pageViews: number;
  interactions: number;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { hasGivenConsent } = useConsent();
  const sessionRef = useRef<SessionData | null>(null);
  const pageStartTime = useRef<number>(Date.now());

  // Check if analytics consent is given
  const canTrack = hasGivenConsent('analytics') || hasGivenConsent('data_processing');

  // Initialize session tracking
  useEffect(() => {
    if (!canTrack) return;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionRef.current = {
      sessionId,
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0
    };

    // Track session start
    trackEvent('session_start', 'session_started', {
      sessionId,
      deviceType: getDeviceType(),
      browser: getBrowserInfo(),
      os: getOSInfo(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Track session end on page unload
    const handleBeforeUnload = () => {
      if (sessionRef.current) {
        trackEvent('session_end', 'session_ended', {
          sessionId: sessionRef.current.sessionId,
          durationSeconds: Math.round((Date.now() - sessionRef.current.startTime) / 1000),
          pagesVisited: sessionRef.current.pageViews,
          actionsTaken: sessionRef.current.interactions
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [canTrack]);

  // Track page views
  useEffect(() => {
    if (!canTrack || !sessionRef.current) return;

    sessionRef.current.pageViews += 1;
    pageStartTime.current = Date.now();

    trackEvent('page_view', 'page_viewed', {
      sessionId: sessionRef.current.sessionId,
      pageUrl: window.location.pathname,
      pageName: getPageName(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });

    // Track page exit
    return () => {
      if (sessionRef.current) {
        const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
        trackEvent('page_view', 'page_exited', {
          sessionId: sessionRef.current.sessionId,
          pageUrl: window.location.pathname,
          timeOnPage,
          scrollDepth: getScrollDepth()
        });
      }
    };
  }, [window.location.pathname, canTrack]);

  const trackEvent = useCallback(async (eventType: string, eventName: string, data: Record<string, any> = {}) => {
    if (!canTrack) return;

    try {
      await supabase.functions.invoke('user_analytics_tracker', {
        body: {
          eventType,
          eventName,
          data: {
            ...data,
            sessionId: sessionRef.current?.sessionId,
            timestamp: new Date().toISOString(),
            userId: user?.id
          }
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [user?.id, canTrack]);

  const trackFeatureUsage = useCallback((featureName: string, timeSpent?: number, success: boolean = true) => {
    if (!canTrack) return;
    
    if (sessionRef.current) {
      sessionRef.current.interactions += 1;
    }

    trackEvent('feature_usage', 'feature_used', {
      featureName,
      timeSpent,
      success,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, canTrack]);

  const trackUserInteraction = useCallback((interactionType: string, elementId?: string, elementClass?: string, context?: Record<string, any>) => {
    if (!canTrack) return;

    if (sessionRef.current) {
      sessionRef.current.interactions += 1;
    }

    trackEvent('user_interaction', interactionType, {
      interactionType,
      elementId,
      elementClass,
      pageUrl: window.location.pathname,
      timestamp: new Date().toISOString(),
      context
    });
  }, [trackEvent, canTrack]);

  const trackVoiceInteraction = useCallback((action: string, language: string, duration?: number, success: boolean = true, intent?: string, confidence?: number) => {
    if (!canTrack) return;

    trackEvent('voice_interaction', action, {
      action,
      language,
      duration,
      success,
      intent,
      confidence,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, canTrack]);

  const trackLearningProgress = useCallback((milestone: string, topic: string, level?: number, completionRate?: number, timeSpent?: number, score?: number) => {
    if (!canTrack) return;

    trackEvent('learning_progress', milestone, {
      milestone,
      topic,
      level,
      completionRate,
      timeSpent,
      score,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, canTrack]);

  return {
    trackEvent,
    trackFeatureUsage,
    trackUserInteraction,
    trackVoiceInteraction,
    trackLearningProgress,
    canTrack,
    sessionId: sessionRef.current?.sessionId
  };
};

// Helper functions
function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function getBrowserInfo(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getOSInfo(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

function getPageName(): string {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'home';
  return segments.join('_');
}

function getScrollDepth(): number {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
}
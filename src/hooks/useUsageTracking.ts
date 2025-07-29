import { useEffect } from 'react';

// Enhanced usage tracking for better UX analytics
export const useUsageTracking = () => {
  const trackFeatureUsage = (feature: string, details?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    const usage = {
      feature,
      timestamp,
      details,
      sessionId: getSessionId()
    };
    
    // Store locally for analytics
    const existingUsage = JSON.parse(localStorage.getItem('feature_usage') || '[]');
    existingUsage.push(usage);
    
    // Keep only last 1000 entries to avoid storage bloat
    if (existingUsage.length > 1000) {
      existingUsage.splice(0, existingUsage.length - 1000);
    }
    
    localStorage.setItem('feature_usage', JSON.stringify(existingUsage));
    
    // Mark feature as used for progress tracking
    localStorage.setItem(`used_${feature}`, 'true');
    
    console.log(`📊 Feature tracked: ${feature}`, details);
  };

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const getUsageStats = () => {
    const usage = JSON.parse(localStorage.getItem('feature_usage') || '[]');
    const stats = usage.reduce((acc: Record<string, number>, item: any) => {
      acc[item.feature] = (acc[item.feature] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalInteractions: usage.length,
      featureUsage: stats,
      lastActivity: usage[usage.length - 1]?.timestamp,
      sessionsCount: new Set(usage.map((u: any) => u.sessionId)).size
    };
  };

  const trackPageView = (page: string) => {
    trackFeatureUsage('page_view', { page });
  };

  const trackInteraction = (type: string, element: string, details?: Record<string, any>) => {
    trackFeatureUsage('interaction', { type, element, ...details });
  };

  const trackError = (error: string, context?: string) => {
    trackFeatureUsage('error', { error, context });
  };

  const trackUserJourney = (step: string, data?: Record<string, any>) => {
    trackFeatureUsage('user_journey', { step, ...data });
  };

  return {
    trackFeatureUsage,
    trackPageView,
    trackInteraction,
    trackError,
    trackUserJourney,
    getUsageStats,
    getSessionId
  };
};

// Auto-track page views
export const usePageTracking = () => {
  const { trackPageView } = useUsageTracking();
  
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);
};

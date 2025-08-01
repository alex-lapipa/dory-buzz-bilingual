import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserAnalytics {
  trackEvent: (eventName: string, eventType?: string, metadata?: any) => Promise<void>;
  trackPageView: (pageUrl: string) => Promise<void>;
  trackUserAction: (action: string, elementId?: string, elementClass?: string) => Promise<void>;
  updateSessionData: (data: Partial<SessionData>) => Promise<void>;
}

interface SessionData {
  actions_taken?: number;
  pages_visited?: number;
  duration_seconds?: number;
  device_type?: string;
  browser?: string;
  screen_resolution?: string;
}

export const useUserAnalytics = (): UserAnalytics => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (
    eventName: string, 
    eventType: string = 'interaction', 
    metadata: any = {}
  ) => {
    try {
      // Add browser and device info to metadata
      const enrichedMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await supabase.rpc('track_user_event', {
        p_event_name: eventName,
        p_event_type: eventType,
        p_page_url: window.location.pathname,
        p_metadata: enrichedMetadata,
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
      // Fail silently to not impact user experience
    }
  }, []);

  const trackPageView = useCallback(async (pageUrl: string) => {
    await trackEvent('page_view', 'navigation', {
      page_url: pageUrl,
      referrer: document.referrer,
    });
  }, [trackEvent]);

  const trackUserAction = useCallback(async (
    action: string, 
    elementId?: string, 
    elementClass?: string
  ) => {
    try {
      await supabase.rpc('track_user_event', {
        p_event_name: action,
        p_event_type: 'user_action',
        p_page_url: window.location.pathname,
        p_element_id: elementId,
        p_element_class: elementClass,
        p_metadata: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.warn('User action tracking error:', error);
    }
  }, []);

  const updateSessionData = useCallback(async (data: Partial<SessionData>) => {
    if (!user) return;

    try {
      // Get current session ID from localStorage or generate one
      let sessionId = localStorage.getItem('current_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('current_session_id', sessionId);
      }

      // Update or create session record
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          session_id: sessionId,
          ...data,
          ended_at: data.duration_seconds ? new Date().toISOString() : undefined,
        }, {
          onConflict: 'session_id'
        });

      if (error) throw error;
    } catch (error) {
      console.warn('Session update error:', error);
    }
  }, [user]);

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    updateSessionData,
  };
};
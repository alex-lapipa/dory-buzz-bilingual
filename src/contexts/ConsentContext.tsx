import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface ConsentContextType {
  consents: ConsentRecord[];
  hasGivenConsent: (type: string) => boolean;
  giveConsent: (type: string, given: boolean) => Promise<void>;
  withdrawConsent: (type: string) => Promise<void>;
  loading: boolean;
  showConsentBanner: boolean;
  dismissConsentBanner: () => void;
}

interface ConsentRecord {
  id: string;
  consent_type: string;
  consent_given: boolean;
  consent_date: string;
  consent_version: string;
  withdrawn_at?: string;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

// GDPR required consent types
export const CONSENT_TYPES = {
  DATA_PROCESSING: 'data_processing',
  MARKETING: 'marketing', 
  ANALYTICS: 'analytics',
  COOKIES: 'cookies',
  NOTIFICATIONS: 'notifications'
} as const;

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Check if user has given essential consents
  useEffect(() => {
    checkConsentStatus();
  }, [user]);

  const checkConsentStatus = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_consents')
        .select('*');

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        // For anonymous users, check by email if available in localStorage
        const guestEmail = localStorage.getItem('guest_email');
        if (guestEmail) {
          query = query.eq('email', guestEmail);
        } else {
          // No user and no guest email, show consent banner
          setShowConsentBanner(true);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setConsents(data || []);
      
      // Check if essential consents are missing
      const hasDataProcessingConsent = data?.some(
        c => c.consent_type === CONSENT_TYPES.DATA_PROCESSING && 
             c.consent_given && 
             !c.withdrawn_at
      );
      
      if (!hasDataProcessingConsent) {
        setShowConsentBanner(true);
      }
      
    } catch (error) {
      console.error('Error checking consent status:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasGivenConsent = (type: string): boolean => {
    const consent = consents.find(
      c => c.consent_type === type && 
           c.consent_given && 
           !c.withdrawn_at
    );
    return !!consent;
  };

  const giveConsent = async (type: string, given: boolean): Promise<void> => {
    try {
      const consentData = {
        consent_type: type,
        consent_given: given,
        consent_version: '1.0',
        ip_address: null, // Could be obtained from a service
        user_agent: navigator.userAgent,
        user_id: user?.id || null,
        email: user?.email || localStorage.getItem('guest_email') || null
      };

      const { error } = await supabase
        .from('user_consents')
        .insert([consentData]);

      if (error) throw error;

      // Refresh consent status
      await checkConsentStatus();
      
      // If data processing consent was given, we can hide the banner
      if (type === CONSENT_TYPES.DATA_PROCESSING && given) {
        setShowConsentBanner(false);
      }

    } catch (error) {
      console.error('Error giving consent:', error);
      throw error;
    }
  };

  const withdrawConsent = async (type: string): Promise<void> => {
    try {
      const consent = consents.find(
        c => c.consent_type === type && 
             c.consent_given && 
             !c.withdrawn_at
      );

      if (!consent) return;

      const { error } = await supabase
        .from('user_consents')
        .update({ withdrawn_at: new Date().toISOString() })
        .eq('id', consent.id);

      if (error) throw error;

      // Refresh consent status
      await checkConsentStatus();

    } catch (error) {
      console.error('Error withdrawing consent:', error);
      throw error;
    }
  };

  const dismissConsentBanner = () => {
    setShowConsentBanner(false);
    // Store dismissal in localStorage for session
    localStorage.setItem('consent_banner_dismissed', 'true');
  };

  const value = {
    consents,
    hasGivenConsent,
    giveConsent,
    withdrawConsent,
    loading,
    showConsentBanner,
    dismissConsentBanner,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};
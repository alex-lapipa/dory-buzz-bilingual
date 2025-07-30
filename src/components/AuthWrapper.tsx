import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, signInAnonymously, loading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isAttempting, setIsAttempting] = useState(false);

  useEffect(() => {
    // Single attempt at anonymous sign-in for better UX
    const initializeAuth = async () => {
      if (!loading && !user && !hasAttempted && !isAttempting) {
        setIsAttempting(true);
        setHasAttempted(true);
        
        try {
          await signInAnonymously();
          console.log('✅ Successfully connected to BeeCrazy Garden World!');
        } catch (error) {
          console.log('ℹ️ Running in guest mode - chat history won\'t be saved');
          console.log('Auth error details:', error);
          // Don't show error toast for auth failures - just run in guest mode silently
        } finally {
          setIsAttempting(false);
        }
      }
    };

    initializeAuth();
  }, [user, loading, signInAnonymously, hasAttempted, isAttempting]);

  return <>{children}</>;
};
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, signInAnonymously, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-sign in anonymously if no user is present
    const initializeAuth = async () => {
      if (!loading && !user) {
        try {
          await signInAnonymously();
          console.log('User signed in anonymously for guest access');
        } catch (error) {
          console.warn('Anonymous sign-in failed, continuing as guest:', error);
          // App will still work without authentication, just with limited functionality
        }
      }
    };

    initializeAuth();
  }, [user, loading, signInAnonymously]);

  // Don't block rendering - let the app work even if auth fails
  return <>{children}</>;
};
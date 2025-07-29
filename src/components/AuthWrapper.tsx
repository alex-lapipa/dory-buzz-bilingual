import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, signInAnonymously, loading } = useAuth();
  const { toast } = useToast();
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
          // Show friendly message to user
          toast({
            title: "Welcome! 🐝",
            description: "Running in guest mode. Your chats won't be saved, but everything else works perfectly!",
            duration: 3000,
          });
        } finally {
          setIsAttempting(false);
        }
      }
    };

    initializeAuth();
  }, [user, loading, signInAnonymously, hasAttempted, isAttempting, toast]);

  return <>{children}</>;
};
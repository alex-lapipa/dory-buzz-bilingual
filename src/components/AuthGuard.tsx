import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, loading, signInAnonymously } = useAuth();
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    const ensureAuth = async () => {
      if (!loading && !user && !attempting) {
        setAttempting(true);
        try {
          console.log('Attempting anonymous sign-in for database access...');
          await signInAnonymously();
        } catch (error) {
          console.warn('Anonymous sign-in failed:', error);
          // Continue anyway - app will work with limited functionality
        } finally {
          setAttempting(false);
        }
      }
    };

    ensureAuth();
  }, [user, loading, signInAnonymously, attempting]);

  if (loading || attempting) {
    return fallback || (
      <Card className="shadow-honey border border-border/30 bg-card/70 backdrop-blur">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Connecting to BeeCrazy Garden World...</p>
        </CardContent>
      </Card>
    );
  }

  // Always render children - anonymous auth provides database access
  // but app should work even if it fails
  return <>{children}</>;
};
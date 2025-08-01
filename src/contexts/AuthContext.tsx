import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer any additional data fetching to prevent deadlocks
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            // Additional user data loading can happen here
            console.log('User signed in:', session.user.email);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData // This will be available in raw_user_meta_data
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth state first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: null, // Disable captcha for development
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Force page reload for clean state
        window.location.href = '/';
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      window.location.href = '/auth';
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
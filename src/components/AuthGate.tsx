import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'twitter' | 'github') => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong with social login.",
        variant: "destructive"
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (isSignUp) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-nature">
        <div className="text-center">
          <div className="text-6xl animate-bee-bounce mb-4">🐝</div>
          <p className="text-lg text-muted-foreground">Loading Mochi...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-nature p-4">
      <Card className="w-full max-w-md shadow-honey border-2 border-border/50 bg-card/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="relative">
              <div className="text-4xl animate-bee-bounce">🐝</div>
              <div className="absolute -top-1 -right-1 text-lg animate-flower-sway">🌻</div>
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-bee bg-clip-text text-transparent">
                Welcome to Mochi's Garden
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Buzztastical! Sign in to start learning 🐝✨
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Options */}
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">Sign in with</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialAuth('google')}
              >
                <span className="text-lg">🔍</span>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialAuth('facebook')}
              >
                <span className="text-lg">📘</span>
                Instagram
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialAuth('twitter')}
              >
                <span className="text-lg">🦋</span>
                Bluesky
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialAuth('github')}
              >
                <span className="text-lg">🎵</span>
                TikTok
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
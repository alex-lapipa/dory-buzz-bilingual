import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from '@/components/icons/lucide-compat';
import { supabase } from '@/integrations/supabase/client';
import { shouldSkipBrowserRedirect, navigateToOAuth, isLawtonEmail } from '@/utils/oauthRedirect';
import "@/styles/mochi-tokens.css";

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp) {
      if (!displayName) {
        setError('Display name is required');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleForgotPassword = async () => {
    const emailToReset = forgotEmail || email;
    if (!emailToReset) {
      setError('Please enter your email address');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailToReset, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
      toast({
        title: '📧 Check your email',
        description: 'We sent you a password reset link.',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'twitter' | 'github' | 'azure') => {
    try {
      setIsLoading(true);
      const callbackUrl = `${window.location.origin}/auth`;
      const skipRedirect = shouldSkipBrowserRedirect();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: skipRedirect,
          ...(provider === 'azure' && { scopes: 'openid email profile' }),
        }
      });

      // When skipBrowserRedirect is true, navigate manually
      if (!error && skipRedirect && data?.url) {
        navigateToOAuth(data.url);
        return;
      }

      if (error) {
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      setError('Something went wrong with social login');
      toast({
        title: "Error",
        description: "Something went wrong with social login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Auto-redirect Lawton domain emails to Microsoft SSO
    if (isLawtonEmail(email)) {
      handleSocialAuth('azure');
      return;
    }
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;
      if (isSignUp) {
        const userData = {
          display_name: displayName,
          language: 'en'
        };
        result = await signUp(email, password, userData);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        if (result.error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (result.error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
          setIsSignUp(false);
        } else if (result.error.message?.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(result.error.message || 'Authentication failed');
        }
        
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (isSignUp) {
        toast({
          title: "🐝 Welcome to Mochi's Garden!",
          description: "Please check your email to verify your account.",
        });
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDisplayName('');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-nature p-4">
        <div className="text-center">
          <img 
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={72} height={72}
            style={{
              width: 72, height: 72, objectFit: 'contain',
              margin: '0 auto 16px', display: 'block',
              filter: 'drop-shadow(0 6px 14px hsl(30 25% 12% / .2))',
              animation: 'mochi-auth-float 4.5s ease-in-out infinite',
            }}
          />
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'hsl(35 78% 38%)' }} />
            <p style={{
              fontSize: 16, fontWeight: 500,
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              color: 'hsl(28 35% 28%)',
            }}>
              Buzzing in <em style={{ color: 'hsl(35 78% 38%)' }}>· un momento</em>
            </p>
          </div>
          <style>{`
            @keyframes mochi-auth-float {
              0%, 100% { transform: translateY(0) rotate(-1deg); }
              50%      { transform: translateY(-5px) rotate(1.5deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              [alt="Mochi the garden bee"] { animation: none !important; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-nature p-4">
         <Card className="w-full max-w-md card-nature shadow-honey">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl bg-gradient-bee bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {forgotSent ? '📧 Check your inbox!' : '🔑 Enter your email to receive a reset link'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {forgotSent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We sent a password reset link to <strong>{forgotEmail}</strong>. Check your email and follow the link.
                </p>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSent(false);
                    setError('');
                  }}
                >
                  ← Back to Sign In
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10 h-11"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-11"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    '📧 Send Reset Link'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                  }}
                >
                  ← Back to Sign In
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-nature p-4">
      <Card className="w-full max-w-md card-nature shadow-honey">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/mochi-clean-200.webp"
              alt="Mochi the garden bee"
              width={56} height={56}
              style={{
                width: 56, height: 56, objectFit: 'contain',
                filter: 'drop-shadow(0 4px 10px hsl(30 25% 12% / .2))',
                animation: 'mochi-auth-float 4.5s ease-in-out infinite',
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <CardTitle style={{
                fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: '-.015em',
                color: 'hsl(30 25% 12%)',
                lineHeight: 1.05,
              }}>
                Mochi&rsquo;s garden
                <em style={{ display:'block', fontStyle:'italic', fontWeight:400, fontSize:'.6em', color:'hsl(35 78% 38%)', marginTop:2 }}>
                  El huerto de Mochi
                </em>
              </CardTitle>
              <p style={{
                fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
                fontSize: 16, fontWeight: 600,
                color: 'hsl(35 78% 38%)',
                marginTop: 4,
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}>
                {isSignUp ? '¡bienvenid@! Welcome' : '¡hola! Welcome back'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email input to detect Lawton domains */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isLawtonEmail(e.target.value)) setError('');
                }}
                className="pl-10 h-11"
                autoComplete="email"
              />
            </div>
          </div>

          {isLawtonEmail(email) ? (
            /* Lawton domain — only Microsoft SSO */
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                <p className="text-sm font-medium text-primary">🏫 Lawton School account detected</p>
                <p className="text-xs text-muted-foreground">Sign in with your school Microsoft account</p>
              </div>
              <Button 
                className="w-full h-11"
                onClick={() => handleSocialAuth('azure')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Microsoft...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                    Continue with Microsoft
                  </>
                )}
              </Button>
            </div>
          ) : (
            /* Non-Lawton — full auth form */
            <>
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">Quick sign in with</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-11"
                    onClick={() => handleSocialAuth('azure')}
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                    Continue with Microsoft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-11"
                    onClick={() => handleSocialAuth('google')}
                    disabled={isLoading}
                  >
                    <span className="text-lg">🔍</span>
                    Continue with Google
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or use email</span>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="How should we call you?"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10 h-11"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isSignUp ? "Create a password (min 6 chars)" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      required
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotEmail(email);
                      setError('');
                    }}
                    className="text-sm text-primary hover:underline w-full text-right"
                  >
                    Forgot password?
                  </button>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignUp ? '🌱 Create Account' : '🐝 Sign In'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                    setDisplayName('');
                  }}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
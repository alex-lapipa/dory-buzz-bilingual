import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLayout } from '@/components/PageLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useConsent, CONSENT_TYPES } from '@/contexts/ConsentContext';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { Loader2, Mail, Lock, User, Calendar, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, loading: authLoading } = useAuth();
  const { giveConsent } = useConsent();
  const { trackEvent, trackUserAction } = useUserAnalytics();
  
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('en');
  
  // GDPR Consent states
  const [consents, setConsents] = useState({
    dataProcessing: false,
    marketing: false,
    analytics: false,
    notifications: false
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Track sign-in attempt
    await trackEvent('signin_attempt', 'auth', { 
      email_domain: email.split('@')[1],
      method: 'email_password' 
    });

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // Track signin error
        await trackEvent('signin_error', 'auth', { 
          error_type: error.message?.includes('Invalid login credentials') ? 'invalid_credentials' : 'other',
          error_message: error.message 
        });

        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message || 'Failed to sign in. Please try again.');
        }
      } else {
        // Track successful signin
        await trackEvent('signin_success', 'auth', { 
          email_domain: email.split('@')[1] 
        });

        toast({
          title: "🐝 Welcome back!",
          description: "You've successfully signed in to BeeCrazy Garden World.",
        });
        navigate('/');
      }
    } catch (err: any) {
      await trackEvent('signin_error', 'auth', { 
        error_type: 'unexpected',
        error_message: err.message 
      });
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'azure' | 'google') => {
    setLoading(true);
    setError('');
    
    const label = provider === 'azure' ? 'microsoft' : 'google';
    await trackEvent(`${label}_signin_attempt`, 'auth', { method: `${label}_oauth` });
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          ...(provider === 'azure' ? { scopes: 'email profile openid' } : {}),
        }
      });
      
      if (error) {
        await trackEvent(`${label}_signin_error`, 'auth', { 
          error_type: 'oauth_error',
          error_message: error.message 
        });
        setError(error.message || `Failed to sign in with ${label}`);
      } else {
        await trackEvent(`${label}_signin_success`, 'auth', { method: `${label}_oauth` });
      }
    } catch (err: any) {
      await trackEvent(`${label}_signin_error`, 'auth', { 
        error_type: 'unexpected',
        error_message: err.message 
      });
      setError(`An unexpected error occurred with ${label} sign-in`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Track signup attempt
    await trackEvent('signup_attempt', 'auth', { 
      age: parseInt(age),
      language,
      email_domain: email.split('@')[1],
      consents_given: Object.values(consents).filter(Boolean).length
    });

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (!consents.dataProcessing) {
      setError('You must agree to data processing to create an account.');
      setLoading(false);
      return;
    }

    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 13 || ageNum > 120) {
      setError('Please enter a valid age between 13 and 120.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        display_name: displayName,
        age: ageNum,
        language: language
      };

      const { error } = await signUp(email, password, userData);
      
      if (error) {
        // Track signup error
        await trackEvent('signup_error', 'auth', { 
          error_type: error.message?.includes('User already registered') ? 'user_exists' : 'other',
          error_message: error.message,
          age: ageNum,
          language
        });

        if (error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
          setActiveTab('signin');
        } else if (error.message?.includes('Password should be at least')) {
          setError('Password is too weak. Please use a stronger password.');
        } else {
          setError(error.message || 'Failed to create account. Please try again.');
        }
      } else {
        // Track successful signup
        await trackEvent('signup_success', 'auth', { 
          age: ageNum,
          language,
          email_domain: email.split('@')[1],
          consents_given: Object.keys(consents).filter(key => consents[key as keyof typeof consents])
        });

        // Record GDPR consents
        try {
          if (consents.dataProcessing) {
            await giveConsent(CONSENT_TYPES.DATA_PROCESSING, true);
          }
          if (consents.marketing) {
            await giveConsent(CONSENT_TYPES.MARKETING, true);
          }
          if (consents.analytics) {
            await giveConsent(CONSENT_TYPES.ANALYTICS, true);
          }
          if (consents.notifications) {
            await giveConsent(CONSENT_TYPES.NOTIFICATIONS, true);
          }
        } catch (consentError) {
          console.error('Error recording consents:', consentError);
        }

        toast({
          title: "🐝 Welcome to BeeCrazy Garden World!",
          description: "Please check your email for a confirmation link to complete your registration.",
          duration: 6000,
        });
        setActiveTab('signin');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <PageLayout showHeader={false}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showHeader={false} className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <span className="text-3xl">🐝</span>
            <span className="text-xl font-bold">BeeCrazy Garden World</span>
          </Link>
          <p className="text-muted-foreground mt-2">Join our garden community with Mochi!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {activeTab === 'signin' ? 'Welcome Back!' : 'Join the Garden!'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'signin' 
                ? 'Sign in to continue your garden adventure' 
                : 'Create your account to start learning with Mochi'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  {/* Microsoft SSO — Primary for Lotus School */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleOAuthSignIn('azure')}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21">
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
                    className="w-full" 
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="display-name"
                        type="text"
                        placeholder="How should we call you?"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="Age"
                          min="13"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <Globe className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* GDPR Consent Section */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-medium text-sm">Privacy & Consent (GDPR)</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="data-processing"
                          checked={consents.dataProcessing}
                          onCheckedChange={(checked) => 
                            setConsents(prev => ({ ...prev, dataProcessing: !!checked }))
                          }
                          required
                        />
                        <Label htmlFor="data-processing" className="text-sm leading-relaxed">
                          <span className="text-red-500">*</span> I agree to the processing of my personal data for account creation and app functionality. <span className="text-muted-foreground">(Required)</span>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="marketing"
                          checked={consents.marketing}
                          onCheckedChange={(checked) => 
                            setConsents(prev => ({ ...prev, marketing: !!checked }))
                          }
                        />
                        <Label htmlFor="marketing" className="text-sm leading-relaxed">
                          I agree to receive marketing emails about garden tips and updates. <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="analytics"
                          checked={consents.analytics}
                          onCheckedChange={(checked) => 
                            setConsents(prev => ({ ...prev, analytics: !!checked }))
                          }
                        />
                        <Label htmlFor="analytics" className="text-sm leading-relaxed">
                          I agree to analytics tracking to help improve the app. <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="notifications"
                          checked={consents.notifications}
                          onCheckedChange={(checked) => 
                            setConsents(prev => ({ ...prev, notifications: !!checked }))
                          }
                        />
                        <Label htmlFor="notifications" className="text-sm leading-relaxed">
                          I agree to receive push notifications about my garden progress. <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      You can withdraw your consent at any time in your profile settings. For more information, see our Privacy Policy.
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  {/* Microsoft SSO — Primary for Lawton School */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleOAuthSignIn('azure')}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21">
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
                    className="w-full" 
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Garden
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthPage;
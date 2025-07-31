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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useConsent, CONSENT_TYPES } from '@/contexts/ConsentContext';
import { GDPRConsentBanner } from '@/components/GDPRConsent';
import { Loader2, Mail, Lock, User, Calendar, Globe } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, loading: authLoading } = useAuth();
  const { giveConsent } = useConsent();
  
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

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message || 'Failed to sign in. Please try again.');
        }
      } else {
        toast({
          title: "🐝 Welcome back!",
          description: "You've successfully signed in to BeeCrazy Garden World.",
        });
        navigate('/');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        if (error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
          setActiveTab('signin');
        } else if (error.message?.includes('Password should be at least')) {
          setError('Password is too weak. Please use a stronger password.');
        } else {
          setError(error.message || 'Failed to create account. Please try again.');
        }
      } else {
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4 relative">
      {/* GDPR Consent Banner - Import and show it here */}
      
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
      
      {/* GDPR Consent Banner */}
      <GDPRConsentBanner />
    </div>
  );
};

export default AuthPage;
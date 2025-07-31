import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useConsent, CONSENT_TYPES } from '@/contexts/ConsentContext';
import { X, Shield, Info } from 'lucide-react';
import { useState } from 'react';

export const GDPRConsentBanner: React.FC = () => {
  const { showConsentBanner, giveConsent, dismissConsentBanner } = useConsent();
  const [consents, setConsents] = useState({
    dataProcessing: false,
    analytics: false,
    marketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showConsentBanner) return null;

  const handleAcceptAll = async () => {
    setIsSubmitting(true);
    try {
      await giveConsent(CONSENT_TYPES.DATA_PROCESSING, true);
      await giveConsent(CONSENT_TYPES.ANALYTICS, true);
      await giveConsent(CONSENT_TYPES.MARKETING, true);
      await giveConsent(CONSENT_TYPES.COOKIES, true);
    } catch (error) {
      console.error('Error accepting all consents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptSelected = async () => {
    setIsSubmitting(true);
    try {
      // Data processing is mandatory
      await giveConsent(CONSENT_TYPES.DATA_PROCESSING, true);
      
      if (consents.analytics) {
        await giveConsent(CONSENT_TYPES.ANALYTICS, true);
      }
      if (consents.marketing) {
        await giveConsent(CONSENT_TYPES.MARKETING, true);
      }
    } catch (error) {
      console.error('Error accepting consents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectAll = async () => {
    setIsSubmitting(true);
    try {
      // Only give essential data processing consent
      await giveConsent(CONSENT_TYPES.DATA_PROCESSING, true);
      await giveConsent(CONSENT_TYPES.ANALYTICS, false);
      await giveConsent(CONSENT_TYPES.MARKETING, false);
    } catch (error) {
      console.error('Error rejecting consents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">🍪 We respect your privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies and similar technologies to provide you with the best experience in BeeCrazy Garden World. 
                    Choose your preferences below or accept all to continue.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-300 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                    </div>
                    <div>
                      <div className="font-medium">Essential</div>
                      <div className="text-muted-foreground">Required for core functionality</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="analytics-consent"
                      checked={consents.analytics}
                      onCheckedChange={(checked) => 
                        setConsents(prev => ({ ...prev, analytics: !!checked }))
                      }
                    />
                    <div>
                      <div className="font-medium">Analytics</div>
                      <div className="text-muted-foreground">Help us improve the app</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="marketing-consent"
                      checked={consents.marketing}
                      onCheckedChange={(checked) => 
                        setConsents(prev => ({ ...prev, marketing: !!checked }))
                      }
                    />
                    <div>
                      <div className="font-medium">Marketing</div>
                      <div className="text-muted-foreground">Garden tips & updates</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    onClick={handleAcceptAll} 
                    size="sm"
                    disabled={isSubmitting}
                  >
                    Accept All
                  </Button>
                  
                  <Button 
                    onClick={handleAcceptSelected} 
                    variant="outline" 
                    size="sm"
                    disabled={isSubmitting}
                  >
                    Accept Selected
                  </Button>
                  
                  <Button 
                    onClick={handleRejectAll} 
                    variant="ghost" 
                    size="sm"
                    disabled={isSubmitting}
                  >
                    Reject Optional
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {/* Link to privacy policy */}}
                      className="text-xs"
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Privacy Policy
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={dismissConsentBanner}
                      className="p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ConsentSettings: React.FC = () => {
  const { consents, hasGivenConsent, giveConsent, withdrawConsent } = useConsent();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentToggle = async (consentType: string, currentValue: boolean) => {
    setIsSubmitting(true);
    try {
      if (currentValue) {
        await withdrawConsent(consentType);
      } else {
        await giveConsent(consentType, true);
      }
    } catch (error) {
      console.error('Error toggling consent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Privacy & Consent Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your data privacy preferences. You can change these settings at any time.
          </p>
        </div>

        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Processing (Required):</strong> Essential for account functionality and cannot be disabled.
              <div className="mt-1 text-xs text-muted-foreground">
                Includes: User authentication, profile management, app functionality
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Analytics & Performance</div>
                <div className="text-sm text-muted-foreground">
                  Help us understand how you use the app to improve your experience
                </div>
              </div>
              <Checkbox 
                checked={hasGivenConsent(CONSENT_TYPES.ANALYTICS)}
                onCheckedChange={(checked) => 
                  handleConsentToggle(CONSENT_TYPES.ANALYTICS, hasGivenConsent(CONSENT_TYPES.ANALYTICS))
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Marketing Communications</div>
                <div className="text-sm text-muted-foreground">
                  Receive garden tips, plant care advice, and product updates
                </div>
              </div>
              <Checkbox 
                checked={hasGivenConsent(CONSENT_TYPES.MARKETING)}
                onCheckedChange={(checked) => 
                  handleConsentToggle(CONSENT_TYPES.MARKETING, hasGivenConsent(CONSENT_TYPES.MARKETING))
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get notified about your garden progress and reminders
                </div>
              </div>
              <Checkbox 
                checked={hasGivenConsent(CONSENT_TYPES.NOTIFICATIONS)}
                onCheckedChange={(checked) => 
                  handleConsentToggle(CONSENT_TYPES.NOTIFICATIONS, hasGivenConsent(CONSENT_TYPES.NOTIFICATIONS))
                }
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>For more information about how we handle your data, please read our Privacy Policy.</p>
        </div>
      </CardContent>
    </Card>
  );
};
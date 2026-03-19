import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useConsent, CONSENT_TYPES } from '@/contexts/ConsentContext';
import { X, Shield, Info } from '@/components/icons/lucide-compat';
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
    dismissConsentBanner(); // Close banner immediately
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
    dismissConsentBanner(); // Close banner immediately
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
    dismissConsentBanner(); // Close banner immediately
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Message */}
          <div className="flex items-center gap-3 flex-1">
            <div className="text-2xl">🍪</div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">We use cookies</p>
              <p className="text-gray-600 text-xs leading-tight">
                This site uses essential cookies for functionality and optional cookies for analytics and marketing. 
                <button className="text-blue-600 hover:underline ml-1">Learn more</button>
              </p>
            </div>
          </div>

          {/* Center: Consent Options */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox 
                checked={consents.analytics}
                onCheckedChange={(checked) => 
                  setConsents(prev => ({ ...prev, analytics: !!checked }))
                }
                className="h-3 w-3"
              />
              <span className="text-gray-700">Analytics</span>
            </label>
            
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox 
                checked={consents.marketing}
                onCheckedChange={(checked) => 
                  setConsents(prev => ({ ...prev, marketing: !!checked }))
                }
                className="h-3 w-3"
              />
              <span className="text-gray-700">Marketing</span>
            </label>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcceptSelected}
              disabled={isSubmitting}
              className="text-xs h-8 px-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Accept Selected
            </Button>
            
            <Button
              size="sm"
              onClick={handleAcceptAll}
              disabled={isSubmitting}
              className="text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accept All
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRejectAll}
              disabled={isSubmitting}
              className="text-xs h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              Reject
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={dismissConsentBanner}
              className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
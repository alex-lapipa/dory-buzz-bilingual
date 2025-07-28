import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Heart, Mail, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FollowDoryModalProps {
  children: React.ReactNode;
}

export const FollowDoryModal: React.FC<FollowDoryModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    parentEmail: '',
    age: '',
    isChild: false,
    consent: false,
    parentConsent: false
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive updates from Dory.",
        variant: "destructive"
      });
      return;
    }

    if (formData.isChild && (!formData.parentEmail || !formData.parentConsent)) {
      toast({
        title: "Parent Consent Required",
        description: "For children under 13, we need a parent's email and consent.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('follow-dory', {
        body: {
          name: formData.name,
          email: formData.email,
          parentEmail: formData.parentEmail || null,
          age: formData.age || null,
          isChild: formData.isChild,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: "¡Buzztastical! 🐝✨",
        description: `Welcome to Dory's Beecrazy world, ${formData.name}! You'll receive updates about our garden adventures.`,
      });

      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        parentEmail: '',
        age: '',
        isChild: false,
        consent: false,
        parentConsent: false
      });
    } catch (error) {
      toast({
        title: "Oops! 🐝",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur border-2 border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <div className="text-2xl animate-bee-bounce">🐝</div>
            <span className="bg-gradient-bee bg-clip-text text-transparent">
              Follow Dory's Beecrazy World!
            </span>
            <div className="text-2xl animate-flower-sway">🌻</div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Join our garden adventure and get the latest buzz about Dory's educational content!
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (optional)</Label>
            <Input
              id="age"
              type="number"
              placeholder="How old are you?"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isChild"
              checked={formData.isChild}
              onCheckedChange={(checked) => handleInputChange('isChild', checked as boolean)}
            />
            <Label htmlFor="isChild" className="text-sm">
              I am under 13 years old
            </Label>
          </div>

          {formData.isChild && (
            <div className="space-y-3 p-3 bg-accent/20 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent/Guardian Email *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@email.com"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  required={formData.isChild}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parentConsent"
                  checked={formData.parentConsent}
                  onCheckedChange={(checked) => handleInputChange('parentConsent', checked as boolean)}
                />
                <Label htmlFor="parentConsent" className="text-sm">
                  My parent/guardian agrees to receive updates about Dory's Beecrazy World
                </Label>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm">
              I agree to receive updates about Dory's garden adventures and educational content *
            </Label>
          </div>

          <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
            <p className="mb-1">🍯 <strong>What you'll get:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Garden tips and nature facts from Dory</li>
              <li>• Fun educational activities and comics</li>
              <li>• Seasonal bee and plant updates</li>
              <li>• Early access to new Beecrazy content</li>
            </ul>
            <p className="mt-2 text-xs">
              Your data is safe with us. Unsubscribe anytime. 🐝✨
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                'Joining...'
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-1" />
                  Follow Dory!
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
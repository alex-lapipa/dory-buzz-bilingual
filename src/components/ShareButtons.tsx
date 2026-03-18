import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShareBlossom, InstagramFlower, VideoFlower, CodeVine, TwoLeaves, ButterflyLink } from '@/components/icons';

interface ShareButtonsProps {
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const appUrl = window.location.origin;
  const embedCode = `<iframe src="${appUrl}?embed=true" width="400" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;
  
  const shareText = "🐝✨ Meet Mochi! Chat with our garden bee from BeeCrazy Garden World - perfect for families learning about nature! 🌻";
  
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied! 🐝",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareToInstagram = () => {
    // Instagram doesn't have direct URL sharing, so we'll copy the text
    copyToClipboard(`${shareText}\n\n${appUrl}`, "Instagram post text");
  };

  const shareToTikTok = () => {
    const tiktokUrl = `https://www.tiktok.com/upload?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
    window.open(tiktokUrl, '_blank');
  };

  const openApp = () => {
    window.open(appUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`animate-flower-sway ${className}`}
        >
          <ShareBlossom className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Share</span>
          📱
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <span className="text-xl animate-bee-bounce">🐝</span>
            Share BeeCrazy Garden World!
            <span className="text-xl animate-flower-sway">🌻</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={shareToInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-primary-foreground"
                size="sm"
              >
                <InstagramFlower className="h-4 w-4 mr-2" />
                Instagram
              </Button>
              <Button
                onClick={shareToTikTok}
                className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                size="sm"
              >
                <VideoFlower className="h-4 w-4 mr-2" />
                TikTok
              </Button>
            </div>
          </div>

          {/* Direct Link */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Direct Link</Label>
            <div className="flex gap-2">
              <Input
                value={appUrl}
                readOnly
                className="text-xs"
              />
              <Button
                onClick={() => copyToClipboard(appUrl, "Link")}
                variant="outline"
                size="sm"
              >
                <TwoLeaves className="h-3 w-3" />
              </Button>
              <Button
                onClick={openApp}
                variant="outline"
                size="sm"
              >
                <ButterflyLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Embed Code (Discord, Twitch, Websites)</Label>
            <div className="space-y-2">
              <textarea
                value={embedCode}
                readOnly
                className="w-full p-2 text-xs bg-muted rounded border resize-none h-20"
              />
              <Button
                onClick={() => copyToClipboard(embedCode, "Embed code")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Code className="h-3 w-3 mr-2" />
                Copy Embed Code
              </Button>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-accent/20">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2">Share text preview:</p>
              <p className="text-xs">{shareText}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShareBlossom, InstagramFlower, VideoFlower, CodeVine, TwoLeaves, ButterflyLink } from '@/components/icons';
import "@/styles/mochi-tokens.css";

interface ShareButtonsProps {
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const appUrl = window.location.origin;
  const embedCode = `<iframe src="${appUrl}?embed=true" width="400" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;
  
  const shareText = "🐝✨ Meet Mochi · conoce a Mochi · the garden bee from Mochi de los Huertos. Bilingual nature & permaculture for families! 🌻";
  
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
          <DialogTitle asChild>
            <div className="text-center space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xl animate-bee-bounce" aria-hidden>🐝</span>
                <span
                  style={{
                    fontFamily: "var(--mochi-font-display, 'Fraunces', serif)",
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'hsl(28 35% 18%)',
                  }}
                >
                  Share Mochi
                </span>
                <span className="text-xl animate-flower-sway" aria-hidden>🌻</span>
              </div>
              <p
                style={{
                  fontFamily: "var(--mochi-font-hand, 'Caveat', cursive)",
                  fontSize: '1.05rem',
                  color: 'hsl(28 35% 28%)',
                }}
              >
                · comparte con tus amig@s ·
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h4 className="text-sm" style={{fontFamily: "var(--mochi-font-display, 'Fraunces', serif)", fontWeight: 600, color: 'hsl(28 35% 18%)'}}>Share on Social Media · redes sociales</h4>
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
            <Label className="text-sm" style={{fontFamily: "var(--mochi-font-display, 'Fraunces', serif)", fontWeight: 600, color: 'hsl(28 35% 18%)'}}>Direct Link · enlace directo</Label>
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
            <Label className="text-sm" style={{fontFamily: "var(--mochi-font-display, 'Fraunces', serif)", fontWeight: 600, color: 'hsl(28 35% 18%)'}}>Embed Code · código incrustado <span className="text-xs font-normal text-muted-foreground">(Discord, Twitch, Websites)</span></Label>
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
                <CodeVine className="h-3 w-3 mr-2" />
                Copy Embed Code
              </Button>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-accent/20">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2" style={{fontFamily: "var(--mochi-font-hand, 'Caveat', cursive)", fontSize: '0.95rem'}}>Share text preview · vista previa</p>
              <p className="text-xs">{shareText}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
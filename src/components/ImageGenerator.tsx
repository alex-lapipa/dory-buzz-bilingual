import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Image, Video, Download } from '@/components/icons/lucide-compat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getGuestUserId } from '@/lib/guestUtils';
import "@/styles/mochi-tokens.css";

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('A beautiful garden with colorful flowers and friendly bees');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('image');
  const { toast } = useToast();

  const generateContent = async (type: 'image' | 'video') => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const userId = getGuestUserId();
      
      const { data, error } = await supabase.functions.invoke('unified_image_generator', {
        body: {
          prompt: prompt.trim(),
          type: type,
          user_id: userId
        },
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: "Success!",
        description: `${type === 'image' ? 'Image' : 'Video'} generated successfully!`,
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to generate ${type}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadContent = () => {
    if (!result) return;

    if (result.type === 'image') {
      const link = document.createElement('a');
      link.href = result.data;
      link.download = `mochi-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.type === 'video') {
      window.open(result.url, '_blank');
    }
  };

  return (
    <Card
      className="w-full max-w-2xl mx-auto"
      style={{
        borderRadius: 'var(--mochi-r-lg, 28px)',
        border: '1px solid hsl(40 92% 56% / 0.18)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 32px -12px rgba(43,29,11,0.16)',
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt=""
            width={44}
            height={44}
            style={{ filter: 'drop-shadow(0 4px 10px rgba(43,29,11,0.18))' }}
          />
          <div className="min-w-0">
            <CardTitle
              style={{
                fontFamily: "var(--mochi-font-display, 'Fraunces', serif)",
                fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'hsl(28 35% 18%)',
                lineHeight: 1.2,
              }}
            >
              AI Content Creator
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '0.65em',
                  color: 'hsl(35 78% 38%)',
                  marginLeft: 6,
                }}
              >
                · with Mochi
              </em>
            </CardTitle>
            <p
              style={{
                fontFamily: "var(--mochi-font-hand, 'Caveat', cursive)",
                fontSize: '1rem',
                color: 'hsl(35 78% 38%)',
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              · crea imágenes y videos del huerto ·
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Create beautiful garden images and videos using AI. Describe what you'd like to see and I'll create it for you.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Image (DALL-E)
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video (Sora)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Try: 'A magical garden with rainbow flowers and happy bees flying around'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="text-muted-foreground">💡 Ideas:</span>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setPrompt("A cozy cottage garden with sunflowers and butterflies")}
                >
                  cottage garden
                </button>
                <span>•</span>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setPrompt("Mochi the bee exploring a tropical garden paradise")}
                >
                  tropical paradise
                </button>
                <span>•</span>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setPrompt("A vegetable garden at sunrise with morning dew")}
                >
                  vegetable garden
                </button>
              </div>
              <Button 
                onClick={() => generateContent('image')} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Try: 'A time-lapse of flowers blooming in a magical garden'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="text-muted-foreground">💡 Ideas:</span>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setPrompt("Bees collecting nectar from colorful wildflowers in slow motion")}
                >
                  bees & flowers
                </button>
                <span>•</span>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setPrompt("A garden transforming through all four seasons")}
                >
                  four seasons
                </button>
              </div>
              <Button 
                onClick={() => generateContent('video')} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">
                  {result.type === 'image' ? 'Image' : 'Video'} Generated
                </Badge>
                <Button size="sm" onClick={downloadContent}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              {result.type === 'image' ? (
                <img 
                  src={result.data} 
                  alt="Generated image" 
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <video 
                  src={result.url} 
                  controls 
                  className="w-full rounded-lg shadow-lg"
                  autoPlay
                  loop
                />
              )}
              
              <div className="mt-2 text-xs text-muted-foreground">
                Model: {result.model}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
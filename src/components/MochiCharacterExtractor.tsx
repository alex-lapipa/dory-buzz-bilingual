import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMochiAssets } from '@/hooks/useMochiAssets';
import { toast } from 'sonner';
import { Loader2, Video, Upload } from 'lucide-react';

export const MochiCharacterExtractor: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const { extractMochiFromVideo, loading, assets } = useMochiAssets();

  const handleExtractCharacter = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please provide a video URL');
      return;
    }

    try {
      await extractMochiFromVideo(videoUrl);
      toast.success('Mochi character extracted successfully!');
      setVideoUrl('');
    } catch (error) {
      toast.error('Failed to extract Mochi character');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Extract Mochi Character from Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter video URL with Mochi the bee..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleExtractCharacter} disabled={loading || !videoUrl.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Extract
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Provide a video URL containing Mochi the bee character. The AI will extract frames, 
            remove backgrounds, and create character assets for use in the chat.
          </p>
        </CardContent>
      </Card>

      {assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Mochi Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="text-center space-y-2">
                  {asset.file_url && (
                    <img
                      src={asset.file_url}
                      alt={`Mochi ${asset.asset_type}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  )}
                  <p className="text-xs text-muted-foreground capitalize">
                    {asset.asset_type}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
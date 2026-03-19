import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { LazyVideo } from '@/components/LazyVideo';

const MochiVideo = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="w-full mt-6 card-nature">
      <CardContent className="p-4">
        <div className="relative">
          <LazyVideo
            src="https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1MzkzNTEwMCwiZXhwIjoyMDY5Mjk1MTAwfQ.vLjp9qFMamfqwfkiO3cCSS8_Ge3V6wVDcfubRCfMlFw"
            autoPlay={true}
            loop={true}
            muted={true}
            className="w-full h-auto rounded-lg shadow-lg opacity-75"
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
              🐝 Meet Mochi the Bee!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MochiVideo;
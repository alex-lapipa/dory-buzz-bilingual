import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

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
    <div className="w-full mt-6">
      <div className="p-4 bg-transparent">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            className="w-full h-auto rounded-lg shadow-lg opacity-75 cursor-pointer hover:opacity-90 transition-opacity"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={() => window.open('https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1MzkzNTEwMCwiZXhwIjoyMDY5Mjk1MTAwfQ.vLjp9qFMamfqwfkiO3cCSS8_Ge3V6wVDcfubRCfMlFw', '_blank')}
          >
            <source 
              src="https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1MzkzNTEwMCwiZXhwIjoyMDY5Mjk1MTAwfQ.vLjp9qFMamfqwfkiO3cCSS8_Ge3V6wVDcfubRCfMlFw" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          
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
      </div>
    </div>
  );
};

export default MochiVideo;
import React, { useEffect, useState } from 'react';
import { useMochiAssets } from '@/hooks/useMochiAssets';
import { toast } from 'sonner';

export const MochiVideoProcessor: React.FC = () => {
  const { extractMochiFromVideo, assets } = useMochiAssets();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Only process if we haven't done it before and don't have any assets
    const processVideo = async () => {
      const alreadyProcessed = localStorage.getItem('mochi_character_processed');
      
      if (alreadyProcessed || hasProcessed || assets.length > 0) {
        return;
      }

      setHasProcessed(true);
      
      const videoUrl = "https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1Mzg0Nzc3MSwiZXhwIjoxNzg1MzgzNzcxfQ.j3lrTKWdS6URzbygzYlLmBu2LIW3OkgR-o2iCacCH14";
      
      try {
        console.log('🐝 Processing Mochi character from video...');
        await extractMochiFromVideo(videoUrl);
        localStorage.setItem('mochi_character_processed', 'true');
        toast.success('🐝 Mochi character successfully extracted and ready for use!');
      } catch (error) {
        console.error('Failed to extract Mochi character:', error);
        // Don't show error toast as it might be due to missing API keys
        console.log('⚠️ Mochi character extraction skipped - using default emoji');
      }
    };

    // Small delay to ensure other components are loaded
    const timer = setTimeout(processVideo, 2000);
    return () => clearTimeout(timer);
  }, [extractMochiFromVideo, assets, hasProcessed]);

  return null; // This is an invisible processor component
};
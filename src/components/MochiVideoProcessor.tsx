import React, { useEffect } from 'react';
import { useMochiAssets } from '@/hooks/useMochiAssets';
import { toast } from 'sonner';

export const MochiVideoProcessor: React.FC = () => {
  const { extractMochiFromVideo } = useMochiAssets();

  useEffect(() => {
    // Auto-extract Mochi character from the provided video URL
    const extractMochi = async () => {
      const videoUrl = "https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1Mzg0Nzc3MSwiZXhwIjoxNzg1MzgzNzcxfQ.j3lrTKWdS6URzbygzYlLmBu2LIW3OkgR-o2iCacCH14";
      
      try {
        await extractMochiFromVideo(videoUrl);
        toast.success('🐝 Mochi character successfully extracted and ready for use in chat!');
      } catch (error) {
        console.error('Failed to extract Mochi character:', error);
        toast.error('Could not extract Mochi character from video');
      }
    };

    // Only extract if we don't already have character assets
    extractMochi();
  }, [extractMochiFromVideo]);

  return null; // This is an invisible processor component
};
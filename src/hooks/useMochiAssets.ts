import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MochiAsset {
  id: string;
  asset_type: string;
  file_path: string;
  file_url: string | null;
  metadata: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMochiAssets = () => {
  const [assets, setAssets] = useState<MochiAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMochiAssets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mochi_assets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading Mochi assets:', error);
      } else {
        setAssets(data || []);
      }
    } catch (error) {
      console.error('Error loading Mochi assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractMochiFromVideo = async (videoUrl: string) => {
    setLoading(true);
    try {
      console.log('🐝 Attempting to extract Mochi character...');
      
      const { data, error } = await supabase.functions.invoke('extract_mochi_character', {
        body: { videoUrl }
      });

      if (error) {
        console.error('Error extracting Mochi character:', error);
        // For now, just log the error instead of throwing
        console.log('🐝 Using fallback - Mochi will appear as emoji in chat');
        return null;
      }

      console.log('🐝 Mochi character extraction result:', data);

      // Reload assets to include the new one
      await loadMochiAssets();
      
      return data;
    } catch (error) {
      console.error('Error extracting Mochi character:', error);
      console.log('🐝 Using fallback - Mochi will appear as emoji in chat');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMochiCharacterAsset = () => {
    return assets.find(asset => asset.asset_type === 'character');
  };

  useEffect(() => {
    loadMochiAssets();
  }, []);

  return {
    assets,
    loading,
    extractMochiFromVideo,
    loadMochiAssets,
    getMochiCharacterAsset
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AudioVariation {
  id: string;
  file_path: string;
  title: string;
  variation: string;
}

const DEFAULT_AUDIO = '/audio/mochis_playful_day.mp3';

export const useBuzzyBeesAudio = () => {
  const [variations, setVariations] = useState<AudioVariation[]>([]);
  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('mochi_assets')
          .select('id, file_path, metadata')
          .eq('asset_type', 'audio_theme')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const mapped = data
            .filter((d) => {
              const meta = d.metadata as Record<string, unknown> | null;
              return meta?.context === 'buzzy_bees';
            })
            .map((d) => {
              const meta = d.metadata as Record<string, unknown>;
              return {
                id: d.id,
                file_path: d.file_path,
                title: (meta?.title as string) ?? 'Variation',
                variation: (meta?.variation as string) ?? 'unknown',
              };
            });
          // Shuffle initially
          setVariations(mapped.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error('Failed to load buzzy bees audio variations:', err);
      }
    };
    load();
  }, []);

  /** Returns the next audio source, cycling through variations. Falls back to default. */
  const getNextAudioSrc = (): string => {
    if (variations.length === 0) return DEFAULT_AUDIO;
    const src = variations[playIndex % variations.length].file_path;
    setPlayIndex((i) => i + 1);
    return src;
  };

  /** Returns a random audio source from available variations. */
  const getRandomAudioSrc = (): string => {
    if (variations.length === 0) return DEFAULT_AUDIO;
    const idx = Math.floor(Math.random() * variations.length);
    return variations[idx].file_path;
  };

  return { variations, getNextAudioSrc, getRandomAudioSrc, defaultAudio: DEFAULT_AUDIO };
};

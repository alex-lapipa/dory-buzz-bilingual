import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AudioVariation {
  id: string;
  file_path: string;
  title: string;
  variation: string;
}

const DEFAULT_AUDIO = '/audio/mochis_playful_day.mp3';

/** Local audio files shipped with the app — used as fallback when DB has no entries */
const LOCAL_VARIATIONS = [
  '/audio/mochis_playful_day.mp3',
  '/audio/mochis_playful_day_v1.mp3',
  '/audio/mochis_playful_day_v2.mp3',
  '/audio/mochis_playful_day_v3.mp3',
  '/audio/mochis_playful_day_v4.mp3',
  '/audio/mochis_playful_day_v5.mp3',
  '/audio/mochis_playful_day_fav6.mp3',
];

export const useBuzzyBeesAudio = () => {
  const [variations, setVariations] = useState<AudioVariation[]>([]);
  const playIndexRef = useRef(0);
  const [currentMix, setCurrentMix] = useState<{ index: number; total: number } | null>(null);

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
          if (mapped.length > 0) {
            // Shuffle initially
            setVariations(mapped.sort(() => Math.random() - 0.5));
          }
        }
      } catch (err) {
        console.error('Failed to load buzzy bees audio variations:', err);
      }
    };
    load();
  }, []);

  /** Returns the next audio source, cycling through DB variations or local files. */
  const getNextAudioSrc = useCallback((): string => {
    if (variations.length > 0) {
      const src = variations[playIndexRef.current % variations.length].file_path;
      playIndexRef.current += 1;
      return src;
    }
    // Fallback: cycle through local files
    const src = LOCAL_VARIATIONS[playIndexRef.current % LOCAL_VARIATIONS.length];
    playIndexRef.current += 1;
    return src;
  }, [variations]);

  /** Returns a random audio source from DB variations or local files. */
  const getRandomAudioSrc = useCallback((): string => {
    if (variations.length > 0) {
      const idx = Math.floor(Math.random() * variations.length);
      return variations[idx].file_path;
    }
    // Fallback: pick random local file
    const idx = Math.floor(Math.random() * LOCAL_VARIATIONS.length);
    return LOCAL_VARIATIONS[idx];
  }, [variations]);

  return { variations, getNextAudioSrc, getRandomAudioSrc, defaultAudio: DEFAULT_AUDIO };
};

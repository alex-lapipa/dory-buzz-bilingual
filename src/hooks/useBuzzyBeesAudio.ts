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
export const LOCAL_VARIATIONS = [
  { path: '/audio/mochis_playful_day.mp3', label: 'Original' },
  { path: '/audio/mochis_playful_day_v1.mp3', label: 'Version 1' },
  { path: '/audio/mochis_playful_day_v2.mp3', label: 'Version 2' },
  { path: '/audio/mochis_playful_day_v3.mp3', label: 'Version 3' },
  { path: '/audio/mochis_playful_day_v4.mp3', label: 'Version 4' },
  { path: '/audio/mochis_playful_day_v5.mp3', label: 'Version 5' },
  { path: '/audio/mochis_playful_day_fav6.mp3', label: 'Favorite 6' },
];

const FAVORITE_KEY = 'buzzy_bees_favorite_mix';

export const useBuzzyBeesAudio = () => {
  const [variations, setVariations] = useState<AudioVariation[]>([]);
  const playIndexRef = useRef(0);
  const [currentMix, setCurrentMix] = useState<{ index: number; total: number } | null>(null);
  const [favoriteIndex, setFavoriteIndex] = useState<number | null>(() => {
    const saved = localStorage.getItem(FAVORITE_KEY);
    return saved !== null ? parseInt(saved, 10) : null;
  });

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
            setVariations(mapped.sort(() => Math.random() - 0.5));
          }
        }
      } catch (err) {
        console.error('Failed to load buzzy bees audio variations:', err);
      }
    };
    load();
  }, []);

  const allPaths = variations.length > 0
    ? variations.map((v) => v.file_path)
    : LOCAL_VARIATIONS.map((v) => v.path);

  const totalMixes = allPaths.length;

  /** Returns the next audio source, cycling through DB variations or local files. */
  const getNextAudioSrc = useCallback((): string => {
    // If parent set a favorite, always use it
    if (favoriteIndex !== null && favoriteIndex >= 0 && favoriteIndex < totalMixes) {
      setCurrentMix({ index: favoriteIndex + 1, total: totalMixes });
      return allPaths[favoriteIndex];
    }
    const idx = playIndexRef.current % totalMixes;
    const src = allPaths[idx];
    playIndexRef.current += 1;
    setCurrentMix({ index: idx + 1, total: totalMixes });
    return src;
  }, [allPaths, totalMixes, favoriteIndex]);

  /** Returns a random audio source from DB variations or local files. */
  const getRandomAudioSrc = useCallback((): string => {
    // If parent set a favorite, always use it
    if (favoriteIndex !== null && favoriteIndex >= 0 && favoriteIndex < totalMixes) {
      setCurrentMix({ index: favoriteIndex + 1, total: totalMixes });
      return allPaths[favoriteIndex];
    }
    const idx = Math.floor(Math.random() * totalMixes);
    setCurrentMix({ index: idx + 1, total: totalMixes });
    return allPaths[idx];
  }, [allPaths, totalMixes, favoriteIndex]);

  const clearCurrentMix = useCallback(() => setCurrentMix(null), []);

  /** Set a favorite version (0-indexed) or null to clear */
  const setFavorite = useCallback((index: number | null) => {
    setFavoriteIndex(index);
    if (index !== null) {
      localStorage.setItem(FAVORITE_KEY, String(index));
    } else {
      localStorage.removeItem(FAVORITE_KEY);
    }
  }, []);

  return {
    variations,
    getNextAudioSrc,
    getRandomAudioSrc,
    currentMix,
    clearCurrentMix,
    defaultAudio: DEFAULT_AUDIO,
    favoriteIndex,
    setFavorite,
    totalMixes,
  };
};

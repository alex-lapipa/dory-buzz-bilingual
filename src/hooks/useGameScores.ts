import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GameScore {
  game_id: string;
  score: number;
  high_score: number;
  play_count: number;
  last_played_at: string;
}

export const useGameScores = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<Record<string, GameScore>>({});
  const [loading, setLoading] = useState(false);

  const loadScores = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('game_id, score, high_score, play_count, last_played_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const map: Record<string, GameScore> = {};
      (data || []).forEach((row: any) => {
        map[row.game_id] = row;
      });
      setScores(map);
    } catch (err) {
      console.error('Error loading game scores:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  const saveScore = useCallback(async (gameId: string, newScore: number) => {
    if (!user) return;

    const existing = scores[gameId];
    const highScore = Math.max(newScore, existing?.high_score || 0);
    const playCount = (existing?.play_count || 0) + 1;

    try {
      const { error } = await supabase
        .from('game_scores')
        .upsert({
          user_id: user.id,
          game_id: gameId,
          score: newScore,
          high_score: highScore,
          play_count: playCount,
          last_played_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,game_id' });

      if (error) throw error;

      setScores(prev => ({
        ...prev,
        [gameId]: {
          game_id: gameId,
          score: newScore,
          high_score: highScore,
          play_count: playCount,
          last_played_at: new Date().toISOString(),
        }
      }));
    } catch (err) {
      console.error('Error saving game score:', err);
    }
  }, [user, scores]);

  const getHighScore = (gameId: string) => scores[gameId]?.high_score || 0;
  const getPlayCount = (gameId: string) => scores[gameId]?.play_count || 0;
  const isCompleted = (gameId: string) => (scores[gameId]?.play_count || 0) > 0;
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s.high_score, 0);
  const completedCount = Object.values(scores).filter(s => s.play_count > 0).length;

  return {
    scores,
    loading,
    saveScore,
    getHighScore,
    getPlayCount,
    isCompleted,
    totalScore,
    completedCount,
    loadScores,
  };
};

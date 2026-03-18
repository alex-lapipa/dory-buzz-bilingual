import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_high_score: number;
  games_completed: number;
  rank: number;
}

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get aggregated scores per user
      const { data: scoreData, error: scoreError } = await supabase
        .from('game_scores')
        .select('user_id, high_score, play_count');

      if (scoreError) throw scoreError;

      // Aggregate by user
      const userMap: Record<string, { total: number; completed: number }> = {};
      (scoreData || []).forEach((row: any) => {
        if (!userMap[row.user_id]) {
          userMap[row.user_id] = { total: 0, completed: 0 };
        }
        userMap[row.user_id].total += row.high_score || 0;
        if (row.play_count > 0) userMap[row.user_id].completed += 1;
      });

      const userIds = Object.keys(userMap);
      if (userIds.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Get display names from profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', userIds);

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach((p: any) => {
        profileMap[p.id] = p.display_name || p.username || 'Anonymous Bee';
      });

      // Build and sort leaderboard
      const board: LeaderboardEntry[] = userIds
        .map((uid) => ({
          user_id: uid,
          display_name: profileMap[uid] || 'Anonymous Bee',
          total_high_score: userMap[uid].total,
          games_completed: userMap[uid].completed,
          rank: 0,
        }))
        .sort((a, b) => b.total_high_score - a.total_high_score)
        .slice(0, 10)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));

      setEntries(board);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary/10 border-primary/30';
    switch (rank) {
      case 1: return 'bg-yellow-50 border-yellow-200';
      case 2: return 'bg-gray-50 border-gray-200';
      case 3: return 'bg-amber-50 border-amber-200';
      default: return 'bg-background border-border';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Trophy className="h-5 w-5" />
          {language === 'es' ? '🏆 Tabla de Líderes' : '🏆 Leaderboard'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {language === 'es'
                ? 'Sé el primero en jugar y aparecer aquí!'
                : 'Be the first to play and appear here!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isCurrentUser = entry.user_id === user?.id;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${getRankBg(entry.rank, isCurrentUser)}`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {entry.display_name}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {language === 'es' ? 'Tú' : 'You'}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.games_completed}/10 {language === 'es' ? 'juegos' : 'games'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-700">{entry.total_high_score.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

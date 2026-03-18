
CREATE POLICY "Authenticated users can view all scores for leaderboard"
  ON public.game_scores FOR SELECT
  TO authenticated
  USING (true);


-- Add INSERT and UPDATE policies for bee_facts (service_role and public insert for edge functions)
CREATE POLICY "service_insert_bee_facts" ON public.bee_facts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "service_update_bee_facts" ON public.bee_facts FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Add INSERT and UPDATE policies for vocabulary_cards
CREATE POLICY "service_insert_vocabulary_cards" ON public.vocabulary_cards FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "service_update_vocabulary_cards" ON public.vocabulary_cards FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Add UPDATE policy for mochi_knowledge_base (INSERT already exists)
CREATE POLICY "service_update_knowledge_base" ON public.mochi_knowledge_base FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Create conversations table for storing chat history
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create bee_learning_progress table for tracking educational progress
CREATE TABLE public.bee_learning_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  topic TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bee learning progress
ALTER TABLE public.bee_learning_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for learning progress
CREATE POLICY "Users can view their own progress" 
ON public.bee_learning_progress 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own progress" 
ON public.bee_learning_progress 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create bee_facts table for educational content
CREATE TABLE public.bee_facts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  fun_fact BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bee facts (public reading)
ALTER TABLE public.bee_facts ENABLE ROW LEVEL SECURITY;

-- Create policy for reading bee facts (public)
CREATE POLICY "Everyone can read bee facts" 
ON public.bee_facts 
FOR SELECT 
USING (true);

-- Insert some initial bee facts
INSERT INTO public.bee_facts (title, content, category, difficulty_level, fun_fact) VALUES
('Bee Communication', 'Bees communicate through a waggle dance! When a worker bee finds a good source of nectar, she returns to the hive and performs a special dance that tells other bees the direction and distance to the flowers.', 'Communication', 1, true),
('Bee Vision', 'Bees can see ultraviolet light! This helps them find nectar guides on flowers that are invisible to human eyes. They see the world very differently than we do.', 'Biology', 2, true),
('Bee Colonies', 'A single bee colony can contain up to 80,000 bees during peak season! The colony works together as a superorganism, with each bee having a specific role.', 'Social Structure', 2, false),
('Pollination Power', 'Bees are responsible for pollinating about 1/3 of everything we eat! Without bees, we would not have many fruits, vegetables, and nuts.', 'Environment', 1, true),
('Bee Products', 'Bees produce more than just honey! They also make beeswax, propolis (bee glue), royal jelly, and pollen. Each product has different uses in the hive.', 'Products', 2, false),
('Worker Bee Lifespan', 'Worker bees live about 6 weeks during busy season, but can live several months during winter. They literally work themselves to exhaustion!', 'Biology', 2, true),
('Queen Bee Facts', 'A queen bee can live 2-5 years and lay up to 2,000 eggs per day! She is the mother of the entire colony.', 'Social Structure', 2, true),
('Bee Flight', 'Bees beat their wings 230 times per second, creating their characteristic buzz. Despite their small wings, they can fly up to 15 mph!', 'Biology', 1, true);

-- Create trigger to update last_activity
CREATE OR REPLACE FUNCTION update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bee_learning_progress_activity
BEFORE UPDATE ON public.bee_learning_progress
FOR EACH ROW
EXECUTE FUNCTION update_last_activity();
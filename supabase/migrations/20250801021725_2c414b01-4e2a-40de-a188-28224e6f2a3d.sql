-- Create optimized voice conversation storage
CREATE TABLE IF NOT EXISTS public.voice_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  conversation_data JSONB NOT NULL DEFAULT '{}',
  voice_settings JSONB DEFAULT '{
    "voice": "alloy",
    "speed": 1.0,
    "pitch": 1.0,
    "humor_level": "high",
    "personality": "cheerful_bee"
  }',
  total_messages INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for voice conversations
ALTER TABLE public.voice_conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for voice conversations
CREATE POLICY "Users can view their own voice conversations"
  ON public.voice_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice conversations"
  ON public.voice_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice conversations"
  ON public.voice_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice conversations"
  ON public.voice_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update conversation metadata
CREATE OR REPLACE FUNCTION public.update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_interaction_at = now();
  
  -- Update message count from JSONB data
  NEW.total_messages = COALESCE(
    jsonb_array_length(NEW.conversation_data->'messages'), 
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stats updates
CREATE TRIGGER update_voice_conversation_stats
  BEFORE UPDATE ON public.voice_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_stats();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_conversations_user_id 
  ON public.voice_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_conversations_session_id 
  ON public.voice_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_conversations_last_interaction 
  ON public.voice_conversations(last_interaction_at DESC);
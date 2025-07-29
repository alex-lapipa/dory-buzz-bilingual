import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Star, Award, Lightbulb, Volume2, Brain, Mic, Camera } from 'lucide-react';

interface BeeFact {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: number;
  fun_fact: boolean;
  image_url?: string;
}

interface LearningProgress {
  id: string;
  topic: string;
  level: number;
  completed_lessons: string[];
}

export const BeeEducationHub: React.FC = () => {
  const [beeFacts, setBeeFacts] = useState<BeeFact[]>([]);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentFact, setCurrentFact] = useState<BeeFact | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBeeEducationData();
  }, []);

  const loadBeeEducationData = async () => {
    try {
      // Load bee facts
      const { data: factsData, error: factsError } = await supabase
        .from('bee_facts')
        .select('*')
        .order('difficulty_level', { ascending: true });

      if (factsError) throw factsError;
      setBeeFacts(factsData || []);

      // Load user progress
      const { data: progressData, error: progressError } = await supabase
        .from('bee_learning_progress')
        .select('*');

      if (!progressError && progressData) {
        setProgress(progressData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading bee education data:', error);
      toast({
        title: "Error",
        description: "Failed to load bee education content",
        variant: "destructive"
      });
    }
  };

  const markLessonComplete = async (factId: string, category: string) => {
    try {
      const existingProgress = progress.find(p => p.topic === category);
      
      if (existingProgress) {
        const updatedLessons = [...existingProgress.completed_lessons, factId];
        const { error } = await supabase
          .from('bee_learning_progress')
          .update({ 
            completed_lessons: updatedLessons,
            level: Math.min(existingProgress.level + 1, 10)
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bee_learning_progress')
          .insert({
            topic: category,
            level: 1,
            completed_lessons: [factId]
          });

        if (error) throw error;
      }

      await loadBeeEducationData();
      toast({
        title: "Great Job! 🐝",
        description: "Lesson completed! You're becoming a bee expert!",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const speakFact = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: `🐝 Bee Fact: ${text}`,
          voice_id: "9BWtsMINqrJLrRacOk9x" // Aria voice
        }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
      
      toast({
        title: "🔊 Now Playing",
        description: "Listen to this bee fact!",
      });
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        title: "Error",
        description: "Failed to generate speech",
        variant: "destructive"
      });
    }
  };

  const getAdvancedAnalysis = async (fact: BeeFact) => {
    try {
      const { data, error } = await supabase.functions.invoke('claude_reasoning', {
        body: { 
          prompt: `As a bee education expert, provide detailed analysis about this bee fact: "${fact.title}: ${fact.content}". Include scientific explanations, fun connections, and educational insights that would help someone understand bees better.`,
          reasoning_type: "educational"
        }
      });

      if (error) throw error;
      
      toast({
        title: "🧠 Advanced Analysis",
        description: "Claude-4 analysis complete! Check the detailed explanation.",
      });

      return data.response;
    } catch (error) {
      console.error('Claude analysis error:', error);
      return null;
    }
  };

  const generateBeeImage = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced_image_generation', {
        body: { 
          prompt: `Beautiful, educational illustration of ${prompt} in a garden setting, child-friendly, colorful, detailed`,
          model: "gpt-image-1",
          quality: "high"
        }
      });

      if (error) throw error;
      
      toast({
        title: "🎨 Image Generated!",
        description: "Check out this beautiful bee illustration!",
      });

      return data.image;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  };

  const categories = ['all', ...new Set(beeFacts.map(fact => fact.category))];
  const filteredFacts = selectedCategory === 'all' 
    ? beeFacts 
    : beeFacts.filter(fact => fact.category === selectedCategory);

  const getProgressForCategory = (category: string) => {
    const categoryProgress = progress.find(p => p.topic === category);
    const categoryFacts = beeFacts.filter(f => f.category === category);
    const completed = categoryProgress?.completed_lessons.length || 0;
    const total = categoryFacts.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl animate-bee-bounce mb-4">🐝</div>
          <p>Loading bee education content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <span className="animate-bee-bounce">🐝</span>
          Bee Education Hub
          <span className="animate-flower-sway">🌻</span>
        </h1>
        <p className="text-muted-foreground">Learn amazing facts about bees with advanced AI assistance!</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.filter(cat => cat !== 'all').map(category => {
              const categoryProgress = getProgressForCategory(category);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <Badge variant="secondary">
                      {categoryProgress.completed}/{categoryProgress.total}
                    </Badge>
                  </div>
                  <Progress value={categoryProgress.percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Topics' : category}
          </Button>
        ))}
      </div>

      {/* Bee Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacts.map((fact) => {
          const categoryProgress = progress.find(p => p.topic === fact.category);
          const isCompleted = categoryProgress?.completed_lessons.includes(fact.id) || false;
          
          return (
            <Card key={fact.id} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {fact.fun_fact && <Star className="h-4 w-4 text-yellow-500" />}
                    {fact.title}
                  </CardTitle>
                  <Badge variant={isCompleted ? "default" : "secondary"}>
                    Level {fact.difficulty_level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{fact.content}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => speakFact(fact.content)}
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Listen
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const analysis = await getAdvancedAnalysis(fact);
                      if (analysis) {
                        setCurrentFact({ ...fact, content: analysis });
                      }
                    }}
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const image = await generateBeeImage(fact.title);
                      if (image) {
                        // Could show in a modal or save to fact
                        console.log('Generated image:', image);
                      }
                    }}
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Visualize
                  </Button>
                </div>
                
                {!isCompleted && (
                  <Button
                    className="w-full"
                    onClick={() => markLessonComplete(fact.id, fact.category)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Mark as Learned
                  </Button>
                )}
                
                {isCompleted && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fun Learning Tips */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Lightbulb className="h-5 w-5" />
            Bee Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <ul className="space-y-2 text-sm">
            <li>🎧 <strong>Listen to facts</strong> - Use the voice feature to hear bee facts aloud!</li>
            <li>🧠 <strong>Get deep analysis</strong> - Click "Analyze" for detailed scientific explanations</li>
            <li>🎨 <strong>Visualize concepts</strong> - Generate beautiful illustrations of bee topics</li>
            <li>📚 <strong>Track progress</strong> - Complete lessons to unlock advanced topics</li>
            <li>🗣️ <strong>Ask Mochi</strong> - Chat with our bee expert for personalized learning!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { BookOpen, Star, Award, Lightbulb, Volume2, Brain, Camera, GraduationCap } from 'lucide-react';

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

const LearningHub: React.FC = () => {
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
      <PageLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl animate-bee-bounce mb-4">🐝</div>
            <p>Loading bee education content...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <span className="animate-bee-bounce">🐝</span>
            Learning Hub
            <span className="animate-flower-sway">🌻</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing facts about bees and gardening with AI-powered learning tools! 
            Choose your learning adventure below.
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-yellow-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 group"
            onClick={() => window.location.href = '/learning/bee-basics'}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-800">
                <span className="text-4xl group-hover:animate-bounce">🐝</span>
                Bee Basics
                <Badge className="bg-yellow-500 text-yellow-900 ml-auto">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-700 line-clamp-2">
                Discover bee anatomy, behavior, and their crucial role in pollination. Learn fascinating facts about these amazing creatures!
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Beginner</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Interactive</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">AI-Powered</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-yellow-600">
                  <span>Progress</span>
                  <span>15 lessons</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 group"
            onClick={() => window.location.href = '/learning/garden-basics'}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <span className="text-4xl group-hover:animate-pulse">🌱</span>
                Garden Basics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700 line-clamp-2">
                Learn how plants grow, what they need to thrive, and how to start your own garden. Perfect for budding botanists!
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Beginner</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Hands-On</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Practical</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-green-600">
                  <span>Progress</span>
                  <span>12 lessons</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 group"
            onClick={() => {
              toast({
                title: "🌸 Coming Soon!",
                description: "Pollination adventures are being prepared with interactive AR experiences!",
              });
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <span className="text-4xl group-hover:animate-bounce">🌸</span>
                Pollination Adventures
                <Badge variant="outline" className="text-xs border-purple-300 text-purple-600 ml-auto">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-700 line-clamp-2">
                Follow pollen on its incredible journey! Experience how flowers and bees work together in this interactive adventure.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Interactive</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Adventure</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">AR Ready</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-purple-600">
                  <span>Progress</span>
                  <span>18 lessons</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 group"
            onClick={() => {
              toast({
                title: "🌍 Coming Soon!",
                description: "Ecosystem exploration with virtual field trips is being developed!",
              });
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <span className="text-4xl group-hover:animate-spin-slow">🌍</span>
                Ecosystem Explorer
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-600 ml-auto">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-700 line-clamp-2">
                Explore complex ecosystems and discover how all living things are connected in the web of life.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Advanced</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Discovery</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Virtual Tours</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Progress</span>
                  <span>20 lessons</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-orange-200 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 group"
            onClick={() => {
              toast({
                title: "🍯 Coming Soon!",
                description: "Beekeeping basics course is being prepared!",
              });
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-800">
                <span className="text-4xl group-hover:animate-bounce">🍯</span>
                Beekeeping Basics
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-600 ml-auto">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-orange-700 line-clamp-2">
                Learn the fundamentals of responsible beekeeping and how to care for these important pollinators.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">Intermediate</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">Practical</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">Expert Tips</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Progress</span>
                  <span>25 lessons</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="h-64 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-teal-200 bg-gradient-to-br from-teal-50 via-green-50 to-teal-100 group"
            onClick={() => {
              toast({
                title: "🌿 Coming Soon!",
                description: "Conservation heroes program is launching soon!",
              });
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-teal-800">
                <span className="text-4xl group-hover:animate-pulse">🌿</span>
                Conservation Heroes
                <Badge variant="outline" className="text-xs border-teal-300 text-teal-600 ml-auto">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-teal-700 line-clamp-2">
                Become a conservation hero! Learn how to protect bees, plants, and the environment in your community.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">Action-Oriented</Badge>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">Community</Badge>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">Impact</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-teal-600">
                  <span>Progress</span>
                  <span>16 lessons</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
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
                      <span className="text-sm font-medium capitalize">{category}</span>
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
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? '🌍 All Topics' : `🌱 ${category}`}
            </Button>
          ))}
        </div>

        {/* Bee Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacts.map((fact) => {
            const categoryProgress = progress.find(p => p.topic === fact.category);
            const isCompleted = categoryProgress?.completed_lessons.includes(fact.id) || false;
            
            return (
              <Card key={fact.id} className="relative group hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                  <p className="text-sm text-muted-foreground leading-relaxed">{fact.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => speakFact(fact.content)}
                      className="text-xs"
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
                      className="text-xs"
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
                          console.log('Generated image:', image);
                        }
                      }}
                      className="text-xs"
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
                    <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
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
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>🎧</span>
                <div><strong>Listen to facts</strong> - Use the voice feature to hear bee facts aloud!</div>
              </li>
              <li className="flex items-start gap-2">
                <span>🧠</span>
                <div><strong>Get deep analysis</strong> - Click "Analyze" for detailed scientific explanations</div>
              </li>
              <li className="flex items-start gap-2">
                <span>🎨</span>
                <div><strong>Visualize concepts</strong> - Generate beautiful illustrations of bee topics</div>
              </li>
              <li className="flex items-start gap-2">
                <span>📚</span>
                <div><strong>Track progress</strong> - Complete lessons to unlock advanced topics</div>
              </li>
              <li className="flex items-start gap-2">
                <span>🗣️</span>
                <div><strong>Ask Mochi</strong> - Chat with our bee expert for personalized learning!</div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default LearningHub;
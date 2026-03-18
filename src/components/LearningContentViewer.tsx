import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  BookOpen, 
  Brain, 
  FlaskConical, 
  Play, 
  Star, 
  Award,
  Volume2,
  Camera,
  CheckCircle,
  Lightbulb,
  Target,
  Clock,
  Users
} from 'lucide-react';

interface LearningContentProps {
  category: string;
  topicTitle: string;
  difficulty: number;
  description: string;
  contentTypes: string[];
}

interface LearningItem {
  id: string;
  title: string;
  content: string;
  type: 'fact' | 'activity' | 'quiz' | 'experiment' | 'video';
  difficulty_level: number;
  fun_fact?: boolean;
  materials?: string[];
  instructions?: string;
  safety_notes?: string;
  question?: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export const LearningContentViewer: React.FC<LearningContentProps> = ({
  category,
  topicTitle,
  difficulty,
  description,
  contentTypes
}) => {
  const [content, setContent] = useState<{[key: string]: LearningItem[]}>({
    facts: [],
    activities: [],
    quizzes: [],
    experiments: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('facts');
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
    loadProgress();
  }, [category]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // First try to load from database
      const { data: dbContent, error } = await supabase
        .from('bee_facts')
        .select('*')
        .eq('category', category)
        .order('difficulty_level', { ascending: true });

      if (!error && dbContent && dbContent.length > 0) {
        // Transform and organize content by type
        const organizedContent = {
          facts: dbContent
            .filter(item => !item.title.includes('Activity') && !item.title.includes('Experiment') && !item.title.includes('Quiz'))
            .map((item, index) => ({
              id: item.id,
              title: item.title,
              content: item.content,
              type: 'fact' as const,
              difficulty_level: item.difficulty_level || 1,
              fun_fact: item.fun_fact || false
            })),
          activities: dbContent
            .filter(item => item.title.includes('Activity'))
            .map((item, index) => ({
              id: item.id,
              title: item.title,
              content: item.content,
              type: 'activity' as const,
              difficulty_level: item.difficulty_level || 1,
              materials: item.content.includes('Materials:') ? 
                item.content.split('Materials:')[1]?.split('.')[0]?.split(',').map(m => m.trim()) : 
                ['Basic materials needed'],
              instructions: item.content
            })),
          experiments: dbContent
            .filter(item => item.title.includes('Experiment'))
            .map((item, index) => ({
              id: item.id,
              title: item.title,
              content: item.content,
              type: 'experiment' as const,
              difficulty_level: item.difficulty_level || 1
            })),
          quizzes: dbContent
            .filter(item => item.title.includes('Quiz'))
            .map((item, index) => ({
              id: item.id,
              title: item.title,
              content: item.content,
              type: 'quiz' as const,
              difficulty_level: item.difficulty_level || 1,
              question: item.content.split('Answer:')[0] || item.content,
              correct_answer: item.content.includes('Answer:') ? 
                item.content.split('Answer:')[1]?.trim() : 
                'Learn more!',
              explanation: `This helps you understand ${topicTitle} better!`
            })),
          videos: [] as LearningItem[] // Videos will be generated separately
        };
        
        setContent(organizedContent);
      } else {
        // Fallback: Generate new content using AI
        await generateFreshContent();
      }
    } catch (error) {
      console.error('Error loading content:', error);
      await generateFreshContent();
    } finally {
      setLoading(false);
    }
  };

  const generateFreshContent = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('learning_content_orchestrator', {
        body: {
          topic: topicTitle,
          category: category,
          difficulty_level: difficulty,
          content_types: contentTypes,
          language: 'en',
          age_group: 'children'
        }
      });

      if (error) throw error;
      
      setContent(data.content);
      
      toast({
        title: "🎓 Fresh Content Generated!",
        description: "AI has created new learning materials just for you!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      // Provide fallback content
      setContent({
        facts: [{
          id: '1',
          title: `Amazing ${topicTitle} Facts`,
          content: `Discover the fascinating world of ${topicTitle}! These amazing creatures and plants have evolved incredible abilities over millions of years.`,
          type: 'fact',
          difficulty_level: difficulty,
          fun_fact: true
        }],
        activities: [{
          id: '1',
          title: `${topicTitle} Observation`,
          content: 'Create your own field journal to record observations and discoveries.',
          type: 'activity',
          difficulty_level: difficulty,
          materials: ['notebook', 'colored pencils', 'magnifying glass'],
          instructions: 'Spend time outdoors observing and sketching what you find.'
        }],
        experiments: [],
        quizzes: [],
        videos: []
      });
    }
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`${category}_progress`);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedItems(data.completed || []);
        setProgress(data.progress || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const markComplete = (itemId: string, type: string) => {
    const completionKey = `${type}_${itemId}`;
    if (completedItems.includes(completionKey)) return;

    const newCompleted = [...completedItems, completionKey];
    setCompletedItems(newCompleted);
    
    // Calculate progress
    const totalItems = Object.values(content).reduce((sum, items) => sum + items.length, 0);
    const newProgress = totalItems > 0 ? (newCompleted.length / totalItems) * 100 : 0;
    setProgress(newProgress);

    // Save progress
    localStorage.setItem(`${category}_progress`, JSON.stringify({
      completed: newCompleted,
      progress: newProgress
    }));

    toast({
      title: "Excellent Work! 🌟",
      description: "You're making great progress in your learning journey!",
    });
  };

  const isCompleted = (itemId: string, type: string) => {
    return completedItems.includes(`${type}_${itemId}`);
  };

  const speakContent = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: `${text}`,
          voice_id: "9BWtsMINqrJLrRacOk9x"
        }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        title: "Audio Unavailable",
        description: "Unable to play audio at this moment.",
        variant: "destructive"
      });
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced_image_generation', {
        body: { 
          prompt: `Educational illustration: ${prompt}, child-friendly, colorful, detailed`,
          model: "gpt-image-1",
          quality: "high"
        }
      });

      if (error) throw error;
      
      toast({
        title: "🎨 Image Created!",
        description: "A beautiful illustration has been generated!",
      });
      
      return data.image;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">🎓</div>
          <p className="text-lg">Preparing your learning adventure...</p>
          <Progress value={33} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Lightbulb className="h-8 w-8 text-yellow-500" />
          {topicTitle}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Level {difficulty}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.round(progress)}% Complete
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            All Ages
          </Badge>
        </div>
        
        <Progress value={progress} className="w-64 mx-auto" />
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="facts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Facts ({content.facts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Activities ({content.activities?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Quizzes ({content.quizzes?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="experiments" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Experiments ({content.experiments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Videos ({content.videos?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Facts Tab */}
        <TabsContent value="facts">
          {content.facts && content.facts.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.facts.map((fact, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {fact.fun_fact && <Star className="h-4 w-4 text-yellow-500" />}
                            {fact.title}
                          </span>
                          {isCompleted(index.toString(), 'fact') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">{fact.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => speakContent(fact.content)}
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateImage(fact.title)}
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Visualize
                          </Button>
                          {!isCompleted(index.toString(), 'fact') && (
                            <Button
                              size="sm"
                              onClick={() => markComplete(index.toString(), 'fact')}
                            >
                              <Award className="h-3 w-3 mr-1" />
                              Mark Learned
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-semibold mb-2">No Facts Available Yet</h3>
                <p className="text-muted-foreground mb-4">We're working on creating amazing facts for this topic!</p>
                <Button onClick={generateFreshContent}>
                  Generate Content
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          {content.activities && content.activities.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.activities.map((activity, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {activity.title}
                          {isCompleted(index.toString(), 'activity') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{activity.content}</p>
                        {activity.materials && (
                          <div>
                            <h4 className="font-medium mb-2">Materials Needed:</h4>
                            <ul className="text-sm list-disc list-inside space-y-1">
                              {activity.materials.map((material, i) => (
                                <li key={i}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {activity.instructions && (
                          <div>
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <p className="text-sm">{activity.instructions}</p>
                          </div>
                        )}
                        {activity.safety_notes && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800">
                              ⚠️ Safety: {activity.safety_notes}
                            </p>
                          </div>
                        )}
                        {!isCompleted(index.toString(), 'activity') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'activity')}
                            className="w-full"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-lg font-semibold mb-2">Activities Coming Soon</h3>
                <p className="text-muted-foreground">Hands-on activities are being prepared!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          {content.quizzes && content.quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {content.quizzes.map((quiz, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        {quiz.title}
                      </span>
                      {isCompleted(index.toString(), 'quiz') && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{quiz.question || quiz.content}</p>
                    {quiz.explanation && (
                      <p className="text-xs text-muted-foreground italic">{quiz.explanation}</p>
                    )}
                    {!isCompleted(index.toString(), 'quiz') && (
                      <Button size="sm" onClick={() => markComplete(index.toString(), 'quiz')} className="w-full">
                        <Award className="h-3 w-3 mr-1" /> Mark Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold mb-2">No Quizzes Yet</h3>
                <p className="text-muted-foreground mb-4">Generate quizzes for this topic!</p>
                <Button onClick={generateFreshContent}>Generate Content</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Experiments Tab */}
        <TabsContent value="experiments">
          {content.experiments && content.experiments.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.experiments.map((exp, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-purple-500" />
                            {exp.title}
                          </span>
                          {isCompleted(index.toString(), 'experiment') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{exp.content}</p>
                        {exp.materials && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">🧪 Materials:</h4>
                            <ul className="text-xs list-disc list-inside space-y-0.5">
                              {exp.materials.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {exp.safety_notes && (
                          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            ⚠️ {exp.safety_notes}
                          </div>
                        )}
                        {!isCompleted(index.toString(), 'experiment') && (
                          <Button size="sm" onClick={() => markComplete(index.toString(), 'experiment')} className="w-full">
                            <Award className="h-3 w-3 mr-1" /> Mark Complete
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-4">⚗️</div>
                <h3 className="text-lg font-semibold mb-2">No Experiments Yet</h3>
                <p className="text-muted-foreground mb-4">Generate experiments for this topic!</p>
                <Button onClick={generateFreshContent}>Generate Content</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          {content.videos && content.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {content.videos.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Play className="h-4 w-4 text-red-500" />
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold mb-2">No Videos Yet</h3>
                <p className="text-muted-foreground">Video content will be available soon!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
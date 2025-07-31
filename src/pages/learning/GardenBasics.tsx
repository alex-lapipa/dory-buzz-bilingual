import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
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
  Sprout, 
  Sun, 
  Droplets, 
  Shovel, 
  Scissors,
  CheckCircle,
  ArrowLeft,
  Leaf,
  Heart,
  FlaskConical,
  BookOpen,
  Camera,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GardenBasics: React.FC = () => {
  const [content, setContent] = useState<any>({
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
  const navigate = useNavigate();

  useEffect(() => {
    generateContent();
    loadProgress();
  }, []);

  const generateContent = async () => {
    try {
      setLoading(true);
      console.log('🌱 Generating garden basics content...');
      
      const { data, error } = await supabase.functions.invoke('learning_content_orchestrator', {
        body: {
          topic: 'Plant Growth and Garden Care',
          category: 'garden_basics',
          difficulty_level: 2,
          content_types: ['facts', 'activities', 'quizzes', 'experiments', 'videos'],
          language: 'en',
          age_group: 'children'
        }
      });

      if (error) {
        console.error('Content generation error:', error);
        // Fallback content
        setContent({
          facts: [
            {
              title: "Plants Drink Through Their Roots",
              content: "Plants have special root systems that soak up water and nutrients from the soil, just like drinking through a straw!",
              fun_fact: true,
              image_description: "Cross-section of plant roots absorbing water"
            },
            {
              title: "Seeds Can Sleep for Years",
              content: "Some seeds can wait in the ground for the perfect conditions to grow - even for many years!",
              fun_fact: true,
              image_description: "Various types of seeds"
            },
            {
              title: "Plants Make Their Own Food",
              content: "Through photosynthesis, plants use sunlight, water, and air to create their own food - amazing!",
              fun_fact: false,
              image_description: "Diagram of photosynthesis process"
            }
          ],
          activities: [
            {
              name: "Start a Windowsill Garden",
              materials: ["small pots", "potting soil", "herb seeds", "water"],
              instructions: "Plant herb seeds in small pots and watch them grow on a sunny windowsill",
              objectives: ["Learn about plant growth", "Start gardening"],
              safety_notes: "Wash hands after handling soil"
            },
            {
              name: "Create a Plant Journal",
              materials: ["notebook", "colored pencils", "ruler"],
              instructions: "Draw and measure your plants every few days to track their growth",
              objectives: ["Observe plant changes", "Practice measuring"],
              safety_notes: "Handle plants gently"
            }
          ],
          quizzes: [
            {
              question: "What do plants need to grow?",
              type: "multiple_choice",
              options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"],
              correct_answer: "Water, sunlight, and air",
              explanation: "Plants need water, sunlight, and air (carbon dioxide) to make their food through photosynthesis!"
            }
          ],
          experiments: [
            {
              name: "Bean Sprouting Experiment",
              purpose: "Observe how seeds germinate and grow",
              materials: ["dried beans", "clear jar", "wet paper towels"],
              steps: "Place beans between wet paper towels in a jar and watch them sprout over several days",
              safety: "Keep hands clean when handling materials"
            }
          ],
          videos: [
            {
              title: "How Plants Grow",
              duration: "3 minutes",
              description: "Watch the amazing journey from seed to plant",
              learning_objectives: ["Understand plant lifecycle", "Learn about germination"]
            }
          ]
        });
      } else {
        setContent(data.content);
      }

      toast({
        title: "🌱 Garden Content Ready!",
        description: "AI-generated learning content about gardening is ready!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const saved = localStorage.getItem('garden_basics_progress');
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
    const newCompleted = [...completedItems, `${type}_${itemId}`];
    setCompletedItems(newCompleted);
    
    const totalItems = content.facts.length + content.activities.length + 
                      content.quizzes.length + content.experiments.length + 
                      content.videos.length;
    const newProgress = (newCompleted.length / totalItems) * 100;
    setProgress(newProgress);

    localStorage.setItem('garden_basics_progress', JSON.stringify({
      completed: newCompleted,
      progress: newProgress
    }));

    toast({
      title: "Excellent! 🌿",
      description: "You're growing your garden knowledge!",
    });
  };

  const isCompleted = (itemId: string, type: string) => {
    return completedItems.includes(`${type}_${itemId}`);
  };

  const speakContent = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: `🌱 ${text}`,
          voice_id: "9BWtsMINqrJLrRacOk9x"
        }
      });

      if (error) throw error;
      
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">🌱</div>
            <p>Growing garden wisdom with AI...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/learning-hub')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learning Hub
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sprout className="h-8 w-8 text-green-600" />
                Garden Basics
                <span className="text-4xl animate-pulse">🌿</span>
              </h1>
              <p className="text-muted-foreground">
                Learn how to grow and care for plants with AI-powered lessons!
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Your Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="facts" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Facts
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Shovel className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Experiments
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          {/* Facts Tab */}
          <TabsContent value="facts">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.facts.map((fact: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-green-800">
                          <span className="flex items-center gap-2">
                            {fact.fun_fact && <Heart className="h-4 w-4 text-red-500" />}
                            {fact.title}
                          </span>
                          {isCompleted(index.toString(), 'fact') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed text-green-700">{fact.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => speakContent(fact.content)}
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Visualize
                          </Button>
                          {!isCompleted(index.toString(), 'fact') && (
                            <Button
                              size="sm"
                              onClick={() => markComplete(index.toString(), 'fact')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Sprout className="h-3 w-3 mr-1" />
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
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.activities.map((activity: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-blue-800">
                          <span className="flex items-center gap-2">
                            <Shovel className="h-4 w-4" />
                            {activity.name}
                          </span>
                          {isCompleted(index.toString(), 'activity') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-blue-700">Materials:</h4>
                          <ul className="text-sm list-disc list-inside text-blue-600">
                            {(activity.materials || []).map((material: string, i: number) => (
                              <li key={i}>{material}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-blue-700">Instructions:</h4>
                          <p className="text-sm text-blue-600">{activity.instructions}</p>
                        </div>
                        {activity.safety_notes && (
                          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-800">
                              ⚠️ Safety: {activity.safety_notes}
                            </p>
                          </div>
                        )}
                        {!isCompleted(index.toString(), 'activity') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'activity')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Scissors className="h-3 w-3 mr-1" />
                            Complete Activity
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
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.quizzes.map((quiz: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-purple-800">
                          <span className="flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Garden Quiz {index + 1}
                          </span>
                          {isCompleted(index.toString(), 'quiz') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="font-medium text-purple-700">{quiz.question}</p>
                        {quiz.options && (
                          <div className="space-y-2">
                            {quiz.options.map((option: string, i: number) => (
                              <Button
                                key={i}
                                variant="outline"
                                className="w-full justify-start border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => {
                                  if (option === quiz.correct_answer) {
                                    markComplete(index.toString(), 'quiz');
                                    toast({
                                      title: "Perfect! 🌱",
                                      description: quiz.explanation,
                                    });
                                  } else {
                                    toast({
                                      title: "Keep trying! 🌿",
                                      description: "That's not quite right, but you're growing!",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>

          {/* Experiments Tab */}
          <TabsContent value="experiments">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.experiments.map((experiment: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-orange-800">
                          <span className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            {experiment.name}
                          </span>
                          {isCompleted(index.toString(), 'experiment') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-orange-700">Purpose:</h4>
                          <p className="text-sm text-orange-600">{experiment.purpose}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-orange-700">Steps:</h4>
                          <p className="text-sm text-orange-600">{experiment.steps}</p>
                        </div>
                        {experiment.safety && (
                          <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs text-red-800">
                              ⚠️ Safety: {experiment.safety}
                            </p>
                          </div>
                        )}
                        {!isCompleted(index.toString(), 'experiment') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'experiment')}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            <Droplets className="h-3 w-3 mr-1" />
                            Try Experiment
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
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.videos.map((video: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-emerald-800">
                          <span className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            {video.title}
                          </span>
                          {isCompleted(index.toString(), 'video') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {video.duration}
                        </Badge>
                        <p className="text-sm text-emerald-600">{video.description}</p>
                        <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200">
                          <div className="text-center">
                            <Sun className="h-12 w-12 mx-auto mb-2 text-emerald-600" />
                            <p className="text-sm text-emerald-700">Video coming soon!</p>
                          </div>
                        </div>
                        {!isCompleted(index.toString(), 'video') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'video')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Sun className="h-3 w-3 mr-1" />
                            Watch Video
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
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default GardenBasics;
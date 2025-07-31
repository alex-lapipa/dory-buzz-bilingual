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
  BookOpen, 
  Brain, 
  FlaskConical, 
  Play, 
  Star, 
  Award,
  Volume2,
  Camera,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LearningContent {
  facts: any[];
  activities: any[];
  quizzes: any[];
  experiments: any[];
  videos: any[];
}

const BeeBasics: React.FC = () => {
  const [content, setContent] = useState<LearningContent>({
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
      console.log('🐝 Generating bee basics content...');
      
      const { data, error } = await supabase.functions.invoke('learning_content_orchestrator', {
        body: {
          topic: 'Bee Anatomy and Behavior',
          category: 'bee_basics',
          difficulty_level: 3,
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
              title: "Bee Wings Beat Super Fast",
              content: "Bees beat their wings about 230 times per second! That's what makes the buzzing sound.",
              fun_fact: true,
              image_description: "Close-up of bee wings in motion"
            },
            {
              title: "Bees Have Five Eyes",
              content: "Bees have two compound eyes and three simple eyes on top of their head to see ultraviolet light.",
              fun_fact: true,
              image_description: "Detailed view of bee eyes"
            }
          ],
          activities: [
            {
              name: "Build a Bee Hotel",
              materials: ["cardboard tubes", "wooden blocks", "drill"],
              instructions: "Create small holes in wood blocks to make homes for solitary bees",
              objectives: ["Learn about bee habitats", "Help local bee populations"],
              safety_notes: "Adult supervision required for drilling"
            }
          ],
          quizzes: [
            {
              question: "How many wings does a bee have?",
              type: "multiple_choice",
              options: ["2", "4", "6", "8"],
              correct_answer: "4",
              explanation: "Bees have two pairs of wings - four wings total!"
            }
          ],
          experiments: [
            {
              name: "Bee Dance Communication",
              purpose: "Learn how bees communicate through dance",
              materials: ["open space", "markers", "measuring tape"],
              steps: "Create a waggle dance to show direction and distance to food sources",
              safety: "Clear area of obstacles"
            }
          ],
          videos: [
            {
              title: "Inside a Bee Colony",
              duration: "4 minutes",
              description: "Explore the fascinating world inside a beehive",
              learning_objectives: ["Understand bee society", "Learn about bee roles"]
            }
          ]
        });
      } else {
        setContent(data.content);
      }

      toast({
        title: "🐝 Content Generated!",
        description: "AI-powered learning content is ready to explore!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const saved = localStorage.getItem('bee_basics_progress');
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
    
    // Calculate progress
    const totalItems = content.facts.length + content.activities.length + 
                      content.quizzes.length + content.experiments.length + 
                      content.videos.length;
    const newProgress = (newCompleted.length / totalItems) * 100;
    setProgress(newProgress);

    // Save progress
    localStorage.setItem('bee_basics_progress', JSON.stringify({
      completed: newCompleted,
      progress: newProgress
    }));

    toast({
      title: "Great Job! 🎉",
      description: "You've completed another learning activity!",
    });
  };

  const isCompleted = (itemId: string, type: string) => {
    return completedItems.includes(`${type}_${itemId}`);
  };

  const speakContent = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { 
          text: `🐝 ${text}`,
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
            <div className="text-6xl animate-bee-bounce mb-4">🐝</div>
            <p>Generating bee-autiful content with AI...</p>
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
                <span className="text-4xl animate-bee-bounce">🐝</span>
                Bee Basics
                <span className="text-4xl animate-flower-sway">🌻</span>
              </h1>
              <p className="text-muted-foreground">
                Discover the amazing world of bees with AI-powered learning!
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
              <Star className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Experiments
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          {/* Facts Tab */}
          <TabsContent value="facts">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.facts.map((fact, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full">
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
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.activities.map((activity, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {activity.name}
                          {isCompleted(index.toString(), 'activity') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Materials:</h4>
                          <ul className="text-sm list-disc list-inside">
                            {(activity.materials || []).map((material: string, i: number) => (
                              <li key={i}>{material}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Instructions:</h4>
                          <p className="text-sm">{activity.instructions}</p>
                        </div>
                        {activity.safety_notes && (
                          <div className="p-2 bg-yellow-50 rounded-lg">
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
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.quizzes.map((quiz, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Quiz Question {index + 1}
                          {isCompleted(index.toString(), 'quiz') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="font-medium">{quiz.question}</p>
                        {quiz.options && (
                          <div className="space-y-2">
                            {quiz.options.map((option: string, i: number) => (
                              <Button
                                key={i}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  if (option === quiz.correct_answer) {
                                    markComplete(index.toString(), 'quiz');
                                    toast({
                                      title: "Correct! 🎉",
                                      description: quiz.explanation,
                                    });
                                  } else {
                                    toast({
                                      title: "Try again! 🤔",
                                      description: "That's not quite right, but keep trying!",
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
                {content.experiments.map((experiment, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {experiment.name}
                          {isCompleted(index.toString(), 'experiment') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Purpose:</h4>
                          <p className="text-sm">{experiment.purpose}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Steps:</h4>
                          <p className="text-sm">{experiment.steps}</p>
                        </div>
                        {experiment.safety && (
                          <div className="p-2 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-800">
                              ⚠️ Safety: {experiment.safety}
                            </p>
                          </div>
                        )}
                        {!isCompleted(index.toString(), 'experiment') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'experiment')}
                            className="w-full"
                          >
                            <FlaskConical className="h-3 w-3 mr-1" />
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
                {content.videos.map((video, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {video.title}
                          {isCompleted(index.toString(), 'video') && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Badge variant="secondary">{video.duration}</Badge>
                        <p className="text-sm">{video.description}</p>
                        <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-orange-600" />
                            <p className="text-sm text-orange-700">Video coming soon!</p>
                          </div>
                        </div>
                        {!isCompleted(index.toString(), 'video') && (
                          <Button
                            size="sm"
                            onClick={() => markComplete(index.toString(), 'video')}
                            className="w-full"
                          >
                            <Play className="h-3 w-3 mr-1" />
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

export default BeeBasics;
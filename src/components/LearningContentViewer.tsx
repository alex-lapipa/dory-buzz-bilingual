import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';
import {
  BookOpen, Brain, FlaskConical, Play, Star, Award, Volume2, Camera,
  CheckCircle, Lightbulb, Target, Clock, Users, Loader2, Sparkles,
} from '@/components/icons/lucide-compat';

/* ─── Types ─── */

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
  steps?: string[];
  purpose?: string;
  duration?: string;
}

/* ─── Interactive Quiz Card ─── */

const QuizCard: React.FC<{
  quiz: LearningItem;
  index: number;
  isCompleted: (id: string, type: string) => boolean;
  markComplete: (id: string, type: string) => void;
}> = ({ quiz, index, isCompleted, markComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const completed = isCompleted(index.toString(), 'quiz');
  const isCorrect = selected === quiz.correct_answer;

  const handleSelect = (opt: string) => {
    if (revealed || completed) return;
    setSelected(opt);
  };

  const handleReveal = () => {
    setRevealed(true);
    if (isCorrect) markComplete(index.toString(), 'quiz');
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Q{index + 1}
          </span>
          {completed && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">{quiz.question || quiz.content}</p>

        {quiz.options && quiz.options.length > 0 && (
          <div className="space-y-2">
            {quiz.options.map((opt, i) => {
              let cls = 'border rounded-lg p-2 text-sm cursor-pointer transition-colors ';
              if (revealed && opt === quiz.correct_answer) cls += 'border-green-500 bg-green-500/10 ';
              else if (revealed && opt === selected) cls += 'border-destructive bg-destructive/10 ';
              else if (selected === opt) cls += 'border-primary bg-primary/10 ';
              else cls += 'border-border hover:border-primary/50 ';

              return (
                <div key={i} className={cls} onClick={() => handleSelect(opt)}>
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        {selected && !revealed && (
          <Button size="sm" onClick={handleReveal} className="w-full">
            Check Answer
          </Button>
        )}

        {revealed && (
          <div className={`p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
            {isCorrect ? '🎉 Correct!' : `❌ The answer is: ${quiz.correct_answer}`}
            {quiz.explanation && <p className="mt-1 text-xs opacity-80">{quiz.explanation}</p>}
          </div>
        )}

        {revealed && !isCorrect && !completed && (
          <Button size="sm" variant="outline" onClick={() => { setSelected(null); setRevealed(false); }} className="w-full">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Main Component ─── */

export const LearningContentViewer: React.FC<LearningContentProps> = ({
  category, topicTitle, difficulty, description, contentTypes,
}) => {
  const [content, setContent] = useState<{ [key: string]: LearningItem[] }>({
    facts: [], activities: [], quizzes: [], experiments: [], videos: [],
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('facts');
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
    loadProgress();
  }, [category]);

  /* ─── Load from DB ─── */
  const loadContent = async () => {
    try {
      setLoading(true);
      const { data: dbContent, error } = await supabase
        .from('bee_facts')
        .select('*')
        .eq('category', category)
        .order('difficulty_level', { ascending: true });

      if (!error && dbContent && dbContent.length > 0) {
        setContent({
          facts: dbContent
            .filter(i => !i.title.includes('Activity') && !i.title.includes('Experiment') && !i.title.includes('Quiz'))
            .map(i => ({ id: i.id, title: i.title, content: i.content, type: 'fact' as const, difficulty_level: i.difficulty_level || 1, fun_fact: i.fun_fact || false })),
          activities: dbContent
            .filter(i => i.title.includes('Activity'))
            .map(i => ({
              id: i.id, title: i.title, content: i.content, type: 'activity' as const, difficulty_level: i.difficulty_level || 1,
              materials: i.content.includes('Materials:') ? i.content.split('Materials:')[1]?.split('.')[0]?.split(',').map((m: string) => m.trim()) : ['Basic materials needed'],
              instructions: i.content,
            })),
          experiments: dbContent
            .filter(i => i.title.includes('Experiment'))
            .map(i => ({ id: i.id, title: i.title, content: i.content, type: 'experiment' as const, difficulty_level: i.difficulty_level || 1 })),
          quizzes: dbContent
            .filter(i => i.title.includes('Quiz'))
            .map(i => ({
              id: i.id, title: i.title, content: i.content, type: 'quiz' as const, difficulty_level: i.difficulty_level || 1,
              question: i.content.split('Answer:')[0] || i.content,
              correct_answer: i.content.includes('Answer:') ? i.content.split('Answer:')[1]?.trim() : 'Learn more!',
              explanation: `This helps you understand ${topicTitle} better!`,
            })),
          videos: [],
        });
      } else {
        // No DB content — don't auto-generate, let user click
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Generate via AI Orchestrator ─── */
  const generateFreshContent = useCallback(async (types?: string[]) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('learning_content_orchestrator', {
        body: {
          topic: topicTitle,
          category,
          difficulty_level: difficulty,
          content_types: types || contentTypes,
          language: 'en',
          age_group: 'children',
        },
      });

      if (error) throw error;
      const gen = data?.content;
      if (!gen) throw new Error('No content returned');

      // Merge AI-generated content into current state
      setContent(prev => ({
        facts: gen.facts?.length ? mapGenerated(gen.facts, 'fact') : prev.facts,
        activities: gen.activities?.length ? mapActivities(gen.activities) : prev.activities,
        quizzes: gen.quizzes?.length ? mapQuizzes(gen.quizzes) : prev.quizzes,
        experiments: gen.experiments?.length ? mapExperiments(gen.experiments) : prev.experiments,
        videos: gen.videos?.length ? mapGenerated(gen.videos, 'video') : prev.videos,
      }));

      toast({ title: '🎓 Content Generated!', description: `AI created ${types?.join(', ') || 'all'} content for ${topicTitle}` });
    } catch (e: any) {
      console.error('Content generation error:', e);
      toast({ title: 'Generation Failed', description: e.message || 'Try again later', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  }, [topicTitle, category, difficulty, contentTypes]);

  /* ─── Mappers for AI output ─── */
  const mapGenerated = (items: any[], type: string): LearningItem[] =>
    items.map((it: any, i: number) => ({
      id: `gen_${type}_${i}`,
      title: it.title || it.name || `${type} ${i + 1}`,
      content: it.content || it.description || JSON.stringify(it),
      type: type as any,
      difficulty_level: difficulty,
      fun_fact: it.fun_fact,
      duration: it.duration,
    }));

  const mapActivities = (items: any[]): LearningItem[] =>
    items.map((it: any, i: number) => ({
      id: `gen_act_${i}`,
      title: it.name || it.title || `Activity ${i + 1}`,
      content: it.instructions || it.content || it.description || '',
      type: 'activity' as const,
      difficulty_level: difficulty,
      materials: Array.isArray(it.materials) ? it.materials : it.materials ? [it.materials] : [],
      instructions: typeof it.instructions === 'string' ? it.instructions : typeof it.steps === 'object' ? JSON.stringify(it.steps) : '',
      safety_notes: it.safety_notes || it.safety || undefined,
    }));

  const mapQuizzes = (items: any[]): LearningItem[] =>
    items.map((it: any, i: number) => ({
      id: `gen_quiz_${i}`,
      title: it.title || `Question ${i + 1}`,
      content: it.question || it.content || '',
      type: 'quiz' as const,
      difficulty_level: difficulty,
      question: it.question || it.content,
      options: Array.isArray(it.options) ? it.options : undefined,
      correct_answer: it.correct_answer || it.answer,
      explanation: it.explanation,
    }));

  const mapExperiments = (items: any[]): LearningItem[] =>
    items.map((it: any, i: number) => ({
      id: `gen_exp_${i}`,
      title: it.name || it.title || `Experiment ${i + 1}`,
      content: it.purpose || it.description || it.content || '',
      type: 'experiment' as const,
      difficulty_level: difficulty,
      materials: Array.isArray(it.materials) ? it.materials : it.materials ? [it.materials] : [],
      steps: Array.isArray(it.steps) ? it.steps : undefined,
      safety_notes: it.safety || it.safety_precautions || it.safety_notes || undefined,
      purpose: it.purpose || it.expected_results,
    }));

  /* ─── Progress ─── */
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`${category}_progress`);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedItems(data.completed || []);
        setProgress(data.progress || 0);
      }
    } catch { /* ignore */ }
  };

  const markComplete = (itemId: string, type: string) => {
    const key = `${type}_${itemId}`;
    if (completedItems.includes(key)) return;
    const newCompleted = [...completedItems, key];
    setCompletedItems(newCompleted);
    const total = Object.values(content).reduce((s, a) => s + a.length, 0);
    const p = total > 0 ? (newCompleted.length / total) * 100 : 0;
    setProgress(p);
    localStorage.setItem(`${category}_progress`, JSON.stringify({ completed: newCompleted, progress: p }));
    toast({ title: 'Excellent Work! 🌟', description: 'Great progress on your learning journey!' });
  };

  const isCompleted = (id: string, type: string) => completedItems.includes(`${type}_${id}`);

  /* ─── TTS ─── */
  const speakContent = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs_tts', {
        body: { text, voice_id: '9BWtsMINqrJLrRacOk9x' },
      });
      if (error) throw error;
      const blob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      new Audio(URL.createObjectURL(blob)).play();
    } catch { toast({ title: 'Audio Unavailable', variant: 'destructive' }); }
  };

  /* ─── Generate button ─── */
  const GenerateBtn: React.FC<{ types: string[]; label?: string }> = ({ types, label }) => (
    <Button onClick={() => generateFreshContent(types)} disabled={generating} variant="default">
      {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
      {label || 'Generate with AI'}
    </Button>
  );

  /* ─── Empty state ─── */
  const EmptyTab: React.FC<{ emoji: string; label: string; types: string[] }> = ({ emoji, label, types }) => (
    <Card className="text-center p-8">
      <CardContent>
        <div className="text-6xl mb-4">{emoji}</div>
        <h3 className="text-lg font-semibold mb-2">No {label} Yet</h3>
        <p className="text-muted-foreground mb-4">Generate {label.toLowerCase()} for this topic using AI!</p>
        <GenerateBtn types={types} label={`Generate ${label}`} />
      </CardContent>
    </Card>
  );

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
          <Lightbulb className="h-8 w-8 text-primary" />
          {topicTitle}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="flex items-center gap-1"><Target className="h-3 w-3" /> Level {difficulty}</Badge>
          <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.round(progress)}% Complete</Badge>
          <Badge variant="secondary" className="flex items-center gap-1"><Users className="h-3 w-3" /> All Ages</Badge>
        </div>
        <Progress value={progress} className="w-64 mx-auto" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="facts" className="flex items-center gap-1 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" /> Facts ({content.facts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1 text-xs sm:text-sm">
            <Star className="h-4 w-4" /> Activities ({content.activities?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-1 text-xs sm:text-sm">
            <Brain className="h-4 w-4" /> Quizzes ({content.quizzes?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="experiments" className="flex items-center gap-1 text-xs sm:text-sm">
            <FlaskConical className="h-4 w-4" /> Experiments ({content.experiments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1 text-xs sm:text-sm">
            <Play className="h-4 w-4" /> Videos ({content.videos?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* ─── Facts ─── */}
        <TabsContent value="facts">
          {content.facts.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.facts.map((fact, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {fact.fun_fact && <Star className="h-4 w-4 text-yellow-500" />}
                            {fact.title}
                          </span>
                          {isCompleted(i.toString(), 'fact') && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">{fact.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => speakContent(fact.content)}>
                            <Volume2 className="h-3 w-3 mr-1" /> Listen
                          </Button>
                          {!isCompleted(i.toString(), 'fact') && (
                            <Button size="sm" onClick={() => markComplete(i.toString(), 'fact')}>
                              <Award className="h-3 w-3 mr-1" /> Mark Learned
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
            <EmptyTab emoji="📚" label="Facts" types={['facts']} />
          )}
        </TabsContent>

        {/* ─── Activities ─── */}
        <TabsContent value="activities">
          {content.activities.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.activities.map((act, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            {act.title}
                          </span>
                          {isCompleted(i.toString(), 'activity') && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{act.content}</p>
                        {act.materials && act.materials.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">🧰 Materials:</h4>
                            <ul className="text-xs list-disc list-inside space-y-0.5">
                              {act.materials.map((m, j) => <li key={j}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {act.safety_notes && (
                          <div className="p-2 bg-accent/50 border border-accent rounded text-xs">
                            ⚠️ {act.safety_notes}
                          </div>
                        )}
                        {!isCompleted(i.toString(), 'activity') && (
                          <Button size="sm" onClick={() => markComplete(i.toString(), 'activity')} className="w-full">
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
            <EmptyTab emoji="🔬" label="Activities" types={['activities']} />
          )}
        </TabsContent>

        {/* ─── Quizzes ─── */}
        <TabsContent value="quizzes">
          {content.quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {content.quizzes.map((quiz, i) => (
                <QuizCard key={i} quiz={quiz} index={i} isCompleted={isCompleted} markComplete={markComplete} />
              ))}
            </div>
          ) : (
            <EmptyTab emoji="🧠" label="Quizzes" types={['quizzes']} />
          )}
        </TabsContent>

        {/* ─── Experiments ─── */}
        <TabsContent value="experiments">
          {content.experiments.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {content.experiments.map((exp, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-primary" />
                            {exp.title}
                          </span>
                          {isCompleted(i.toString(), 'experiment') && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {exp.purpose && <p className="text-xs text-muted-foreground italic">🎯 {exp.purpose}</p>}
                        <p className="text-sm">{exp.content}</p>
                        {exp.materials && exp.materials.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">🧪 Materials:</h4>
                            <ul className="text-xs list-disc list-inside space-y-0.5">
                              {exp.materials.map((m, j) => <li key={j}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {exp.steps && exp.steps.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">📋 Steps:</h4>
                            <ol className="text-xs list-decimal list-inside space-y-0.5">
                              {exp.steps.map((s, j) => <li key={j}>{s}</li>)}
                            </ol>
                          </div>
                        )}
                        {exp.safety_notes && (
                          <div className="p-2 bg-accent/50 border border-accent rounded text-xs">
                            ⚠️ {exp.safety_notes}
                          </div>
                        )}
                        {!isCompleted(i.toString(), 'experiment') && (
                          <Button size="sm" onClick={() => markComplete(i.toString(), 'experiment')} className="w-full">
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
            <EmptyTab emoji="⚗️" label="Experiments" types={['experiments']} />
          )}
        </TabsContent>

        {/* ─── Videos ─── */}
        <TabsContent value="videos">
          {content.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {content.videos.map((video, i) => (
                <Card key={i} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Play className="h-4 w-4 text-destructive" />
                      {video.title}
                      {video.duration && <Badge variant="outline" className="text-xs ml-auto">{video.duration}</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyTab emoji="🎬" label="Videos" types={['videos']} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

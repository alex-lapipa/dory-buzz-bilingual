import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, MessageCircle, BookOpen, Languages, Send, Loader2 } from '@/components/icons/lucide-compat';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BeeFact {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: number | null;
  fun_fact: boolean | null;
  domain: string | null;
  tags: string[] | null;
}

interface VocabHint {
  word_en: string;
  word_es: string;
  example_en: string | null;
  example_es: string | null;
}

const BeeBasics: React.FC = () => {
  const navigate = useNavigate();
  const [facts, setFacts] = useState<BeeFact[]>([]);
  const [vocab, setVocab] = useState<VocabHint[]>([]);
  const [loading, setLoading] = useState(true);
  const [askingMochi, setAskingMochi] = useState(false);
  const [mochiQuestion, setMochiQuestion] = useState('');
  const [mochiAnswer, setMochiAnswer] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [factsRes, vocabRes] = await Promise.all([
        supabase
          .from('bee_facts')
          .select('id, title, content, category, difficulty_level, fun_fact, domain, tags')
          .order('difficulty_level', { ascending: true })
          .limit(50),
        supabase
          .from('vocabulary_cards')
          .select('word_en, word_es, example_en, example_es')
          .eq('domain', 'bee_biology')
          .limit(12),
      ]);

      if (factsRes.data) setFacts(factsRes.data);
      if (vocabRes.data) setVocab(vocabRes.data);
    } catch (e) {
      console.error('Failed to load bee content:', e);
    } finally {
      setLoading(false);
    }
  };

  const askMochi = async () => {
    if (!mochiQuestion.trim()) return;
    setAskingMochi(true);
    setMochiAnswer(null);
    try {
      const { data, error } = await supabase.functions.invoke('mochi_rag_v2', {
        body: { message: mochiQuestion, language: 'en', age_level: 'child' },
      });
      if (error) throw error;
      setMochiAnswer(data.response);
    } catch (e) {
      console.error('Mochi RAG error:', e);
      setMochiAnswer("Bzz! I couldn't find an answer right now. Try again later! 🐝");
    } finally {
      setAskingMochi(false);
    }
  };

  const categories = [...new Set(facts.map(f => f.category))];
  const filtered = activeCategory ? facts.filter(f => f.category === activeCategory) : facts;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learning-hub')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Beeducation
          </Button>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-5xl animate-bee-bounce">🐝</span>
            Bee Basics
          </h1>
          <p className="text-lg text-muted-foreground">
            {facts.length} facts from our knowledge base — explore and ask Mochi!
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={activeCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            All ({facts.length})
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setActiveCategory(cat)}
            >
              {cat.replace(/_/g, ' ')} ({facts.filter(f => f.category === cat).length})
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Facts grid */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(fact => (
                  <Card key={fact.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {fact.fun_fact && <Star className="h-4 w-4 text-yellow-500 shrink-0" />}
                        <span className="line-clamp-2">{fact.title}</span>
                      </CardTitle>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {fact.category?.replace(/_/g, ' ')}
                        </Badge>
                        {fact.difficulty_level && (
                          <Badge variant="outline" className="text-xs">
                            Level {fact.difficulty_level}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4">{fact.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <Card className="text-center p-8">
                <CardContent>
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-muted-foreground">No facts found for this category.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: Vocab + Ask Mochi */}
          <div className="space-y-6">
            {/* Ask Mochi */}
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Ask Mochi 🐝
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="How do bees make honey?"
                    value={mochiQuestion}
                    onChange={e => setMochiQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askMochi()}
                    className="text-sm"
                  />
                  <Button size="icon" onClick={askMochi} disabled={askingMochi}>
                    {askingMochi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                {mochiAnswer && (
                  <div className="p-3 bg-primary/5 rounded-lg text-sm">
                    {mochiAnswer}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vocabulary */}
            {vocab.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Vocabulary / Vocabulario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vocab.map((v, i) => (
                      <div key={i} className="text-xs p-2 rounded bg-muted/50">
                        <span className="font-medium">{v.word_en}</span>
                        <span className="text-muted-foreground"> / {v.word_es}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BeeBasics;

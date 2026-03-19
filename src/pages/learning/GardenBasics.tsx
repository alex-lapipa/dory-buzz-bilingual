import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Sprout, MessageCircle, Languages, Send, Loader2, Leaf } from '@/components/icons/lucide-compat';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface KBEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  domain: string | null;
  tags: string[] | null;
  subcategory: string | null;
}

interface VocabHint {
  word_en: string;
  word_es: string;
}

const GardenBasics: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<KBEntry[]>([]);
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
      const [kbRes, vocabRes] = await Promise.all([
        supabase
          .from('mochi_knowledge_base')
          .select('id, title, content, category, domain, tags, subcategory')
          .or('domain.eq.permaculture,domain.eq.garden,category.eq.permaculture,category.eq.seeds,category.eq.garden_basics')
          .order('created_at', { ascending: false })
          .limit(60),
        supabase
          .from('vocabulary_cards')
          .select('word_en, word_es')
          .eq('domain', 'permaculture')
          .limit(12),
      ]);

      if (kbRes.data) setEntries(kbRes.data);
      if (vocabRes.data) setVocab(vocabRes.data);
    } catch (e) {
      console.error('Failed to load garden content:', e);
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
      setMochiAnswer("Bzz! I couldn't find an answer right now. Try again later! 🐝");
    } finally {
      setAskingMochi(false);
    }
  };

  const categories = [...new Set(entries.map(e => e.category))];
  const filtered = activeCategory ? entries.filter(e => e.category === activeCategory) : entries;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learning-hub')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Beeducation
          </Button>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-5xl animate-pulse">🌱</span>
            Garden Basics
          </h1>
          <p className="text-lg text-muted-foreground">
            {entries.length} entries from the knowledge base — learn about plants, seeds & permaculture!
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant={activeCategory === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveCategory(null)}>
            All ({entries.length})
          </Badge>
          {categories.map(cat => (
            <Badge key={cat} variant={activeCategory === cat ? 'default' : 'outline'} className="cursor-pointer capitalize" onClick={() => setActiveCategory(cat)}>
              {cat.replace(/_/g, ' ')} ({entries.filter(e => e.category === cat).length})
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(entry => (
                  <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="line-clamp-2">{entry.title}</span>
                      </CardTitle>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs capitalize">{entry.category?.replace(/_/g, ' ')}</Badge>
                        {entry.domain && <Badge variant="outline" className="text-xs capitalize">{entry.domain.replace(/_/g, ' ')}</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4">{entry.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <Card className="text-center p-8">
                <CardContent>
                  <p className="text-2xl mb-2">🌿</p>
                  <p className="text-muted-foreground">No garden content found for this category.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Ask Mochi 🐝
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="How do seeds germinate?" value={mochiQuestion} onChange={e => setMochiQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askMochi()} className="text-sm" />
                  <Button size="icon" onClick={askMochi} disabled={askingMochi}>
                    {askingMochi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                {mochiAnswer && <div className="p-3 bg-primary/5 rounded-lg text-sm">{mochiAnswer}</div>}
              </CardContent>
            </Card>

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

export default GardenBasics;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, Database } from '@/components/icons/lucide-compat';

interface BeeFact {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: number | null;
  fun_fact: boolean | null;
  domain: string | null;
  language: string | null;
  tags: string[] | null;
}

const BeeBasicsAdmin: React.FC = () => {
  const [facts, setFacts] = useState<BeeFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);

  useEffect(() => { loadFacts(); }, []);

  const loadFacts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bee_facts')
      .select('id, title, content, category, difficulty_level, fun_fact, domain, language, tags')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) setFacts(data);
    setLoading(false);
  };

  const categories = [...new Set(facts.map(f => f.category))];
  const filtered = facts
    .filter(f => !filterCat || f.category === filterCat)
    .filter(f => !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">{facts.length} Bee Facts</span>
        </div>
        <Button variant="outline" size="sm" onClick={loadFacts}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search facts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1 flex-wrap">
          <Badge variant={filterCat === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterCat(null)}>All</Badge>
          {categories.map(c => (
            <Badge key={c} variant={filterCat === c ? 'default' : 'outline'} className="cursor-pointer capitalize" onClick={() => setFilterCat(c)}>
              {c.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {filtered.map(fact => (
            <Card key={fact.id} className="text-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{fact.title}</CardTitle>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs capitalize">{fact.category.replace(/_/g, ' ')}</Badge>
                  {fact.fun_fact && <Badge variant="outline" className="text-xs">⭐ Fun Fact</Badge>}
                  <Badge variant="outline" className="text-xs">Level {fact.difficulty_level || 1}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3">{fact.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No facts match your search.</p>
      )}
    </div>
  );
};

export default BeeBasicsAdmin;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, Database } from '@/components/icons/lucide-compat';

interface KBEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  domain: string | null;
  source: string | null;
  tags: string[] | null;
}

const GardenBasicsAdmin: React.FC = () => {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mochi_knowledge_base')
      .select('id, title, content, category, domain, source, tags')
      .or('domain.eq.permaculture,domain.eq.garden,category.eq.permaculture,category.eq.seeds,category.eq.garden_basics')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) setEntries(data);
    setLoading(false);
  };

  const categories = [...new Set(entries.map(e => e.category))];
  const filtered = entries
    .filter(e => !filterCat || e.category === filterCat)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold">{entries.length} Garden/Permaculture Entries</span>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
          {filtered.map(entry => (
            <Card key={entry.id} className="text-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{entry.title}</CardTitle>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs capitalize">{entry.category.replace(/_/g, ' ')}</Badge>
                  {entry.domain && <Badge variant="outline" className="text-xs capitalize">{entry.domain.replace(/_/g, ' ')}</Badge>}
                  {entry.source && <Badge variant="outline" className="text-xs">{entry.source}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GardenBasicsAdmin;

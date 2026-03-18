import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Music, Mic, Volume2, CheckSquare, Sparkles, Palette } from 'lucide-react';

interface KBEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  domain: string | null;
  tags: string[] | null;
  created_at: string | null;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  audio_design: { label: 'Research & Evidence', icon: Sparkles, color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  audio_guidelines: { label: 'Framework & Guidelines', icon: Volume2, color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400' },
  audio_system: { label: 'Sound Design System', icon: Music, color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  audio_reference: { label: 'Reference Tables', icon: Palette, color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  audio_production: { label: 'Production Rules', icon: CheckSquare, color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400' },
  audio_scripts: { label: 'Example Scripts', icon: Mic, color: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
};

const AudioSoundDesign: React.FC = () => {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('mochi_knowledge_base')
        .select('id, title, content, category, domain, tags, created_at')
        .eq('source', 'rag_08_audio_sound_design')
        .order('category')
        .order('title');
      setEntries((data as KBEntry[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const grouped = entries.reduce<Record<string, KBEntry[]>>((acc, e) => {
    (acc[e.category] = acc[e.category] || []).push(e);
    return acc;
  }, {});

  const categories = Object.keys(CATEGORY_META).filter(c => grouped[c]?.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          return (
            <div key={cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${meta.color}`}>
              <Icon className="h-3.5 w-3.5" />
              {meta.label}: {grouped[cat].length}
            </div>
          );
        })}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          Total: {entries.length} entries
        </div>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue={categories[0] || 'audio_design'}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map(cat => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            return (
              <TabsTrigger key={cat} value={cat} className="gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="space-y-4 mt-4">
            {grouped[cat].map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const EntryCard: React.FC<{ entry: KBEntry }> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.content.length > 400;
  const displayContent = isLong && !expanded ? entry.content.slice(0, 400) + '...' : entry.content;

  // Split content into bullet-like sections for readability
  const sections = displayContent.split(/(?<=\.) (?=[A-Z0-9])/);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">{entry.title}</CardTitle>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {entry.tags.slice(0, 6).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
          {sections.map((s, i) => (
            <p key={i}>{s.trim()}</p>
          ))}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioSoundDesign;

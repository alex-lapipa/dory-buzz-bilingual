import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Music, Mic, Volume2, CheckSquare, Sparkles, Palette, Play, Pause, Upload, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KBEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  domain: string | null;
  tags: string[] | null;
  created_at: string | null;
}

interface AudioAsset {
  id: string;
  asset_type: string;
  file_path: string;
  file_url: string | null;
  metadata: any;
  is_active: boolean;
  created_at: string;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  audio_design: { label: 'Research & Evidence', icon: Sparkles, color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  audio_guidelines: { label: 'Framework & Guidelines', icon: Volume2, color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400' },
  audio_system: { label: 'Sound Design System', icon: Music, color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  audio_reference: { label: 'Reference Tables', icon: Palette, color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  audio_production: { label: 'Production Rules', icon: CheckSquare, color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400' },
  audio_scripts: { label: 'Example Scripts', icon: Mic, color: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
};

const MOCHI_AUDIO_FILE_PATH = 'audio/mochis_playful_day.mp3';
const MOCHI_AUDIO_METADATA = {
  title: "Mochi's Playful Day",
  category: "theme_music",
  duration_estimate: "~30s",
  source: "rag_08_audio_sound_design",
  tags: ["theme", "playful", "pentatonic", "C_major"],
};

// --- Audio Assets Section ---
const AudioAssetsSection: React.FC = () => {
  const [assets, setAssets] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const loadAssets = async () => {
    const { data } = await supabase
      .from('mochi_assets')
      .select('*')
      .in('asset_type', ['audio_theme', 'audio_sfx', 'audio_voice'])
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setAssets((data as AudioAsset[]) || []);
    setLoading(false);
  };

  const registerInitialAsset = async () => {
    setRegistering(true);
    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('mochi_assets')
        .select('id')
        .eq('file_path', MOCHI_AUDIO_FILE_PATH)
        .maybeSingle();

      if (existing) {
        toast({ title: 'Already registered', description: "Mochi's Playful Day is already in the database." });
        setRegistering(false);
        return;
      }

      // Upload to Supabase Storage
      const response = await fetch('/audio/mochis_playful_day.mp3');
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('mochi-assets')
        .upload(MOCHI_AUDIO_FILE_PATH, blob, { contentType: 'audio/mpeg', upsert: true });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Continue anyway — file may already exist
      }

      const { data: urlData } = supabase.storage
        .from('mochi-assets')
        .getPublicUrl(MOCHI_AUDIO_FILE_PATH);

      const { error: insertError } = await supabase
        .from('mochi_assets')
        .insert({
          asset_type: 'audio_theme',
          file_path: MOCHI_AUDIO_FILE_PATH,
          file_url: urlData.publicUrl,
          metadata: MOCHI_AUDIO_METADATA,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast({ title: '✅ Registered', description: "Mochi's Playful Day saved to database & storage." });
      await loadAssets();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => { loadAssets(); }, []);

  const alreadyRegistered = assets.some(a => a.file_path === MOCHI_AUDIO_FILE_PATH);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" /> Audio Assets
        </CardTitle>
        <CardDescription>Registered sound design files for Mochi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!alreadyRegistered && (
          <Button onClick={registerInitialAsset} disabled={registering} size="sm" className="gap-2">
            {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Register "Mochi's Playful Day"
          </Button>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audio assets registered yet.</p>
        ) : (
          <div className="space-y-3">
            {assets.map(asset => (
              <AudioAssetRow key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AudioAssetRow: React.FC<{ asset: AudioAsset }> = ({ asset }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      const src = asset.file_url || `/audio/${asset.file_path.split('/').pop()}`;
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const meta = asset.metadata || {};

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
      <Button variant="ghost" size="icon" onClick={togglePlay} className="shrink-0">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{meta.title || asset.file_path}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="secondary" className="text-[10px]">{asset.asset_type}</Badge>
          {meta.tags?.map((t: string) => (
            <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">{t}</Badge>
          ))}
        </div>
      </div>
      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
    </div>
  );
};

// --- Main Component ---
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
      {/* Audio Assets */}
      <AudioAssetsSection />

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

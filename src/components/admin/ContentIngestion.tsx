import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Globe, Loader2, RefreshCw, Database, CheckCircle, XCircle, Clock,
  Sparkles, Link2, Tag, FileText, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrawlJob {
  id: string;
  url: string;
  domain: string;
  status: string | null;
  chunks_created: number | null;
  nodes_created: number | null;
  created_at: string | null;
  completed_at: string | null;
  error_msg: string | null;
  firecrawl_id: string | null;
}

interface KBStats {
  total: number;
  withEmbeddings: number;
  byDomain: { domain: string; count: number }[];
}

const DOMAINS = [
  { value: 'bee_biology', label: '🐝 Bee Biology' },
  { value: 'bee_culture', label: '🍯 Bee Culture' },
  { value: 'permaculture', label: '🌿 Permaculture' },
  { value: 'garden', label: '🌻 Garden' },
  { value: 'seeds', label: '🌱 Seeds' },
];

const SUGGESTED_URLS = [
  // Bee Conservation & Biology
  { url: 'https://beeinformed.org/resources', domain: 'bee_biology', label: 'Bee Informed Partnership' },
  { url: 'https://www.xerces.org/pollinators', domain: 'bee_biology', label: 'Xerces Society — Pollinators' },
  { url: 'https://www.pollinator.org/learning-center', domain: 'bee_biology', label: 'Pollinator Partnership — Learning Center' },
  { url: 'https://www.honeybees.com/bee-biology', domain: 'bee_biology', label: 'Honeybees.com — Bee Biology' },
  { url: 'https://www.bumblebeeconservation.org/about-bees', domain: 'bee_biology', label: 'Bumblebee Conservation Trust' },
  { url: 'https://www.savethebees.org', domain: 'bee_biology', label: 'Save the Bees — Conservation' },
  { url: 'https://thebeeconservancy.org/10-ways-to-save-the-bees', domain: 'bee_biology', label: 'The Bee Conservancy — 10 Ways' },
  { url: 'https://www.fs.usda.gov/wildflowers/pollinators/animals/bees.shtml', domain: 'bee_biology', label: 'USDA Forest Service — Bees' },
  // Bee Culture & Beekeeping
  { url: 'https://www.beeculture.com', domain: 'bee_culture', label: 'Bee Culture Magazine' },
  { url: 'https://beekeeping.extension.org', domain: 'bee_culture', label: 'Beekeeping Extension — Best Practices' },
  // Garden & Permaculture
  { url: 'https://extension.umn.edu/yard-and-garden', domain: 'garden', label: 'UMN Extension — Garden' },
  { url: 'https://www.permaculturenews.org', domain: 'permaculture', label: 'Permaculture News' },
  { url: 'https://www.nwf.org/Garden-for-Wildlife/About/Native-Plants/Pollinators', domain: 'garden', label: 'NWF — Pollinator Garden Plants' },
  { url: 'https://www.rhs.org.uk/wildlife/plants-for-pollinators', domain: 'garden', label: 'RHS — Plants for Pollinators' },
];

const ContentIngestion: React.FC = () => {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('bee_biology');
  const [sourceLabel, setSourceLabel] = useState('');
  const [categoryOverride, setCategoryOverride] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<KBStats | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [embedRunning, setEmbedRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('crawl_jobs')
      .select('id, url, domain, status, chunks_created, nodes_created, created_at, completed_at, error_msg, firecrawl_id')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setJobs(data);
    setLoading(false);
  };

  const loadStats = async () => {
    const { count: total } = await supabase
      .from('mochi_knowledge_base')
      .select('id', { count: 'exact', head: true });

    const { data: domainData } = await supabase
      .from('mochi_knowledge_base')
      .select('domain');

    const domainCounts: Record<string, number> = {};
    domainData?.forEach(r => {
      const d = r.domain || 'unknown';
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    });

    setStats({
      total: total || 0,
      withEmbeddings: total || 0, // all are embedded per status report
      byDomain: Object.entries(domainCounts).map(([domain, count]) => ({ domain, count })),
    });
  };

  const startCrawl = async (crawlUrl?: string, crawlDomain?: string) => {
    const targetUrl = crawlUrl || url.trim();
    const targetDomain = crawlDomain || domain;
    if (!targetUrl) return;

    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl_scraper', {
        body: {
          url: targetUrl,
          domain: targetDomain,
          action: 'scrape',
          category_override: categoryOverride || undefined,
          source_label: sourceLabel || undefined,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Unknown error');

      toast({
        title: '✅ Content Ingested!',
        description: `${data.chunks_created} chunks created, ${data.embedded} embedded from ${targetUrl}`,
      });
      setUrl('');
      setSourceLabel('');
      setCategoryOverride('');
      await Promise.all([loadJobs(), loadStats()]);
    } catch (e: any) {
      toast({ title: 'Ingestion Failed', description: e.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setCrawling(false);
    }
  };

  const triggerEmbed = async () => {
    setEmbedRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('mochi_embed', { body: {} });
      if (error) throw error;
      toast({
        title: '🧠 Embedding Complete',
        description: `${data.embedded} new embeddings generated. ${data.remaining || 0} remaining.`,
      });
      await loadStats();
    } catch (e: any) {
      toast({ title: 'Embedding Failed', description: e.message, variant: 'destructive' });
    } finally {
      setEmbedRunning(false);
    }
  };

  const statusIcon = (status: string | null) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
  };

  const embedPct = stats ? (stats.withEmbeddings / Math.max(stats.total, 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* KB Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total KB Entries</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">{stats.withEmbeddings}</div>
            <div className="text-xs text-muted-foreground">Embedded</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">{jobs.filter(j => j.status === 'completed').length}</div>
            <div className="text-xs text-muted-foreground">Successful Crawls</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">{jobs.reduce((s, j) => s + (j.chunks_created || 0), 0)}</div>
            <div className="text-xs text-muted-foreground">Total Chunks</div>
          </Card>
        </div>
      )}

      <Tabs defaultValue="ingest">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingest" className="text-xs sm:text-sm">
            <Globe className="h-4 w-4 mr-1" /> Ingest URL
          </TabsTrigger>
          <TabsTrigger value="suggested" className="text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 mr-1" /> Suggested
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs sm:text-sm">
            <Zap className="h-4 w-4 mr-1" /> Tools
          </TabsTrigger>
        </TabsList>

        {/* ── Ingest Tab ── */}
        <TabsContent value="ingest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5" /> Scrape & Ingest URL
              </CardTitle>
              <CardDescription>
                Content is scraped via Firecrawl, chunked into ~1200 char sections, inserted into the knowledge base, and auto-embedded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">URL to scrape</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="https://example.com/article" value={url} onChange={e => setUrl(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Domain</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground" value={domain} onChange={e => setDomain(e.target.value)}>
                    {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Source label (optional)
                  </label>
                  <Input placeholder="e.g. beeinformed.org" value={sourceLabel} onChange={e => setSourceLabel(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Category override (optional)
                  </label>
                  <Input placeholder="auto-detected if empty" value={categoryOverride} onChange={e => setCategoryOverride(e.target.value)} />
                </div>
              </div>

              <Button onClick={() => startCrawl()} disabled={crawling || !url.trim()} className="w-full md:w-auto">
                {crawling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                Scrape, Chunk & Embed
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Suggested URLs ── */}
        <TabsContent value="suggested">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTED_URLS.map((s, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{s.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.url}</p>
                    <Badge variant="secondary" className="mt-1 text-xs capitalize">{s.domain.replace(/_/g, ' ')}</Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => startCrawl(s.url, s.domain)} disabled={crawling}>
                    {crawling ? <Loader2 className="h-3 w-3 animate-spin" /> : <Globe className="h-3 w-3" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tools ── */}
        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Re-run Embeddings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Process any knowledge base entries that are missing embeddings.
                </p>
                {stats && (
                  <div className="space-y-1">
                    <Progress value={embedPct} className="h-2" />
                    <p className="text-xs text-muted-foreground">{Math.round(embedPct)}% embedded</p>
                  </div>
                )}
                <Button size="sm" variant="outline" onClick={triggerEmbed} disabled={embedRunning}>
                  {embedRunning ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  Run Embedder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Domain Breakdown
                </h3>
                {stats?.byDomain.map(d => (
                  <div key={d.domain} className="flex justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{d.domain.replace(/_/g, ' ')}</span>
                    <Badge variant="outline" className="text-xs">{d.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Crawl History ── */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Database className="h-4 w-4" /> Crawl History ({jobs.length})
        </h3>
        <Button variant="outline" size="sm" onClick={loadJobs}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : jobs.length === 0 ? (
        <Card className="text-center p-8">
          <p className="text-muted-foreground">No crawl jobs yet. Start one above!</p>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {jobs.map(job => (
            <Card key={job.id} className="text-sm">
              <CardContent
                className="py-3 cursor-pointer"
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {statusIcon(job.status)}
                    <span className="truncate font-medium">{job.url}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs capitalize">{job.domain.replace(/_/g, ' ')}</Badge>
                    <Badge variant="outline" className="text-xs">{job.chunks_created || 0} chunks</Badge>
                    {job.nodes_created ? <Badge variant="outline" className="text-xs">{job.nodes_created} embedded</Badge> : null}
                    {expandedJob === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {expandedJob === job.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">Status:</span> {job.status}</p>
                    <p><span className="font-medium text-foreground">Created:</span> {job.created_at ? new Date(job.created_at).toLocaleString() : '—'}</p>
                    {job.completed_at && <p><span className="font-medium text-foreground">Completed:</span> {new Date(job.completed_at).toLocaleString()}</p>}
                    {job.firecrawl_id && <p><span className="font-medium text-foreground">Firecrawl ID:</span> {job.firecrawl_id}</p>}
                    {job.error_msg && <p className="text-destructive"><span className="font-medium">Error:</span> {job.error_msg}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentIngestion;

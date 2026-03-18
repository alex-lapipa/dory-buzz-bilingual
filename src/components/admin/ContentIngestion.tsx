import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Loader2, RefreshCw, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrawlJob {
  id: string;
  url: string;
  domain: string;
  status: string | null;
  chunks_created: number | null;
  nodes_created: number | null;
  created_at: string | null;
  error_msg: string | null;
}

const ContentIngestion: React.FC = () => {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('bee_biology');
  const [crawling, setCrawling] = useState(false);
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('crawl_jobs')
      .select('id, url, domain, status, chunks_created, nodes_created, created_at, error_msg')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setJobs(data);
    setLoading(false);
  };

  const startCrawl = async () => {
    if (!url.trim()) return;
    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl_scraper', {
        body: { url: url.trim(), domain, action: 'scrape' },
      });
      if (error) throw error;
      toast({ title: '🕷️ Crawl Started', description: `Scraping ${url}` });
      setUrl('');
      await loadJobs();
    } catch (e: any) {
      toast({ title: 'Crawl Failed', description: e.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setCrawling(false);
    }
  };

  const statusIcon = (status: string | null) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Ingest Content via Firecrawl
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Input placeholder="https://beeinformed.org/resources" value={url} onChange={e => setUrl(e.target.value)} className="flex-1 min-w-[250px]" />
            <select className="border rounded-md px-3 py-2 text-sm bg-background" value={domain} onChange={e => setDomain(e.target.value)}>
              <option value="bee_biology">Bee Biology</option>
              <option value="permaculture">Permaculture</option>
              <option value="bee_culture">Bee Culture</option>
              <option value="seeds">Seeds</option>
              <option value="garden">Garden</option>
            </select>
            <Button onClick={startCrawl} disabled={crawling || !url.trim()}>
              {crawling ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Globe className="h-4 w-4 mr-1" />}
              Scrape & Ingest
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Content will be scraped, chunked, and embedded into the knowledge base automatically.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Database className="h-4 w-4" /> Recent Crawl Jobs
        </h3>
        <Button variant="outline" size="sm" onClick={loadJobs}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No crawl jobs yet. Start one above!</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {jobs.map(job => (
            <Card key={job.id} className="text-sm">
              <CardContent className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {statusIcon(job.status)}
                  <span className="truncate">{job.url}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs capitalize">{job.domain}</Badge>
                  <Badge variant="outline" className="text-xs">{job.chunks_created || 0} chunks</Badge>
                  <Badge variant="outline" className="text-xs">{job.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentIngestion;

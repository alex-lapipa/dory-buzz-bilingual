import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, RefreshCw, Globe, CheckCircle, AlertCircle, Loader2 } from '@/components/icons/lucide-compat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncStatus {
  entries: number;
  months: string[];
  last_sync: string | null;
}

const LunarCalendarAdmin: React.FC = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [scraping, setScraping] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lunar_calendar_agent', {
        body: { action: 'status' },
      });
      if (error) throw error;
      setStatus(data);
    } catch (err) {
      console.error('Status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('lunar_calendar_agent', {
        body: { action: 'sync' },
      });
      if (error) throw error;
      toast({
        title: '🌙 Lunar Calendar Synced',
        description: `${data.entries_synced} entries ingested and vectorized.`,
      });
      fetchStatus();
    } catch (err: any) {
      toast({ title: 'Sync Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('lunar_calendar_agent', {
        body: { action: 'scrape' },
      });
      if (error) throw error;
      toast({
        title: '🔍 Sources Scraped',
        description: `${data.sources_scraped} sources checked for lunar data.`,
      });
    } catch (err: any) {
      toast({ title: 'Scrape Failed', description: err.message, variant: 'destructive' });
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Moon className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Lunar Calendar 2026</h2>
          <p className="text-sm text-muted-foreground">
            Manage lunar phase data for permaculture guidance
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 
              (status && status.entries > 0) ? <CheckCircle className="h-4 w-4 text-green-500" /> : 
              <AlertCircle className="h-4 w-4 text-amber-500" />
            }
            Knowledge Base Status
          </CardTitle>
          <CardDescription>Lunar calendar entries in mochi_knowledge_base</CardDescription>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={status.entries > 0 ? "default" : "secondary"}>
                  {status.entries} entries
                </Badge>
                {status.last_sync && (
                  <span className="text-xs text-muted-foreground">
                    Last sync: {new Date(status.last_sync).toLocaleDateString()}
                  </span>
                )}
              </div>
              {status.entries === 0 && (
                <p className="text-sm text-amber-600">
                  No lunar data found. Click "Sync Baseline" to ingest the verified 2026 lunar calendar.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading status...</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📥 Sync Baseline Data</CardTitle>
            <CardDescription>
              Ingest verified lunar phase data from rag_09 JSON into knowledge base and vectorize for RAG.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSync} disabled={syncing} className="w-full">
              {syncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              {syncing ? 'Syncing...' : 'Sync Baseline'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔍 Scrape & Validate</CardTitle>
            <CardDescription>
              Scrape timeanddate.com and Farmer's Almanac via Firecrawl to cross-reference lunar data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleScrape} disabled={scraping} variant="outline" className="w-full">
              {scraping ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
              {scraping ? 'Scraping...' : 'Scrape Sources'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🌿 How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>The lunar calendar is a <strong>core knowledge pillar</strong> for Mochi's permaculture guidance.</p>
          <p>• <strong>Baseline JSON</strong> (rag_09) contains verified 2026 lunar phase dates from USNO data.</p>
          <p>• <strong>Sync</strong> ingests this data into <code>mochi_knowledge_base</code> with domain <code>lunar_calendar</code>.</p>
          <p>• <strong>Embedding</strong> via <code>mochi_embed</code> makes it searchable through the RAG pipeline.</p>
          <p>• <strong>Scrape</strong> cross-references external sources to validate accuracy.</p>
          <p>• Mochi and BeeBee automatically access this data when users ask about moon phases, planting times, or permaculture.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LunarCalendarAdmin;

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Zap, Archive, AlertTriangle, Clock, CheckCircle2, XCircle } from 'lucide-react';

type FnStatus = 'active' | 'deprecated' | 'support';

interface EdgeFunctionEntry {
  name: string;
  status: FnStatus;
  category: string;
  description: string;
  lastInvocation?: string | null;
  invocationCount?: number;
}

const EDGE_FUNCTIONS: Omit<EdgeFunctionEntry, 'lastInvocation' | 'invocationCount'>[] = [
  // Primary pipeline
  { name: 'mochi_rag_v2', status: 'active', category: 'Chat', description: 'Primary RAG pipeline — embed → vector search → KG walk → multi-model cascade' },
  // Active support
  { name: 'unified_image_generator', status: 'active', category: 'Media', description: 'Centralized image generation (Flux, DALL-E)' },
  { name: 'unified_voice_hub', status: 'active', category: 'Voice', description: 'TTS/STT hub for voice interactions' },
  { name: 'lunar_calendar_agent', status: 'active', category: 'Content', description: 'Lunar calendar sync, scrape, and status' },
  { name: 'rag_json_ingest', status: 'active', category: 'Data', description: 'Knowledge base JSON ingestion pipeline' },
  { name: 'user_analytics_tracker', status: 'active', category: 'Analytics', description: 'User event and session tracking' },
  { name: 'send-welcome-email', status: 'active', category: 'Email', description: 'Welcome email via Resend' },
  { name: 'elevenlabs_tts', status: 'active', category: 'Voice', description: 'ElevenLabs text-to-speech' },
  { name: 'follow-mochi', status: 'active', category: 'Social', description: 'Follow Mochi social integration' },
  { name: 'generate_storycards', status: 'active', category: 'Content', description: 'AI-generated storycard panels' },
  { name: 'mochi_embed', status: 'active', category: 'Data', description: 'Embedding generation for KB entries' },
  { name: 'learning_content_orchestrator', status: 'active', category: 'Content', description: 'Learning module content orchestration' },
  { name: 'firecrawl_scraper', status: 'active', category: 'Data', description: 'Web scraping via Firecrawl for KB ingestion' },
  { name: 'extract_mochi_character', status: 'active', category: 'Media', description: 'Mochi character extraction from images' },
  { name: 'generate_image', status: 'support', category: 'Media', description: 'Legacy image gen — use unified_image_generator instead' },
  { name: 'advanced_image_generation', status: 'support', category: 'Media', description: 'Advanced image gen — routes to unified_image_generator' },
  { name: 'health_monitor', status: 'active', category: 'System', description: 'System health monitoring' },
  { name: 'comprehensive-health-check', status: 'active', category: 'System', description: 'Comprehensive platform health check' },
  { name: 'insights_generator', status: 'active', category: 'Analytics', description: 'AI-powered improvement insights' },
  { name: 'integration_sync', status: 'active', category: 'System', description: 'Integration synchronization' },
  { name: 'integrations_status_check', status: 'active', category: 'System', description: 'Integration status checker' },
  { name: 'persona_generator', status: 'active', category: 'Analytics', description: 'User persona profiling' },
  { name: 'unified_deployment', status: 'active', category: 'System', description: 'Unified deployment orchestrator' },
  { name: 'realtime_session', status: 'support', category: 'Voice', description: 'Realtime session management' },
  // Deprecated
  { name: 'master_ai_orchestrator', status: 'deprecated', category: 'Chat', description: 'Legacy chat — gpt-4o-mini, no RAG context' },
  { name: 'mochi_master_orchestrator', status: 'deprecated', category: 'Chat', description: 'Duplicate of mochi_rag_v2' },
  { name: 'unified_chat_orchestrator', status: 'deprecated', category: 'Chat', description: 'Legacy load-balancing chat, not called by frontend' },
  { name: 'comprehensive_app_audit', status: 'deprecated', category: 'System', description: 'Static audit with hardcoded values' },
  { name: 'claude_reasoning', status: 'deprecated', category: 'Chat', description: 'Standalone Claude call without RAG' },
  { name: 'design_agent_review', status: 'deprecated', category: 'System', description: 'Design review agent, not called by frontend' },
  { name: 'production_optimizer', status: 'deprecated', category: 'System', description: 'Production optimization, not called by frontend' },
  { name: 'google_health_ping', status: 'deprecated', category: 'System', description: 'Single-purpose Google health ping' },
  { name: 'auth_service', status: 'deprecated', category: 'Auth', description: 'Overlaps with Supabase built-in auth' },
  { name: 'stt_chat', status: 'deprecated', category: 'Voice', description: 'STT chat — may be replaced by unified_voice_hub' },
  { name: 'realtime_voice_chat', status: 'deprecated', category: 'Voice', description: 'Realtime voice — may be replaced by unified_voice_hub' },
  { name: 'mochi_realtime_voice', status: 'deprecated', category: 'Voice', description: 'Mochi realtime voice — may be replaced by unified_voice_hub' },
];

const STATUS_CONFIG: Record<FnStatus, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30', icon: CheckCircle2 },
  support: { label: 'Support', color: 'bg-amber-500/15 text-amber-700 border-amber-500/30', icon: AlertTriangle },
  deprecated: { label: 'Deprecated', color: 'bg-red-500/15 text-red-700 border-red-500/30', icon: XCircle },
};

const EdgeFunctionsDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [invocationData, setInvocationData] = useState<Record<string, { last: string; count: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvocationData();
  }, []);

  const fetchInvocationData = async () => {
    try {
      // Query mochi_integrations for last invocation times grouped by function_category
      const { data } = await supabase
        .from('mochi_integrations')
        .select('function_category, created_at, platform')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (data) {
        const grouped: Record<string, { last: string; count: number }> = {};
        for (const row of data) {
          const key = row.function_category || row.platform || 'unknown';
          if (!grouped[key]) {
            grouped[key] = { last: row.created_at, count: 1 };
          } else {
            grouped[key].count++;
          }
        }
        setInvocationData(grouped);
      }
    } catch (err) {
      console.error('Failed to fetch invocation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(EDGE_FUNCTIONS.map(f => f.category));
    return Array.from(cats).sort();
  }, []);

  const functions = useMemo(() => {
    return EDGE_FUNCTIONS
      .map(fn => ({
        ...fn,
        lastInvocation: invocationData[fn.name]?.last || invocationData[fn.name.replace(/-/g, '_')]?.last || null,
        invocationCount: invocationData[fn.name]?.count || invocationData[fn.name.replace(/-/g, '_')]?.count || 0,
      }))
      .filter(fn => {
        if (statusFilter !== 'all' && fn.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && fn.category !== categoryFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return fn.name.toLowerCase().includes(q) || fn.description.toLowerCase().includes(q) || fn.category.toLowerCase().includes(q);
        }
        return true;
      });
  }, [search, statusFilter, categoryFilter, invocationData]);

  const counts = useMemo(() => ({
    active: EDGE_FUNCTIONS.filter(f => f.status === 'active').length,
    support: EDGE_FUNCTIONS.filter(f => f.status === 'support').length,
    deprecated: EDGE_FUNCTIONS.filter(f => f.status === 'deprecated').length,
    total: EDGE_FUNCTIONS.length,
  }), []);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{counts.total}</div>
            <div className="text-xs text-muted-foreground">Total Functions</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{counts.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{counts.support}</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{counts.deprecated}</div>
            <div className="text-xs text-muted-foreground">Deprecated</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search functions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Function list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-3xl animate-bee-bounce mb-2">🐝</div>
            <p className="text-sm text-muted-foreground">Loading invocation data...</p>
          </div>
        ) : functions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No functions match your filters.</div>
        ) : (
          functions.map(fn => {
            const cfg = STATUS_CONFIG[fn.status];
            const Icon = cfg.icon;
            return (
              <Card key={fn.name} className={fn.status === 'deprecated' ? 'opacity-70' : ''}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-4 w-4 shrink-0" />
                      <code className="text-sm font-mono truncate">{fn.name}</code>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${cfg.color}`}>
                        {cfg.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {fn.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-6 sm:ml-0">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(fn.lastInvocation ?? null)}
                      </span>
                      {fn.invocationCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {fn.invocationCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-6">{fn.description}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EdgeFunctionsDashboard;

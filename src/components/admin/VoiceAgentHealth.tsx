import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AgentHealth {
  id: string;
  agent_name: string;
  agent_id: string;
  status: string;
  error_message: string | null;
  quota_remaining: number | null;
  response_time_ms: number | null;
  checked_at: string;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'healthy': return 'bg-green-500/15 text-green-700 border-green-500/30';
    case 'degraded': return 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30';
    case 'down': return 'bg-red-500/15 text-red-700 border-red-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

const statusEmoji = (s: string) => {
  switch (s) {
    case 'healthy': return '✅';
    case 'degraded': return '⚠️';
    case 'down': return '🔴';
    default: return '❓';
  }
};

export const VoiceAgentHealth: React.FC = () => {
  const [records, setRecords] = useState<AgentHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    // Get latest health check per agent
    const { data } = await supabase
      .from('voice_agent_health')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(20);

    if (data) {
      // Deduplicate to latest per agent
      const latest = new Map<string, AgentHealth>();
      for (const row of data as unknown as AgentHealth[]) {
        if (!latest.has(row.agent_name)) {
          latest.set(row.agent_name, row);
        }
      }
      setRecords(Array.from(latest.values()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  const runManualCheck = async () => {
    setRunningCheck(true);
    try {
      await supabase.functions.invoke('voice_agent_monitor', { body: {} });
      await fetchHealth();
    } catch (e) {
      console.error('Manual health check failed:', e);
    }
    setRunningCheck(false);
  };

  const anyDegraded = records.some(r => r.status !== 'healthy');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            🎙️ Voice Agent Health
            {anyDegraded && <Badge variant="destructive" className="text-xs">Issues Detected</Badge>}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitored every 15 minutes via pg_cron
          </p>
        </div>
        <Button onClick={runManualCheck} disabled={runningCheck} size="sm" variant="outline">
          {runningCheck ? '🔄 Checking…' : '🔍 Run Check Now'}
        </Button>
      </div>

      {/* Alert banner */}
      {anyDegraded && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            ⚠️ One or more voice agents are degraded or down. Check error details below.
          </p>
        </div>
      )}

      {/* Agent cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-2xl animate-bee-bounce">🐝</span>
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No health data yet. Click "Run Check Now" to start monitoring.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {records.map((agent) => (
            <Card key={agent.agent_name} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                agent.status === 'healthy' ? 'bg-green-500' :
                agent.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-base font-semibold">
                    {statusEmoji(agent.status)} {agent.agent_name}
                  </span>
                  <Badge className={statusColor(agent.status)} variant="outline">
                    {agent.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent ID</span>
                  <span className="font-mono text-xs">{agent.agent_id.slice(0, 20)}…</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span>{agent.response_time_ms ?? '—'}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Check</span>
                  <span>{new Date(agent.checked_at).toLocaleString()}</span>
                </div>
                {agent.error_message && (
                  <div className="mt-2 p-2 rounded bg-destructive/10 text-xs text-destructive break-all">
                    {agent.error_message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* History */}
      <HealthHistory />
    </div>
  );
};

const HealthHistory: React.FC = () => {
  const [history, setHistory] = useState<AgentHealth[]>([]);

  useEffect(() => {
    supabase
      .from('voice_agent_health')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setHistory(data as unknown as AgentHealth[]);
      });
  }, []);

  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Health Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-1.5 pr-4">Agent</th>
                <th className="text-left py-1.5 pr-4">Status</th>
                <th className="text-left py-1.5 pr-4">Response</th>
                <th className="text-left py-1.5">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-border/50">
                  <td className="py-1.5 pr-4">{h.agent_name}</td>
                  <td className="py-1.5 pr-4">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColor(h.status)}`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="py-1.5 pr-4">{h.response_time_ms ?? '—'}ms</td>
                  <td className="py-1.5 text-muted-foreground">
                    {new Date(h.checked_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAgentHealth;

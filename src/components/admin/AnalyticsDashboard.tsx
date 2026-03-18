import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users, MessageSquare, Activity, TrendingUp,
  Globe, Clock, Zap, BarChart3, Brain, BookOpen,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(48 96% 53%)',
  'hsl(142 71% 45%)',
  'hsl(262 83% 58%)',
  'hsl(0 84% 60%)',
];

interface Stats {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  totalConversations: number;
  totalChatSessions: number;
  totalIntegrations: number;
  avgResponseTime: number;
  successRate: number;
  knowledgeBaseSize: number;
  beeFacts: number;
}

interface TimeSeriesPoint { date: string; count: number }
interface PieSlice { name: string; value: number }

const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [languageDist, setLanguageDist] = useState<PieSlice[]>([]);
  const [platformDist, setPlatformDist] = useState<PieSlice[]>([]);
  const [userGrowth, setUserGrowth] = useState<TimeSeriesPoint[]>([]);
  const [chatActivity, setChatActivity] = useState<TimeSeriesPoint[]>([]);
  const [featureUsage, setFeatureUsage] = useState<{ name: string; uses: number }[]>([]);
  const [topModels, setTopModels] = useState<PieSlice[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCoreStats(),
      fetchLanguageDistribution(),
      fetchPlatformDistribution(),
      fetchUserGrowth(),
      fetchChatActivity(),
      fetchFeatureUsage(),
      fetchModelUsage(),
    ]);
    setLoading(false);
  };

  const fetchCoreStats = async () => {
    const [profiles, sessions, messages, convos, chatSess, integrations, kb, facts] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('conversations').select('id', { count: 'exact', head: true }),
      supabase.from('chat_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('mochi_integrations').select('response_time_ms, success').limit(500),
      supabase.from('mochi_knowledge_base').select('id', { count: 'exact', head: true }),
      supabase.from('bee_facts').select('id', { count: 'exact', head: true }),
    ]);

    const intData = integrations.data || [];
    const successCount = intData.filter((i) => i.success).length;
    const avgTime = intData.length
      ? Math.round(intData.reduce((s, i) => s + (i.response_time_ms || 0), 0) / intData.length)
      : 0;

    setStats({
      totalUsers: profiles.count || 0,
      totalSessions: sessions.count || 0,
      totalMessages: messages.count || 0,
      totalConversations: convos.count || 0,
      totalChatSessions: chatSess.count || 0,
      totalIntegrations: intData.length,
      avgResponseTime: avgTime,
      successRate: intData.length ? Math.round((successCount / intData.length) * 100) : 0,
      knowledgeBaseSize: kb.count || 0,
      beeFacts: facts.count || 0,
    });
  };

  const fetchLanguageDistribution = async () => {
    const { data } = await supabase.from('profiles').select('language');
    if (!data) return;
    const counts: Record<string, number> = {};
    data.forEach((p) => {
      const lang = p.language || 'en';
      counts[lang] = (counts[lang] || 0) + 1;
    });
    setLanguageDist(Object.entries(counts).map(([name, value]) => ({ name: name === 'en' ? 'English' : name === 'es' ? 'Spanish' : name, value })));
  };

  const fetchPlatformDistribution = async () => {
    const { data } = await supabase.from('mochi_integrations').select('platform').limit(500);
    if (!data) return;
    const counts: Record<string, number> = {};
    data.forEach((i) => { counts[i.platform] = (counts[i.platform] || 0) + 1; });
    setPlatformDist(Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));
  };

  const fetchUserGrowth = async () => {
    const { data } = await supabase.from('profiles').select('created_at').order('created_at', { ascending: true });
    if (!data) return;
    const byDay: Record<string, number> = {};
    data.forEach((p) => {
      const day = p.created_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    // Cumulative
    let cumulative = 0;
    setUserGrowth(Object.entries(byDay).map(([date, count]) => {
      cumulative += count;
      return { date, count: cumulative };
    }));
  };

  const fetchChatActivity = async () => {
    const { data } = await supabase.from('messages').select('created_at').order('created_at', { ascending: true }).limit(1000);
    if (!data) return;
    const byDay: Record<string, number> = {};
    data.forEach((m) => {
      const day = m.created_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    setChatActivity(Object.entries(byDay).map(([date, count]) => ({ date, count })));
  };

  const fetchFeatureUsage = async () => {
    const { data } = await supabase.from('feature_usage').select('feature_name, usage_count').order('usage_count', { ascending: false }).limit(10);
    if (!data) return;
    setFeatureUsage(data.map((f) => ({ name: f.feature_name, uses: f.usage_count || 0 })));
  };

  const fetchModelUsage = async () => {
    const { data } = await supabase.from('mochi_integrations').select('model').limit(500);
    if (!data) return;
    const counts: Record<string, number> = {};
    data.forEach((i) => {
      const model = i.model || 'unknown';
      counts[model] = (counts[model] || 0) + 1;
    });
    setTopModels(Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">📊</div>
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Users" value={stats?.totalUsers ?? 0} color="text-blue-500" />
        <KpiCard icon={MessageSquare} label="Messages" value={stats?.totalMessages ?? 0} color="text-green-500" />
        <KpiCard icon={Activity} label="Conversations" value={stats?.totalConversations ?? 0} color="text-purple-500" />
        <KpiCard icon={Zap} label="AI Calls" value={stats?.totalIntegrations ?? 0} color="text-amber-500" />
        <KpiCard icon={Clock} label="Avg Response" value={`${stats?.avgResponseTime ?? 0}ms`} color="text-cyan-500" />
        <KpiCard icon={TrendingUp} label="Success Rate" value={`${stats?.successRate ?? 0}%`} color="text-emerald-500" />
        <KpiCard icon={Brain} label="KB Entries" value={stats?.knowledgeBaseSize ?? 0} color="text-indigo-500" />
        <KpiCard icon={BookOpen} label="Bee Facts" value={stats?.beeFacts ?? 0} color="text-orange-500" />
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="growth"><BarChart3 className="h-4 w-4 mr-1" /> Growth</TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-1" /> Chat</TabsTrigger>
          <TabsTrigger value="ai"><Zap className="h-4 w-4 mr-1" /> AI Models</TabsTrigger>
          <TabsTrigger value="features"><Activity className="h-4 w-4 mr-1" /> Features</TabsTrigger>
          <TabsTrigger value="audience"><Globe className="h-4 w-4 mr-1" /> Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader><CardTitle className="text-base">User Growth (Cumulative)</CardTitle></CardHeader>
            <CardContent className="h-72">
              {userGrowth.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Chat Messages</CardTitle></CardHeader>
            <CardContent className="h-72">
              {chatActivity.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chatActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">AI Platform Distribution</CardTitle></CardHeader>
              <CardContent className="h-72">
                {platformDist.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={platformDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {platformDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyChart />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Model Usage</CardTitle></CardHeader>
              <CardContent className="h-72">
                {topModels.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topModels} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyChart />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader><CardTitle className="text-base">Top Feature Usage</CardTitle></CardHeader>
            <CardContent className="h-72">
              {featureUsage.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureUsage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
                    <Tooltip />
                    <Bar dataKey="uses" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyChart label="No feature usage data yet" />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Language Distribution</CardTitle></CardHeader>
              <CardContent className="h-72">
                {languageDist.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={languageDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {languageDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyChart />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Session Statistics</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  <StatRow label="Total Sessions" value={stats?.totalSessions ?? 0} />
                  <StatRow label="Chat Sessions" value={stats?.totalChatSessions ?? 0} />
                  <StatRow label="Total Conversations" value={stats?.totalConversations ?? 0} />
                  <StatRow label="Total Messages" value={stats?.totalMessages ?? 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ── Small sub-components ── */

const KpiCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
  <Card>
    <CardContent className="flex items-center gap-3 p-4">
      <Icon className={`h-8 w-8 shrink-0 ${color}`} />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
    </CardContent>
  </Card>
);

const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <Badge variant="secondary" className="font-mono">{value.toLocaleString()}</Badge>
  </div>
);

const EmptyChart: React.FC<{ label?: string }> = ({ label = 'No data available yet' }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">{label}</div>
);

export default AnalyticsDashboard;

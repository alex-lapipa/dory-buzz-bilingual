import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, MessageSquare, ChevronDown, ChevronUp } from '@/components/icons/lucide-compat';

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

interface Message {
  id: string;
  content: string;
  type: string;
  created_at: string;
}

const ChatManagement: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at, updated_at, user_id')
      .order('updated_at', { ascending: false })
      .limit(100);
    if (data) setConversations(data);
    setLoading(false);
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    setLoadingMessages(true);
    const { data } = await supabase
      .from('messages')
      .select('id, content, type, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
      .limit(50);
    setMessages(data || []);
    setLoadingMessages(false);
  };

  const filtered = conversations.filter(c =>
    !search || (c.title || '').toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">{conversations.length} Conversations</span>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {filtered.map(conv => (
            <Card key={conv.id} className="text-sm">
              <CardHeader className="py-3 cursor-pointer" onClick={() => toggleExpand(conv.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{conv.title || 'Untitled Conversation'}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </Badge>
                      {conv.user_id ? (
                        <Badge variant="secondary" className="text-xs">Authenticated</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Guest</Badge>
                      )}
                    </div>
                  </div>
                  {expandedId === conv.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
              {expandedId === conv.id && (
                <CardContent className="pt-0">
                  {loadingMessages ? (
                    <Skeleton className="h-20" />
                  ) : messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No messages found.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {messages.map(msg => (
                        <div key={msg.id} className={`p-2 rounded text-xs ${msg.type === 'user' ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'}`}>
                          <span className="font-medium capitalize">{msg.type}: </span>
                          <span className="line-clamp-3">{msg.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatManagement;

/**
 * useSystemStatus — polls the public-readable v_system_status view from Supabase.
 *
 * Powers both the homepage SystemStatusBadge and the full /status page.
 * The view itself was added in the recent backend hardening pass and is
 * granted SELECT to anon, so this works without authentication.
 *
 * Defaults to a 60-second poll interval; passing `intervalMs: 0` disables polling.
 */
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemStatusRow {
  overall_status: string;
  active_agents: number;
  active_routes: number;
  fallback_routes: number;
  kb_chunks_embedded: number;
  bee_facts: number;
  storycards: number;
  vocabulary_cards: number;
  kg_nodes: number;
  rag_requests_24h: number;
  conversations_lifetime: number;
  as_of: string;
}

export interface UseSystemStatusResult {
  status: SystemStatusRow | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  refresh: () => Promise<void>;
}

export function useSystemStatus(intervalMs = 60_000): UseSystemStatusResult {
  const [status, setStatus] = useState<SystemStatusRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const timerRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const fetchStatus = async () => {
    try {
      // The view is in the public schema and grants SELECT to anon
      const { data, error: queryError } = await (supabase as any)
        .from('v_system_status')
        .select('*')
        .limit(1)
        .single();

      if (!isMountedRef.current) return;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      setStatus(data as SystemStatusRow);
      setError(null);
      setLastFetched(new Date());
      setLoading(false);
    } catch (e) {
      if (!isMountedRef.current) return;
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchStatus();

    if (intervalMs > 0) {
      timerRef.current = window.setInterval(fetchStatus, intervalMs);
    }

    return () => {
      isMountedRef.current = false;
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { status, loading, error, lastFetched, refresh: fetchStatus };
}

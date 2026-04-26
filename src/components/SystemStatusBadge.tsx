/**
 * SystemStatusBadge — a compact, friendly status indicator.
 *
 * - Pulls live data from the v_system_status view via useSystemStatus()
 * - Renders a small "breathing" dot + bilingual status text
 * - Links to the full /status page for the curious
 * - Bilingual via useLanguage()
 * - Fully accessible: role=status, aria-live=polite
 * - Respects prefers-reduced-motion (the .float-soft animation honors it)
 *
 * This is purely additive: any page can import + render it. The homepage
 * gets it via LearningHub, but it doesn't replace anything.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSystemStatus } from '@/hooks/useSystemStatus';

export const SystemStatusBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { status, loading, error } = useSystemStatus();

  const isHealthy = !error && !!status && status.overall_status === 'healthy';

  // Color mapping: healthy = honey/primary, error/loading = muted
  const dotColor = isHealthy ? 'bg-emerald-500' : error ? 'bg-amber-500' : 'bg-muted-foreground';

  const labelEn = loading
    ? 'Checking…'
    : error
      ? 'Status unavailable'
      : `Mochi is buzzing — ${status?.kb_chunks_embedded ?? 0} facts ready`;

  const labelEs = loading
    ? 'Comprobando…'
    : error
      ? 'Estado no disponible'
      : `Mochi está zumbando — ${status?.kb_chunks_embedded ?? 0} datos listos`;

  return (
    <Link
      to="/status"
      role="status"
      aria-live="polite"
      aria-label={language === 'es' ? labelEs : labelEn}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        text-xs font-medium text-muted-foreground
        rounded-2026-sm border border-transparent
        hover:border-primary/30 hover:bg-primary/5
        transition-colors duration-200
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      <span className="relative inline-flex h-2 w-2">
        {isHealthy && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60 animate-ping`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span>{language === 'es' ? labelEs : labelEn}</span>
    </Link>
  );
};

export default SystemStatusBadge;

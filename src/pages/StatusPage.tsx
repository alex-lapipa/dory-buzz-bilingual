/**
 * /status — public live system status page.
 *
 * Surfaces the work from the recent backend hardening pass to anyone curious:
 *   • RAG corpus coverage (4 vector stores, 712 vectors total)
 *   • Active agents + routing rules (with fallback indicator)
 *   • 24h activity from rag_request_log
 *   • Lifetime numbers (conversations, content)
 *   • Last refresh timestamp + bilingual labels
 *
 * Uses only existing UI primitives and the new design-system-2026 utilities.
 * Pure read-only — no admin auth required. The view itself is granted
 * SELECT to anon.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { PageSEO } from '@/components/PageSEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PollenSparkle, MusicalFlower } from '@/components/icons';

const StatusPage: React.FC = () => {
  const { language } = useLanguage();
  const { status, loading, error, lastFetched, refresh } = useSystemStatus(60_000);

  const t = (en: string, es: string) => (language === 'es' ? es : en);

  const StatRow: React.FC<{ label: string; value: React.ReactNode; emoji?: string }> = ({ label, value, emoji }) => (
    <div className="flex items-baseline justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">
        {emoji && <span className="mr-2">{emoji}</span>}
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );

  return (
    <>
      <PageSEO
        titleEn="System Status — MochiBee"
        titleEs="Estado del Sistema — MochiBee"
        descriptionEn="Live operational status for the MochiBee bilingual learning platform — RAG corpus, agents, traffic and routing."
        descriptionEs="Estado operativo en vivo de la plataforma MochiBee — corpus RAG, agentes, tráfico y enrutamiento."
        path="/status"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 surface-glass has-grain px-6 py-8 sm:px-10 sm:py-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {t('Live · 60s refresh', 'En vivo · refresca cada 60s')}
            </Badge>
            <PollenSparkle className="h-6 w-6 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
            {t('System Status', 'Estado del Sistema')}{' '}
            <span className="text-3xl sm:text-4xl">🐝</span>
          </h1>

          <p className="text-lg text-foreground/80 max-w-md mx-auto leading-relaxed text-pretty">
            {t(
              'A live look inside the hive — what Mochi is running on right now.',
              'Una mirada en vivo dentro de la colmena — sobre qué está funcionando Mochi ahora mismo.',
            )}
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MusicalFlower className="h-4 w-4" />
            <span>
              {lastFetched
                ? t(
                    `Last update ${lastFetched.toLocaleTimeString('en-GB')}`,
                    `Última actualización ${lastFetched.toLocaleTimeString('es-ES')}`,
                  )
                : t('Loading…', 'Cargando…')}
            </span>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <Card className="border-2 border-amber-300 bg-amber-50">
            <CardContent className="p-6">
              <h2 className="font-semibold text-amber-900 mb-2">
                {t('Status briefly unavailable', 'Estado temporalmente no disponible')}
              </h2>
              <p className="text-sm text-amber-800">
                {t(
                  'No need to worry — the site itself is up. The status feed is just catching up. Try refreshing in a moment.',
                  'No te preocupes — el sitio está funcionando. La fuente de estado se está poniendo al día. Intenta refrescar en un momento.',
                )}
              </p>
              <p className="mt-2 text-xs text-amber-700/70 font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && !status && (
          <Card data-card="lift">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                <div className="skeleton-2026 h-3 w-3/4" />
                <div className="skeleton-2026 h-3 w-1/2" />
                <div className="skeleton-2026 h-3 w-2/3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status grid */}
        {status && (
          <>
            {/* Top-level overall status */}
            <Card data-card="lift" className="border-2 border-emerald-300/60">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative inline-flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {t('All systems healthy', 'Todos los sistemas funcionando')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'Knowledge base, agents, voice and routing are all running.',
                        'Base de conocimientos, agentes, voz y enrutamiento funcionando.',
                      )}
                    </p>
                  </div>
                  <button
                    onClick={refresh}
                    className="text-xs px-3 py-1.5 rounded-2026-sm border border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    {t('Refresh now', 'Actualizar ahora')}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Three-column overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card data-card="lift">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t('Knowledge Base', 'Base de conocimientos')}
                  </h3>
                  <StatRow
                    emoji="📚"
                    label={t('Knowledge chunks', 'Fragmentos')}
                    value={status.kb_chunks_embedded.toLocaleString()}
                  />
                  <StatRow
                    emoji="🐝"
                    label={t('Bee facts', 'Datos de abejas')}
                    value={status.bee_facts}
                  />
                  <StatRow
                    emoji="🌐"
                    label={t('Knowledge graph nodes', 'Nodos del grafo')}
                    value={status.kg_nodes}
                  />
                  <StatRow
                    emoji="🔤"
                    label={t('Vocabulary cards', 'Tarjetas de vocabulario')}
                    value={status.vocabulary_cards}
                  />
                  <StatRow
                    emoji="📖"
                    label={t('Storycards', 'Cuentos ilustrados')}
                    value={status.storycards}
                  />
                </CardContent>
              </Card>

              <Card data-card="lift">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t('AI Agents', 'Agentes IA')}
                  </h3>
                  <StatRow
                    emoji="🤖"
                    label={t('Active agents', 'Agentes activos')}
                    value={status.active_agents}
                  />
                  <StatRow
                    emoji="🚦"
                    label={t('Routing rules', 'Reglas de enrutamiento')}
                    value={status.active_routes}
                  />
                  <StatRow
                    emoji="↩️"
                    label={t('Fallback routes', 'Rutas de respaldo')}
                    value={status.fallback_routes}
                  />
                </CardContent>
              </Card>

              <Card data-card="lift">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t('Activity', 'Actividad')}
                  </h3>
                  <StatRow
                    emoji="⚡"
                    label={t('RAG requests, 24h', 'Consultas RAG, 24h')}
                    value={status.rag_requests_24h.toLocaleString()}
                  />
                  <StatRow
                    emoji="💬"
                    label={t('Conversations, lifetime', 'Conversaciones totales')}
                    value={status.conversations_lifetime.toLocaleString()}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Plain-English summary */}
            <Card data-card="lift">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-semibold mb-3">
                  {t('What this means', 'Lo que significa')}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
                  {t(
                    `Mochi has ${status.kb_chunks_embedded} pieces of bee, garden and seed knowledge ready to share, plus a knowledge graph of ${status.kg_nodes} concepts linked together. ${status.active_agents} specialised agents handle different kinds of questions, with ${status.fallback_routes} backup routes ready if any service has a hiccup. Voice, text and the visual cards you see are all running.`,
                    `Mochi tiene ${status.kb_chunks_embedded} piezas de conocimiento sobre abejas, jardines y semillas listas para compartir, más un grafo de conocimiento con ${status.kg_nodes} conceptos conectados. ${status.active_agents} agentes especializados manejan diferentes tipos de preguntas, con ${status.fallback_routes} rutas de respaldo listas por si algún servicio tiene un hipo. La voz, el texto y las tarjetas visuales que ves están todos funcionando.`,
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                {t(
                  `Snapshot taken ${new Date(status.as_of).toLocaleString('en-GB')}`,
                  `Captura tomada ${new Date(status.as_of).toLocaleString('es-ES')}`,
                )}
              </p>
              <Link
                to="/"
                className="inline-block text-sm text-primary hover:underline underline-offset-4"
              >
                {t('← Back to Mochi', '← Volver a Mochi')}
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StatusPage;

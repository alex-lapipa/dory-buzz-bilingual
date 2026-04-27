/**
 * /miel-de-montes — bespoke music page for the Miel de Montes / Toño series.
 *
 * Design language: dialogue with techno.dog — the global techno culture
 * archive. Strict mono typography (IBM Plex Mono + Space Mono), pure-black
 * background, lawn-green primary accent (#7CFC00), crimson secondary,
 * brutalist sharp corners, terminal-archive layout, glitch chromatic edges.
 *
 * Source-of-truth: SONGS array exported from /pages/kids/KidsSongs.tsx,
 * filtered for ids starting with 'miel-de-montes'. Lyrics imported from
 * /pages/kids/songLyrics.ts. Audio playback logic mirrored from the kids
 * page — no shared state, fresh audioRef so the two players never collide.
 *
 * The 4 cards rendered here NEVER appear on /kids-songs (filtered out
 * there too). Adding a 5th Miel de Montes track to the SONGS array auto-
 * routes it here — no nav plumbing needed.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageSEO } from '@/components/PageSEO';
import { SONGS } from './kids/KidsSongs';
import { SONG_LYRICS, SECTION_NAMES_ES } from './kids/songLyrics';
import { toast } from 'sonner';
import '@/styles/mochi-tokens.css';

// Filter from the shared SONGS source-of-truth
const TRACKS = SONGS.filter((s) => s.id.startsWith('miel-de-montes'));

type PlayMode = 'vocal' | 'instrumental';
type PlayState = { id: string; mode: PlayMode } | null;

// Catalog metadata layered onto the existing track records — purely
// visual flavour for the archive layout. Falls back gracefully when a
// new track ships before its catalog row is added.
const CATALOG: Record<string, {
  catNo: string; bpm: string; key: string; duration: string; genre: string;
}> = {
  'miel-de-montes': {
    catNo: '/001', bpm: '128', key: 'E MIN', duration: '02:30',
    genre: 'INDIE-ROCK · KRAUTROCK',
  },
  'miel-de-montes-extended': {
    catNo: '/002', bpm: '128', key: 'E MIN', duration: '04:10',
    genre: 'INDIE-TRONICA · MOTORIK',
  },
  'miel-de-montes-extended-en': {
    catNo: '/003', bpm: '128', key: 'E MIN', duration: '04:10',
    genre: 'INDIE-TRONICA · TB-303',
  },
  'miel-de-montes-industrial-en': {
    catNo: '/004', bpm: '132', key: 'E MIN', duration: '04:30',
    genre: 'INDUSTRIAL-TECHNO · ELECTROCLASH',
  },
};

const resolveVocalUrl = (
  song: typeof SONGS[number],
  language: 'en' | 'es'
): string | undefined => {
  const s = song as Record<string, string | undefined>;
  if (language === 'es' && s.vocalEsUrl) return s.vocalEsUrl;
  if (language === 'en' && s.vocalEnUrl) return s.vocalEnUrl;
  return s.vocalEnUrl || s.vocalEsUrl || s.vocalUrl;
};

const MielDeMontes: React.FC = () => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<PlayState>(null);
  const [openLyricsId, setOpenLyricsId] = useState<string | null>(null);

  const isPlaying = (id: string, mode: PlayMode) =>
    playing?.id === id && playing?.mode === mode;

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(null);
  };

  const playTrack = (
    track: typeof SONGS[number],
    mode: PlayMode
  ) => {
    const t = track as Record<string, string | undefined>;
    const url = mode === 'vocal'
      ? resolveVocalUrl(track, language === 'es' ? 'es' : 'en')
      : t.instrumentalUrl;
    if (!url) return;
    if (isPlaying(track.id, mode)) {
      stopAll();
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      toast.error(language === 'es'
        ? 'No se pudo reproducir.'
        : 'Playback failed.');
    });
    setPlaying({ id: track.id, mode });
    audioRef.current.onended = () => setPlaying(null);
  };

  useEffect(() => () => { stopAll(); }, []);

  const toggleLyrics = (id: string) =>
    setOpenLyricsId((c) => (c === id ? null : id));

  const shareTrack = async (track: typeof SONGS[number]) => {
    const t = track as Record<string, string>;
    const url = `https://www.mochinillo.com/miel-de-montes#track-${t.id}`;
    const title = t.title_en || t.title_es || 'Miel de Montes';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch { /* fall through to clipboard */ }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(language === 'es' ? 'Enlace copiado' : 'Link copied');
      } catch {
        toast.error(language === 'es' ? 'No se pudo copiar' : 'Copy failed');
      }
    }
  };

  const accent = '#7CFC00';        // techno-green / lawn-green
  const accentDim = '#4f9c00';
  const crimson = '#dc2626';
  const surface = '#0a0a0a';
  const surfaceAlt = '#141414';
  const textPrimary = '#f4faff';
  const textMuted = 'rgba(244,250,255,0.62)';
  const border = 'rgba(124,252,0,0.22)';

  const mono = "'IBM Plex Mono', 'Space Mono', 'JetBrains Mono', ui-monospace, monospace";

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: textPrimary,
        fontFamily: mono,
        position: 'relative',
        paddingBottom: 80,
      }}
    >
      <PageSEO
        titleEn="Miel de Montes — A Tribute Series for Toño | Mochi de los Huertos"
        titleEs="Miel de Montes — Serie tributo para Toño | Mochi de los Huertos"
        descriptionEn="Indie-tronica, krautrock motorik, minimal-techno, TB-303 acid bass, industrial-techno. Four cuts written for Toño and his family who make heather honey in the Bierzo mountains. Designed in dialogue with techno.dog."
        descriptionEs="Indie-tronica, motorik krautrock, techno minimal, bajo ácido TB-303, industrial-techno. Cuatro cortes para Toño y su familia que hacen miel de brezo en los montes del Bierzo. En diálogo con techno.dog."
      />

      {/* Subtle scan-line + grid texture overlays — fixed, not parallax */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 2px, rgba(124,252,0,0.025) 2px, rgba(124,252,0,0.025) 3px)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(124,252,0,0.04) 1px, transparent 1px) 0 0 / 100% 64px,' +
            'linear-gradient(90deg, rgba(124,252,0,0.04) 1px, transparent 1px) 0 0 / 64px 100%',
        }}
      />

      {/* ─── Top archive bar ─── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(0,0,0,0.86)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{
          maxWidth: 980, margin: '0 auto',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>
          <a href="/" style={{ color: textMuted, textDecoration: 'none' }}>
            ← MOCHI / HOME
          </a>
          <span style={{ color: accent }}>
            ARCHIVE / MIEL DE MONTES / {String(TRACKS.length).padStart(2, '0')} CUTS
          </span>
          <a
            href="https://techno.dog"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: textMuted, textDecoration: 'none',
              borderBottom: `1px dashed ${textMuted}`,
              paddingBottom: 1,
            }}
          >
            ↗ TECHNO.DOG
          </a>
        </div>
      </header>

      {/* ─── Hero / colophon ─── */}
      <section
        style={{
          maxWidth: 980, margin: '0 auto',
          padding: '64px 24px 32px',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: accent, marginBottom: 20 }}>
          / 001 — 004 · TRIBUTE SERIES · TOÑO · BIERZO MOUNTAINS
        </div>
        <h1
          style={{
            fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 8vw, 5.2rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            margin: 0,
            color: textPrimary,
            textShadow:
              '2px 0 0 rgba(220,38,38,0.55), -2px 0 0 rgba(124,252,0,0.55)',
          }}
        >
          MIEL DE<br/>MONTES
        </h1>
        <div
          style={{
            marginTop: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 1,
            border: `1px solid ${border}`,
            background: border,
          }}
        >
          {[
            { k: 'SERIES', v: 'TRIBUTE / TOÑO' },
            { k: 'TRACKS', v: String(TRACKS.length).padStart(2, '0') },
            { k: 'KEY', v: 'E MIN' },
            { k: 'BPM', v: '128 — 132' },
            { k: 'GENRE', v: 'INDIE-TRONICA → INDUSTRIAL' },
            { k: 'ORIGIN', v: 'BIERZO · ASTURIAS · BERLIN' },
            { k: 'COMPOSED BY', v: 'ALEX LAWTON', href: 'https://alexlawton.io' },
          ].map((cell) => (
            <div key={cell.k} style={{ background: surface, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: textMuted }}>
                {cell.k}
              </div>
              {cell.href ? (
                <a
                  href={cell.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    fontSize: 13, letterSpacing: '0.04em', color: accent,
                    marginTop: 4, fontWeight: 500,
                    textDecoration: 'none',
                    borderBottom: `1px dashed ${accent}`,
                    paddingBottom: 1,
                  }}
                >
                  {cell.v}
                </a>
              ) : (
                <div style={{
                  fontSize: 13, letterSpacing: '0.04em', color: textPrimary,
                  marginTop: 4, fontWeight: 500,
                }}>
                  {cell.v}
                </div>
              )}
            </div>
          ))}
        </div>
        <p
          style={{
            marginTop: 28, maxWidth: '60ch',
            fontSize: 14.5, lineHeight: 1.65, color: textMuted,
            letterSpacing: '0.005em', fontWeight: 400,
          }}
        >
          {language === 'es' ? (
            <>
              Cuatro cortes escritos para <strong style={{color: textPrimary}}>Toño</strong> y su familia,
              que hacen miel de brezo en los montes del Bierzo. Construidos sobre motorik krautrock,
              precisión de sintetizador secuenciado, ruptura de techno minimal y rabia rockera
              anticomercial. Bajo ácido TB-303 entra en la segunda mitad de los cortes extendidos.
              La versión <em>Industrial Cut</em> empuja la serie a territorio de club berlinés.
              <br/><br/>
              Diseñado en diálogo con <a href="https://techno.dog" target="_blank" rel="noopener noreferrer"
                style={{color: accent, textDecoration: 'underline', textDecorationStyle: 'dashed'}}>techno.dog</a> —
              el archivo abierto de cultura techno underground.
            </>
          ) : (
            <>
              Four cuts written for <strong style={{color: textPrimary}}>Toño</strong> and his family,
              who make heather honey in the Bierzo mountains. Built on krautrock motorik, sequenced
              synth precision, minimal-techno breakdown, and anti-commercial rock grit. TB-303 acid
              bass enters the second half of the extended cuts. The <em>Industrial Cut</em> pushes
              the series into Berlin club territory.
              <br/><br/>
              Designed in dialogue with <a href="https://techno.dog" target="_blank" rel="noopener noreferrer"
                style={{color: accent, textDecoration: 'underline', textDecorationStyle: 'dashed'}}>techno.dog</a> —
              the open archive of underground techno culture.
            </>
          )}
        </p>
      </section>

      {/* ─── Track list ─── */}
      <section
        style={{
          maxWidth: 980, margin: '0 auto',
          padding: '8px 24px 64px',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 11, letterSpacing: '0.18em', color: textMuted,
          marginBottom: 16, marginTop: 32,
          borderTop: `1px solid ${border}`, paddingTop: 16,
        }}>
          <span style={{color: accent}}>━━━</span> TRACKLIST <span style={{color: accent}}>━━━</span>
        </div>

        <div role="list">
          {TRACKS.map((track) => {
            const t = track as Record<string, string | undefined>;
            const cat = CATALOG[track.id] || { catNo: '/00X', bpm: '—', key: '—', duration: '—', genre: '—' };
            const lyrics = SONG_LYRICS[track.id]
              ? SONG_LYRICS[track.id][language === 'es' ? 'es' : 'en']
              : undefined;
            const hasVocal = Boolean(resolveVocalUrl(track, language === 'es' ? 'es' : 'en'));
            const hasInstrumental = Boolean(t.instrumentalUrl);
            const playingVocal = isPlaying(track.id, 'vocal');
            const playingInstrumental = isPlaying(track.id, 'instrumental');
            const isAnyPlaying = playingVocal || playingInstrumental;
            const isLyricsOpen = openLyricsId === track.id;

            return (
              <article
                key={track.id}
                id={`track-${track.id}`}
                role="listitem"
                style={{
                  border: `1px solid ${isAnyPlaying ? accent : border}`,
                  background: isAnyPlaying
                    ? 'linear-gradient(180deg, rgba(124,252,0,0.06) 0%, rgba(0,0,0,0.4) 100%)'
                    : surface,
                  marginBottom: 12,
                  position: 'relative',
                  scrollMarginTop: 80,
                  transition: 'border-color 200ms ease',
                }}
              >
                {/* Glitch chromatic edge on play */}
                {isAnyPlaying && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', inset: -1, pointerEvents: 'none',
                    boxShadow: '0 0 0 1px rgba(220,38,38,0.4) inset, 1px 0 0 rgba(220,38,38,0.4), -1px 0 0 rgba(124,252,0,0.4)',
                  }} />
                )}

                {/* Track header row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(56px, auto) 1fr auto',
                  alignItems: 'baseline',
                  gap: 16,
                  padding: '20px 20px 8px',
                  borderBottom: `1px dashed ${border}`,
                }}>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 22, fontWeight: 700, color: accent,
                    letterSpacing: '0.04em',
                  }}>
                    {cat.catNo}
                  </div>
                  <h2 style={{
                    margin: 0,
                    fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
                    fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: textPrimary,
                    textTransform: 'uppercase',
                    lineHeight: 1.15,
                  }}>
                    {language === 'es' ? track.title_es : track.title_en}
                  </h2>
                  <div style={{
                    fontSize: 10.5, letterSpacing: '0.18em', color: textMuted,
                    textTransform: 'uppercase', fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}>
                    {cat.duration}
                  </div>
                </div>

                {/* Metadata strip */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '4px 14px',
                  padding: '10px 20px',
                  fontSize: 10.5, letterSpacing: '0.16em', color: textMuted,
                  textTransform: 'uppercase', fontWeight: 500,
                  borderBottom: `1px dashed ${border}`,
                }}>
                  <span><span style={{color: accentDim}}>BPM </span>{cat.bpm}</span>
                  <span><span style={{color: accentDim}}>KEY </span>{cat.key}</span>
                  <span><span style={{color: accentDim}}>GENRE </span>{cat.genre}</span>
                </div>

                {/* Description body */}
                <p style={{
                  padding: '14px 20px 6px',
                  margin: 0,
                  fontSize: 13.5, lineHeight: 1.6,
                  color: textMuted,
                  letterSpacing: '0.005em',
                  fontWeight: 400,
                  maxWidth: '70ch',
                }}>
                  {language === 'es' ? track.description_es : track.description_en}
                </p>

                {/* Action row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 1,
                  padding: '12px 20px 20px',
                  marginTop: 6,
                }}>
                  <button
                    type="button"
                    onClick={() => hasVocal && playTrack(track, 'vocal')}
                    disabled={!hasVocal}
                    style={{
                      fontFamily: mono,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      padding: '12px 14px',
                      background: playingVocal ? accent : 'transparent',
                      color: playingVocal ? '#000' : (hasVocal ? accent : textMuted),
                      border: `1px solid ${playingVocal ? accent : (hasVocal ? accent : border)}`,
                      cursor: hasVocal ? 'pointer' : 'not-allowed',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {playingVocal ? '■ STOP' : '▶ LISTEN'}
                  </button>
                  <button
                    type="button"
                    onClick={() => hasInstrumental && playTrack(track, 'instrumental')}
                    disabled={!hasInstrumental}
                    style={{
                      fontFamily: mono,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      padding: '12px 14px',
                      background: playingInstrumental ? crimson : 'transparent',
                      color: playingInstrumental ? '#fff' : (hasInstrumental ? crimson : textMuted),
                      border: `1px solid ${playingInstrumental ? crimson : (hasInstrumental ? crimson : border)}`,
                      cursor: hasInstrumental ? 'pointer' : 'not-allowed',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {playingInstrumental ? '■ STOP' : '▶ INSTRUMENTAL'}
                  </button>
                  {lyrics && lyrics.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleLyrics(track.id)}
                      style={{
                        fontFamily: mono,
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        padding: '12px 14px',
                        background: 'transparent',
                        color: textPrimary,
                        border: `1px solid ${border}`,
                        cursor: 'pointer',
                      }}
                    >
                      {isLyricsOpen ? '▴ HIDE LYRICS' : '▾ LYRICS'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => shareTrack(track)}
                    style={{
                      fontFamily: mono,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      padding: '12px 14px',
                      background: 'transparent',
                      color: textMuted,
                      border: `1px solid ${border}`,
                      cursor: 'pointer',
                    }}
                  >
                    ↗ SHARE
                  </button>
                </div>

                {/* Lyrics panel */}
                {isLyricsOpen && lyrics && (
                  <div
                    id={`lyrics-${track.id}`}
                    style={{
                      borderTop: `1px solid ${border}`,
                      background: '#050505',
                      padding: '20px 24px 24px',
                    }}
                  >
                    {lyrics.map((section, sIdx) => (
                      <div key={sIdx} style={{ marginBottom: sIdx < lyrics.length - 1 ? 18 : 0 }}>
                        <div style={{
                          fontSize: 10, letterSpacing: '0.22em', color: accent,
                          textTransform: 'uppercase', fontWeight: 700,
                          marginBottom: 6,
                        }}>
                          {language === 'es' && SECTION_NAMES_ES[section.name]
                            ? SECTION_NAMES_ES[section.name]
                            : section.name}
                        </div>
                        <div style={{
                          fontFamily: mono,
                          fontSize: 13.5, lineHeight: 1.7,
                          color: textPrimary,
                          letterSpacing: '0.005em',
                        }}>
                          {section.lines.map((ln, lnIdx) => (
                            <div key={lnIdx}>{ln}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── Colophon footer ─── */}
      <footer
        style={{
          maxWidth: 980, margin: '0 auto',
          padding: '32px 24px 64px',
          borderTop: `1px solid ${border}`,
          fontSize: 11, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: textMuted,
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        <div>
          <div style={{ color: accent, marginBottom: 8 }}>↗ DIALOGUE</div>
          <a
            href="https://techno.dog"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: textPrimary, textDecoration: 'none',
              borderBottom: `1px dashed ${textMuted}`, paddingBottom: 1,
            }}
          >
            TECHNO.DOG
          </a>
          <div style={{ fontSize: 10, color: textMuted, marginTop: 6, letterSpacing: '0.06em', textTransform: 'none' }}>
            Global techno culture archive. Open-source, community-built, strictly non-commercial.
          </div>
        </div>
        <div>
          <div style={{ color: accent, marginBottom: 8 }}>↗ ECOSYSTEM</div>
          <a href="https://lapipa.io" target="_blank" rel="noopener noreferrer" style={{ color: textPrimary, textDecoration: 'none', display: 'block', marginBottom: 4 }}>LAPIPA.IO</a>
          <a href="https://simientesinfinitas.com" target="_blank" rel="noopener noreferrer" style={{ color: textPrimary, textDecoration: 'none', display: 'block', marginBottom: 4 }}>SIMIENTES INFINITAS</a>
          <a href="/kids-songs" style={{ color: textMuted, textDecoration: 'none', display: 'block' }}>← KIDS CATALOGUE</a>
        </div>
        <div>
          <div style={{ color: accent, marginBottom: 8 }}>↗ ARCHIVE</div>
          <div style={{ color: textPrimary }}>MOCHI DE LOS HUERTOS / MIEL DE MONTES / 2026</div>
          <div style={{ fontSize: 10, color: textMuted, marginTop: 6, letterSpacing: '0.06em', textTransform: 'none' }}>
            Tribute series. For Toño and the bees of Bierzo.
          </div>
        </div>
        <div>
          <div style={{ color: accent, marginBottom: 8 }}>↗ COMPOSED BY</div>
          <a
            href="https://alexlawton.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: textPrimary, textDecoration: 'none',
              borderBottom: `1px dashed ${textMuted}`, paddingBottom: 1,
            }}
          >
            ALEX LAWTON
          </a>
          <div style={{ fontSize: 10, color: textMuted, marginTop: 6, letterSpacing: '0.06em', textTransform: 'none' }}>
            {language === 'es'
              ? 'Banda sonora original y letras. alexlawton.io'
              : 'Original soundtrack and lyrics. alexlawton.io'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MielDeMontes;

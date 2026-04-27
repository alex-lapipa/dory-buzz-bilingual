import React, { useState } from 'react';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import { PageSEO } from '@/components/PageSEO';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import "@/styles/mochi-tokens.css";

/**
 * Chat · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same default export, same translation keys, same MochiInterface
 * mount-point ({ activeTab: "chat" }), same FloatingGarden bg, same
 * collapsible intro pattern.
 *
 * Visual changes:
 *   - Calmer cream/honey background (was: yellow→green→blue gradient)
 *     so the actual chat UI takes visual centre stage
 *   - Fraunces display headline with italic bilingual accent
 *   - Caveat handwritten greeting
 *   - Cleaned Mochi character peeks above the headline
 *   - Honey-glass intro card with chevron toggle
 *   - Reduced-motion respected
 */

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [introOpen, setIntroOpen] = useState<boolean>(true);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 0%, hsl(45 92% 92%) 0%, hsl(42 90% 97%) 45%, hsl(38 32% 88%) 100%)',
        color: 'hsl(30 25% 12%)',
        fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
      }}
    >
      <PageSEO
        titleEn="Chat with Mochi — The Garden Bee"
        titleEs="Chatea con Mochi — La Abeja del Jardín"
        descriptionEn="Talk to Mochi the Garden Bee! Ask questions about bees, gardens, and nature in English or Spanish."
        descriptionEs="¡Habla con Mochi la Abeja del Jardín! Haz preguntas sobre abejas, jardines y naturaleza en inglés, español o francés."
        path="/chat"
      />

      {/* Floating garden ornaments — kept, but subtler */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.22 }}
        aria-hidden
      >
        <FloatingGarden />
      </div>

      {/* Page content */}
      <div className="relative z-10 container mx-auto" style={{ padding: 'clamp(20px, 3vw, 32px) clamp(12px, 3vw, 24px)' }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 32px' }}>
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={84}
            height={84}
            style={{
              width: 84,
              height: 84,
              objectFit: 'contain',
              margin: '0 auto 12px',
              display: 'block',
              filter: 'drop-shadow(0 6px 14px hsl(30 25% 12% / .2))',
              animation: 'mochi-chat-float 4.8s ease-in-out infinite',
            }}
          />

          <span
            style={{
              fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
              fontSize: 22,
              fontWeight: 600,
              color: 'hsl(35 78% 38%)',
              display: 'inline-block',
              transform: 'rotate(-1.5deg)',
            }}
            aria-hidden
          >
            {t('chat.heroEmoji')} {t('chat.heroTagline')}
          </span>

          <h1
            style={{
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              fontWeight: 600,
              fontSize: 'clamp(32px, 5vw, 52px)',
              letterSpacing: '-.025em',
              lineHeight: 1.0,
              margin: '4px 0 8px',
            }}
          >
            {t('chat.heroTitle')}
          </h1>

          <p
            style={{
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.6vw, 18px)',
              color: 'hsl(35 78% 38%)',
              margin: 0,
            }}
          >
            la abeja del huerto · the garden bee
          </p>
        </div>

        {/* ── Mochi introduction card (collapsible) ──────────── */}
        <div
          data-card="lift"
          style={{
            position: 'relative',
            maxWidth: 760,
            margin: '0 auto 28px',
            padding: 'clamp(20px, 2.5vw, 28px)',
            background: 'hsl(45 60% 96% / .82)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
            borderRadius: 'var(--mochi-r-lg, 28px)',
            border: '1px solid hsl(40 92% 56% / .25)',
            boxShadow: 'var(--mochi-shadow-card, 0 10px 30px -8px hsl(25 28% 22% / .15))',
            overflow: 'hidden',
          }}
          className="mochi-grain"
        >
          {/* Honey drip top accent */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 28,
              right: 28,
              height: 3,
              borderRadius: '0 0 6px 6px',
              background:
                'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
            }}
          />

          <button
            type="button"
            onClick={() => setIntroOpen((v) => !v)}
            aria-expanded={introOpen}
            aria-label={t('chat.openIntroductionAria') as string}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              fontFamily: 'inherit',
              color: 'inherit',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
                fontWeight: 600,
                fontSize: 'clamp(17px, 2vw, 21px)',
                letterSpacing: '-.01em',
                color: 'hsl(35 78% 38%)',
                margin: 0,
                transition: 'color .2s',
              }}
            >
              {t('chat.introTitle')}
            </h2>
            {introOpen ? (
              <ChevronUp className="h-5 w-5" style={{ color: 'hsl(28 35% 28%)', flexShrink: 0 }} aria-hidden />
            ) : (
              <ChevronDown className="h-5 w-5" style={{ color: 'hsl(28 35% 28%)', flexShrink: 0 }} aria-hidden />
            )}
          </button>

          {introOpen && (
            <div className="animate-fade-in" style={{ marginTop: 16, display: 'grid', gap: 18 }}>
              <p
                style={{
                  fontSize: 'clamp(14px, 1.45vw, 15.5px)',
                  color: 'hsl(28 35% 28%)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {t('chat.introBody')}
              </p>

              <div>
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'hsl(35 78% 38%)',
                    margin: '0 0 10px',
                  }}
                >
                  {t('chat.tipsTitle')}
                </h3>
                <ul style={{ display: 'grid', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  {[t('chat.tip1'), t('chat.tip2'), t('chat.tip3'), t('chat.tip4')].map(
                    (tip, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          fontSize: 14,
                          color: 'hsl(28 35% 28%)',
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            flexShrink: 0,
                            width: 6,
                            height: 6,
                            marginTop: 8,
                            borderRadius: '50%',
                            background:
                              'linear-gradient(180deg, hsl(40 92% 56%), hsl(32 88% 44%))',
                          }}
                        />
                        <span>{tip}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── Chat Interface — unchanged behavior ─────────────── */}
        <div className="w-full">
          <MochiInterface activeTab="chat" />
        </div>
      </div>

      <style>{`
        @keyframes mochi-chat-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-6px) rotate(1.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [alt="Mochi the garden bee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Chat;

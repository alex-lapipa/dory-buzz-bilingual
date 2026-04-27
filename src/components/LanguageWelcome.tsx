import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import "@/styles/mochi-tokens.css";

/**
 * LanguageWelcome · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same public API: { onLanguageSelect: (language: 'en' | 'es') => void }.
 * Triggered after the LandingPage when no language has been chosen yet.
 *
 * Visual changes from v1:
 *   - Cleaned bee character (mochi-clean-200.webp, no halo)
 *   - Glass-morphism card with honey-drip top accent
 *   - Fraunces display headline with italic accent
 *   - Caveat handwritten bilingual greeting
 *   - Language pill buttons (Español/English) using v2 honey palette
 *   - All garden insects retained (they're delightful)
 *   - bg-gradient-nature retained
 */

interface LanguageWelcomeProps {
  onLanguageSelect: (language: 'en' | 'es') => void;
}

export const LanguageWelcome: React.FC<LanguageWelcomeProps> = ({ onLanguageSelect }) => {
  const handleLanguageSelect = (language: 'en' | 'es') => {
    onLanguageSelect(language);
  };

  return (
    <>
      {/* Garden Flying Insects (preserved from v1 — they're delightful) */}
      <div className="flying-bee flying-bee-1 animate-tiny-bee-fly">🐝</div>
      <div className="flying-bee flying-bee-2 animate-tiny-bee-hover">🐝</div>
      <div className="flying-bee flying-bee-3 animate-tiny-bee-zigzag">🐝</div>
      <div className="flying-bee flying-bee-4 animate-tiny-bee-loop">🐝</div>
      <div className="flying-bee flying-bee-5 animate-bee-to-garden">🐝</div>

      <div className="flying-bee flying-butterfly-1 animate-butterfly-flutter">🦋</div>
      <div className="flying-bee flying-butterfly-2 animate-butterfly-dance">🦋</div>
      <div className="flying-bee flying-butterfly-3 animate-butterfly-spiral">🦋</div>
      <div className="flying-bee flying-butterfly-4 animate-butterfly-float">🦋</div>

      <div className="flying-bee flying-ladybird-1 animate-ladybug-crawl">🐞</div>
      <div className="flying-bee flying-ladybird-2 animate-insect-hover">🐞</div>
      <div className="flying-bee flying-ladybird-3 animate-insect-patrol">🐞</div>

      <div className="flying-bee flying-swallow-1 animate-swallow-dive">🐦</div>
      <div className="flying-bee flying-swallow-2 animate-swallow-soar">🐦</div>
      <div className="flying-bee flying-swallow-3 animate-swallow-hunt">🐦</div>

      <div className="flying-bee flying-dragonfly-1 animate-dragonfly-zip">🜻</div>
      <div className="flying-bee flying-dragonfly-2 animate-insect-dart">🜻</div>
      <div className="flying-bee flying-moth-1 animate-moth-night">🦗</div>
      <div className="flying-bee flying-hoverfly-1 animate-insect-buzz">🪰</div>

      {/* Main stage */}
      <div
        className="min-h-screen safe-area-top safe-area-bottom bg-gradient-nature bg-cover bg-center bg-no-repeat"
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: 'clamp(20px, 4vw, 48px)',
          paddingTop: 'clamp(72px, 10vw, 120px)',
          fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
        }}
      >
        <div
          role="dialog"
          aria-labelledby="lw-heading"
          aria-describedby="lw-greeting"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 460,
            background: 'hsl(45 60% 96% / .82)',
            backdropFilter: 'blur(22px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.2)',
            borderRadius: 'var(--mochi-r-lg, 28px)',
            border: '1px solid hsl(42 90% 97% / .6)',
            boxShadow: 'var(--mochi-shadow-float, 0 24px 48px -16px hsl(25 28% 22% / .28))',
            padding: 'clamp(28px, 5vw, 44px)',
            textAlign: 'center',
            color: 'hsl(30 25% 12%)',
            overflow: 'hidden',
          }}
        >
          {/* Honey drip top accent */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 28,
              right: 28,
              height: 4,
              borderRadius: '0 0 8px 8px',
              background:
                'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
            }}
          />

          {/* Mochi character (cleaned, no halo) */}
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={104}
            height={104}
            style={{
              width: 104,
              height: 104,
              objectFit: 'contain',
              margin: '0 auto 18px',
              display: 'block',
              filter: 'drop-shadow(0 8px 18px hsl(30 25% 12% / .22))',
              animation: 'mochi-bee-bounce 4.5s ease-in-out infinite',
            }}
          />

          {/* Handwritten bilingual greeting */}
          <span
            id="lw-greeting"
            style={{
              fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
              fontSize: 22,
              fontWeight: 600,
              color: 'hsl(35 78% 38%)',
              display: 'inline-block',
              transform: 'rotate(-1.5deg)',
              marginBottom: 6,
            }}
          >
            ¡Hola amig@s · Hello friends!
          </span>

          {/* Display headline */}
          <h1
            id="lw-heading"
            style={{
              fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
              fontSize: 'clamp(26px, 4vw, 34px)',
              fontWeight: 600,
              letterSpacing: '-.02em',
              lineHeight: 1.05,
              margin: '4px 0 14px',
            }}
          >
            I&rsquo;m Mochi
            <em
              style={{
                display: 'block',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '.62em',
                color: 'hsl(35 78% 38%)',
                marginTop: 2,
              }}
            >
              de los Huertos
            </em>
          </h1>

          {/* Subtitle bilingual pair */}
          <p
            style={{
              fontSize: 14.5,
              color: 'hsl(28 35% 28%)',
              lineHeight: 1.55,
              margin: '0 auto 24px',
              maxWidth: '32ch',
            }}
          >
            Tu amiga abeja del huerto en Asturias.
            <br />
            Your garden bee friend from Asturias.
          </p>

          {/* Language label */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'hsl(35 78% 38%)',
              marginBottom: 14,
            }}
          >
            Elige tu idioma · Choose your language
          </p>

          {/* Language buttons */}
          <div style={{ display: 'grid', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleLanguageSelect('es')}
              aria-label="Continuar en Español"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '14px 22px',
                borderRadius: 'var(--mochi-r-pill, 999px)',
                fontFamily: 'inherit',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '.005em',
                border: 0,
                cursor: 'pointer',
                background:
                  'linear-gradient(180deg, hsl(40 92% 56%) 0%, hsl(32 88% 44%) 100%)',
                color: 'hsl(30 25% 12%)',
                boxShadow:
                  'var(--mochi-shadow-honey, 0 14px 36px -12px hsl(32 88% 44% / .55))',
                transition: 'transform .2s var(--mochi-ease-spring, cubic-bezier(.34,1.56,.64,1))',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>🇪🇸</span>
              Español
            </button>

            <button
              type="button"
              onClick={() => handleLanguageSelect('en')}
              aria-label="Continue in English"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '14px 22px',
                borderRadius: 'var(--mochi-r-pill, 999px)',
                fontFamily: 'inherit',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '.005em',
                background: 'hsl(42 90% 97%)',
                color: 'hsl(30 25% 12%)',
                border: '1.5px solid hsl(30 25% 12% / .35)',
                cursor: 'pointer',
                transition: 'transform .2s var(--mochi-ease-spring, cubic-bezier(.34,1.56,.64,1)), background .2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'hsl(45 92% 92%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.background = 'hsl(42 90% 97%)';
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>🇬🇧</span>
              English
            </button>
          </div>

          {/* Closing bilingual hint */}
          <p
            style={{
              marginTop: 22,
              fontSize: 12.5,
              color: 'hsl(28 35% 28%)',
              opacity: 0.78,
              lineHeight: 1.45,
            }}
          >
            Bees · honey · permaculture · seed-saving
            <br />
            Abejas · miel · permacultura · semillas
          </p>

          {/* Co-located keyframe (additive) */}
          <style>{`
            @keyframes mochi-bee-bounce {
              0%, 100% { transform: translateY(0) rotate(-1deg); }
              50%      { transform: translateY(-8px) rotate(1.5deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              [aria-labelledby="lw-heading"] img { animation: none !important; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default LanguageWelcome;

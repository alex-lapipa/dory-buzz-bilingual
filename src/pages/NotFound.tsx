import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NatureLeaf } from '@/components/icons';
import "@/styles/mochi-tokens.css";

/**
 * Round 13 — NotFound page is now translated to EN / ES / FR via i18next.
 * Adds an explanation paragraph and keeps the original 🐝 + 404 visual.
 */
const NotFound: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-full safe-area-top safe-area-bottom" style={{
      background: 'radial-gradient(ellipse at 30% 0%, hsl(45 92% 92%) 0%, hsl(42 90% 97%) 45%, hsl(38 32% 88%) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div
        className="mochi-grain"
        style={{
          position: 'relative',
          maxWidth: 440, width: '100%',
          padding: 'clamp(28px, 4vw, 40px)',
          background: 'hsl(45 60% 96% / .9)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          borderRadius: 'var(--mochi-r-lg, 28px)',
          border: '1px solid hsl(40 92% 56% / .25)',
          boxShadow: 'var(--mochi-shadow-card, 0 10px 30px -8px hsl(25 28% 22% / .15))',
          overflow: 'hidden',
          textAlign: 'center',
          color: 'hsl(30 25% 12%)',
          fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
        }}
      >
        <span aria-hidden style={{
          position: 'absolute', top: 0, left: 28, right: 28, height: 4,
          borderRadius: '0 0 8px 8px',
          background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
        }} />

        <img
          src="/lovable-uploads/mochi-clean-200.webp"
          alt="Mochi the garden bee"
          width={96} height={96}
          style={{
            width: 96, height: 96, objectFit: 'contain',
            margin: '0 auto 12px', display: 'block',
            filter: 'drop-shadow(0 6px 14px hsl(30 25% 12% / .2))',
            animation: 'mochi-404-float 3.8s ease-in-out infinite',
          }}
        />

        <h1 style={{
          fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
          fontWeight: 700,
          fontSize: 'clamp(48px, 8vw, 64px)',
          letterSpacing: '-.04em',
          lineHeight: 0.9,
          margin: '0 0 8px',
          color: 'hsl(35 78% 38%)',
        }}>
          {t('notFound.code')}
        </h1>

        <p style={{
          fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
          fontStyle: 'italic',
          fontSize: 19, fontWeight: 500,
          color: 'hsl(30 25% 12%)',
          margin: '0 0 12px',
        }}>
          {t('notFound.lostInGarden')}
        </p>

        <p style={{
          fontSize: 14, color: 'hsl(28 35% 28%)',
          lineHeight: 1.55,
          margin: '0 0 24px',
        }}>
          {t('notFound.explanation')}
        </p>

        <Button asChild className="w-full" style={{
          background: 'linear-gradient(180deg, hsl(40 92% 56%), hsl(32 88% 44%))',
          color: 'hsl(30 25% 12%)',
          fontWeight: 600,
          fontSize: 15,
          height: 48,
          borderRadius: 999,
          border: '1px solid hsl(32 88% 44% / .5)',
          boxShadow: '0 4px 14px -4px hsl(35 78% 38% / .35), inset 0 1px 0 hsl(48 100% 80% / .8)',
        }}>
          <Link to="/">
            <NatureLeaf className="h-4 w-4 mr-2" />
            {t('notFound.returnHome')}
          </Link>
        </Button>
      </div>

      <style>{`
        @keyframes mochi-404-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-8px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [alt="Mochi the garden bee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;

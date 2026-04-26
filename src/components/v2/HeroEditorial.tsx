import React from "react";
import { MochiBrandMark } from "@/components/icons/MochiIcons";

/**
 * HeroEditorial · v1.0
 * ─────────────────────────────────────────────────────────
 * Editorial-magazine hero for the Mochi landing page.
 * Picos de Europa background with warm overlay + grain,
 * Fraunces display headline with italic accent, Mochi
 * character at proper scale, language pill, glass meta-card.
 *
 * ADDITIVE: lives at src/components/v2/HeroEditorial.tsx.
 * Use it as a drop-in for LandingPage.tsx hero when ready.
 */

export interface HeroEditorialProps {
  language?: "en" | "es" | "fr";
  onLanguageChange?: (lang: "en" | "es" | "fr") => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  bgUrl?: string;
  characterUrl?: string;
}

const COPY = {
  en: {
    handwritten: "Hola amig@s · Hello friends",
    title: "Mochi",
    italic: "de los Huertos",
    sub: "The garden bee from Asturias. Curious, bilingual, and a little quirky — learn about bees, pollination, permaculture and seed-saving with stories, songs and conversations you can actually have.",
    primary: "Talk to Mochi",
    secondary: "Explore the garden",
    meta: [
      { h: "For ages",       p: "6 – 8",         span: "· and curious adults" },
      { h: "Languages",      p: "EN · ES",       span: "· FR coming" },
      { h: "Topics",         p: "Bees · Permaculture", span: "· Seed saving" },
      { h: "Voice + chat",   p: "Always on",     span: "· Mochi listens" },
    ],
  },
  es: {
    handwritten: "Hola amig@s · Hello friends",
    title: "Mochi",
    italic: "de los Huertos",
    sub: "La abeja de los huertos asturianos. Curiosa, bilingüe y un poco peculiar — aprende sobre abejas, polinización, permacultura y guardado de semillas con cuentos, canciones y conversaciones de verdad.",
    primary: "Habla con Mochi",
    secondary: "Explora el huerto",
    meta: [
      { h: "Edades",         p: "6 – 8 años",    span: "· y adultos curiosos" },
      { h: "Idiomas",        p: "ES · EN",       span: "· FR pronto" },
      { h: "Temas",          p: "Abejas · Permacultura", span: "· Semillas" },
      { h: "Voz + chat",     p: "Siempre activa", span: "· Mochi escucha" },
    ],
  },
  fr: {
    handwritten: "Salut mes ami·e·s",
    title: "Mochi",
    italic: "de los Huertos",
    sub: "L'abeille du jardin asturien. Curieuse, bilingue et un peu unique — découvre les abeilles, la pollinisation, la permaculture et la conservation des semences.",
    primary: "Parle à Mochi",
    secondary: "Visite le jardin",
    meta: [
      { h: "Âges",           p: "6 – 8 ans",     span: "· et adultes" },
      { h: "Langues",        p: "FR · EN · ES",  span: "" },
      { h: "Sujets",         p: "Abeilles · Permaculture", span: "· Semences" },
      { h: "Voix + chat",    p: "Toujours là",   span: "· Mochi écoute" },
    ],
  },
};

const DEFAULT_BG =
  "https://www.mochinillo.com/lovable-uploads/fd5aef97-797c-4c5c-9e60-be6c9898cdc7.png";
const DEFAULT_CHAR =
  "https://www.mochinillo.com/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png";

export const HeroEditorial: React.FC<HeroEditorialProps> = ({
  language = "en",
  onLanguageChange,
  onPrimaryClick,
  onSecondaryClick,
  bgUrl = DEFAULT_BG,
  characterUrl = DEFAULT_CHAR,
}) => {
  const c = COPY[language];

  return (
    <section
      className="mochi-hero-editorial"
      style={{
        position: "relative",
        minHeight: "clamp(640px, 92vh, 920px)",
        overflow: "hidden",
        isolation: "isolate",
        display: "grid",
        alignItems: "end",
        fontFamily: "var(--mochi-font-sans, Saira, sans-serif)",
        color: "hsl(42 90% 97%)",
      }}
    >
      {/* Photo background */}
      <div
        aria-label="Picos de Europa, Asturias"
        role="img"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -2,
          background: `radial-gradient(1200px 600px at 80% -10%, hsl(48 100% 65% / .35), transparent 60%), linear-gradient(180deg, transparent 30%, hsl(30 25% 12% / .55) 100%), url(${bgUrl}) center/cover no-repeat`,
          filter: "saturate(1.05)",
        }}
      />
      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          opacity: 0.35,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top bar — brand + language */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: "clamp(20px, 4vw, 56px)",
          right: "clamp(20px, 4vw, 56px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MochiBrandMark size={38} />
          <span
            style={{
              fontFamily: "var(--mochi-font-display, Fraunces, serif)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-.01em",
            }}
          >
            Mochi{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              de los Huertos
            </em>
          </span>
        </div>

        {/* Language pill */}
        <div
          role="group"
          aria-label="Language toggle"
          style={{
            display: "inline-flex",
            padding: 4,
            background: "hsl(42 90% 97% / .18)",
            borderRadius: 999,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid hsl(42 90% 97% / .25)",
          }}
        >
          {(["en", "es", "fr"] as const).map((lng) => (
            <button
              key={lng}
              type="button"
              aria-pressed={language === lng}
              onClick={() => onLanguageChange?.(lng)}
              style={{
                border: 0,
                background: language === lng ? "hsl(42 90% 97%)" : "transparent",
                color: language === lng ? "hsl(30 25% 12%)" : "hsl(42 90% 97% / .85)",
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: ".04em",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .2s",
                boxShadow:
                  language === lng
                    ? "var(--mochi-shadow-soft, 0 4px 14px rgba(43,29,11,.12))"
                    : "none",
              }}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(80px, 10vh, 140px) clamp(20px, 4vw, 56px) clamp(40px, 6vh, 80px)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 32,
        }}
      >
        <style>{`
          @media (min-width: 920px) {
            .mochi-hero-editorial > div:last-of-type { grid-template-columns: 1.4fr 1fr; align-items: end; gap: 56px; }
          }
          @keyframes mochi-bee-hover {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50%      { transform: translateY(-12px) rotate(1deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .mochi-hero-editorial img { animation: none !important; }
          }
        `}</style>

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              fontFamily: "var(--mochi-font-script, Caveat, cursive)",
              fontSize: "clamp(22px, 2.3vw, 30px)",
              color: "hsl(48 100% 65%)",
              display: "inline-block",
              transform: "rotate(-2deg)",
              marginBottom: 12,
            }}
          >
            {c.handwritten}
          </span>
          <h1
            style={{
              fontFamily: "var(--mochi-font-display, Fraunces, serif)",
              fontWeight: 600,
              fontSize: "clamp(48px, 8.4vw, 124px)",
              lineHeight: 0.9,
              letterSpacing: "-.035em",
              textShadow: "0 2px 18px hsl(30 25% 12% / .35)",
              margin: 0,
            }}
          >
            {c.title}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "hsl(48 100% 65%)",
                display: "block",
                fontSize: ".55em",
                letterSpacing: "-.015em",
                marginTop: 4,
                textShadow: "0 2px 12px hsl(30 25% 12% / .4)",
              }}
            >
              {c.italic}
            </em>
          </h1>
          <p
            style={{
              marginTop: 20,
              maxWidth: "38ch",
              fontSize: "clamp(15px, 1.5vw, 19px)",
              color: "hsl(42 90% 97% / .92)",
              lineHeight: 1.55,
            }}
          >
            {c.sub}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
            <button
              type="button"
              onClick={onPrimaryClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 26px",
                borderRadius: 999,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 600,
                background:
                  "linear-gradient(180deg, hsl(40 92% 56%) 0%, hsl(32 88% 44%) 100%)",
                color: "hsl(30 25% 12%)",
                border: 0,
                cursor: "pointer",
                boxShadow:
                  "var(--mochi-shadow-honey, 0 14px 36px -12px hsl(32 88% 44% / .55))",
                transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
              </svg>
              {c.primary}
            </button>
            <button
              type="button"
              onClick={onSecondaryClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 26px",
                borderRadius: 999,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 600,
                background: "hsl(42 90% 97% / .15)",
                color: "hsl(42 90% 97%)",
                border: "1px solid hsl(42 90% 97% / .55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                cursor: "pointer",
                transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              {c.secondary}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <img
          src={characterUrl}
          alt="Mochi the garden bee character"
          style={{
            position: "relative",
            alignSelf: "end",
            width: "clamp(220px, 30vw, 360px)",
            marginBottom: 16,
            filter: "drop-shadow(0 18px 32px hsl(30 25% 12% / .35))",
            animation: "mochi-bee-hover 5.2s ease-in-out infinite",
            justifySelf: "end",
          }}
        />
      </div>

      {/* Floating glass meta-card */}
      <div
        aria-label="At a glance"
        style={{
          position: "absolute",
          bottom: -48,
          left: "clamp(20px, 4vw, 56px)",
          right: "clamp(20px, 4vw, 56px)",
          maxWidth: 1240,
          margin: "0 auto",
          background: "hsl(45 60% 96% / .72)",
          backdropFilter: "blur(22px) saturate(1.2)",
          WebkitBackdropFilter: "blur(22px) saturate(1.2)",
          border: "1px solid hsl(42 90% 97% / .6)",
          borderRadius: "var(--mochi-r-lg, 28px)",
          padding: "20px 28px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px 32px",
          boxShadow: "var(--mochi-shadow-float, 0 24px 48px -16px rgba(43,29,11,.28))",
          color: "hsl(30 25% 12%)",
        }}
      >
        {c.meta.map((m) => (
          <div key={m.h}>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "hsl(35 78% 38%)",
                margin: 0,
              }}
            >
              {m.h}
            </h4>
            <p
              style={{
                fontFamily: "var(--mochi-font-display, Fraunces, serif)",
                fontSize: 17,
                fontWeight: 500,
                marginTop: 4,
                margin: 0,
              }}
            >
              {m.p}{" "}
              <span style={{ color: "hsl(28 35% 28%)", fontWeight: 400 }}>
                {m.span}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroEditorial;

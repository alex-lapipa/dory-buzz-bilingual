import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroEditorial, HoneyCard } from "@/components/v2";
import { IcMic, IcNotebook, IcFlower, IcHive, IcLeaf, IcSeed } from "@/components/icons/MochiIcons";
import "@/styles/mochi-tokens.css";

/**
 * LandingPage · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same public API as v1 — { onGetStarted } prop, useLanguage
 * hook, default export. Existing onboarding flow downstream
 * (LanguageWelcome → OnboardingFlow → LearningHub) unaffected.
 *
 * What changes for first-time visitors:
 *   - HeroEditorial replaces the small inline "BeeCrazy" header
 *   - Three HoneyCard features replace the icon+text grid
 *   - Honeycomb-paper backdrop replaces the flat gradient
 *   - Bilingual handwritten subtitles on every card
 */

interface LandingPageProps {
  onGetStarted: () => void;
}

const COPY = {
  en: {
    eyebrow: "What you can do",
    title: "Three doors into the garden.",
    titleEm: "garden",
    sub:
      "Pick whichever fits your mood — talk, read, or get your hands in the soil. Mochi switches gears with you.",
    cards: [
      {
        icon: <IcMic />,
        title: "Talk to Mochi",
        subtitle: "Habla con Mochi",
        body:
          "Press the mic. Ask anything about bees, pollination, gardens or seeds — Mochi answers in your language.",
        cta: "Start a conversation",
        variant: "honey" as const,
      },
      {
        icon: <IcNotebook />,
        title: "Read a story",
        subtitle: "Lee un cuento",
        body:
          "Six-panel storycards in EN+ES. Vocabulary highlighted, voice narration, gentle quizzes between scenes.",
        cta: "Open the storybook",
        variant: "meadow" as const,
      },
      {
        icon: <IcFlower />,
        title: "Grow a garden",
        subtitle: "Cultiva un huerto",
        body:
          "Permaculture and seed-saving guides from Simientes Infinitas. Practical, ecological, doable on a balcony.",
        cta: "See the guides",
        variant: "sky" as const,
      },
    ],
    promiseEyebrow: "What we promise",
    promises: [
      {
        icon: <IcHive />,
        h: "Real, not cute.",
        p: "We use real bee science and Asturian light, not cartoon clichés. Even kids deserve real words.",
      },
      {
        icon: <IcLeaf />,
        h: "Bilingual by design.",
        p: "EN + ES paired throughout. French is on the way. No language is a translation afterthought.",
      },
      {
        icon: <IcSeed />,
        h: "Slow over fast.",
        p: "Pacing built for a 6-year-old's attention. Repetition, response time, and rest are part of the design.",
      },
    ],
    closeEyebrow: "Ready when you are",
    closeTitle: "Step into the meadow.",
    closeTitleEm: "meadow",
    closeSub:
      "It costs nothing to look around. Mochi will be here whenever you want to ask a question — in voice or text, in English or Spanish.",
    closeCta: "Start exploring",
  },
  es: {
    eyebrow: "Lo que puedes hacer",
    title: "Tres puertas al huerto.",
    titleEm: "huerto",
    sub:
      "Elige la que te apetezca — hablar, leer o meter las manos en la tierra. Mochi cambia de marcha contigo.",
    cards: [
      {
        icon: <IcMic />,
        title: "Habla con Mochi",
        subtitle: "Talk to Mochi",
        body:
          "Pulsa el micro. Pregúntale lo que quieras sobre abejas, polinización, huertos o semillas — Mochi responde en tu idioma.",
        cta: "Empieza a charlar",
        variant: "honey" as const,
      },
      {
        icon: <IcNotebook />,
        title: "Lee un cuento",
        subtitle: "Read a story",
        body:
          "Cuentos de seis viñetas en ES+EN. Vocabulario destacado, narración por voz, mini-quiz entre escenas.",
        cta: "Abrir el libro",
        variant: "meadow" as const,
      },
      {
        icon: <IcFlower />,
        title: "Cultiva un huerto",
        subtitle: "Grow a garden",
        body:
          "Guías de permacultura y guardado de semillas de Simientes Infinitas. Prácticas, ecológicas, hechas para un balcón.",
        cta: "Ver las guías",
        variant: "sky" as const,
      },
    ],
    promiseEyebrow: "Lo que prometemos",
    promises: [
      {
        icon: <IcHive />,
        h: "Real, no monina.",
        p: "Usamos ciencia real de las abejas y luz asturiana, no clichés de dibujos animados. Hasta los niños merecen palabras reales.",
      },
      {
        icon: <IcLeaf />,
        h: "Bilingüe por diseño.",
        p: "ES + EN emparejado en todo. El francés está en camino. Ningún idioma es un añadido tardío.",
      },
      {
        icon: <IcSeed />,
        h: "Despacio mejor que rápido.",
        p: "Ritmo pensado para la atención de un niño de 6 años. Repetición, tiempo de respuesta y descanso son parte del diseño.",
      },
    ],
    closeEyebrow: "Cuando estés lista",
    closeTitle: "Entra en el prado.",
    closeTitleEm: "prado",
    closeSub:
      "Echar un vistazo no cuesta nada. Mochi estará aquí cuando quieras hacer una pregunta — por voz o texto, en inglés o español.",
    closeCta: "Empieza a explorar",
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { language, setLanguage } = useLanguage();
  const c = COPY[language === "es" ? "es" : "en"];

  const handleLangChange = (lng: "en" | "es" | "fr") => {
    // FR not yet wired into LanguageContext — fall back to EN for now
    setLanguage(lng === "fr" ? "en" : lng);
  };

  return (
    <div
      style={{
        background: "hsl(40 65% 96%)",
        color: "hsl(30 25% 12%)",
        minHeight: "100vh",
        fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
      }}
    >
      {/* ── 1 · Hero ─────────────────────────────────── */}
      <HeroEditorial
        language={language === "es" ? "es" : "en"}
        onLanguageChange={handleLangChange}
        onPrimaryClick={onGetStarted}
        onSecondaryClick={() => {
          document.getElementById("doors")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {/* spacer for the floating glass meta-card overlap */}
      <div style={{ height: 80 }} />

      {/* ── 2 · Three doors (HoneyCards) ─────────────── */}
      <section
        id="doors"
        style={{
          padding: "clamp(72px, 9vw, 140px) clamp(20px, 4vw, 56px)",
          background: "hsl(40 65% 96%)",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          className="mochi-honeycomb-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span
            style={{
              fontFamily: "var(--mochi-font-sans)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "hsl(35 78% 38%)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 24, height: 1, background: "hsl(35 78% 38%)" }} />
            {c.eyebrow}
          </span>
          <h2
            style={{
              fontFamily: "var(--mochi-font-display, Fraunces, serif)",
              fontWeight: 600,
              fontSize: "clamp(32px, 4.4vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-.02em",
              marginTop: 14,
              maxWidth: "20ch",
            }}
          >
            {c.title.split(c.titleEm)[0]}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(35 78% 38%)" }}>
              {c.titleEm}
            </em>
            {c.title.split(c.titleEm)[1]}
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 1.5vw, 18px)",
              color: "hsl(28 35% 28%)",
              maxWidth: "60ch",
              marginTop: 16,
              lineHeight: 1.65,
            }}
          >
            {c.sub}
          </p>

          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              marginTop: 56,
            }}
          >
            {c.cards.map((card) => (
              <HoneyCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                body={card.body}
                cta={card.cta}
                variant={card.variant}
                onClick={onGetStarted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 · What we promise (3 small cards on warm bg) ── */}
      <section
        style={{
          padding: "clamp(72px, 9vw, 140px) clamp(20px, 4vw, 56px)",
          background: "hsl(42 90% 97%)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--mochi-font-sans)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "hsl(35 78% 38%)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 24, height: 1, background: "hsl(35 78% 38%)" }} />
            {c.promiseEyebrow}
          </span>

          <div
            style={{
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 48,
            }}
          >
            {c.promises.map((p) => (
              <article
                key={p.h}
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    color: "hsl(35 78% 38%)",
                    background: "hsl(45 92% 92%)",
                    border: "1px solid hsl(40 92% 56% / .25)",
                  }}
                >
                  <span style={{ width: 28, height: 28, display: "block" }}>{p.icon}</span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--mochi-font-display)",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "-.01em",
                    margin: 0,
                  }}
                >
                  {p.h}
                </h3>
                <p
                  style={{
                    color: "hsl(28 35% 28%)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {p.p}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Closing CTA ────────────────────────────── */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 160px) clamp(20px, 4vw, 56px)",
          background:
            "linear-gradient(180deg, hsl(140 38% 26%), hsl(140 38% 18%))",
          color: "hsl(40 65% 96%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--mochi-font-sans)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "hsl(48 100% 65%)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <span style={{ width: 24, height: 1, background: "hsl(48 100% 65%)" }} />
            {c.closeEyebrow}
            <span style={{ width: 24, height: 1, background: "hsl(48 100% 65%)" }} />
          </span>
          <h2
            style={{
              fontFamily: "var(--mochi-font-display, Fraunces, serif)",
              fontWeight: 600,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-.025em",
              marginTop: 18,
              color: "hsl(40 65% 96%)",
            }}
          >
            {c.closeTitle.split(c.closeTitleEm)[0]}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(48 100% 65%)" }}>
              {c.closeTitleEm}
            </em>
            {c.closeTitle.split(c.closeTitleEm)[1]}
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 1.5vw, 19px)",
              marginTop: 18,
              lineHeight: 1.65,
              color: "hsl(40 65% 96% / .85)",
            }}
          >
            {c.closeSub}
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            style={{
              marginTop: 36,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 32px",
              borderRadius: 999,
              fontFamily: "inherit",
              fontSize: 16,
              fontWeight: 600,
              background:
                "linear-gradient(180deg, hsl(40 92% 56%) 0%, hsl(32 88% 44%) 100%)",
              color: "hsl(30 25% 12%)",
              border: 0,
              cursor: "pointer",
              boxShadow:
                "0 14px 36px -12px hsl(32 88% 44% / .55), 0 0 0 1px hsl(40 92% 56% / .12) inset",
              transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            {c.closeCta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

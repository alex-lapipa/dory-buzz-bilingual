import React, { useState } from "react";
import "@/styles/mochi-tokens.css";
import { HeroEditorial, HoneyCard, MochiPod, MochiPodState } from "@/components/v2";
import { MOCHI_ICONS, IcMic, IcNotebook, IcFlower } from "@/components/icons/MochiIcons";

/**
 * BrandBook · /brand
 * ─────────────────────────────────────────────────────────
 * Living style guide. Demonstrates every v2 component on
 * one scrollable page. New contributors land here to learn
 * the system before touching feature surfaces.
 *
 * ADDITIVE: a brand-new route. Existing pages keep working.
 */

const PALETTE = [
  { name: "Honey",   hsl: "40 92% 56%",  onLight: false },
  { name: "Deep",    hsl: "32 88% 44%",  onLight: false },
  { name: "Pollen",  hsl: "48 100% 65%", onLight: true  },
  { name: "Meadow",  hsl: "95 38% 46%",  onLight: false },
  { name: "Forest",  hsl: "140 38% 26%", onLight: false },
  { name: "Coral",   hsl: "12 78% 56%",  onLight: false },
  { name: "Earth",   hsl: "28 35% 28%",  onLight: false },
  { name: "Bark",    hsl: "25 28% 22%",  onLight: false },
  { name: "Bee",     hsl: "30 25% 12%",  onLight: false },
  { name: "Linen",   hsl: "40 65% 96%",  onLight: true  },
];

const VOICE_DOS = [
  { kind: "we say", text: '"Bees pollinate one in every three bites you eat."' },
  { kind: "not",    text: '"Bees are super-duper important little buzzy buddies!"' },
  { kind: "we say", text: '"Let\'s open the hive — slowly, so we don\'t startle anyone."' },
  { kind: "not",    text: '"OMG you HAVE to see this AMAZING thing!!!"' },
];

const VALUES = [
  "Real photos beat cartoons. Asturian light, not stock fields.",
  "Bilingual by design. Every label is paired, never an afterthought.",
  "Quiet maximalism. Texture & depth, not loud and busy.",
  "Slow over fast. Pacing supports a 6-year-old's attention.",
  "Permaculture inside. We compost components — no waste.",
];

const POD_STATES: { state: MochiPodState; transcript?: { who: "user" | "mochi"; text: string } }[] = [
  { state: "idle" },
  { state: "listening", transcript: { who: "user", text: "How does a bee make honey?" } },
  { state: "thinking",  transcript: { who: "mochi", text: "Let me think about that…" } },
  { state: "speaking",  transcript: { who: "mochi", text: "Bees collect nectar from flowers. Inside the hive, they pass it mouth-to-mouth — adding enzymes that turn it into honey. ¡Buzztastical! 🐝✨" } },
];

const Section: React.FC<React.PropsWithChildren<{ id?: string; eyebrow?: string; title: React.ReactNode; lede?: string; bg?: string; }>> = ({ id, eyebrow, title, lede, bg, children }) => (
  <section
    id={id}
    style={{
      padding: "clamp(72px, 9vw, 140px) clamp(20px, 4vw, 56px)",
      background: bg ?? "hsl(40 65% 96%)",
    }}
  >
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      {eyebrow && (
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
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          fontFamily: "var(--mochi-font-display)",
          fontWeight: 600,
          fontSize: "clamp(32px, 4.4vw, 56px)",
          lineHeight: 1.05,
          letterSpacing: "-.02em",
          marginTop: 14,
          color: "hsl(30 25% 12%)",
        }}
      >
        {title}
      </h2>
      {lede && (
        <p
          style={{
            fontSize: "clamp(16px, 1.5vw, 18px)",
            color: "hsl(28 35% 28%)",
            maxWidth: "60ch",
            marginTop: 16,
            lineHeight: 1.65,
          }}
        >
          {lede}
        </p>
      )}
      {children}
    </div>
  </section>
);

const BrandBook: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "es" | "fr">("en");

  return (
    <div style={{ background: "hsl(40 65% 96%)", color: "hsl(30 25% 12%)", minHeight: "100vh" }}>
      {/* Hero */}
      <HeroEditorial
        language={language}
        onLanguageChange={setLanguage}
        onPrimaryClick={() => {
          document.getElementById("voice-pod")?.scrollIntoView({ behavior: "smooth" });
        }}
        onSecondaryClick={() => {
          document.getElementById("cards")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Spacer for hero meta-card overlap */}
      <div style={{ height: 80 }} />

      {/* Palette + type + voice + values */}
      <Section
        id="brand-book"
        eyebrow="01 · Brand book"
        title={<>A garden, not a <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(35 78% 38%)" }}>theme park</em>.</>}
        lede="Mochi sits between two worlds — children's wonder and grown-up reverence for nature. The system is warm, tactile, slightly hand-drawn. Avoid candy colours and cartoon slickness; lean into Asturian light, honey, meadow, and the soft grain of paper."
        bg="hsl(42 90% 97%)"
      >
        <div
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginTop: 48,
          }}
        >
          {/* Palette */}
          <div style={brandCardStyle}>
            <h3 style={brandCardH3}>Palette</h3>
            <p style={brandCardP}>Sun, hive, meadow. Rest below. Five accents earn their place.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 18 }}>
              {PALETTE.map((c) => (
                <div
                  key={c.name}
                  title={c.name}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 12,
                    background: `hsl(${c.hsl})`,
                    position: "relative",
                    boxShadow: "inset 0 0 0 1px hsl(30 25% 12% / .08)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      bottom: 6,
                      left: 8,
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                      color: c.onLight ? "hsl(30 25% 12%)" : "hsl(42 90% 97%)",
                      textShadow: c.onLight ? "none" : "0 1px 2px hsl(30 25% 12% / .5)",
                    }}
                  >
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Type */}
          <div style={brandCardStyle}>
            <h3 style={brandCardH3}>Typography</h3>
            <p style={brandCardP}>One serif, one sans, one handwritten. Three voices, one hive.</p>
            <div style={{ marginTop: 18 }}>
              <TypeRow label="Display · Fraunces 600" sample="Mochi de los Huertos" font="display" />
              <TypeRow label="Display italic · 400" sample="the garden bee" font="display" italic />
              <TypeRow label="Body · Saira 400/600" sample="Bees pollinate one in three bites of food." font="sans" />
              <TypeRow label="Field notes · Caveat 700" sample="¡Buzztastical! · field note from the hive" font="script" />
            </div>
          </div>

          {/* Voice */}
          <div style={brandCardStyle}>
            <h3 style={brandCardH3}>Voice</h3>
            <p style={brandCardP}>Mochi is warm, curious, never patronising. Even kids deserve real words.</p>
            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {VOICE_DOS.map((v, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 14, padding: "10px 0", borderBottom: "1px dashed hsl(25 28% 22% / .12)" }}>
                  <div style={{ fontFamily: "var(--mochi-font-display)", fontStyle: "italic", color: "hsl(35 78% 38%)", fontSize: 14, fontWeight: 500 }}>
                    {v.kind}
                  </div>
                  <div style={{ fontSize: 14.5, color: "hsl(28 35% 28%)" }}>{v.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={brandCardStyle}>
            <h3 style={brandCardH3}>Values</h3>
            <p style={brandCardP}>Anchors that decide every visual and copy call.</p>
            <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, display: "grid", gap: 12 }}>
              {VALUES.map((v) => (
                <li key={v} style={{ display: "flex", gap: 10, alignItems: "start", fontSize: 14.5, color: "hsl(28 35% 28%)" }}>
                  <span style={{ color: "hsl(32 88% 44%)", fontSize: 18, lineHeight: 1 }}>✿</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Icons */}
      <Section
        id="icons"
        eyebrow="02 · Icon set"
        title={<>Twelve hand-drawn <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(35 78% 38%)" }}>marks</em>, not stock pictograms.</>}
        lede="Single-colour SVG, 24×24 viewBox, 1.5 stroke, round caps. Each icon has a slight asymmetry — a curl, a pollen dot — so they read as drawn, not generated."
        bg="hsl(40 65% 96%)"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16,
            marginTop: 48,
          }}
        >
          {MOCHI_ICONS.map(({ Icon, name, id }) => (
            <div
              key={id}
              style={{
                background: "hsl(42 90% 98%)",
                border: "1px solid hsl(40 92% 56% / .14)",
                borderRadius: 18,
                padding: "22px 14px 14px",
                textAlign: "center",
                transition: "transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--mochi-shadow-card, 0 10px 30px -8px rgba(43,29,11,.18))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div style={{ color: "hsl(35 78% 38%)", display: "grid", placeItems: "center" }}>
                <Icon size={56} style={{ strokeWidth: 1.5 }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--mochi-font-sans)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "hsl(30 25% 12%)",
                  marginTop: 10,
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: 10.5, color: "hsl(28 35% 28%)", opacity: 0.7, marginTop: 2 }}>
                {id}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Floating cards */}
      <Section
        id="cards"
        eyebrow="03 · Floating cards"
        title={<>Honey-glass over <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(35 78% 38%)" }}>honeycomb paper</em>.</>}
        lede="Cards rest on a soft honeycomb backdrop. Glass surface with backdrop blur, a thin honey drip on top, custom icon tile, bilingual headline pair. Hover lifts and tilts -.4° for a tactile feel."
        bg="hsl(40 65% 96%)"
      >
        <div
          className="mochi-honeycomb-bg"
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginTop: 56,
            padding: 28,
            borderRadius: 28,
          }}
        >
          <HoneyCard
            variant="honey"
            icon={<IcMic />}
            title="Talk to Mochi"
            subtitle="Habla con Mochi"
            body="Press the mic. Ask anything about bees, pollination, gardens or seeds — Mochi answers in your language."
            cta="Start a conversation"
          />
          <HoneyCard
            variant="meadow"
            icon={<IcNotebook />}
            title="Read a story"
            subtitle="Lee un cuento"
            body="Six-panel storycards in EN+ES. Vocabulary highlighted, voice narration, gentle quizzes between scenes."
            cta="Open the storybook"
          />
          <HoneyCard
            variant="sky"
            icon={<IcFlower />}
            title="Grow a garden"
            subtitle="Cultiva un huerto"
            body="Permaculture and seed-saving guides from Simientes Infinitas. Practical, ecological, doable on a balcony."
            cta="See the guides"
          />
        </div>
      </Section>

      {/* Voice pod */}
      <Section
        id="voice-pod"
        eyebrow="04 · Voice agent"
        title={<>The <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(48 100% 65%)" }}>Mochi Pod</em>.</>}
        lede="Replaces the current single-button voice trigger with a four-state pod: idle, listening, thinking, speaking. Live waveform, transcript bubble, captions toggle, and Mochi's actual face."
        bg="hsl(140 38% 26%)"
      >
        <style>{`
          #voice-pod span:first-of-type { color: hsl(48 100% 65%) !important; }
          #voice-pod span:first-of-type span { background: hsl(48 100% 65%) !important; }
          #voice-pod h2 { color: hsl(40 65% 96%) !important; }
          #voice-pod p { color: hsl(40 65% 96% / .8) !important; }
        `}</style>
        <div
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginTop: 48,
          }}
        >
          {POD_STATES.map((p) => (
            <MochiPod
              key={p.state}
              state={p.state}
              transcript={p.transcript}
              captionsOn={p.state !== "idle"}
            />
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer
        style={{
          background: "hsl(30 25% 12%)",
          color: "hsl(40 65% 96% / .85)",
          padding: "80px clamp(20px, 4vw, 56px) 40px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 24 }}>
          <h2
            style={{
              fontFamily: "var(--mochi-font-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 600,
              color: "hsl(40 65% 96%)",
              letterSpacing: "-.02em",
              lineHeight: 1.1,
              maxWidth: "20ch",
            }}
          >
            The garden bee, the{" "}
            <em style={{ fontStyle: "italic", color: "hsl(40 92% 56%)" }}>quiet revolution</em>.
          </h2>
          <p style={{ maxWidth: "42ch", fontSize: 15, lineHeight: 1.65, color: "hsl(40 65% 96% / .65)" }}>
            Part of LA PIPA IS LA PIPA — a regenerative ecosystem celebrating biodiversity,
            food sovereignty, and the slow art of paying attention.
          </p>
          <div
            style={{
              marginTop: 24,
              paddingTop: 24,
              borderTop: "1px solid hsl(40 65% 96% / .12)",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              fontSize: 12.5,
              color: "hsl(40 65% 96% / .55)",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>© 2026 Mochi de los Huertos · Made with honey in Asturias</span>
            <span>v1.0 design system · /brand</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const brandCardStyle: React.CSSProperties = {
  background: "hsl(42 90% 98%)",
  borderRadius: 28,
  padding: 32,
  border: "1px solid hsl(40 92% 56% / .14)",
  position: "relative",
  overflow: "hidden",
};
const brandCardH3: React.CSSProperties = {
  fontFamily: "var(--mochi-font-display)",
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: "-.01em",
  margin: 0,
};
const brandCardP: React.CSSProperties = {
  color: "hsl(28 35% 28%)",
  marginTop: 8,
  fontSize: 14.5,
};

const TypeRow: React.FC<{ label: string; sample: string; font: "display" | "sans" | "script"; italic?: boolean; }> = ({ label, sample, font, italic }) => {
  const fontFamily =
    font === "display"
      ? "var(--mochi-font-display, Fraunces, serif)"
      : font === "sans"
      ? "var(--mochi-font-sans, Saira, sans-serif)"
      : "var(--mochi-font-script, Caveat, cursive)";
  const fontSize = font === "display" ? 36 : font === "sans" ? 17 : 26;
  const fontWeight = font === "script" ? 700 : font === "display" && italic ? 400 : font === "sans" ? 500 : 600;
  const color = font === "script" ? "hsl(35 78% 38%)" : "hsl(30 25% 12%)";

  return (
    <div style={{ padding: "12px 0", borderBottom: "1px dashed hsl(25 28% 22% / .15)" }}>
      <div
        style={{
          fontFamily: "var(--mochi-font-sans)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "hsl(35 78% 38%)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle: italic ? "italic" : "normal",
          color,
          lineHeight: font === "display" ? 1 : 1.3,
          letterSpacing: font === "display" ? "-.02em" : "normal",
          marginTop: 6,
        }}
      >
        {sample}
      </div>
    </div>
  );
};

export default BrandBook;

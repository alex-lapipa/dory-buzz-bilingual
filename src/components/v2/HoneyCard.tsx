import React from "react";

/**
 * HoneyCard · v1.0
 * ─────────────────────────────────────────────────────────
 * Floating glass-morphism card. Replaces the generic shadcn
 * Card primitive on feature surfaces. Pure presentational —
 * compose it with any icon, copy, link.
 *
 * Variants: "honey" (default) | "meadow" | "sky"
 *
 * ADDITIVE: lives in src/components/v2/. No existing usage
 * is modified. Drop into any page when ready.
 */

type Variant = "honey" | "meadow" | "sky";

export interface HoneyCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;          // bilingual pair, rendered in handwritten style
  body: string;
  cta?: string;
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  className?: string;
}

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  honey: {
    background: "hsl(45 60% 96% / .72)",
    borderColor: "hsl(42 90% 97%)",
  },
  meadow: {
    background: "hsl(95 38% 46% / .12)",
    borderColor: "hsl(95 38% 46% / .35)",
  },
  sky: {
    background: "hsl(200 60% 88% / .35)",
    borderColor: "hsl(200 60% 88% / .6)",
  },
};

const VARIANT_ACCENT: Record<Variant, string> = {
  honey:  "hsl(35 78% 38%)",
  meadow: "hsl(140 38% 26%)",
  sky:    "hsl(200 70% 30%)",
};

const VARIANT_ICON_BG: Record<Variant, React.CSSProperties> = {
  honey: {
    background: "linear-gradient(135deg, hsl(45 92% 92%), hsl(42 90% 97%))",
    border: "1px solid hsl(40 92% 56% / .25)",
    color: "hsl(35 78% 38%)",
  },
  meadow: {
    background: "linear-gradient(135deg, hsl(95 38% 80%), hsl(95 38% 92%))",
    border: "1px solid hsl(95 38% 46% / .4)",
    color: "hsl(140 38% 26%)",
  },
  sky: {
    background: "linear-gradient(135deg, hsl(200 60% 92%), hsl(200 60% 96%))",
    border: "1px solid hsl(200 60% 60% / .35)",
    color: "hsl(200 70% 30%)",
  },
};

export const HoneyCard: React.FC<HoneyCardProps> = ({
  icon,
  title,
  subtitle,
  body,
  cta,
  onClick,
  href,
  variant = "honey",
  className = "",
}) => {
  const accent = VARIANT_ACCENT[variant];
  const Component: React.ElementType = href ? "a" : onClick ? "button" : "article";

  return (
    <Component
      onClick={onClick}
      href={href}
      className={`mochi-honey-card ${className}`}
      style={{
        position: "relative",
        display: "block",
        textAlign: "left",
        width: "100%",
        padding: 32,
        borderRadius: "var(--mochi-r-lg, 28px)",
        border: "1px solid",
        boxShadow: "var(--mochi-shadow-card, 0 10px 30px -8px rgba(43,29,11,.18))",
        backdropFilter: "blur(18px) saturate(1.15)",
        WebkitBackdropFilter: "blur(18px) saturate(1.15)",
        overflow: "hidden",
        transition:
          "transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s cubic-bezier(.16,1,.3,1)",
        cursor: onClick || href ? "pointer" : "default",
        font: "inherit",
        color: "inherit",
        ...VARIANT_STYLE[variant],
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform = "translateY(-8px) rotate(-.4deg)";
        e.currentTarget.style.boxShadow =
          "var(--mochi-shadow-float, 0 24px 48px -16px rgba(43,29,11,.28))";
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow =
          "var(--mochi-shadow-card, 0 10px 30px -8px rgba(43,29,11,.18))";
      }}
    >
      {/* Honey drip top accent */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 28,
          right: 28,
          height: 4,
          borderRadius: "0 0 8px 8px",
          background:
            variant === "honey"
              ? "linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))"
              : variant === "meadow"
              ? "linear-gradient(90deg, hsl(95 38% 46%), hsl(95 50% 60%), hsl(95 38% 46%))"
              : "linear-gradient(90deg, hsl(200 70% 50%), hsl(200 80% 70%), hsl(200 70% 50%))",
        }}
      />

      {/* Icon tile */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          marginBottom: 22,
          transition: "transform .4s cubic-bezier(.34,1.56,.64,1)",
          ...VARIANT_ICON_BG[variant],
        }}
      >
        <span style={{ width: 32, height: 32, display: "block" }}>{icon}</span>
      </div>

      {/* Title + bilingual subtitle */}
      <h3
        style={{
          fontFamily: "var(--mochi-font-display, 'Fraunces', Georgia, serif)",
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: "-.01em",
          lineHeight: 1.2,
          color: "hsl(30 25% 12%)",
          margin: 0,
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <span
          style={{
            display: "block",
            marginTop: 2,
            fontFamily: "var(--mochi-font-script, 'Caveat', cursive)",
            fontSize: 18,
            fontWeight: 600,
            color: accent,
          }}
        >
          {subtitle}
        </span>
      )}

      {/* Body */}
      <p
        style={{
          marginTop: 14,
          color: "hsl(28 35% 28%)",
          fontSize: 15,
          lineHeight: 1.6,
          fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        }}
      >
        {body}
      </p>

      {/* CTA */}
      {cta && (
        <span
          style={{
            marginTop: 22,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: accent,
            paddingBottom: 1,
            borderBottom: `1.5px solid ${accent}33`,
            fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
          }}
        >
          {cta}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
          </svg>
        </span>
      )}
    </Component>
  );
};

export default HoneyCard;

import React from "react";
import { IcMic } from "@/components/icons/MochiIcons";

/**
 * MochiPod · v1.0
 * ─────────────────────────────────────────────────────────
 * Presentational voice-agent UI. Renders Mochi's face,
 * a live waveform, status pill, transcript bubble, and a
 * mic / stop / cancel control + captions toggle.
 *
 * Pure props in / events out — does NOT integrate with
 * ElevenLabs by itself. The existing GlobalVoiceAgent.tsx
 * keeps doing the SDK lifting; later we can hook this in.
 *
 * ADDITIVE: lives at src/components/v2/MochiPod.tsx. Not
 * imported anywhere except BrandBook (preview). Drop into
 * page surfaces when ready.
 */

export type MochiPodState = "idle" | "listening" | "thinking" | "speaking";

export interface MochiPodProps {
  state?: MochiPodState;
  name?: string;
  avatarSrc?: string;
  transcript?: { who: "user" | "mochi"; text: string };
  captionsOn?: boolean;
  onMicClick?: () => void;
  onCaptionsToggle?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ACCENT_BY_STATE: Record<MochiPodState, string> = {
  idle:      "hsl(200 25% 40%)",
  listening: "hsl(12 78% 56%)",
  thinking:  "hsl(280 35% 55%)",
  speaking:  "hsl(40 92% 56%)",
};

const STATUS_LABEL: Record<MochiPodState, string> = {
  idle:      "Tap to talk",
  listening: "Listening",
  thinking:  "Thinking…",
  speaking:  "Speaking",
};

const DEFAULT_AVATAR =
  "https://www.mochinillo.com/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png";

const WAVE_BAR_HEIGHTS = [14, 28, 42, 52, 38, 28, 18, 32, 22, 12];

export const MochiPod: React.FC<MochiPodProps> = ({
  state = "idle",
  name = "Mochi",
  avatarSrc = DEFAULT_AVATAR,
  transcript,
  captionsOn = true,
  onMicClick,
  onCaptionsToggle,
  className = "",
  style,
}) => {
  const accent = ACCENT_BY_STATE[state];
  const isActive = state === "listening" || state === "speaking";

  return (
    <div
      className={`mochi-pod mochi-pod--${state} ${className}`}
      style={{
        background: "hsl(45 60% 96%)",
        color: "hsl(30 25% 12%)",
        borderRadius: "var(--mochi-r-lg, 28px)",
        padding: 22,
        boxShadow:
          "var(--mochi-shadow-float, 0 24px 48px -16px rgba(43,29,11,.28))",
        display: "grid",
        gap: 16,
        position: "relative",
        fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        ...style,
      }}
    >
      {/* ── Header: avatar + name + status ─────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundImage: `url(${avatarSrc})`,
            backgroundSize: "130%",
            backgroundPosition: "center 30%",
            background: `url(${avatarSrc}) center 30% / 130% no-repeat, hsl(45 92% 92%)`,
            border: "2px solid hsl(42 90% 97%)",
            boxShadow: "0 4px 10px hsl(30 25% 12% / .15)",
            flexShrink: 0,
            position: "relative",
          }}
          role="img"
          aria-label={`${name} avatar`}
        >
          {/* Active dot */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: isActive ? accent : "hsl(95 38% 46%)",
              border: "2px solid hsl(45 60% 96%)",
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--mochi-font-display, Fraunces, serif)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-.005em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: accent,
              marginTop: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                background: "currentColor",
                borderRadius: "50%",
                animation: state === "idle" ? "none" : "mochi-pulse 1.4s ease-in-out infinite",
              }}
            />
            {STATUS_LABEL[state]}
          </div>
        </div>
      </div>

      {/* ── Waveform ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          height: 64,
          background: "hsl(30 25% 12% / .04)",
          borderRadius: 14,
          padding: "0 18px",
        }}
      >
        {WAVE_BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            style={{
              width: 4,
              height: state === "idle" ? 6 : h,
              background: `linear-gradient(180deg, ${accent}, hsl(32 88% 44%))`,
              borderRadius: 2,
              opacity: state === "idle" ? 0.3 : 1,
              animation:
                state === "idle"
                  ? "none"
                  : state === "thinking"
                  ? "mochi-think 1.4s ease-in-out infinite"
                  : "mochi-wave 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      {/* ── Transcript (only if present) ─────────────────── */}
      {transcript && captionsOn && (
        <div
          style={{
            background: "hsl(45 92% 92%)",
            borderRadius: 16,
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
            color: "hsl(25 28% 22%)",
            position: "relative",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -6,
              left: 18,
              width: 12,
              height: 12,
              background: "hsl(45 92% 92%)",
              transform: "rotate(45deg)",
            }}
          />
          <em style={{ fontStyle: "italic", color: "hsl(35 78% 38%)", marginRight: 6 }}>
            {transcript.who === "user" ? "You:" : `${name}:`}
          </em>
          {transcript.text}
        </div>
      )}

      {/* ── Controls ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          onClick={onMicClick}
          aria-label={
            state === "idle"
              ? `Start talking to ${name}`
              : state === "listening"
              ? "Stop"
              : state === "thinking"
              ? "Cancel"
              : "Stop speaking"
          }
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: state === "idle" ? "hsl(30 25% 12%)" : accent,
            color: "hsl(42 90% 97%)",
            border: 0,
            display: "grid",
            placeItems: "center",
            boxShadow: `0 6px 18px -4px ${accent}88`,
            cursor: "pointer",
            transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
            animation:
              state === "listening"
                ? "mochi-ring 1.6s ease-out infinite"
                : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        >
          {state === "idle" ? (
            <IcMic size={22} style={{ strokeWidth: 2 }} />
          ) : state === "thinking" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeDasharray="31.4" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onCaptionsToggle}
          aria-pressed={captionsOn}
          aria-label="Toggle captions"
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11.5,
            fontWeight: 600,
            color: captionsOn ? "hsl(42 90% 97%)" : "hsl(28 35% 28%)",
            padding: "6px 12px",
            borderRadius: 999,
            background: captionsOn ? "hsl(30 25% 12%)" : "hsl(30 25% 12% / .06)",
            border: 0,
            cursor: "pointer",
          }}
        >
          {captionsOn ? "CC ON" : "CC"}
        </button>
      </div>

      {/* Co-located keyframes (scoped via style tag) */}
      <style>{`
        @keyframes mochi-pulse {
          0%, 100% { opacity: .35; transform: scale(.8); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes mochi-wave {
          0%, 100% { transform: scaleY(.4); }
          50%      { transform: scaleY(1.2); }
        }
        @keyframes mochi-think {
          0%, 100% { transform: scaleY(.4); }
          50%      { transform: scaleY(.7); }
        }
        @keyframes mochi-ring {
          0%   { box-shadow: 0 6px 18px -4px ${accent}88, 0 0 0 0 ${accent}88; }
          100% { box-shadow: 0 6px 18px -4px ${accent}88, 0 0 0 18px ${accent}00; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mochi-pod * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MochiPod;

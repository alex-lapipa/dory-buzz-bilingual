import React, { useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import "@/styles/mochi-tokens.css";

/**
 * GlobalVoiceAgent · v2 (Mochi Pod pill)
 * ─────────────────────────────────────────────────────────
 * Same ElevenLabs SDK contract:
 *   - useConversation({ onConnect, onDisconnect, onError })
 *   - conversation.startSession({ signedUrl })
 *   - conversation.endSession()
 *   - conversation.status, conversation.isSpeaking
 * Same agent-routing behaviour:
 *   - MOCHI_AGENT_ID for general routes
 *   - BEEBEE_AGENT_ID for kids routes (/buzzy-bees, /kids-*)
 * Same error handling and toast UI.
 *
 * Only the visual layer changes: a horizontal honey-glass pill
 * with the clean Mochi avatar (no halo), live mini-waveform when
 * active, and a refined mic button instead of the old simple circle.
 */

const MOCHI_AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const BEEBEE_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";
const KIDS_ROUTES = ["/buzzy-bees", "/kids-stories", "/kids-games", "/kids-songs"];

const MOCHI_AVATAR = "/lovable-uploads/mochi-clean-200.webp";

export const GlobalVoiceAgent: React.FC = () => {
  const location = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasShownErrorRef = useRef(false);

  const isKidsRoute = KIDS_ROUTES.some((r) => location.pathname.startsWith(r));
  const agentId = isKidsRoute ? BEEBEE_AGENT_ID : MOCHI_AGENT_ID;
  const agentName = isKidsRoute ? "BeeBee" : "Mochi";

  const conversation = useConversation({
    onConnect: () => console.log(`🐝 ${agentName} voice connected`),
    onDisconnect: () => console.log(`🐝 ${agentName} voice disconnected`),
    onError: (error) => {
      console.error(`🐝 ${agentName} voice error:`, error);
      if (!hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        setHasError(true);
        toast({
          title: "🐝 Voice temporarily unavailable",
          description: `${agentName} can't connect right now. You can keep chatting with text mode.`,
          variant: "destructive",
        });
      }
    },
  });

  const startConversation = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setHasError(false);
    hasShownErrorRef.current = false;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke(
        "elevenlabs_conversation_token",
        { body: { agent_id: agentId } }
      );

      if (error || !data?.signed_url) {
        throw new Error(error?.message || "No signed URL received");
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (err: any) {
      console.error("🐝 Failed to start voice:", err);
      if (!hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        setHasError(true);
        toast({
          title: "🐝 Voice connection failed",
          description: err?.message?.includes("Permission")
            ? "Please allow microphone access to talk to " + agentName
            : `${agentName} voice is unavailable. Please use text chat.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [agentId, agentName, conversation, isConnecting]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  // ── State derivation for the visual pod ────────────────────
  const visualState: "idle" | "listening" | "thinking" | "speaking" =
    isConnecting ? "thinking" :
    isConnected && isSpeaking ? "speaking" :
    isConnected && !isSpeaking ? "listening" :
    "idle";

  const accent =
    visualState === "speaking"  ? "hsl(40 92% 56%)"   :   // honey
    visualState === "listening" ? "hsl(12 78% 56%)"   :   // coral
    visualState === "thinking"  ? "hsl(280 35% 55%)"  :   // muted purple
                                  "hsl(40 92% 56%)";      // honey resting

  const statusLabel =
    visualState === "speaking"  ? `${agentName} is speaking…` :
    visualState === "listening" ? "Listening" :
    visualState === "thinking"  ? "Connecting…" :
                                  "Tap to talk";

  // ── Error fallback panel ────────────────────────────────────
  if (hasError) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 70,
          width: "min(22rem, calc(100vw - 2rem))",
          background: "hsl(45 60% 96%)",
          color: "hsl(30 25% 12%)",
          border: "1px solid hsl(40 92% 56% / .25)",
          borderRadius: "var(--mochi-r-lg, 28px)",
          padding: 16,
          boxShadow: "var(--mochi-shadow-float, 0 24px 48px -16px rgba(43,29,11,.28))",
          fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>🐝 Voice connection issue</p>
        <p style={{ fontSize: 12.5, color: "hsl(28 35% 28%)", margin: "6px 0 12px" }}>
          {agentName} voice is unavailable right now. Please use text chat.
        </p>
        <button
          onClick={() => {
            setHasError(false);
            hasShownErrorRef.current = false;
            startConversation();
          }}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "hsl(35 78% 38%)",
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Floating pod pill ───────────────────────────────────────
  return (
    <div
      className="mochi-respect-motion"
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 8px 8px 14px",
        background: "hsl(30 25% 12%)",
        color: "hsl(40 65% 96%)",
        borderRadius: 999,
        border: `1.5px solid ${accent}55`,
        boxShadow:
          "var(--mochi-shadow-float, 0 24px 48px -16px rgba(43,29,11,.28))",
        fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        animation: "mochi-pod-enter .8s cubic-bezier(.34,1.56,.64,1) .4s both",
        minHeight: 56,
      }}
    >
      <style>{`
        @keyframes mochi-pod-enter {
          from { transform: translateY(80px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes mochi-pod-wave {
          0%, 100% { transform: scaleY(.4); }
          50%      { transform: scaleY(1.2); }
        }
        @keyframes mochi-pod-ring {
          0%   { box-shadow: 0 6px 18px -4px ${accent}88, 0 0 0 0    ${accent}88; }
          100% { box-shadow: 0 6px 18px -4px ${accent}88, 0 0 0 14px ${accent}00; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mochi-respect-motion, .mochi-respect-motion * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `url(${MOCHI_AVATAR}) center 28% / 130% no-repeat, hsl(45 92% 92%)`,
          border: `2px solid ${visualState === "idle" ? "hsl(40 92% 56%)" : accent}`,
          flexShrink: 0,
          position: "relative",
          transition: "border-color .25s",
        }}
        aria-label={`${agentName} avatar`}
        role="img"
      >
        {/* Active dot */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: visualState === "idle" ? "hsl(95 38% 46%)" : accent,
            border: "2px solid hsl(30 25% 12%)",
            transition: "background .25s",
          }}
        />
      </div>

      {/* Mini waveform — only when active */}
      {(visualState === "listening" || visualState === "speaking") && (
        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            height: 28,
            marginLeft: 2,
          }}
        >
          {[10, 18, 24, 16, 22, 12].map((h, i) => (
            <span
              key={i}
              style={{
                width: 3,
                height: h,
                background: `linear-gradient(180deg, ${accent}, hsl(32 88% 44%))`,
                borderRadius: 2,
                animation: "mochi-pod-wave 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
                transformOrigin: "center",
              }}
            />
          ))}
        </div>
      )}

      {/* Text label */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{agentName}</span>
        <small
          style={{
            fontSize: 10.5,
            opacity: visualState === "idle" ? 0.6 : 0.85,
            color: visualState === "idle" ? "hsl(40 65% 96%)" : accent,
            letterSpacing: ".02em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 140,
            transition: "color .25s, opacity .25s",
          }}
        >
          {statusLabel}
        </small>
      </div>

      {/* Mic / Stop button */}
      <button
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        aria-label={
          isConnected
            ? `Stop talking to ${agentName}`
            : isConnecting
            ? `Connecting to ${agentName}…`
            : `Talk to ${agentName}`
        }
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background:
            isConnecting ? "hsl(28 35% 28%)" :
            isConnected ? accent :
            "hsl(40 92% 56%)",
          color: "hsl(30 25% 12%)",
          border: 0,
          display: "grid",
          placeItems: "center",
          cursor: isConnecting ? "wait" : "pointer",
          flexShrink: 0,
          marginLeft: 2,
          transition: "transform .2s cubic-bezier(.34,1.56,.64,1), background .2s",
          animation:
            visualState === "listening" ? "mochi-pod-ring 1.6s ease-out infinite" : "none",
        }}
        onMouseEnter={(e) => {
          if (!isConnecting) e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
        }}
      >
        {isConnecting ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="0" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </svg>
        ) : isConnected ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default GlobalVoiceAgent;

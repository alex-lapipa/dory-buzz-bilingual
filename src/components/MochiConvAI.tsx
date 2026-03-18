import React, { useEffect, useRef, useState } from "react";

// Agent ID for Mochi Bee
const AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const ACCESS_DENIED_PATTERN = /access denied|not authorized|domain is not authorized/i;
const FRIENDLY_ACCESS_DENIED_MESSAGE =
  "Mochi voice is unavailable on this domain right now. Please use text chat while we reconnect.";

interface MochiConvAIProps {
  className?: string;
  compact?: boolean;
}

export const MochiConvAI: React.FC<MochiConvAIProps> = ({ className = "", compact = false }) => {
  const [widgetReady, setWidgetReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Inject the ElevenLabs ConvAI widget script once
    const existing = document.querySelector('script[data-elevenlabs-convai]');
    if (existing) {
      setWidgetReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.setAttribute("data-elevenlabs-convai", "true");
    script.onload = () => setWidgetReady(true);
    script.onerror = () => setError("Failed to load voice agent. Please try again.");
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      /* script persists globally — don't remove on unmount */
    };
  }, []);

  useEffect(() => {
    if (!widgetReady || error) return;

    const detectDeniedMessage = () => {
      const text = containerRef.current?.textContent ?? "";
      if (ACCESS_DENIED_PATTERN.test(text)) {
        setError(FRIENDLY_ACCESS_DENIED_MESSAGE);
      }
    };

    const onWindowError = (event: ErrorEvent) => {
      if (ACCESS_DENIED_PATTERN.test(event.message ?? "")) {
        setError(FRIENDLY_ACCESS_DENIED_MESSAGE);
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = typeof event.reason === "string" ? event.reason : String(event.reason ?? "");
      if (ACCESS_DENIED_PATTERN.test(reason)) {
        setError(FRIENDLY_ACCESS_DENIED_MESSAGE);
      }
    };

    const observer = new MutationObserver(detectDeniedMessage);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const intervalId = window.setInterval(detectDeniedMessage, 1000);

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    detectDeniedMessage();

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [widgetReady, error]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${className}`}>
        <span className="text-3xl">🐝</span>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!widgetReady) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
        <span className="text-3xl animate-bee-bounce">🐝</span>
        <p className="text-sm text-muted-foreground">Loading Mochi&apos;s voice...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center gap-4 ${compact ? "p-2" : "p-6"} ${className}`}
    >
      {!compact && (
        <div className="mb-2 space-y-1 text-center">
          <p className="text-sm font-medium text-foreground">🐝 Talk to Mochi — press and hold to speak</p>
          <p className="text-xs text-muted-foreground">Mochi habla inglés y español · Mochi speaks English and Spanish</p>
        </div>
      )}
      {/* ElevenLabs ConvAI custom element */}
      {/* @ts-ignore — custom element registered by the ElevenLabs script */}
      <elevenlabs-convai
        agent-id={AGENT_ID}
        style={{ width: compact ? "60px" : "80px", height: compact ? "60px" : "80px" }}
      />
    </div>
  );
};

export default MochiConvAI;

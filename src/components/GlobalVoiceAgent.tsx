import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const MOCHI_AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const BEEBEE_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";
const KIDS_ROUTES = ["/buzzy-bees", "/kids-stories", "/kids-games", "/kids-songs"];
const ACCESS_DENIED_PATTERN = /access denied|not authorized|domain is not authorized/i;

export const GlobalVoiceAgent: React.FC = () => {
  const location = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const hasShownErrorRef = useRef(false);

  const isKidsRoute = KIDS_ROUTES.some((route) => location.pathname.startsWith(route));
  const agentId = isKidsRoute ? BEEBEE_AGENT_ID : MOCHI_AGENT_ID;

  const showFriendlyError = () => {
    if (hasShownErrorRef.current) return;
    hasShownErrorRef.current = true;
    setHasError(true);
    toast({
      title: "🐝 Voice temporarily unavailable",
      description: "Mochi can’t connect right now. You can keep chatting with text mode.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const existing = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
    if (existing) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => setScriptLoaded(true);
    script.onerror = showFriendlyError;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || hasError) return;

    const matchesDeniedError = (value: unknown) =>
      ACCESS_DENIED_PATTERN.test(typeof value === "string" ? value : "");

    const detectDomError = () => {
      const localText = widgetContainerRef.current?.textContent ?? "";
      if (matchesDeniedError(localText)) {
        showFriendlyError();
      }
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (matchesDeniedError(event.message)) {
        showFriendlyError();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = typeof event.reason === "string" ? event.reason : String(event.reason ?? "");
      if (matchesDeniedError(reason)) {
        showFriendlyError();
      }
    };

    const observer = new MutationObserver(detectDomError);
    if (widgetContainerRef.current) {
      observer.observe(widgetContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const intervalId = window.setInterval(detectDomError, 1000);

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    detectDomError();

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [scriptLoaded, hasError]);

  if (!scriptLoaded) return null;

  if (hasError) {
    return (
      <div className="fixed bottom-4 right-4 z-[70] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-3 text-card-foreground shadow-lg">
        <p className="text-sm font-semibold">🐝 Voice connection issue</p>
        <p className="text-xs text-muted-foreground">
          Mochi voice is unavailable on this domain right now. Please use text chat while we reconnect.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={widgetContainerRef}
      key={agentId}
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`,
      }}
    />
  );
};

export default GlobalVoiceAgent;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const MOCHI_AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const BEEBEE_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";

const KIDS_ROUTES = ["/buzzy-bees", "/kids-stories", "/kids-games", "/kids-songs"];

export const GlobalVoiceAgent: React.FC = () => {
  const location = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isKidsRoute = KIDS_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );
  const agentId = isKidsRoute ? BEEBEE_AGENT_ID : MOCHI_AGENT_ID;

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
    );
    if (existing) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      setHasError(true);
      toast({
        title: "🐝 Voice agent unavailable",
        description: "Mochi's voice is taking a nap. Chat features still work!",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
  }, []);

  // Listen for widget errors (access denied, etc.)
  useEffect(() => {
    if (!scriptLoaded) return;

    const handleWidgetError = (event: ErrorEvent) => {
      if (
        event.message?.toLowerCase().includes("access denied") ||
        event.message?.toLowerCase().includes("not authorized")
      ) {
        setHasError(true);
        toast({
          title: "🐝 Voice connection issue",
          description:
            "Mochi can't connect right now. Please try again later or use the text chat instead.",
        });
      }
    };

    window.addEventListener("error", handleWidgetError);
    return () => window.removeEventListener("error", handleWidgetError);
  }, [scriptLoaded]);

  if (!scriptLoaded || hasError) return null;

  return (
    <div
      key={agentId}
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`,
      }}
    />
  );
};

export default GlobalVoiceAgent;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MOCHI_AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const BEEBEE_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";

const KIDS_ROUTES = ["/buzzy-bees"];

export const GlobalVoiceAgent: React.FC = () => {
  const location = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
    document.body.appendChild(script);
  }, []);

  if (!scriptLoaded) return null;

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

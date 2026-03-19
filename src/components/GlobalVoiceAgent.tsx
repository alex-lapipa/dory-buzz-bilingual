import React, { useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MOCHI_AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";
const BEEBEE_AGENT_ID = "agent_8101km13rwc3eyb98g0wampfx499";
const KIDS_ROUTES = ["/buzzy-bees", "/kids-stories", "/kids-games", "/kids-songs"];

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

  if (hasError) {
    return (
      <div className="fixed bottom-4 right-4 z-[70] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-3 text-card-foreground shadow-lg">
        <p className="text-sm font-semibold">🐝 Voice connection issue</p>
        <p className="text-xs text-muted-foreground mb-2">
          {agentName} voice is unavailable right now. Please use text chat.
        </p>
        <button
          onClick={() => { setHasError(false); hasShownErrorRef.current = false; startConversation(); }}
          className="text-xs text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-center gap-2">
      {isConnected && (
        <div className="rounded-full bg-card border border-border px-3 py-1 text-xs text-card-foreground shadow-md">
          {isSpeaking ? `${agentName} is speaking…` : "Listening…"}
        </div>
      )}

      <button
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
          ${isConnecting ? "bg-muted text-muted-foreground cursor-wait" : ""}
          ${isConnected && isSpeaking ? "bg-primary text-primary-foreground animate-pulse" : ""}
          ${isConnected && !isSpeaking ? "bg-destructive text-destructive-foreground" : ""}
          ${!isConnected && !isConnecting ? "bg-primary text-primary-foreground hover:scale-110" : ""}
        `}
        aria-label={isConnected ? `Stop talking to ${agentName}` : `Talk to ${agentName}`}
      >
        {isConnecting ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
          </svg>
        ) : isConnected ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default GlobalVoiceAgent;

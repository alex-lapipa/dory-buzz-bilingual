import React, { useState, useCallback, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";

const AGENT_ID = "agent_1301kkyvc82vey5896n39y1cm5hc";

interface MochiConvAIProps {
  className?: string;
  compact?: boolean;
}

export const MochiConvAI: React.FC<MochiConvAIProps> = ({ className = "", compact = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasShownErrorRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => console.log("🐝 Mochi inline voice connected"),
    onDisconnect: () => console.log("🐝 Mochi inline voice disconnected"),
    onError: (err) => {
      console.error("🐝 Mochi inline voice error:", err);
      if (!hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        setError("Mochi voice is unavailable right now. Please use text chat.");
      }
    },
  });

  const startConversation = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setError(null);
    hasShownErrorRef.current = false;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error: fnError } = await supabase.functions.invoke(
        "elevenlabs_conversation_token",
        { body: { agent_id: AGENT_ID } }
      );

      if (fnError || !data?.token) {
        throw new Error(fnError?.message || "No token received");
      }

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (err: any) {
      console.error("🐝 Mochi inline start failed:", err);
      if (!hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        setError(
          err?.message?.includes("Permission")
            ? "Please allow microphone access to talk to Mochi."
            : "Mochi voice is unavailable right now. Please use text chat."
        );
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, isConnecting]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${className}`}>
        <span className="text-3xl">🐝</span>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => {
            setError(null);
            startConversation();
          }}
          className="text-xs text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${compact ? "p-2" : "p-6"} ${className}`}>
      {!compact && (
        <div className="mb-2 space-y-1 text-center">
          <p className="text-sm font-medium text-foreground">
            🐝 Talk to Mochi — tap the mic to speak
          </p>
          <p className="text-xs text-muted-foreground">
            Mochi habla inglés y español · Mochi speaks English and Spanish
          </p>
        </div>
      )}

      {/* Status */}
      {isConnected && (
        <p className="text-xs text-muted-foreground">
          {isSpeaking ? "Mochi is speaking…" : "Listening…"}
        </p>
      )}

      {/* Mic button */}
      <button
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        className={`
          rounded-full shadow-md flex items-center justify-center transition-all duration-200
          ${compact ? "w-14 h-14" : "w-20 h-20"}
          ${isConnecting ? "bg-muted text-muted-foreground cursor-wait" : ""}
          ${isConnected && isSpeaking ? "bg-primary text-primary-foreground animate-pulse" : ""}
          ${isConnected && !isSpeaking ? "bg-destructive text-destructive-foreground" : ""}
          ${!isConnected && !isConnecting ? "bg-primary text-primary-foreground hover:scale-110" : ""}
        `}
        aria-label={isConnected ? "Stop talking to Mochi" : "Talk to Mochi"}
      >
        {isConnecting ? (
          <span className="text-lg animate-spin">🐝</span>
        ) : isConnected ? (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className={compact ? "w-6 h-6" : "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MochiConvAI;

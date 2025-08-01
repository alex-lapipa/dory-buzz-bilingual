import React from 'react';
import { MochiVoiceInterface } from '@/components/MochiVoiceInterface';
import { FloatingGarden } from '@/components/FloatingGarden';

const Voice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <FloatingGarden />
      </div>
      
      {/* Compact Voice Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center py-2 px-3 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎤</span>
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                Voice Chat with Mochi
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Voice-to-voice conversations
              </p>
            </div>
          </div>
        </div>

        {/* Voice Interface - Takes remaining space */}
        <div className="flex-1 p-2 md:p-4">
          <MochiVoiceInterface />
        </div>
      </div>
    </div>
  );
};

export default Voice;
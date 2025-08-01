import React from 'react';
import { MochiVoiceInterface } from '@/components/MochiVoiceInterface';
import { FloatingGarden } from '@/components/FloatingGarden';

const Voice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <FloatingGarden />
      </div>
      
      {/* Voice Content */}
      <div className="relative z-10 container mx-auto px-3 py-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl animate-bounce">🐝</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                Voice Chat with Mochi
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Voice-to-voice conversations with your AI garden assistant
              </p>
            </div>
          </div>
        </div>

        {/* Voice Interface */}
        <div className="w-full">
          <MochiVoiceInterface />
        </div>
      </div>
    </div>
  );
};

export default Voice;
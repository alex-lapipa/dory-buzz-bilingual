import React from 'react';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import { PageSEO } from '@/components/PageSEO';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
      <PageSEO
        titleEn="Chat with Mochi — The Garden Bee"
        titleEs="Chatea con Mochi — La Abeja del Jardín"
        descriptionEn="Talk to Mochi the Garden Bee! Ask questions about bees, gardens, and nature in English or Spanish."
        descriptionEs="¡Habla con Mochi la Abeja del Jardín! Haz preguntas sobre abejas, jardines y naturaleza."
        path="/chat"
      />
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <FloatingGarden />
      </div>
      
      {/* Chat Content */}
      <div className="relative z-10 container mx-auto px-3 py-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl animate-bounce">🐝</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                Chat with Mochi
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Text-based conversations with your AI garden assistant
              </p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-full">
          <MochiInterface activeTab="chat" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
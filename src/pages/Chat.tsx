import React, { useState } from 'react';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import { PageSEO } from '@/components/PageSEO';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [introOpen, setIntroOpen] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
      <PageSEO
        titleEn="Chat with Mochi — The Garden Bee"
        titleEs="Chatea con Mochi — La Abeja del Jardín"
        descriptionEn="Talk to Mochi the Garden Bee! Ask questions about bees, gardens, and nature in English, Spanish or French."
        descriptionEs="¡Habla con Mochi la Abeja del Jardín! Haz preguntas sobre abejas, jardines y naturaleza en inglés, español o francés."
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
            <span className="text-4xl animate-bounce" aria-hidden="true">
              {t('chat.heroEmoji')}
            </span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                {t('chat.heroTitle')}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {t('chat.heroTagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Round 13 — Mochi introduction card (collapsible, multi-language) */}
        <Card
          data-card="lift"
          className="max-w-3xl mx-auto mb-6 border-2 border-primary/20 surface-glass has-grain"
        >
          <CardContent className="p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setIntroOpen((v) => !v)}
              aria-expanded={introOpen}
              aria-label={t('chat.openIntroductionAria')}
              className="w-full flex items-center justify-between gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <h2 className="text-lg sm:text-xl font-bold text-primary-strong group-hover:text-primary transition-colors">
                {t('chat.introTitle')}
              </h2>
              {introOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              )}
            </button>

            {introOpen && (
              <div className="mt-4 space-y-4 animate-fade-in">
                <p className="text-sm sm:text-base text-readable leading-relaxed">
                  {t('chat.introBody')}
                </p>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {t('chat.tipsTitle')}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-readable">
                    <li>{t('chat.tip1')}</li>
                    <li>{t('chat.tip2')}</li>
                    <li>{t('chat.tip3')}</li>
                    <li>{t('chat.tip4')}</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface — unchanged, original behavior preserved */}
        <div className="w-full">
          <MochiInterface activeTab="chat" />
        </div>
      </div>
    </div>
  );
};

export default Chat;

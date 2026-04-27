import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/PageLayout';
import MasterControlPanel from '@/components/MasterControlPanel';
import { MochiInterface } from '@/components/MochiInterface';
import { BeeEducationHub } from '@/components/BeeEducationHub';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ConsentSettings } from '@/components/GDPRConsent';
import LunarCalendarWidget from '@/components/LunarCalendarWidget';
import {
  PollenSparkle, BeeChat, LeafBook, ButterflyFrame, GardenTools,
  BeehiveSafe, SunflowerStar, NatureLeaf,
} from '@/components/icons';
import "@/styles/mochi-tokens.css";

/**
 * Dashboard · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same default export, same 5-tab structure (control/chat/
 * education/images/privacy), same default tab ('control'),
 * all sub-components preserved (MasterControlPanel,
 * MochiInterface, BeeEducationHub, ImageGenerator,
 * ConsentSettings, LunarCalendarWidget), all 9 custom icons
 * preserved.
 */

const Dashboard: React.FC = () => {
  const cardTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
    fontWeight: 600,
    letterSpacing: '-.01em',
    color: 'hsl(30 25% 12%)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const accentStyle: React.CSSProperties = {
    fontStyle: 'italic',
    fontWeight: 400,
    color: 'hsl(35 78% 38%)',
    fontSize: '.7em',
    marginLeft: 6,
  };

  return (
    <PageLayout>
      {/* ── Editorial header ──────────────────────────────────── */}
      <div
        className="mochi-grain animate-bouncy-enter"
        style={{
          position: 'relative',
          marginBottom: 28,
          padding: 'clamp(28px, 4vw, 40px)',
          background: 'hsl(45 60% 96% / .82)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          borderRadius: 'var(--mochi-r-lg, 28px)',
          border: '1px solid hsl(40 92% 56% / .2)',
          boxShadow: 'var(--mochi-shadow-card, 0 10px 30px -8px hsl(25 28% 22% / .15))',
          overflow: 'hidden',
          fontFamily: 'var(--mochi-font-sans, "Saira", sans-serif)',
          color: 'hsl(30 25% 12%)',
        }}
      >
        {/* Honey drip top accent */}
        <span aria-hidden style={{
          position: 'absolute', top: 0, left: 28, right: 28, height: 4,
          borderRadius: '0 0 8px 8px',
          background: 'linear-gradient(90deg, hsl(40 92% 56%), hsl(48 100% 65%), hsl(40 92% 56%))',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <img
              src="/lovable-uploads/mochi-clean-200.webp"
              alt="Mochi the garden bee"
              width={68}
              height={68}
              style={{
                width: 68,
                height: 68,
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 6px 14px hsl(30 25% 12% / .2))',
                animation: 'mochi-dash-float 4.8s ease-in-out infinite',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <span style={{
                fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
                fontSize: 18,
                fontWeight: 600,
                color: 'hsl(35 78% 38%)',
                display: 'inline-block',
                transform: 'rotate(-1deg)',
              }}>
                ¡bienvenid@ a tu huerto · welcome to your garden
              </span>
              <h1 style={{
                fontFamily: 'var(--mochi-font-display, "Fraunces", serif)',
                fontWeight: 600,
                fontSize: 'clamp(28px, 4vw, 38px)',
                letterSpacing: '-.02em',
                lineHeight: 1.05,
                margin: '2px 0 4px',
              }}>
                Mochi
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'hsl(35 78% 38%)', marginLeft: 8 }}>
                  de los Huertos
                </em>
              </h1>
              <p style={{
                fontSize: 14,
                color: 'hsl(28 35% 28%)',
                margin: 0,
                lineHeight: 1.45,
              }}>
                Your garden companion · Tu compañera del huerto
              </p>
            </div>
          </div>

          <Badge variant="default" className="gap-1 animate-bee-flutter">
            <PollenSparkle className="h-3 w-3" />
            Garden Ready
          </Badge>
        </div>
      </div>

      {/* ── Lunar calendar widget ─────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <LunarCalendarWidget />
      </div>

      {/* ── Main tabs ─────────────────────────────────────────── */}
      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="control" className="gap-2">
            <GardenTools className="h-4 w-4" />
            <span className="hidden sm:inline">Control</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <BeeChat className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-2">
            <LeafBook className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ButterflyFrame className="h-4 w-4" />
            <span className="hidden sm:inline">Create</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <BeehiveSafe className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control">
          <MasterControlPanel />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle style={cardTitleStyle}>
                <BeeChat className="h-5 w-5" style={{ color: 'hsl(35 78% 38%)' }} />
                Chat with Mochi
                <em style={accentStyle}>Habla con Mochi</em>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MochiInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle style={cardTitleStyle}>
                <LeafBook className="h-5 w-5" style={{ color: 'hsl(35 78% 38%)' }} />
                Educational hub
                <em style={accentStyle}>Centro educativo</em>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BeeEducationHub />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle style={cardTitleStyle}>
                <ButterflyFrame className="h-5 w-5" style={{ color: 'hsl(35 78% 38%)' }} />
                Garden image creator
                <em style={accentStyle}>Crear imágenes</em>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <ConsentSettings />
        </TabsContent>
      </Tabs>

      {/* ── Footer line ───────────────────────────────────────── */}
      <div style={{
        marginTop: 48,
        textAlign: 'center',
        fontSize: 13,
        color: 'hsl(28 35% 28%)',
        opacity: 0.78,
      }}>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <NatureLeaf className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
          Powered by nature &amp; curiosity
          <SunflowerStar className="h-4 w-4" style={{ color: 'hsl(35 78% 38%)' }} />
        </p>
        <p style={{
          marginTop: 4,
          fontFamily: 'var(--mochi-font-script, "Caveat", cursive)',
          fontSize: 16,
          color: 'hsl(35 78% 38%)',
        }}>
          donde la naturaleza encuentra la educación · where nature meets education
        </p>
      </div>

      <style>{`
        @keyframes mochi-dash-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-5px) rotate(1.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [alt="Mochi the garden bee"] { animation: none !important; }
        }
      `}</style>
    </PageLayout>
  );
};

export default Dashboard;

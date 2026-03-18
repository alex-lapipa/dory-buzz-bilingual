import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const BrandBook: React.FC = () => {
  const colorTokens = [
    { name: 'Primary (Bee Yellow)', var: '--primary', hsl: '59 100% 50%', class: 'bg-primary', sample: 'bg-primary' },
    { name: 'Primary Foreground', var: '--primary-foreground', hsl: '30 100% 8%', class: 'bg-primary-foreground', sample: 'bg-primary-foreground' },
    { name: 'Foreground (Dark Honey)', var: '--foreground', hsl: '39 100% 10%', class: 'text-foreground', sample: 'bg-foreground' },
    { name: 'Destructive (Alert)', var: '--destructive', hsl: '0 84.2% 60.2%', class: 'bg-destructive', sample: 'bg-destructive' },
    { name: 'Ring / Focus', var: '--ring', hsl: '59 100% 50%', class: 'ring-ring', sample: 'bg-ring' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl animate-bee-bounce">🐝</span>
          <h2 className="text-3xl font-bold text-foreground">MochiBee Brand Book</h2>
          <span className="text-5xl animate-flower-sway">🌻</span>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          The official brand identity guide for BeeCrazy Garden World — crafted by Mochi's Design Agent.
        </p>
      </div>

      {/* Logo Usage */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Logo & Mascot Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <img
                src="/lovable-uploads/1f601181-1675-48ad-9c86-886c676b13e7.png"
                alt="La Pipa logo"
                className="h-16 w-16"
              />
              <span className="text-sm font-medium">La Pipa Logo</span>
              <span className="text-xs text-muted-foreground">Min size: 24×24px</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <img
                src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png"
                alt="Mochi the Bee"
                className="h-16 w-16"
              />
              <span className="text-sm font-medium">Mochi Mascot</span>
              <span className="text-xs text-muted-foreground">Use with drop-shadow</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <div className="h-16 flex items-center">
                <span className="text-2xl font-bold text-primary">MochiBee 🌻</span>
              </div>
              <span className="text-sm font-medium">Wordmark</span>
              <span className="text-xs text-muted-foreground">Saira Bold + emoji</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 text-sm space-y-1">
            <p className="font-medium">Mascot Guidelines:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Always show Mochi with a friendly, approachable expression</li>
              <li>Use the <code className="text-xs bg-muted px-1 rounded">animate-bee-bounce</code> animation for interactive states</li>
              <li>Pair with 🌻 sunflower emoji in branded contexts</li>
              <li>Never distort or recolor the mascot asset</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorTokens.map((c) => (
              <div key={c.var} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className={`w-12 h-12 rounded-lg ${c.sample} border border-border shrink-0`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.var}</p>
                  <p className="text-xs text-muted-foreground">{c.hsl}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Gradient Tokens</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="h-20 rounded-lg bg-gradient-bee flex items-end p-2">
                <span className="text-xs font-mono text-primary-foreground bg-primary-foreground/20 px-2 py-0.5 rounded">gradient-bee</span>
              </div>
              <div className="h-20 rounded-lg bg-gradient-flower flex items-end p-2">
                <span className="text-xs font-mono text-primary-foreground bg-primary-foreground/20 px-2 py-0.5 rounded">gradient-flower</span>
              </div>
              <div className="h-20 rounded-lg bg-gradient-nature flex items-end p-2">
                <span className="text-xs font-mono text-primary-foreground bg-primary-foreground/20 px-2 py-0.5 rounded">gradient-nature</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>✏️ Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-border space-y-1">
            <p className="text-sm text-muted-foreground">Font Family</p>
            <p className="text-xl font-bold font-saira">Saira — Primary Typeface</p>
            <p className="text-xs text-muted-foreground font-mono">font-family: 'Saira', sans-serif</p>
          </div>

          <div className="space-y-3">
            <h1 className="text-responsive-4xl font-bold">Heading 1 — responsive-4xl</h1>
            <h2 className="text-responsive-3xl font-bold">Heading 2 — responsive-3xl</h2>
            <h3 className="text-responsive-2xl font-semibold">Heading 3 — responsive-2xl</h3>
            <h4 className="text-responsive-xl font-semibold">Heading 4 — responsive-xl</h4>
            <p className="text-responsive-base">Body text — responsive-base (default)</p>
            <p className="text-responsive-sm text-muted-foreground">Small text — responsive-sm</p>
            <p className="text-responsive-xs text-muted-foreground">Caption — responsive-xs</p>
          </div>
        </CardContent>
      </Card>

      {/* Tone of Voice */}
      <Card>
        <CardHeader>
          <CardTitle>🗣️ Tone of Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <Badge>English</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Friendly, warm, and encouraging</li>
                <li>✅ Nature-inspired vocabulary</li>
                <li>✅ Accessible to families and children</li>
                <li>❌ Never condescending or overly technical</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <Badge>Español</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Cálido, cercano y educativo</li>
                <li>✅ Contexto cultural mexicano</li>
                <li>✅ Vocabulario de naturaleza en español</li>
                <li>❌ Sin jerga técnica innecesaria</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

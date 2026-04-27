import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HoneycombMenu, BeeFlying, BeeFace, ButterflyLink, FlowerHeart, SunflowerStar,
  BeehiveSafe, LeafBook, BeeChat, PollenSparkle, SeedlingChart, MusicalFlower,
  FlowerBudClose, FlowerPlay, FlowerPause, HoneycombTrophy, BeeAntenna,
  DandelionSpin, LeafEnvelope, SundialFlower, LadybugInfo, EarthVine,
  TwoLeaves, BloomingCheck, WiltingFlower, SproutingSeed, GardenTools,
  ButterflySearch, FlowerEye, Firefly, ButterflyFrame, BeeUpload, BeeDownload,
  GardenExpand, GardenShrink, GraduationBee, NatureLeaf, GamepadFlower,
  VolumeFlower, GardenLock, ShareBlossom, BeeColony, GardenKey, CloudFlower,
  BotBee, GardenX, ActivityVine, TrendingVine, BeeTrailRight, DandelionBack,
  VideoFlower, CodeVine, InstagramFlower, GardenCalendar, VolumeMuted,
  WifiFlower, WifiOffFlower, HiveDatabase, WiltingCircle, NatureWarning, BeeChatSquare,
} from '@/components/icons';

const iconGrid = [
  { name: 'HoneycombMenu', Icon: HoneycombMenu, replaces: 'Menu' },
  { name: 'BeeFace', Icon: BeeFace, replaces: 'User' },
  { name: 'BeeFlying', Icon: BeeFlying, replaces: 'LogOut' },
  { name: 'FlowerHeart', Icon: FlowerHeart, replaces: 'Heart' },
  { name: 'SunflowerStar', Icon: SunflowerStar, replaces: 'Star' },
  { name: 'BeehiveSafe', Icon: BeehiveSafe, replaces: 'Shield' },
  { name: 'LeafBook', Icon: LeafBook, replaces: 'BookOpen' },
  { name: 'BeeChat', Icon: BeeChat, replaces: 'MessageCircle' },
  { name: 'PollenSparkle', Icon: PollenSparkle, replaces: 'Sparkles / Zap' },
  { name: 'SeedlingChart', Icon: SeedlingChart, replaces: 'BarChart3' },
  { name: 'MusicalFlower', Icon: MusicalFlower, replaces: 'Music' },
  { name: 'FlowerPlay', Icon: FlowerPlay, replaces: 'Play' },
  { name: 'FlowerPause', Icon: FlowerPause, replaces: 'Pause' },
  { name: 'FlowerBudClose', Icon: FlowerBudClose, replaces: 'X / Close' },
  { name: 'HoneycombTrophy', Icon: HoneycombTrophy, replaces: 'Trophy' },
  { name: 'BeeAntenna', Icon: BeeAntenna, replaces: 'Mic' },
  { name: 'DandelionSpin', Icon: DandelionSpin, replaces: 'Loader / Refresh' },
  { name: 'LeafEnvelope', Icon: LeafEnvelope, replaces: 'Mail' },
  { name: 'SundialFlower', Icon: SundialFlower, replaces: 'Clock' },
  { name: 'LadybugInfo', Icon: LadybugInfo, replaces: 'Info' },
  { name: 'EarthVine', Icon: EarthVine, replaces: 'Globe' },
  { name: 'TwoLeaves', Icon: TwoLeaves, replaces: 'Copy' },
  { name: 'BloomingCheck', Icon: BloomingCheck, replaces: 'CheckCircle' },
  { name: 'WiltingFlower', Icon: WiltingFlower, replaces: 'AlertCircle' },
  { name: 'SproutingSeed', Icon: SproutingSeed, replaces: 'Plus' },
  { name: 'GardenTools', Icon: GardenTools, replaces: 'Settings' },
  { name: 'ButterflySearch', Icon: ButterflySearch, replaces: 'Search' },
  { name: 'ButterflyLink', Icon: ButterflyLink, replaces: 'ExternalLink' },
  { name: 'ButterflyFrame', Icon: ButterflyFrame, replaces: 'Camera' },
  { name: 'FlowerEye', Icon: FlowerEye, replaces: 'Eye' },
  { name: 'Firefly', Icon: Firefly, replaces: 'Brain / Lightbulb' },
  { name: 'GraduationBee', Icon: GraduationBee, replaces: 'GraduationCap' },
  { name: 'NatureLeaf', Icon: NatureLeaf, replaces: 'Leaf' },
  { name: 'VolumeFlower', Icon: VolumeFlower, replaces: 'Volume2' },
  { name: 'VolumeMuted', Icon: VolumeMuted, replaces: 'VolumeX' },
  { name: 'GardenLock', Icon: GardenLock, replaces: 'Lock' },
  { name: 'GardenCalendar', Icon: GardenCalendar, replaces: 'Calendar' },
  { name: 'ShareBlossom', Icon: ShareBlossom, replaces: 'Share2' },
  { name: 'BeeColony', Icon: BeeColony, replaces: 'Users' },
  { name: 'BeeUpload', Icon: BeeUpload, replaces: 'Upload' },
  { name: 'BeeDownload', Icon: BeeDownload, replaces: 'Download' },
  { name: 'GardenExpand', Icon: GardenExpand, replaces: 'Expand' },
  { name: 'GardenShrink', Icon: GardenShrink, replaces: 'Shrink' },
  { name: 'BeeTrailRight', Icon: BeeTrailRight, replaces: 'ArrowRight' },
  { name: 'DandelionBack', Icon: DandelionBack, replaces: 'RotateCcw' },
  { name: 'GamepadFlower', Icon: GamepadFlower, replaces: 'Gamepad2' },
  { name: 'VideoFlower', Icon: VideoFlower, replaces: 'Video' },
  { name: 'CodeVine', Icon: CodeVine, replaces: 'Code' },
  { name: 'InstagramFlower', Icon: InstagramFlower, replaces: 'Instagram' },
  { name: 'GardenKey', Icon: GardenKey, replaces: 'Key' },
  { name: 'CloudFlower', Icon: CloudFlower, replaces: 'Cloud' },
  { name: 'BotBee', Icon: BotBee, replaces: 'Bot' },
  { name: 'ActivityVine', Icon: ActivityVine, replaces: 'Activity' },
  { name: 'TrendingVine', Icon: TrendingVine, replaces: 'TrendingUp' },
  { name: 'WifiFlower', Icon: WifiFlower, replaces: 'Wifi' },
  { name: 'WifiOffFlower', Icon: WifiOffFlower, replaces: 'WifiOff' },
  { name: 'HiveDatabase', Icon: HiveDatabase, replaces: 'Database' },
  { name: 'GardenX', Icon: GardenX, replaces: 'X' },
  { name: 'WiltingCircle', Icon: WiltingCircle, replaces: 'XCircle' },
  { name: 'NatureWarning', Icon: NatureWarning, replaces: 'AlertTriangle' },
  { name: 'BeeChatSquare', Icon: BeeChatSquare, replaces: 'MessageSquare' },
];

export const BrandBook: React.FC = () => {
  const colorTokens = [
    { name: 'Primary (Bee Yellow)', var: '--primary', hsl: '59 100% 50%', sample: 'bg-primary' },
    { name: 'Primary Foreground', var: '--primary-foreground', hsl: '30 100% 8%', sample: 'bg-primary-foreground' },
    { name: 'Foreground (Dark Honey)', var: '--foreground', hsl: '39 100% 10%', sample: 'bg-foreground' },
    { name: 'Ring / Focus', var: '--ring', hsl: '59 100% 50%', sample: 'bg-ring' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl animate-bee-bounce">🐝</span>
          <h2 className="text-3xl font-bold text-foreground">Mochi de los Huertos Brand Book</h2>
          <span className="text-5xl animate-flower-sway">🌻</span>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          The official brand identity guide for BeeCrazy Garden World — crafted by Mochi's Design Agent.
        </p>
      </div>

      {/* Logo Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ButterflyFrame className="h-5 w-5 text-primary" />
            Logo & Mascot Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <img src="/lovable-uploads/1f601181-1675-48ad-9c86-886c676b13e7.png" alt="La Pipa logo" className="h-16 w-16" />
              <span className="text-sm font-medium">La Pipa Logo</span>
              <span className="text-xs text-muted-foreground">Min size: 24×24px</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <img src="/lovable-uploads/mochi-clean-400.webp" alt="Mochi the Bee" className="h-16 w-16" />
              <span className="text-sm font-medium">Mochi Mascot</span>
              <span className="text-xs text-muted-foreground">Use with drop-shadow</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border">
              <div className="h-16 flex items-center">
                <span className="text-2xl font-bold text-primary">Mochi de los Huertos 🌻</span>
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

      {/* Iconography — NEW SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PollenSparkle className="h-5 w-5 text-primary" />
            Iconography — BeeIcon System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-secondary/50 text-sm space-y-2">
            <p className="font-medium">Icon Design Principles:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>All icons are nature-themed SVGs: bees, flowers, butterflies, leaves, honeycombs</li>
              <li>No generic tech icons (rockets, gears, lightning bolts, shields with locks)</li>
              <li>Rounded, child-friendly line art with consistent 24×24 viewBox</li>
              <li>Drop-in replacements for Lucide icons (same <code className="bg-muted px-1 rounded">size</code>, <code className="bg-muted px-1 rounded">color</code>, <code className="bg-muted px-1 rounded">className</code> props)</li>
              <li>Import from <code className="bg-muted px-1 rounded">@/components/icons</code></li>
            </ul>
          </div>

          <Separator />

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {iconGrid.map(({ name, Icon, replaces }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Icon className="h-6 w-6 text-foreground" />
                <span className="text-[10px] font-medium text-center leading-tight">{name}</span>
                <span className="text-[9px] text-muted-foreground text-center">was: {replaces}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50/50 text-sm space-y-2">
            <p className="font-medium text-amber-800">🐝 Do / Don't:</p>
            <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">✅ Do</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Use BeeIcons for all UI actions</li>
                  <li>Keep nature emoji (🐝🌻🦋🌸🌿)</li>
                  <li>Use amber tones for warnings</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">🚫 Don't</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Use Lucide generic icons</li>
                  <li>Use tech emoji (🚀⚡🔧🛡️)</li>
                  <li>Use red for non-critical alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlowerHeart className="h-5 w-5 text-primary" />
            Color Palette
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <LeafBook className="h-5 w-5 text-primary" />
            Typography
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <BeeChat className="h-5 w-5 text-primary" />
            Tone of Voice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <Badge>English</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Friendly, warm, and encouraging</li>
                <li>✅ Nature-inspired vocabulary</li>
                <li>✅ Accessible to families and children</li>
                <li>🚫 Never condescending or overly technical</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <Badge>Español</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Cálido, cercano y educativo</li>
                <li>✅ Contexto cultural mexicano</li>
                <li>✅ Vocabulario de naturaleza en español</li>
                <li>🚫 Sin jerga técnica innecesaria</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

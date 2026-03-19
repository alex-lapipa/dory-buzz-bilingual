import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { FlowerHeart, PollenSparkle, NatureLeaf } from '@/components/icons';

export const DesignSystem: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">🐝 MochiBee Design System</h2>
        <p className="text-muted-foreground">Live component showcase — copy the class names and use them.</p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>All button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><FlowerHeart className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{'<Button variant="default" size="sm">'}</p>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1"><Zap className="h-3 w-3" /> With Icon</Badge>
            <Badge className="gap-1 animate-bee-flutter"><Leaf className="h-3 w-3" /> Animated</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{'<Badge variant="secondary">'}</p>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="font-medium">Standard Card</p>
                <p className="text-sm text-muted-foreground">Glass morphism with backdrop blur</p>
                <p className="text-xs text-muted-foreground font-mono mt-2">className="glass-card"</p>
              </CardContent>
            </Card>
            <div className="rounded-lg p-4 bg-gradient-bee border border-border">
              <p className="font-medium text-primary-foreground">Gradient Card</p>
              <p className="text-sm text-primary-foreground/80">Using bg-gradient-bee</p>
              <p className="text-xs text-primary-foreground/60 font-mono mt-2">className="bg-gradient-bee"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demo-input">Text Input</Label>
              <Input id="demo-input" placeholder="Type something..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-disabled">Disabled Input</Label>
              <Input id="demo-disabled" placeholder="Disabled" disabled />
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="demo-check" />
              <Label htmlFor="demo-check">Checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="demo-switch" />
              <Label htmlFor="demo-switch">Switch</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Animations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-center">
              <span className="text-4xl inline-block animate-bee-bounce">🐝</span>
              <p className="text-xs text-muted-foreground font-mono mt-1">animate-bee-bounce</p>
            </div>
            <div className="text-center">
              <span className="text-4xl inline-block animate-flower-sway">🌻</span>
              <p className="text-xs text-muted-foreground font-mono mt-1">animate-flower-sway</p>
            </div>
            <div className="text-center">
              <span className="text-4xl inline-block animate-pulse">💛</span>
              <p className="text-xs text-muted-foreground font-mono mt-1">animate-pulse</p>
            </div>
            <div className="text-center">
              <Badge className="animate-bee-flutter gap-1"><Zap className="h-3 w-3" /> Flutter</Badge>
              <p className="text-xs text-muted-foreground font-mono mt-1">animate-bee-flutter</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="text-xs font-mono w-20 text-muted-foreground">mobile-{size}</span>
                <div className={`h-4 bg-primary/60 rounded`} style={{ width: `var(--spacing-${size})` }} />
                <span className="text-xs text-muted-foreground">--spacing-{size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

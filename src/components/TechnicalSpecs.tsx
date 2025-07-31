import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Cpu, 
  Database, 
  Globe, 
  Mic, 
  MessageCircle, 
  Image, 
  Zap,
  Shield,
  Cloud,
  Code
} from 'lucide-react';

export const TechnicalSpecs: React.FC = () => {
  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {/* Core Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code className="h-5 w-5" />
            Core Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Frontend:</span>
              <div className="text-muted-foreground">React 18 + TypeScript</div>
            </div>
            <div>
              <span className="font-medium">Build Tool:</span>
              <div className="text-muted-foreground">Vite</div>
            </div>
            <div>
              <span className="font-medium">UI Framework:</span>
              <div className="text-muted-foreground">Tailwind CSS</div>
            </div>
            <div>
              <span className="font-medium">Components:</span>
              <div className="text-muted-foreground">Shadcn/UI + Radix</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backend Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Backend & Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Database:</span>
              <Badge variant="secondary">Supabase PostgreSQL</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Authentication:</span>
              <Badge variant="secondary">Supabase Auth</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Real-time:</span>
              <Badge variant="secondary">WebSockets</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Edge Functions:</span>
              <Badge variant="secondary">Deno Runtime</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cpu className="h-5 w-5" />
            AI & ML Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">OpenAI GPT-4:</span>
              <Badge variant="default">Primary Chat</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">OpenAI Realtime API:</span>
              <Badge variant="default">Voice-to-Voice</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Anthropic Claude:</span>
              <Badge variant="secondary">Advanced Reasoning</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">xAI Grok:</span>
              <Badge variant="secondary">Alternative AI</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">DALL-E 3:</span>
              <Badge variant="secondary">Image Generation</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">ElevenLabs:</span>
              <Badge variant="secondary">Text-to-Speech</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mic className="h-5 w-5" />
            Voice Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Real-time Voice Chat</span>
              <Badge variant="default">WebRTC</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Speech Recognition</span>
              <Badge variant="secondary">Browser STT</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Voice Synthesis</span>
              <Badge variant="secondary">ElevenLabs TTS</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Audio Processing</span>
              <Badge variant="secondary">Web Audio API</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment & Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="h-5 w-5" />
            Deployment & Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Hosting:</span>
              <Badge variant="default">Vercel</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">CDN:</span>
              <Badge variant="secondary">Global Edge Network</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">SSL/TLS:</span>
              <Badge variant="secondary">Auto-managed</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Analytics:</span>
              <Badge variant="secondary">Built-in</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Load Time:</span>
              <div className="text-muted-foreground">&lt; 2 seconds</div>
            </div>
            <div>
              <span className="font-medium">Voice Latency:</span>
              <div className="text-muted-foreground">&lt; 300ms</div>
            </div>
            <div>
              <span className="font-medium">Uptime:</span>
              <div className="text-muted-foreground">99.9%</div>
            </div>
            <div>
              <span className="font-medium">Scalability:</span>
              <div className="text-muted-foreground">Auto-scaling</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Authentication:</span>
              <Badge variant="default">JWT + OAuth</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Data Encryption:</span>
              <Badge variant="secondary">AES-256</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Privacy:</span>
              <Badge variant="secondary">GDPR Compliant</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API Security:</span>
              <Badge variant="secondary">Rate Limited</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            Platform Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Desktop:</span>
              <div className="text-muted-foreground">Chrome, Firefox, Safari, Edge</div>
            </div>
            <div>
              <span className="font-medium">Mobile:</span>
              <div className="text-muted-foreground">iOS Safari, Android Chrome</div>
            </div>
            <div>
              <span className="font-medium">Tablet:</span>
              <div className="text-muted-foreground">iPad, Android Tablets</div>
            </div>
            <div>
              <span className="font-medium">PWA:</span>
              <div className="text-muted-foreground">Installable App</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
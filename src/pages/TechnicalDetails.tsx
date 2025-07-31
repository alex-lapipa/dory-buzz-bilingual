import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Zap, 
  Mic, 
  Image, 
  Database, 
  Cloud, 
  Shield, 
  Users,
  Sparkles,
  Heart,
  Leaf
} from 'lucide-react';

const TechnicalDetails: React.FC = () => {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl animate-bee-bounce">🐝</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
              BeeCrazy Garden World
            </h1>
            <span className="text-4xl animate-flower-sway">🌻</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Next-Gen AI Platform
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Leaf className="h-3 w-3 mr-1" />
              Educational & Interactive
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Heart className="h-3 w-3 mr-1" />
              Family-Friendly
            </Badge>
          </div>
        </div>

        {/* Project Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              About BeeCrazy Garden World
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              BeeCrazy Garden World represents a groundbreaking fusion of artificial intelligence and nature education, 
              designed to create an immersive learning experience for families and garden enthusiasts worldwide.
            </p>
            
            <p className="leading-relaxed">
              Our platform combines cutting-edge AI technologies with deep domain expertise in permaculture, 
              beekeeping, and sustainable gardening practices. Through our friendly bee companion "Mochi," 
              users embark on educational adventures that make learning about nature engaging, interactive, and fun.
            </p>
            
            <p className="leading-relaxed">
              The project bridges the gap between complex environmental science and accessible family education, 
              offering multilingual support (English and Spanish) to reach diverse communities and promote 
              global environmental awareness.
            </p>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Advanced Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* AI & Machine Learning */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI & Machine Learning
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800">OpenAI GPT-4.1 Turbo</h4>
                    <p className="text-sm text-purple-700">
                      Latest language model for natural conversations, educational content generation, 
                      and contextual understanding of complex gardening topics.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">Anthropic Claude 4</h4>
                    <p className="text-sm text-blue-700">
                      Advanced reasoning capabilities for deep educational analysis, 
                      scientific explanations, and nuanced environmental insights.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">XAI Grok Integration</h4>
                    <p className="text-sm text-green-700">
                      Real-time data processing and innovative problem-solving approaches 
                      for garden-specific challenges and solutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice & Media Technologies */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Mic className="h-5 w-5 text-orange-600" />
                  Voice & Media Technologies
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800">ElevenLabs Premium TTS</h4>
                    <p className="text-sm text-orange-700">
                      Ultra-realistic voice synthesis with emotion and context awareness, 
                      bringing Mochi to life with natural speech patterns.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800">OpenAI Realtime Voice</h4>
                    <p className="text-sm text-red-700">
                      Revolutionary real-time voice interaction capabilities for 
                      seamless conversational experiences without delays.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-medium text-pink-800">Advanced Image Generation</h4>
                    <p className="text-sm text-pink-700">
                      DALL-E 3 and GPT-Image-1 for creating educational illustrations, 
                      garden visualizations, and interactive learning materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              Infrastructure & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Database className="h-8 w-8 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-800 mb-2">Supabase Backend</h4>
                <p className="text-sm text-slate-700">
                  PostgreSQL database with real-time capabilities, edge functions, 
                  and built-in authentication for secure data management.
                </p>
              </div>
              
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <Zap className="h-8 w-8 text-cyan-600 mb-2" />
                <h4 className="font-medium text-cyan-800 mb-2">Vercel Edge Network</h4>
                <p className="text-sm text-cyan-700">
                  Global content delivery with ultra-low latency, 
                  ensuring fast loading times worldwide.
                </p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Shield className="h-8 w-8 text-emerald-600 mb-2" />
                <h4 className="font-medium text-emerald-800 mb-2">GDPR Compliance</h4>
                <p className="text-sm text-emerald-700">
                  Full privacy protection with transparent consent management 
                  and data processing controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next-Generation Advantages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Next-Generation Advantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-purple-700">🧠 AI-Powered Personalization</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Adaptive learning paths based on user interests and progress</li>
                    <li>• Context-aware responses that evolve with conversation history</li>
                    <li>• Multi-modal interactions combining text, voice, and visual content</li>
                    <li>• Real-time sentiment analysis for emotional engagement</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-700">🌱 Educational Innovation</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Gamified learning experiences with progress tracking</li>
                    <li>• Interactive storytelling with branching narratives</li>
                    <li>• Augmented reality garden planning (coming soon)</li>
                    <li>• Community-driven content and shared discoveries</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-700">🚀 Performance Excellence</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Sub-100ms response times for voice interactions</li>
                    <li>• Edge computing for reduced latency worldwide</li>
                    <li>• Progressive web app technology for offline functionality</li>
                    <li>• Optimized mobile experience with touch-first design</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-orange-700">🌍 Global Accessibility</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Bilingual support with cultural context adaptation</li>
                    <li>• Voice recognition for multiple accents and dialects</li>
                    <li>• Screen reader compatibility and keyboard navigation</li>
                    <li>• Bandwidth optimization for developing regions</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Innovation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">🔬 Upcoming Features</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Advanced plant recognition, IoT garden sensor integration, 
                  and AR-powered garden design tools.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Plant ID Camera</Badge>
                  <Badge variant="secondary" className="text-xs">Weather Integration</Badge>
                  <Badge variant="secondary" className="text-xs">Community Marketplace</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Team Signatures */}
        <Card className="bg-gradient-to-r from-green-50 via-yellow-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Heart className="h-6 w-6" />
              Project Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium text-amber-800 mb-4">
                  Crafted with passion by our expert team
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white/60 rounded-lg border border-amber-200">
                  <div className="text-2xl mb-2">🤖</div>
                  <h4 className="font-bold text-amber-800">Alec Lawton</h4>
                  <p className="text-sm text-amber-700 font-medium">AI Specialist</p>
                  <p className="text-xs text-amber-600 mt-2">
                    Advanced AI integration, machine learning optimization, 
                    and next-generation technology implementation
                  </p>
                </div>
                
                <div className="p-4 bg-white/60 rounded-lg border border-amber-200">
                  <div className="text-2xl mb-2">🐝</div>
                  <h4 className="font-bold text-amber-800">Isabel Rimada</h4>
                  <p className="text-sm text-amber-700 font-medium">Bee & Beeswax Expert</p>
                  <p className="text-xs text-amber-600 mt-2">
                    Sustainable beekeeping practices, beeswax & candles crafting, 
                    and ecological garden systems
                  </p>
                </div>
                
                <div className="p-4 bg-white/60 rounded-lg border border-amber-200">
                  <div className="text-2xl mb-2">🌻</div>
                  <h4 className="font-bold text-amber-800">Dory Casas</h4>
                  <p className="text-sm text-amber-700 font-medium">Garden, Seeds & Permaculture Specialist</p>
                  <p className="text-xs text-amber-600 mt-2">
                    Heirloom seed preservation, organic gardening methods, 
                    permaculture design, and natural beeswax applications
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-amber-700 italic">
                  "Where artificial intelligence meets natural wisdom to cultivate tomorrow's gardeners" 🌱
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TechnicalDetails;
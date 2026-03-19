import React from 'react';
import { MochiConvAI } from '@/components/MochiConvAI';
import { MochiInterface } from '@/components/MochiInterface';
import { FloatingGarden } from '@/components/FloatingGarden';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { GraduationBee, SeedlingChart, NatureLeaf } from '@/components/icons';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Optimized background elements */}
      <div className="absolute inset-0 opacity-20">
        <FloatingGarden />
      </div>
      
      {/* Mobile-First Content with consistent spacing */}
      <div className="relative z-10 content-spacing min-h-screen">
        {/* Mobile Hero Section - Compact and centered */}
        <div className="text-center space-y-mobile-lg mb-mobile-2xl">
          <div className="flex items-center justify-center gap-mobile-md">
            <img 
              src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png" 
              alt="Mochi the Bee" 
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 animate-bee-bounce filter drop-shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-responsive-2xl md:text-responsive-3xl lg:text-responsive-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                MochiBee Garden
              </h1>
              <p className="text-responsive-sm md:text-responsive-base text-muted-foreground font-medium">
                Your garden assistant <SunflowerStar className="h-4 w-4 inline text-primary" />
              </p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-4xl mx-auto mb-mobile-3xl">
          <div className="card-nature rounded-lg shadow-card">
            <MochiInterface activeTab="chat" />
          </div>
        </div>

        {/* Quick Actions - Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-mobile-lg max-w-2xl mx-auto mb-mobile-2xl">
          <Card 
            className="card-nature cursor-pointer" 
            onClick={() => navigate('/learning-hub')}
          >
            <CardHeader className="pb-mobile-md">
              <CardTitle className="flex items-center gap-2 text-responsive-lg">
                <GraduationBee className="h-5 w-5 text-primary" />
                🐝 Beeducation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-responsive-sm text-muted-foreground">
                Explore gardening knowledge with Mochi
              </p>
            </CardContent>
          </Card>

          <Card 
            className="card-nature cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          >
            <CardHeader className="pb-mobile-md">
              <CardTitle className="flex items-center gap-2 text-responsive-lg">
                <SeedlingChart className="h-5 w-5 text-primary" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-responsive-sm text-muted-foreground">
                View progress and insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Footer */}
        <div className="text-center">
          <p className="text-responsive-sm text-muted-foreground flex items-center justify-center gap-2">
            <NatureLeaf className="h-4 w-4" />
            Garden assistant powered by nature
            <NatureLeaf className="h-4 w-4" />
          </p>
        </div>
      </div>

      {/* Floating Mochi Voice Widget — bottom right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <MochiConvAI compact />
      </div>
    </div>
  );
};

export default Index;

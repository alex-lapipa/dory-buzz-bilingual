import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeafEnvelope, BloomingCheck, FlowerHeart } from '@/components/icons';

interface WelcomeEmailProps {
  userEmail: string;
  displayName: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userEmail,
  displayName
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-green-50">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <span className="text-6xl">🐝</span>
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                <FlowerHeart className="h-4 w-4" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
            Welcome to Mochi's Garden! 🌻
          </CardTitle>
          <p className="text-muted-foreground">
            Your AI companion for sustainable gardening and bee-friendly practices
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">
              Hi {displayName}! 👋
            </h2>
            <p className="text-muted-foreground">
              Thank you for joining our community of eco-conscious gardeners! 
              Mochi is excited to help you create a thriving, bee-friendly garden.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              What you can do with Mochi:
            </h3>
            
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <span className="text-2xl">🎤</span>
                <div>
                  <p className="font-medium">Voice-to-Voice Chat</p>
                  <p className="text-sm text-muted-foreground">
                    Have natural conversations about gardening, plants, and bee care
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-medium">Plant Care Guidance</p>
                  <p className="text-sm text-muted-foreground">
                    Get personalized advice for your specific plants and growing conditions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <span className="text-2xl">🐛</span>
                <div>
                  <p className="font-medium">Bee Education</p>
                  <p className="text-sm text-muted-foreground">
                    Learn about bee behavior, habitat creation, and pollinator-friendly plants
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <span className="text-2xl">♻️</span>
                <div>
                  <p className="font-medium">Sustainable Practices</p>
                  <p className="text-sm text-muted-foreground">
                    Discover eco-friendly gardening methods and composting techniques
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm">
                We've sent this welcome information to: <strong>{userEmail}</strong>
              </p>
            </div>

            <div className="text-center">
              <Button className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white">
                Start Chatting with Mochi 🐝
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>
              Questions? Reply to this email or visit our help center.
              <br />
              Happy gardening! 🌻🐝
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
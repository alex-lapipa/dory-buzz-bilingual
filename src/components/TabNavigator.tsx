import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Mic, Image, Video, Zap, Sparkles } from 'lucide-react';

interface TabNavigatorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  const tabs = [
    {
      id: 'unified',
      label: 'Unified AI',
      icon: Zap,
      description: 'All AI features in one interface'
    },
    {
      id: 'chat',
      label: 'Text Chat',
      icon: MessageCircle,
      description: 'Chat with Mochi using text'
    },
    {
      id: 'voice',
      label: 'Voice Chat',
      icon: Mic,
      description: 'Talk to Mochi with your voice'
    },
    {
      id: 'generate',
      label: 'Image Generator',
      icon: Image,
      description: 'Create beautiful garden images'
    },
    {
      id: 'video',
      label: 'Video Feed',
      icon: Video,
      description: 'Watch Mochi in the garden'
    }
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`h-auto p-3 flex flex-col items-center gap-2 transition-all ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                title={tab.description}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs text-center">{tab.label}</span>
                {isActive && (
                  <Sparkles className="h-3 w-3 animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
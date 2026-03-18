import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Globe, Heart } from 'lucide-react';

export const ExternalLinks: React.FC = () => {
  const links = [
    {
      title: 'La Pipa.ai',
      description: 'Visit our main website',
      url: 'https://lapipa.ai',
      icon: Globe,
      color: 'text-blue-600'
    },
    {
      title: 'GitHub Repository',
      description: 'View source code',
      url: 'https://github.com',
      icon: Github,
      color: 'text-gray-700'
    },
    {
      title: 'Supabase',
      description: 'Powered by Supabase',
      url: 'https://supabase.com',
      icon: ExternalLink,
      color: 'text-green-600'
    },
    {
      title: 'OpenAI',
      description: 'AI technology by OpenAI',
      url: 'https://openai.com',
      icon: ExternalLink,
      color: 'text-purple-600'
    }
  ];

  const handleLinkClick = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    console.log(`Opening external link: ${title} - ${url}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          External Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 justify-start"
                onClick={() => handleLinkClick(link.url, link.title)}
              >
                <Icon className={`h-4 w-4 mr-3 ${link.color}`} />
                <div className="text-left">
                  <div className="font-medium">{link.title}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
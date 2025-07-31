import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VideoPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  views: number;
  likes: number;
  tags: string[];
  author: string;
  publishedAt: string;
}

export const MochiVideoFeed: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // Mochi bee video data
  const mochiVideo: VideoPost = {
    id: 'mochi-bee-official',
    title: '🐝 Meet Mochi the Bee - Official Character Video',
    description: 'Conoce a Mochi, nuestra abejita oficial de BeeCrazy Garden World! Este adorable personaje te guiará en tu aventura de aprendizaje sobre abejas, jardines y la naturaleza. ¡Descubre el mundo mágico de las abejas con Mochi!',
    videoUrl: 'https://zrdywdregcrykmbiytvl.supabase.co/storage/v1/object/sign/mochibee/Mochi%20the%20bee.m4v?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ODAxZThkZi1hYTMyLTRjNDEtYmYxMi03ZjJlYmI0NjQ5MjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb2NoaWJlZS9Nb2NoaSB0aGUgYmVlLm00diIsImlhdCI6MTc1Mzg0Nzc3MSwiZXhwIjoxNzg1MzgzNzcxfQ.j3lrTKWdS6URzbygzYlLmBu2LIW3OkgR-o2iCacCH14',
    duration: '2:30',
    views: 1247,
    likes: 189,
    tags: ['bee', 'education', 'character', 'garden', 'nature'],
    author: 'BeeCrazy Team',
    publishedAt: '2024-01-30'
  };

  const handleVideoClick = () => {
    const video = document.getElementById('mochi-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    const video = document.getElementById('mochi-video') as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mochiVideo.title,
        text: mochiVideo.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast here
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-saira font-bold text-primary mb-2">
          🐝 Mochi Video Feed
        </h2>
        <p className="text-muted-foreground">
          Descubre videos oficiales de Mochi la abeja
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              🐝
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{mochiVideo.author}</p>
              <p className="text-xs text-muted-foreground">{mochiVideo.publishedAt}</p>
            </div>
          </div>
          <CardTitle className="text-lg font-saira">{mochiVideo.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Video Player */}
          <div className="relative group">
            <video
              id="mochi-video"
              className="w-full aspect-video object-cover"
              src={mochiVideo.videoUrl}
              poster="/placeholder.svg" // You can add a thumbnail here
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => {
                const video = e.target as HTMLVideoElement;
                video.muted = isMuted;
              }}
            >
              Tu navegador no soporta el elemento video.
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleVideoClick}
                className="bg-white/90 hover:bg-white"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
            
            {/* Duration Badge */}
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
              {mochiVideo.duration}
            </Badge>
            
            {/* Mute Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMuteToggle}
              className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/80"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
            </Button>
          </div>
          
          {/* Video Info */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {mochiVideo.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mochiVideo.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{mochiVideo.views.toLocaleString()} visualizaciones</span>
              <span>{mochiVideo.likes + (hasLiked ? 1 : 0)} me gusta</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 ${hasLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{hasLiked ? 'Te gusta' : 'Me gusta'}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartir</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comentar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Coming Soon Section */}
      <Card className="text-center p-6 border-dashed border-2 border-primary/30">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-primary">🎬 Más videos próximamente</p>
          <p className="text-sm text-muted-foreground">
            Pronto habrán más aventuras educativas con Mochi la abeja
          </p>
        </div>
      </Card>
    </div>
  );
};
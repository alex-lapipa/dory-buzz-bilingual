import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlowerPlay, FlowerPause } from '@/components/icons';

interface SongCardData {
  id: string;
  title_en: string;
  title_es: string;
  emoji: string;
  color: string;
  audioSrc?: string;
  lyrics_en?: string[];
  lyrics_es?: string[];
}

interface SingAlongCardProps {
  song: SongCardData;
  language: 'en' | 'es';
  /** If provided, overrides the song's default audioSrc each time play is pressed */
  getAudioSrc?: () => string;
  /** Current mix indicator e.g. { index: 3, total: 7 } */
  currentMix?: { index: number; total: number } | null;
  /** Called when playback stops */
  onStop?: () => void;
}

const SingAlongCard: React.FC<SingAlongCardProps> = ({ song, language, getAudioSrc, currentMix, onStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Always use English lyrics as primary (learning target), Spanish as support
  const lyrics = song.lyrics_en;
  const secondaryLyrics = song.lyrics_es;
  const title = song.title_en;
  const subtitle = language === 'es' ? song.title_es : undefined;

  const handlePlay = useCallback(() => {
    if (!lyrics) return;

    if (isPlaying) {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setActiveLine(-1);
      onStop?.();
      return;
    }

    // Determine which audio file to play
    const audioSrc = getAudioSrc ? getAudioSrc() : song.audioSrc;

    if (audioSrc) {
      // Always create a new Audio element so we can swap sources between plays
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      audioRef.current = new Audio(audioSrc);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setActiveLine(-1);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setIsPlaying(true);
    let line = 0;
    setActiveLine(0);
    intervalRef.current = setInterval(() => {
      line++;
      if (line >= (lyrics?.length ?? 0)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!audioSrc) {
          setIsPlaying(false);
          setActiveLine(-1);
        }
      } else {
        setActiveLine(line);
      }
    }, 2500);
  }, [isPlaying, song.audioSrc, lyrics, getAudioSrc]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${song.color} p-4 sm:p-6 text-center`}>
        <span className="text-5xl sm:text-6xl block mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
          {song.emoji}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-foreground/90 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-foreground/60 italic mt-1">{subtitle}</p>
        )}
      </div>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="space-y-3 min-h-[140px]">
          {lyrics?.map((line, i) => (
            <div
              key={i}
              className={`transition-all duration-500 rounded-lg px-3 py-1.5 ${
                activeLine === i
                  ? 'bg-primary/20 scale-105'
                  : ''
              }`}
            >
              <p className={`text-base sm:text-lg font-semibold leading-relaxed ${
                activeLine === i ? 'text-primary font-bold' : 'text-foreground'
              }`}>
                {line}
              </p>
              {secondaryLyrics?.[i] && (
                <p className={`text-xs sm:text-sm leading-snug mt-0.5 italic ${
                  activeLine === i ? 'text-primary/60' : 'text-muted-foreground/70'
                }`}>
                  {secondaryLyrics[i]}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handlePlay}
          size="lg"
          className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl gap-3"
          variant={isPlaying ? 'secondary' : 'default'}
        >
          {isPlaying ? (
            <>
              <FlowerPause className="h-6 w-6" />
              Stop! <span className="text-sm font-normal opacity-70">¡Para!</span>
            </>
          ) : (
            <>
              <FlowerPlay className="h-6 w-6" />
              Sing! <span className="text-sm font-normal opacity-70">¡Canta!</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SingAlongCard;
export type { SongCardData };

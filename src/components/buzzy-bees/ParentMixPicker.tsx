import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LOCAL_VARIATIONS } from '@/hooks/useBuzzyBeesAudio';

interface ParentMixPickerProps {
  favoriteIndex: number | null;
  setFavorite: (index: number | null) => void;
  totalMixes: number;
}

const ParentMixPicker: React.FC<ParentMixPickerProps> = ({
  favoriteIndex,
  setFavorite,
  totalMixes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewingIndex, setPreviewingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPreviewingIndex(null);
  }, []);

  const previewMix = useCallback((index: number) => {
    stopPreview();
    const src = LOCAL_VARIATIONS[index]?.path;
    if (!src) return;
    setPreviewingIndex(index);
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => setPreviewingIndex(null);
    audio.play().catch(() => setPreviewingIndex(null));
    // Auto-stop after 8 seconds (preview only)
    setTimeout(() => {
      if (audioRef.current === audio) {
        audio.pause();
        setPreviewingIndex(null);
      }
    }, 8000);
  }, [stopPreview]);

  const handleToggle = (checked: boolean) => {
    setIsOpen(checked);
    if (!checked) stopPreview();
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            🔒 Parent Controls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="parent-toggle" className="text-xs text-muted-foreground">
              {isOpen ? 'Open' : 'Closed'}
            </Label>
            <Switch
              id="parent-toggle"
              checked={isOpen}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-muted-foreground">
            Preview each version and pick a favorite for your child.
            <br />
            <span className="italic">Escucha cada versión y elige la favorita para tu hijo/a.</span>
          </p>

          <div className="space-y-2">
            {LOCAL_VARIATIONS.map((variation, index) => {
              const isFavorite = favoriteIndex === index;
              const isPreviewing = previewingIndex === index;

              return (
                <div
                  key={variation.path}
                  className={`flex items-center gap-2 rounded-xl p-2 transition-all ${
                    isFavorite
                      ? 'bg-primary/15 ring-2 ring-primary/40'
                      : 'bg-muted/40 hover:bg-muted/70'
                  }`}
                >
                  {/* Preview button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 shrink-0"
                    onClick={() => isPreviewing ? stopPreview() : previewMix(index)}
                    title={isPreviewing ? 'Stop preview' : 'Preview this mix'}
                  >
                    {isPreviewing ? '⏹️' : '▶️'}
                  </Button>

                  {/* Label */}
                  <span className="flex-1 text-sm font-medium">
                    {variation.label}
                    {isPreviewing && (
                      <span className="ml-2 text-xs text-primary animate-pulse">Playing...</span>
                    )}
                  </span>

                  {/* Favorite toggle */}
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs px-3 shrink-0"
                    onClick={() => setFavorite(isFavorite ? null : index)}
                  >
                    {isFavorite ? '⭐ Favorite' : 'Set Fav'}
                  </Button>
                </div>
              );
            })}
          </div>

          {favoriteIndex !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <Badge variant="secondary" className="text-xs">
                ⭐ Always plays: {LOCAL_VARIATIONS[favoriteIndex]?.label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground h-7"
                onClick={() => { setFavorite(null); stopPreview(); }}
              >
                Clear · Quitar
              </Button>
            </div>
          )}

          {favoriteIndex === null && (
            <p className="text-xs text-muted-foreground/60 text-center pt-1">
              🎲 Random mix each play · Mezcla aleatoria cada vez
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ParentMixPicker;

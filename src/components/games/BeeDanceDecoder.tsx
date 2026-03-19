import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { HoneycombTrophy, DandelionBack, BeeTrailLeft, GardenX, BloomingCheck } from '@/components/icons';

interface DanceRound {
  direction: string;
  angle: number;
  distance: string;
  waggleDuration: number; // seconds of waggle = distance
  options: string[];
  correctAnswer: string;
  fact: string;
}

interface BeeDanceDecoderProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const rounds: DanceRound[] = [
  { direction: 'North', angle: 0, distance: 'Close (100m)', waggleDuration: 0.5, options: ['North', 'South', 'East', 'West'], correctAnswer: 'North', fact: 'The waggle dance was decoded by Karl von Frisch, who won a Nobel Prize for it!' },
  { direction: 'East', angle: 90, distance: 'Medium (500m)', waggleDuration: 1.2, options: ['North-East', 'East', 'South', 'West'], correctAnswer: 'East', fact: 'The angle of the dance relative to vertical represents the angle to the sun!' },
  { direction: 'South-West', angle: 225, distance: 'Far (1km)', waggleDuration: 2.0, options: ['North-West', 'South-East', 'South-West', 'North'], correctAnswer: 'South-West', fact: 'Longer waggle runs mean the food source is farther away!' },
  { direction: 'North-East', angle: 45, distance: 'Very Close (50m)', waggleDuration: 0.3, options: ['North-East', 'South-West', 'East', 'North-West'], correctAnswer: 'North-East', fact: 'For very close food, bees do a "round dance" instead of waggling!' },
  { direction: 'West', angle: 270, distance: 'Far (2km)', waggleDuration: 3.0, options: ['East', 'West', 'South', 'North-East'], correctAnswer: 'West', fact: 'Bees can communicate food sources up to 6km away!' },
  { direction: 'South-East', angle: 135, distance: 'Medium (800m)', waggleDuration: 1.5, options: ['North-West', 'South-East', 'East', 'South'], correctAnswer: 'South-East', fact: 'Other bees follow the dancer closely, feeling the vibrations with their antennae!' },
  { direction: 'South', angle: 180, distance: 'Close (200m)', waggleDuration: 0.7, options: ['North', 'South', 'West', 'East'], correctAnswer: 'South', fact: 'The dance is performed on vertical comb surfaces in darkness!' },
  { direction: 'North-West', angle: 315, distance: 'Very Far (3km)', waggleDuration: 4.0, options: ['North-West', 'South-East', 'North', 'West'], correctAnswer: 'North-West', fact: 'Bees adjust the dance angle as the sun moves across the sky!' },
];

export const BeeDanceDecoder: React.FC<BeeDanceDecoderProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [dancing, setDancing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setRoundIndex(0);
    setScore(0);
  };

  const currentRound = rounds[roundIndex];

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setDancing(true);
      const timer = setTimeout(() => setDancing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [roundIndex, gameStarted, gameCompleted]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentRound.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 20);
      toast({ title: '✅ Correct direction!', description: currentRound.fact });
    } else {
      toast({ title: `❌ It was ${currentRound.correctAnswer}`, description: currentRound.fact });
    }

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      if (roundIndex < rounds.length - 1) {
        setRoundIndex(prev => prev + 1);
      } else {
        const finalScore = isCorrect ? score + 20 : score;
        setScore(finalScore);
        setGameCompleted(true);
        onGameComplete(finalScore);
      }
    }, 2500);
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">💃 Bee Dance Decoder</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🐝💃🌻</div>
          <p className="text-muted-foreground">Watch the waggle dance and decode the direction to the flowers! The bee's dance angle tells other bees which way to fly.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">8 Rounds</Badge>
            <Badge variant="outline">20 pts each</Badge>
            <Badge variant="outline">160 max</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Decoding 💃</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Dance Decoded!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 140 ? '🏆' : score >= 100 ? '⭐' : '📚'}</div>
          <p className="text-2xl font-bold">{score} / 160 points</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Round {roundIndex + 1}/{rounds.length}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={(roundIndex / rounds.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dance visualization */}
        <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          {/* Compass markers */}
          <span className="absolute top-1 text-xs text-muted-foreground">N</span>
          <span className="absolute bottom-1 text-xs text-muted-foreground">S</span>
          <span className="absolute right-1 text-xs text-muted-foreground">E</span>
          <span className="absolute left-1 text-xs text-muted-foreground">W</span>
          {/* Dancing bee */}
          <div
            className={`text-4xl transition-transform ${dancing ? 'animate-bounce' : ''}`}
            style={{ transform: `rotate(${currentRound.angle}deg)`, transformOrigin: 'center' }}
          >
            🐝
          </div>
          {/* Direction arrow */}
          <div
            className="absolute w-0.5 h-16 bg-primary/60 origin-bottom"
            style={{ transform: `rotate(${currentRound.angle}deg)`, bottom: '50%', left: 'calc(50% - 1px)' }}
          />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Distance clue: {currentRound.distance}</p>
          <p className="text-xs text-muted-foreground">Waggle duration: {currentRound.waggleDuration}s {dancing ? '(dancing...)' : '(done!)'}</p>
        </div>

        <p className="font-semibold text-center">Which direction are the flowers?</p>
        <div className="grid grid-cols-2 gap-3">
          {currentRound.options.map(opt => {
            let variant: 'outline' | 'default' | 'destructive' = 'outline';
            if (showResult && opt === currentRound.correctAnswer) variant = 'default';
            else if (showResult && opt === selectedAnswer && opt !== currentRound.correctAnswer) variant = 'destructive';
            return (
              <Button key={opt} variant={variant} className="h-auto py-3" onClick={() => handleAnswer(opt)} disabled={showResult}>
                {opt} {showResult && opt === currentRound.correctAnswer && <CheckCircle className="ml-1 h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

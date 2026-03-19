import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Camera, Trophy, RotateCcw, ArrowLeft, X, CheckCircle } from '@/components/icons/lucide-compat';

interface BeeSpecies {
  id: string;
  name: string;
  emoji: string;
  size: string;
  appearance: string;
  behavior: string;
  habitat: string;
  funFact: string;
}

interface SpeciesRound {
  description: string;
  clues: string[];
  correctId: string;
  options: string[];
}

interface SpeciesSpotterProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const species: BeeSpecies[] = [
  { id: 'honeybee', name: 'Honeybee', emoji: '🐝', size: '12-15mm', appearance: 'Golden-brown with dark stripes, hairy body', behavior: 'Lives in large colonies of 20,000-60,000. Performs waggle dances.', habitat: 'Managed hives and wild tree cavities', funFact: 'Honeybees visit 50-100 flowers per foraging trip!' },
  { id: 'bumblebee', name: 'Bumblebee', emoji: '🐝💨', size: '15-25mm', appearance: 'Round, very fuzzy, bold black and yellow bands', behavior: 'Small colonies of 50-400. Can buzz-pollinate tomatoes!', habitat: 'Underground nests, old mouse holes', funFact: 'Bumblebees can fly in colder temperatures than honeybees!' },
  { id: 'carpenter', name: 'Carpenter Bee', emoji: '🪵🐝', size: '19-25mm', appearance: 'Large, shiny black abdomen (not fuzzy), males have yellow face', behavior: 'Solitary. Drills tunnels in wood to nest.', habitat: 'Dead wood, wooden structures, tree trunks', funFact: 'Despite their size, carpenter bees rarely sting!' },
  { id: 'mason', name: 'Mason Bee', emoji: '🧱🐝', size: '8-15mm', appearance: 'Dark metallic blue-black, compact body', behavior: 'Solitary. Uses mud to seal nest cells in hollow stems.', habitat: 'Bee hotels, hollow stems, small holes', funFact: 'One mason bee pollinates as effectively as 100 honeybees!' },
  { id: 'leafcutter', name: 'Leafcutter Bee', emoji: '🍃🐝', size: '8-15mm', appearance: 'Dark with pale hair bands, carries pollen under abdomen', behavior: 'Solitary. Cuts circular pieces from leaves to build nest cells.', habitat: 'Rotting wood, soil, bee hotels', funFact: 'You can spot their work by the perfect circles cut from rose leaves!' },
  { id: 'sweat', name: 'Sweat Bee', emoji: '💎🐝', size: '4-10mm', appearance: 'Metallic green, blue, or bronze. Very small!', behavior: 'Semi-social. Attracted to human perspiration for salt.', habitat: 'Underground burrows', funFact: 'Some sweat bee species are among the most beautiful insects on Earth!' },
];

const generateRounds = (): SpeciesRound[] => {
  return species.map(s => {
    const otherNames = species.filter(o => o.id !== s.id).map(o => o.name).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [s.name, ...otherNames].sort(() => Math.random() - 0.5);
    return {
      description: `Size: ${s.size}. ${s.appearance}. ${s.behavior}`,
      clues: [`Habitat: ${s.habitat}`, `Appearance: ${s.appearance}`],
      correctId: s.id,
      options,
    };
  });
};

export const SpeciesSpotter: React.FC<SpeciesSpotterProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [rounds, setRounds] = useState<SpeciesRound[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setRounds(generateRounds());
    setRoundIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const round = rounds[roundIndex];
    const correct = species.find(s => s.id === round.correctId)!;
    const isCorrect = answer === correct.name;

    if (isCorrect) {
      setScore(prev => prev + 25);
      toast({ title: `✅ It's a ${correct.name}!`, description: correct.funFact });
    } else {
      toast({ title: `❌ That was a ${correct.name}`, description: correct.funFact });
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      if (roundIndex < rounds.length - 1) {
        setRoundIndex(prev => prev + 1);
      } else {
        const finalScore = isCorrect ? score + 25 : score;
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
            <CardTitle className="flex items-center gap-2"><Camera className="h-6 w-6" /> Bee Species Spotter</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🔍🐝🪵🧱</div>
          <p className="text-muted-foreground">Can you identify different bee species from their descriptions? Learn to tell honeybees from bumblebees, carpenters from masons!</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">6 Species</Badge>
            <Badge variant="outline">25 pts each</Badge>
            <Badge variant="outline">150 max</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Spotting 🔍</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Species Expert!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 125 ? '🏆' : score >= 75 ? '⭐' : '📚'}</div>
          <p className="text-2xl font-bold">{score} / 150 points</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const round = rounds[roundIndex];
  const correct = species.find(s => s.id === round.correctId)!;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Species {roundIndex + 1}/{rounds.length}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={(roundIndex / rounds.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-accent/30 space-y-2">
          <p className="text-4xl text-center">{correct.emoji}</p>
          <p className="text-sm">{round.description}</p>
          {round.clues.map((clue, i) => (
            <p key={i} className="text-xs text-muted-foreground">🔎 {clue}</p>
          ))}
        </div>
        <p className="font-semibold text-center">What species is this?</p>
        <div className="grid grid-cols-2 gap-3">
          {round.options.map(opt => {
            let variant: 'outline' | 'default' | 'destructive' = 'outline';
            if (showResult && opt === correct.name) variant = 'default';
            else if (showResult && opt === selectedAnswer && opt !== correct.name) variant = 'destructive';
            return (
              <Button key={opt} variant={variant} className="h-auto py-3 text-sm" onClick={() => handleAnswer(opt)} disabled={showResult}>
                {opt} {showResult && opt === correct.name && <CheckCircle className="ml-1 h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

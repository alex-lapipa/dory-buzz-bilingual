import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FlaskConical, Trophy, RotateCcw, ArrowLeft, X, CheckCircle, ArrowRight as ArrowRightIcon } from 'lucide-react';

interface LifecycleStage {
  id: string;
  name: string;
  emoji: string;
  days: string;
  description: string;
  order: number;
}

interface LifecycleChallenge {
  title: string;
  beeType: string;
  stages: LifecycleStage[];
  fact: string;
}

interface LifecycleLabProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const challenges: LifecycleChallenge[] = [
  {
    title: 'Worker Bee Lifecycle',
    beeType: '👷‍♀️ Worker',
    stages: [
      { id: 'egg', name: 'Egg', emoji: '🥚', days: 'Days 1-3', description: 'The queen lays a tiny egg in a wax cell', order: 1 },
      { id: 'larva', name: 'Larva', emoji: '🐛', days: 'Days 4-9', description: 'A white grub fed royal jelly then pollen/honey', order: 2 },
      { id: 'pupa', name: 'Pupa', emoji: '🫘', days: 'Days 10-20', description: 'Cell is capped; metamorphosis occurs inside', order: 3 },
      { id: 'adult', name: 'Adult Worker', emoji: '🐝', days: 'Day 21+', description: 'Emerges to clean, nurse, guard, then forage', order: 4 },
    ],
    fact: 'Worker bees live about 6 weeks in summer but can live 4-6 months in winter!'
  },
  {
    title: 'Queen Bee Lifecycle',
    beeType: '👑 Queen',
    stages: [
      { id: 'q-egg', name: 'Egg', emoji: '🥚', days: 'Days 1-3', description: 'Same fertilized egg as a worker bee', order: 1 },
      { id: 'q-larva', name: 'Royal Larva', emoji: '🐛👑', days: 'Days 4-8', description: 'Fed exclusively royal jelly — triggers queen development', order: 2 },
      { id: 'q-pupa', name: 'Queen Pupa', emoji: '🫘✨', days: 'Days 9-15', description: 'Develops in a larger peanut-shaped queen cell', order: 3 },
      { id: 'q-virgin', name: 'Virgin Queen', emoji: '👸', days: 'Day 16', description: 'Emerges, may fight rival queens, takes mating flights', order: 4 },
      { id: 'q-mated', name: 'Mated Queen', emoji: '👑🐝', days: 'Day 20+', description: 'Begins laying up to 2,000 eggs per day', order: 5 },
    ],
    fact: 'A queen bee can live 3-5 years — much longer than workers!'
  },
  {
    title: 'Drone Lifecycle',
    beeType: '♂️ Drone',
    stages: [
      { id: 'd-egg', name: 'Unfertilized Egg', emoji: '🥚♂️', days: 'Days 1-3', description: 'Develops from an unfertilized egg (no father!)', order: 1 },
      { id: 'd-larva', name: 'Drone Larva', emoji: '🐛♂️', days: 'Days 4-10', description: 'Larger larva fed generously by nurse bees', order: 2 },
      { id: 'd-pupa', name: 'Drone Pupa', emoji: '🫘♂️', days: 'Days 11-24', description: 'Develops in an oversized dome-shaped cell', order: 3 },
      { id: 'd-adult', name: 'Adult Drone', emoji: '🐝♂️', days: 'Day 24+', description: 'Sole purpose is to mate with queens from other colonies', order: 4 },
    ],
    fact: 'Drones have no stinger and don\'t collect pollen — they exist only to mate!'
  },
  {
    title: 'Honey Production',
    beeType: '🍯 Process',
    stages: [
      { id: 'h-nectar', name: 'Nectar Collection', emoji: '🌸', days: 'Step 1', description: 'Forager bees sip nectar from flowers into their honey stomach', order: 1 },
      { id: 'h-transfer', name: 'Mouth Transfer', emoji: '💋', days: 'Step 2', description: 'Forager passes nectar mouth-to-mouth to house bees', order: 2 },
      { id: 'h-enzyme', name: 'Enzyme Addition', emoji: '⚗️', days: 'Step 3', description: 'Enzymes break down complex sugars into simple sugars', order: 3 },
      { id: 'h-evap', name: 'Evaporation', emoji: '💨', days: 'Step 4', description: 'Bees fan wings to evaporate water from 70% to 18%', order: 4 },
      { id: 'h-cap', name: 'Capping', emoji: '🔒', days: 'Step 5', description: 'Cell is sealed with beeswax — honey is preserved!', order: 5 },
    ],
    fact: 'It takes about 2 million flower visits to make 1 pound of honey!'
  },
];

export const LifecycleLab: React.FC<LifecycleLabProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [placedOrder, setPlacedOrder] = useState<string[]>([]);
  const [availableStages, setAvailableStages] = useState<LifecycleStage[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setChallengeIndex(0);
    setScore(0);
    initChallenge(0);
  };

  const initChallenge = (idx: number) => {
    const ch = challenges[idx];
    setAvailableStages([...ch.stages].sort(() => Math.random() - 0.5));
    setPlacedOrder([]);
    setShowResult(false);
  };

  const placeStage = (stageId: string) => {
    if (showResult) return;
    if (placedOrder.includes(stageId)) {
      setPlacedOrder(prev => prev.filter(id => id !== stageId));
    } else {
      setPlacedOrder(prev => [...prev, stageId]);
    }
  };

  const checkOrder = () => {
    const ch = challenges[challengeIndex];
    const correctOrder = ch.stages.map(s => s.id);
    const isCorrect = placedOrder.length === correctOrder.length && placedOrder.every((id, i) => id === correctOrder[i]);

    setShowResult(true);

    if (isCorrect) {
      const pts = 25;
      setScore(prev => prev + pts);
      toast({ title: '✅ Perfect sequence!', description: ch.fact });
    } else {
      toast({ title: '❌ Not the right order', description: `Correct: ${ch.stages.map(s => s.name).join(' → ')}` });
    }

    setTimeout(() => {
      if (challengeIndex < challenges.length - 1) {
        const next = challengeIndex + 1;
        setChallengeIndex(next);
        initChallenge(next);
      } else {
        const finalScore = isCorrect ? score + 25 : score;
        setScore(finalScore);
        setGameCompleted(true);
        onGameComplete(finalScore);
      }
    }, 3000);
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><FlaskConical className="h-6 w-6" /> Bee Lifecycle Lab</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🥚🐛🫘🐝</div>
          <p className="text-muted-foreground">Put the lifecycle stages in the correct order! Learn about worker bees, queens, drones, and even how honey is made.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">4 Challenges</Badge>
            <Badge variant="outline">25 pts each</Badge>
            <Badge variant="outline">100 max</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Lab 🔬</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Lab Complete!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 75 ? '🏆' : score >= 50 ? '⭐' : '📚'}</div>
          <p className="text-2xl font-bold">{score} / 100 points</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ch = challenges[challengeIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{ch.beeType} — {ch.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={(challengeIndex / challenges.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">Tap stages in the correct order (first → last)</p>

        {/* Placed sequence */}
        <div className="flex gap-2 flex-wrap justify-center min-h-[60px] p-3 rounded-lg bg-accent/20 border border-dashed border-border">
          {placedOrder.length === 0 && <span className="text-muted-foreground text-sm">Tap stages below to order them...</span>}
          {placedOrder.map((id, i) => {
            const stage = ch.stages.find(s => s.id === id)!;
            const isCorrect = showResult && ch.stages[i]?.id === id;
            const isWrong = showResult && ch.stages[i]?.id !== id;
            return (
              <React.Fragment key={id}>
                {i > 0 && <ArrowRightIcon className="h-4 w-4 text-muted-foreground self-center" />}
                <Badge variant={isCorrect ? 'default' : isWrong ? 'destructive' : 'secondary'} className="cursor-pointer text-sm py-1 px-2" onClick={() => !showResult && placeStage(id)}>
                  {stage.emoji} {stage.name}
                  {isCorrect && <CheckCircle className="ml-1 h-3 w-3" />}
                </Badge>
              </React.Fragment>
            );
          })}
        </div>

        {/* Available stages */}
        <div className="grid grid-cols-1 gap-2">
          {availableStages.filter(s => !placedOrder.includes(s.id)).map(stage => (
            <Button key={stage.id} variant="outline" className="h-auto py-3 justify-start text-left" onClick={() => placeStage(stage.id)} disabled={showResult}>
              <span className="text-xl mr-2">{stage.emoji}</span>
              <div>
                <div className="font-medium">{stage.name}</div>
                <div className="text-xs text-muted-foreground">{stage.days} — {stage.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {placedOrder.length === ch.stages.length && !showResult && (
          <Button onClick={checkOrder} className="w-full">Check Order ✅</Button>
        )}
      </CardContent>
    </Card>
  );
};

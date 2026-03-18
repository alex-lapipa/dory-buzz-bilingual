import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Puzzle, Trophy, RotateCcw, ArrowLeft, X, CheckCircle } from 'lucide-react';

type CellType = 'honey' | 'brood' | 'pollen' | 'empty' | 'royal';

interface HiveChallenge {
  id: number;
  title: string;
  description: string;
  gridSize: number;
  target: Record<CellType, number>;
  fact: string;
}

interface HiveBuilderProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const CELL_INFO: Record<CellType, { emoji: string; label: string; color: string }> = {
  honey: { emoji: '🍯', label: 'Honey', color: 'bg-yellow-100 border-yellow-300' },
  brood: { emoji: '🥚', label: 'Brood', color: 'bg-orange-100 border-orange-300' },
  pollen: { emoji: '🌼', label: 'Pollen', color: 'bg-amber-100 border-amber-300' },
  royal: { emoji: '👑', label: 'Royal Jelly', color: 'bg-purple-100 border-purple-300' },
  empty: { emoji: '⬡', label: 'Empty', color: 'bg-muted/30 border-border' },
};

const challenges: HiveChallenge[] = [
  { id: 1, title: 'Starter Comb', description: 'Build a small comb: 4 honey, 3 pollen, 2 brood cells', gridSize: 3, target: { honey: 4, pollen: 3, brood: 2, empty: 0, royal: 0 }, fact: 'Bees build hexagonal cells because they use the least wax for the most space!' },
  { id: 2, title: 'Nursery Frame', description: 'Create a nursery: 5 brood, 3 pollen, 2 honey, 1 royal jelly', gridSize: 3, target: { brood: 5, pollen: 3, honey: 2, royal: 1, empty: 0 }, fact: 'Nurse bees feed royal jelly to larvae for the first 3 days!' },
  { id: 3, title: 'Honey Storage', description: 'Fill honey stores: 8 honey, 4 pollen, 2 brood, 2 royal', gridSize: 4, target: { honey: 8, pollen: 4, brood: 2, royal: 2, empty: 0 }, fact: 'A single hive can produce 25-60 pounds of honey per year!' },
  { id: 4, title: 'Queen\'s Chamber', description: 'Royal layout: 6 brood, 6 honey, 3 royal, 1 pollen', gridSize: 4, target: { brood: 6, honey: 6, royal: 3, pollen: 1, empty: 0 }, fact: 'The queen can lay up to 2,000 eggs per day!' },
  { id: 5, title: 'Master Architect', description: 'Perfect balance: 7 honey, 5 brood, 5 pollen, 3 royal, 5 empty', gridSize: 5, target: { honey: 7, brood: 5, pollen: 5, royal: 3, empty: 5 }, fact: 'Bees maintain the hive temperature at exactly 35°C (95°F)!' },
];

const BRUSH_ORDER: CellType[] = ['honey', 'brood', 'pollen', 'royal', 'empty'];

export const HiveBuilder: React.FC<HiveBuilderProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [brush, setBrush] = useState<CellType>('honey');
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setChallengeIndex(0);
    setScore(0);
    setCompletedChallenges(0);
    initChallenge(0);
  };

  const initChallenge = (idx: number) => {
    const ch = challenges[idx];
    setGrid(Array.from({ length: ch.gridSize }, () => Array(ch.gridSize).fill('empty' as CellType)));
    setBrush('honey');
  };

  const placeCell = (r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === brush ? 'empty' : brush;
      return next;
    });
  };

  const getCounts = (): Record<CellType, number> => {
    const counts: Record<CellType, number> = { honey: 0, brood: 0, pollen: 0, royal: 0, empty: 0 };
    grid.forEach(row => row.forEach(cell => counts[cell]++));
    return counts;
  };

  const checkSolution = () => {
    const ch = challenges[challengeIndex];
    const counts = getCounts();
    const correct = (Object.keys(ch.target) as CellType[]).every(k => counts[k] === ch.target[k]);

    if (correct) {
      const pts = 30;
      setScore(prev => prev + pts);
      setCompletedChallenges(prev => prev + 1);
      toast({ title: '✅ Perfect Comb!', description: ch.fact });

      if (challengeIndex < challenges.length - 1) {
        setTimeout(() => {
          const next = challengeIndex + 1;
          setChallengeIndex(next);
          initChallenge(next);
        }, 1500);
      } else {
        const finalScore = score + pts;
        setScore(finalScore);
        setGameCompleted(true);
        onGameComplete(finalScore);
      }
    } else {
      toast({ title: '❌ Not quite right', description: 'Check the cell counts and try again!' });
    }
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Puzzle className="h-6 w-6" /> Hive Builder Challenge</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🐝⬡🍯</div>
          <p className="text-muted-foreground">Build honeycomb patterns! Place honey, brood, pollen, and royal jelly cells to match each challenge's requirements.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">5 Challenges</Badge>
            <Badge variant="outline">30 pts each</Badge>
            <Badge variant="outline">150 max</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Building ⬡</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Master Architect!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">🏆</div>
          <p className="text-2xl font-bold">{score} / 150 points</p>
          <p className="text-muted-foreground">{completedChallenges} / {challenges.length} challenges completed</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ch = challenges[challengeIndex];
  const counts = getCounts();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{ch.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={(challengeIndex / challenges.length) * 100} className="h-2" />
        <p className="text-sm text-muted-foreground">{ch.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 justify-center flex-wrap">
          {BRUSH_ORDER.map(type => (
            <Button key={type} size="sm" variant={brush === type ? 'default' : 'outline'} onClick={() => setBrush(type)}>
              {CELL_INFO[type].emoji} {CELL_INFO[type].label}
            </Button>
          ))}
        </div>
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${ch.gridSize}, 1fr)`, maxWidth: `${ch.gridSize * 56}px` }}>
          {grid.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => placeCell(r, c)} className={`aspect-square flex items-center justify-center text-xl rounded-md border-2 transition-all hover:scale-105 ${CELL_INFO[cell].color}`}>
              {CELL_INFO[cell].emoji}
            </button>
          )))}
        </div>
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          {(Object.keys(ch.target) as CellType[]).filter(k => ch.target[k] > 0).map(k => (
            <Badge key={k} variant={counts[k] === ch.target[k] ? 'default' : 'outline'}>
              {CELL_INFO[k].emoji} {counts[k]}/{ch.target[k]}
              {counts[k] === ch.target[k] && <CheckCircle className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
        <Button onClick={checkSolution} className="w-full">Check Pattern ✅</Button>
      </CardContent>
    </Card>
  );
};

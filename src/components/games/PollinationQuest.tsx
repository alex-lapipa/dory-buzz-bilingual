import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Target, Trophy, RotateCcw, ArrowLeft, X, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight } from '@/components/icons/lucide-compat';

type CellType = 'empty' | 'flower' | 'hazard' | 'hive' | 'bee' | 'visited';

interface PollinationQuestProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const GRID_SIZE = 7;
const FLOWERS = ['🌻', '🌺', '🌷', '🌸', '🌼', '💐', '🌹'];
const HAZARDS = ['☠️', '🌧️', '💨'];

const generateGrid = (): { grid: CellType[][]; flowerCount: number } => {
  const grid: CellType[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('empty'));
  grid[0][0] = 'bee';
  grid[GRID_SIZE - 1][GRID_SIZE - 1] = 'hive';
  let flowerCount = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== 'empty') continue;
      const rand = Math.random();
      if (rand < 0.25) { grid[r][c] = 'flower'; flowerCount++; }
      else if (rand < 0.35) grid[r][c] = 'hazard';
    }
  }
  if (flowerCount === 0) { grid[1][1] = 'flower'; flowerCount = 1; }
  return { grid, flowerCount };
};

const getCellEmoji = (cell: CellType, r: number, c: number) => {
  switch (cell) {
    case 'bee': return '🐝';
    case 'flower': return FLOWERS[(r * GRID_SIZE + c) % FLOWERS.length];
    case 'hazard': return HAZARDS[(r + c) % HAZARDS.length];
    case 'hive': return '🏠';
    case 'visited': return '·';
    default: return '🌿';
  }
};

export const PollinationQuest: React.FC<PollinationQuestProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [beePos, setBeePos] = useState({ r: 0, c: 0 });
  const [pollen, setPollen] = useState(0);
  const [moves, setMoves] = useState(0);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [totalFlowers, setTotalFlowers] = useState(0);

  const startGame = () => {
    const { grid: newGrid, flowerCount } = generateGrid();
    setGrid(newGrid);
    setBeePos({ r: 0, c: 0 });
    setPollen(0);
    setMoves(0);
    setHealth(3);
    setScore(0);
    setTotalFlowers(flowerCount);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const moveBee = useCallback((dr: number, dc: number) => {
    if (gameCompleted) return;
    const nr = beePos.r + dr;
    const nc = beePos.c + dc;
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) return;

    const newGrid = grid.map(row => [...row]);
    const targetCell = newGrid[nr][nc];

    newGrid[beePos.r][beePos.c] = 'visited';

    let newPollen = pollen;
    let newHealth = health;
    let newScore = score;

    if (targetCell === 'flower') {
      newPollen++;
      newScore += 20;
      toast({ title: '🌸 Pollen collected!', description: `${newPollen} pollen gathered` });
    } else if (targetCell === 'hazard') {
      newHealth--;
      toast({ title: '⚠️ Hazard!', description: newHealth > 0 ? `Health: ${'❤️'.repeat(newHealth)}` : 'Oh no!' });
      if (newHealth <= 0) {
        setGameCompleted(true);
        setScore(newScore);
        onGameComplete(newScore);
        return;
      }
    } else if (targetCell === 'hive') {
      newScore += newPollen * 15 + Math.max(0, 50 - moves);
      setScore(newScore);
      setGameCompleted(true);
      toast({ title: '🏠 Home safe!', description: `Delivered ${newPollen} pollen to the hive!` });
      onGameComplete(newScore);
      newGrid[nr][nc] = 'bee';
      setGrid(newGrid);
      setBeePos({ r: nr, c: nc });
      setPollen(newPollen);
      setMoves(m => m + 1);
      setHealth(newHealth);
      return;
    }

    newGrid[nr][nc] = 'bee';
    setGrid(newGrid);
    setBeePos({ r: nr, c: nc });
    setPollen(newPollen);
    setMoves(m => m + 1);
    setHealth(newHealth);
    setScore(newScore);
  }, [beePos, grid, pollen, health, score, moves, gameCompleted, toast, onGameComplete]);

  // Keyboard controls
  React.useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') moveBee(-1, 0);
      else if (e.key === 'ArrowDown') moveBee(1, 0);
      else if (e.key === 'ArrowLeft') moveBee(0, -1);
      else if (e.key === 'ArrowRight') moveBee(0, 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameStarted, gameCompleted, moveBee]);

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Target className="h-6 w-6" /> Pollination Quest</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🐝🌻🏠</div>
          <p className="text-muted-foreground">Guide your bee through the garden! Collect pollen from flowers 🌸, avoid hazards ☠️, and make it back to the hive 🏠.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">7×7 Grid</Badge>
            <Badge variant="outline">Arrows/Buttons to move</Badge>
            <Badge variant="outline">3 lives</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Quest 🗺️</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Quest Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{health > 0 ? '🏆' : '💀'}</div>
          <p className="text-2xl font-bold">{score} points</p>
          <p className="text-muted-foreground">{pollen} pollen collected in {moves} moves</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />New Quest</Button>
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
          <CardTitle className="flex items-center gap-2 text-base"><Target className="h-5 w-5" /> Pollination Quest</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex gap-3 text-sm flex-wrap">
          <Badge>🌸 {pollen}</Badge>
          <Badge variant="outline">{'❤️'.repeat(health)}</Badge>
          <Badge variant="secondary">Moves: {moves}</Badge>
          <Badge>{score} pts</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, maxWidth: '350px' }}>
          {grid.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`aspect-square flex items-center justify-center text-lg rounded border ${cell === 'bee' ? 'bg-primary/20 border-primary' : cell === 'visited' ? 'bg-muted/50 border-muted' : 'bg-accent/20 border-border'}`}>
              {getCellEmoji(cell, r, c)}
            </div>
          )))}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <Button size="sm" variant="outline" onClick={() => moveBee(-1, 0)}><ArrowUp className="h-4 w-4" /></Button>
            <div />
            <Button size="sm" variant="outline" onClick={() => moveBee(0, -1)}><ArrowLeftIcon className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => moveBee(1, 0)}><ArrowDown className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => moveBee(0, 1)}><ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">Use arrow keys or buttons. Collect 🌸, avoid ☠️, reach 🏠!</p>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Trophy, RotateCcw, ArrowLeft, X, CheckCircle, Info } from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  emoji: string;
  beeScore: number;
  bloomSeason: string;
  type: 'flower' | 'herb' | 'tree' | 'veggie';
  tip: string;
}

interface GardenPlannerProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const GRID_SIZE = 4;

const plants: Plant[] = [
  { id: 'lavender', name: 'Lavender', emoji: '💜', beeScore: 10, bloomSeason: 'Summer', type: 'flower', tip: 'One of the best bee-attracting plants!' },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', beeScore: 9, bloomSeason: 'Summer', type: 'flower', tip: 'Provides both pollen and nectar' },
  { id: 'rosemary', name: 'Rosemary', emoji: '🌿', beeScore: 8, bloomSeason: 'Spring', type: 'herb', tip: 'Early spring blooms help hungry bees' },
  { id: 'borage', name: 'Borage', emoji: '🔵', beeScore: 10, bloomSeason: 'Summer', type: 'herb', tip: 'Refills nectar every 2 minutes!' },
  { id: 'clover', name: 'Clover', emoji: '🍀', beeScore: 9, bloomSeason: 'Spring-Fall', type: 'flower', tip: 'Essential food for bumblebees' },
  { id: 'apple-tree', name: 'Apple Tree', emoji: '🍎', beeScore: 8, bloomSeason: 'Spring', type: 'tree', tip: 'Blossoms feed bees, bees pollinate fruit!' },
  { id: 'wildflower', name: 'Wildflower Mix', emoji: '🌸', beeScore: 9, bloomSeason: 'Spring-Fall', type: 'flower', tip: 'Native wildflowers are best for local bees' },
  { id: 'thyme', name: 'Thyme', emoji: '🫖', beeScore: 7, bloomSeason: 'Summer', type: 'herb', tip: 'Tiny flowers packed with nectar' },
  { id: 'crocus', name: 'Crocus', emoji: '🟣', beeScore: 8, bloomSeason: 'Early Spring', type: 'flower', tip: 'First food source after winter!' },
  { id: 'zinnia', name: 'Zinnia', emoji: '🌺', beeScore: 7, bloomSeason: 'Summer-Fall', type: 'flower', tip: 'Bright colors guide bees to nectar' },
  { id: 'bee-hotel', name: 'Bee Hotel', emoji: '🏨', beeScore: 8, bloomSeason: 'Year-round', type: 'veggie', tip: 'Provides nesting sites for solitary bees!' },
  { id: 'water', name: 'Water Source', emoji: '💧', beeScore: 6, bloomSeason: 'Year-round', type: 'veggie', tip: 'Bees need water — add pebbles so they can land!' },
];

export const GardenPlanner: React.FC<GardenPlannerProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState<string | null>(null);

  const startGame = () => {
    setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
    setSelectedPlant(null);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const placeOnGrid = (r: number, c: number) => {
    if (!selectedPlant) {
      // Remove plant
      setGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = null;
        return next;
      });
      return;
    }
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = selectedPlant;
      return next;
    });
  };

  const calculateScore = () => {
    let totalBeeScore = 0;
    const seasons = new Set<string>();
    const types = new Set<string>();
    const usedPlants = new Set<string>();
    let filledCells = 0;

    grid.forEach(row => row.forEach(cell => {
      if (cell) {
        const plant = plants.find(p => p.id === cell);
        if (plant) {
          totalBeeScore += plant.beeScore;
          seasons.add(plant.bloomSeason);
          types.add(plant.type);
          usedPlants.add(cell);
          filledCells++;
        }
      }
    }));

    // Bonuses
    let bonus = 0;
    if (seasons.size >= 3) bonus += 20; // Season diversity
    if (types.size >= 3) bonus += 15; // Type diversity
    if (usedPlants.size >= 6) bonus += 15; // Variety
    if (filledCells >= 12) bonus += 10; // Full garden

    const finalScore = totalBeeScore + bonus;
    setScore(finalScore);
    setGameCompleted(true);

    const rating = finalScore >= 140 ? 'Master Gardener! 🏆' : finalScore >= 100 ? 'Great Garden! ⭐' : 'Good Start! 🌱';
    toast({ title: rating, description: `Bee-friendliness: ${totalBeeScore} + Bonuses: ${bonus} = ${finalScore} pts` });
    onGameComplete(finalScore);
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Leaf className="h-6 w-6" /> Bee-Friendly Garden Planner</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🌻🐝🌿🏡</div>
          <p className="text-muted-foreground">Design the perfect bee-friendly garden! Pick plants that bloom in different seasons, provide variety, and maximize bee-friendliness.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">4×4 Garden Grid</Badge>
            <Badge variant="outline">12 Plant Types</Badge>
            <Badge variant="outline">Season & variety bonuses</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Planting 🌱</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Garden Complete!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 140 ? '🏆' : score >= 100 ? '⭐' : '🌱'}</div>
          <p className="text-2xl font-bold">{score} points</p>
          <p className="text-muted-foreground">Your garden's bee-friendliness score</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Redesign</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filledCount = grid.flat().filter(Boolean).length;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base"><Leaf className="inline h-5 w-5 mr-1" /> Garden Planner</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <p className="text-xs text-muted-foreground">Select a plant below, then tap a grid cell to place it. Fill your garden and score!</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plant palette */}
        <div className="flex gap-1 flex-wrap justify-center">
          {plants.map(p => (
            <Button key={p.id} size="sm" variant={selectedPlant === p.id ? 'default' : 'outline'} className="text-xs px-2 py-1 h-auto" onClick={() => setSelectedPlant(selectedPlant === p.id ? null : p.id)}>
              {p.emoji} {p.name}
            </Button>
          ))}
        </div>

        {/* Show tip for selected plant */}
        {selectedPlant && (() => {
          const p = plants.find(pl => pl.id === selectedPlant);
          return p ? (
            <div className="text-xs text-center p-2 rounded bg-accent/30 flex items-center gap-1 justify-center">
              <Info className="h-3 w-3" /> {p.tip} | 🐝 Score: {p.beeScore} | 🌸 {p.bloomSeason}
            </div>
          ) : null;
        })()}

        {/* Garden grid */}
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, maxWidth: '280px' }}>
          {grid.map((row, r) => row.map((cell, c) => {
            const plant = cell ? plants.find(p => p.id === cell) : null;
            return (
              <button key={`${r}-${c}`} onClick={() => placeOnGrid(r, c)} className={`aspect-square flex items-center justify-center text-2xl rounded-md border-2 transition-all hover:scale-105 ${plant ? 'bg-green-50 border-green-300' : 'bg-accent/10 border-dashed border-border'}`}>
                {plant ? plant.emoji : '🟫'}
              </button>
            );
          }))}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span>{filledCount}/{GRID_SIZE * GRID_SIZE} planted</span>
          <Button onClick={calculateScore} disabled={filledCount < 4}>Score My Garden 🌟</Button>
        </div>
      </CardContent>
    </Card>
  );
};

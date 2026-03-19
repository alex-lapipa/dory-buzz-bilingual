import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Bug, CheckCircle, X, Trophy, RotateCcw, ArrowLeft } from '@/components/icons/lucide-compat';

interface AnatomyPart {
  id: string;
  name: string;
  emoji: string;
  description: string;
  funFact: string;
  position: { top: string; left: string };
}

interface BeeAnatomyExplorerProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const anatomyParts: AnatomyPart[] = [
  { id: 'head', name: 'Head', emoji: '🧠', description: 'Contains the brain, compound eyes, antennae, and mouthparts.', funFact: 'A bee\'s brain has about 960,000 neurons!', position: { top: '20%', left: '15%' } },
  { id: 'compound-eyes', name: 'Compound Eyes', emoji: '👁️', description: 'Two large eyes made of thousands of tiny lenses called ommatidia.', funFact: 'Bees can see ultraviolet light that humans cannot!', position: { top: '15%', left: '25%' } },
  { id: 'antennae', name: 'Antennae', emoji: '📡', description: 'Two feelers used for smell, touch, and detecting vibrations.', funFact: 'Antennae can detect electric fields from flowers!', position: { top: '5%', left: '20%' } },
  { id: 'proboscis', name: 'Proboscis', emoji: '👅', description: 'A long tongue-like straw used to sip nectar from flowers.', funFact: 'A honeybee\'s proboscis can be up to 7mm long!', position: { top: '30%', left: '10%' } },
  { id: 'thorax', name: 'Thorax', emoji: '💪', description: 'The middle section where wings and legs attach. Contains flight muscles.', funFact: 'Flight muscles make up 25% of a bee\'s body weight!', position: { top: '40%', left: '40%' } },
  { id: 'wings', name: 'Wings', emoji: '🪽', description: 'Four wings (two pairs) that beat 200 times per second during flight.', funFact: 'The "buzz" sound comes from wing vibrations!', position: { top: '25%', left: '55%' } },
  { id: 'legs', name: 'Legs', emoji: '🦵', description: 'Six legs with special structures for collecting and carrying pollen.', funFact: 'Hind legs have "pollen baskets" called corbiculae!', position: { top: '60%', left: '35%' } },
  { id: 'abdomen', name: 'Abdomen', emoji: '🍯', description: 'The rear section containing the digestive system, wax glands, and stinger.', funFact: 'Worker bees have a honey stomach in the abdomen!', position: { top: '45%', left: '70%' } },
  { id: 'stinger', name: 'Stinger', emoji: '⚡', description: 'A modified egg-laying organ used for defense. Only females have stingers.', funFact: 'Queen bees can sting multiple times — workers cannot!', position: { top: '55%', left: '85%' } },
  { id: 'pollen-basket', name: 'Pollen Basket', emoji: '🧺', description: 'A concave area on hind legs surrounded by hairs to carry pollen.', funFact: 'One pollen load can weigh 35% of the bee\'s body!', position: { top: '65%', left: '50%' } },
];

export const BeeAnatomyExplorer: React.FC<BeeAnatomyExplorerProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [identified, setIdentified] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateOptions = (correctId: string) => {
    const correct = anatomyParts.find(p => p.id === correctId)!;
    const others = anatomyParts.filter(p => p.id !== correctId).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct.name, ...others.map(o => o.name)].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const startGame = () => {
    setGameStarted(true);
    setIdentified([]);
    setScore(0);
    setCurrentPartIndex(0);
    setGameCompleted(false);
    generateOptions(anatomyParts[0].id);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    const currentPart = anatomyParts[currentPartIndex];
    const isCorrect = answer === currentPart.name;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (isCorrect) {
      setScore(prev => prev + 15);
      setIdentified(prev => [...prev, currentPart.id]);
      toast({ title: `✅ Correct! That's the ${currentPart.name}!`, description: currentPart.funFact });
    } else {
      toast({ title: `❌ Not quite!`, description: `That was the ${currentPart.name}. ${currentPart.description}` });
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      if (currentPartIndex < anatomyParts.length - 1) {
        const nextIndex = currentPartIndex + 1;
        setCurrentPartIndex(nextIndex);
        generateOptions(anatomyParts[nextIndex].id);
      } else {
        const finalScore = isCorrect ? score + 15 : score;
        setScore(finalScore);
        setGameCompleted(true);
        onGameComplete(finalScore);
      }
    }, 2000);
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Bug className="h-6 w-6" /> Bee Anatomy Explorer</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">🐝🔬</div>
          <p className="text-muted-foreground">Learn about bee body parts! You'll be shown a body part with a description — pick the correct name from four options.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">10 Body Parts</Badge>
            <Badge variant="outline">15 pts each</Badge>
            <Badge variant="outline">150 max score</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Start Exploring 🔍</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Anatomy Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 120 ? '🏆' : score >= 75 ? '⭐' : '📚'}</div>
          <p className="text-2xl font-bold">{score} / 150 points</p>
          <p className="text-muted-foreground">{identified.length} / {anatomyParts.length} parts correctly identified</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPart = anatomyParts[currentPartIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Bug className="h-5 w-5" /> Part {currentPartIndex + 1}/{anatomyParts.length}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={((currentPartIndex) / anatomyParts.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 rounded-lg bg-accent/30">
          <div className="text-5xl mb-3">{currentPart.emoji}</div>
          <p className="text-sm text-muted-foreground italic mb-2">{currentPart.description}</p>
          <p className="text-xs text-muted-foreground">📍 Located: {currentPart.position.top} from top</p>
        </div>
        <p className="font-semibold text-center">What is this body part called?</p>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            let variant: 'outline' | 'default' | 'destructive' = 'outline';
            if (showResult && opt === currentPart.name) variant = 'default';
            else if (showResult && opt === selectedAnswer && opt !== currentPart.name) variant = 'destructive';
            return (
              <Button key={opt} variant={variant} className="h-auto py-3 text-sm" onClick={() => handleAnswer(opt)} disabled={showResult}>
                {opt}
                {showResult && opt === currentPart.name && <CheckCircle className="ml-1 h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

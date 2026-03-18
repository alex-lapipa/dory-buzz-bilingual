import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Microscope, Trophy, RotateCcw, ArrowLeft, X, CheckCircle, Eye } from 'lucide-react';

interface VisionRound {
  flower: string;
  humanView: { emoji: string; color: string; description: string };
  beeView: { emoji: string; pattern: string; description: string };
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface MicroscopicBeeWorldProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

const rounds: VisionRound[] = [
  {
    flower: 'Sunflower',
    humanView: { emoji: '🌻', color: 'Yellow', description: 'A bright yellow flower with brown center' },
    beeView: { emoji: '🌻✨', pattern: 'UV bullseye', description: 'Dark center ring with glowing UV "landing strip" guides pointing to nectar' },
    question: 'What do bees see on sunflowers that humans cannot?',
    options: ['UV nectar guides (landing strips)', 'Infrared heat spots', 'X-ray pollen patterns', 'Magnetic field lines'],
    correctAnswer: 'UV nectar guides (landing strips)',
    explanation: 'Sunflowers have UV-absorbing patterns that create a "bullseye" visible only to bees, guiding them to nectar!'
  },
  {
    flower: 'White Daisy',
    humanView: { emoji: '🌼', color: 'White with yellow center', description: 'Simple white petals around a yellow disc' },
    beeView: { emoji: '🌼💜', pattern: 'Purple with dark center', description: 'Petals appear purple/blue, center absorbs UV creating dark target' },
    question: 'What color does a "white" daisy appear to bees?',
    options: ['Still white', 'Purple/blue', 'Invisible', 'Red'],
    correctAnswer: 'Purple/blue',
    explanation: 'Bees cannot see red but can see UV. White petals reflect UV differently, appearing purple-blue to bee vision!'
  },
  {
    flower: 'Red Poppy',
    humanView: { emoji: '🌺', color: 'Bright red', description: 'Vivid red petals with black center' },
    beeView: { emoji: '🌺⬛', pattern: 'Dark/UV-bright', description: 'Appears very dark (bees can\'t see red) but with UV-reflecting edges' },
    question: 'Why can bees still find red poppies if they can\'t see red?',
    options: ['They smell them', 'UV patterns reflect from petals', 'They memorize locations', 'Other bees tell them'],
    correctAnswer: 'UV patterns reflect from petals',
    explanation: 'Red poppies reflect UV light that bees CAN see, creating bright patterns invisible to us!'
  },
  {
    flower: 'Evening Primrose',
    humanView: { emoji: '🌕', color: 'Pale yellow', description: 'Delicate pale yellow petals' },
    beeView: { emoji: '🌕🎯', pattern: 'Bright with dark center cross', description: 'Vivid yellow with a dramatic dark cross-pattern in UV pointing to nectaries' },
    question: 'How many color receptors do bees have vs humans?',
    options: ['Same (3)', 'More (4-5)', 'Fewer (2)', 'Only 1'],
    correctAnswer: 'Same (3)',
    explanation: 'Bees have 3 color receptors like humans, but shifted: they see UV, blue, and green — not red!'
  },
  {
    flower: 'Lavender',
    humanView: { emoji: '💜', color: 'Purple', description: 'Spikes of small purple flowers' },
    beeView: { emoji: '💜💡', pattern: 'Brilliant blue-violet', description: 'Extremely vibrant blue-violet — one of the most visible flowers to bees' },
    question: 'Why is lavender one of the best bee-attracting plants?',
    options: ['It\'s purple — bees\' favorite visible color', 'It\'s the tallest flower', 'It has the most petals', 'It grows fastest'],
    correctAnswer: 'It\'s purple — bees\' favorite visible color',
    explanation: 'Bees see blue-violet most vividly. Combined with abundant nectar and long bloom time, lavender is a bee superstar!'
  },
  {
    flower: 'Rose',
    humanView: { emoji: '🌹', color: 'Red', description: 'Classic red rose with many petals' },
    beeView: { emoji: '🌹🔲', pattern: 'Very dark / near-invisible', description: 'Appears almost black — red is outside bee vision. Minimal UV reflection.' },
    question: 'Why are red roses less attractive to bees than other flowers?',
    options: ['Red is invisible to bees', 'Roses have no nectar', 'Roses are too large', 'Thorns repel bees'],
    correctAnswer: 'Red is invisible to bees',
    explanation: 'Pure red falls outside bee vision range. Cultivated roses also often lack nectar, making them doubly unattractive to bees!'
  },
  {
    flower: 'Dandelion',
    humanView: { emoji: '🌕', color: 'Yellow', description: 'Common yellow weed flower' },
    beeView: { emoji: '🌕🔆', pattern: 'Bright UV with dark ring', description: 'Intensely bright with UV-absorbing ring marking the nectar zone' },
    question: 'Why are dandelions critically important for bees?',
    options: ['They bloom early when little else flowers', 'They\'re the biggest flowers', 'They have the most pollen', 'They never close'],
    correctAnswer: 'They bloom early when little else flowers',
    explanation: 'Dandelions are often the first spring food source for bees emerging from winter — never poison them!'
  },
];

export const MicroscopicBeeWorld: React.FC<MicroscopicBeeWorldProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [viewMode, setViewMode] = useState<'human' | 'bee'>('human');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setRoundIndex(0);
    setScore(0);
    setViewMode('human');
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const round = rounds[roundIndex];
    const isCorrect = answer === round.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 20);
      toast({ title: '✅ Correct!', description: round.explanation });
    } else {
      toast({ title: '❌ Not quite', description: round.explanation });
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      setViewMode('human');
      if (roundIndex < rounds.length - 1) {
        setRoundIndex(prev => prev + 1);
      } else {
        const finalScore = isCorrect ? score + 20 : score;
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
            <CardTitle className="flex items-center gap-2"><Microscope className="h-6 w-6" /> Microscopic Bee World</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-6xl">👁️🐝🔬🌸</div>
          <p className="text-muted-foreground">Discover how bees see the world! Toggle between human vision and bee UV vision to learn why bees prefer certain flowers.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">7 Flowers</Badge>
            <Badge variant="outline">20 pts each</Badge>
            <Badge variant="outline">140 max</Badge>
          </div>
          <Button onClick={startGame} className="w-full">Enter Bee Vision 👁️</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Vision Master!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl">{score >= 120 ? '🏆' : score >= 80 ? '⭐' : '📚'}</div>
          <p className="text-2xl font-bold">{score} / 140 points</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame}><RotateCcw className="mr-2 h-4 w-4" />Play Again</Button>
            <Button variant="outline" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const round = rounds[roundIndex];
  const view = viewMode === 'human' ? round.humanView : round.beeView;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{round.flower} — Round {roundIndex + 1}/{rounds.length}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge>{score} pts</Badge>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <Progress value={(roundIndex / rounds.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vision toggle */}
        <div className="flex justify-center gap-2">
          <Button size="sm" variant={viewMode === 'human' ? 'default' : 'outline'} onClick={() => setViewMode('human')}>
            <Eye className="mr-1 h-4 w-4" /> Human Vision
          </Button>
          <Button size="sm" variant={viewMode === 'bee' ? 'default' : 'outline'} onClick={() => setViewMode('bee')}>
            🐝 Bee UV Vision
          </Button>
        </div>

        {/* Vision display */}
        <div className={`p-6 rounded-lg text-center space-y-2 transition-all duration-500 ${viewMode === 'bee' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-accent/30 border-2 border-border'}`}>
          <div className="text-6xl">{view.emoji}</div>
          <p className="font-medium">{viewMode === 'human' ? `Color: ${round.humanView.color}` : `Pattern: ${round.beeView.pattern}`}</p>
          <p className="text-sm text-muted-foreground">{view.description}</p>
        </div>

        <p className="font-semibold text-center text-sm">{round.question}</p>
        <div className="grid grid-cols-1 gap-2">
          {round.options.map(opt => {
            let variant: 'outline' | 'default' | 'destructive' = 'outline';
            if (showResult && opt === round.correctAnswer) variant = 'default';
            else if (showResult && opt === selectedAnswer && opt !== round.correctAnswer) variant = 'destructive';
            return (
              <Button key={opt} variant={variant} className="h-auto py-3 text-sm text-left justify-start" onClick={() => handleAnswer(opt)} disabled={showResult}>
                {opt} {showResult && opt === round.correctAnswer && <CheckCircle className="ml-auto h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

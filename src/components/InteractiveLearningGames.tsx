import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Trophy, 
  Target, 
  CheckCircle,
  Puzzle,
  Gamepad2,
  Brain,
  FlaskConical,
  Camera,
  Microscope,
  Leaf,
  Bug
} from 'lucide-react';
import { FlowerMemoryGame } from './games/FlowerMemoryGame';
import { BeeTrivia } from './games/BeeTrivia';
import { BeeAnatomyExplorer } from './games/BeeAnatomyExplorer';
import { PollinationQuest } from './games/PollinationQuest';
import { HiveBuilder } from './games/HiveBuilder';
import { BeeDanceDecoder } from './games/BeeDanceDecoder';
import { LifecycleLab } from './games/LifecycleLab';
import { GardenPlanner } from './games/GardenPlanner';
import { SpeciesSpotter } from './games/SpeciesSpotter';
import { MicroscopicBeeWorld } from './games/MicroscopicBeeWorld';

interface GameCardProps {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  icon: React.ReactNode;
  color: string;
  onPlay: () => void;
  completed?: boolean;
  progress?: number;
  isPlayable?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  title, 
  description, 
  difficulty, 
  category, 
  icon, 
  color, 
  onPlay, 
  completed = false,
  progress = 0,
  isPlayable = false
}) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${color} group relative overflow-hidden`}>
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
          <CheckCircle className="h-4 w-4" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl group-hover:animate-bounce">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{category}</p>
            </div>
          </div>
          <Badge className={difficultyColors[difficulty]} variant="outline">
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{description}</p>
        
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button 
          onClick={onPlay}
          className="w-full" 
          variant={isPlayable ? (completed ? "outline" : "default") : "outline"}
          disabled={!isPlayable}
        >
          {isPlayable ? (completed ? "Play Again" : "Start Game") : "Coming Soon"}
          <Gamepad2 className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export const InteractiveLearningGames: React.FC = () => {
  const { toast } = useToast();
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});
  
  const playGame = (gameId: string, gameTitle: string) => {
    setCurrentGame(gameId);
  };

  const handleGameComplete = (gameId: string, score: number) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames([...completedGames, gameId]);
    }
    setGameScores(prev => ({ ...prev, [gameId]: Math.max(prev[gameId] || 0, score) }));
    setCurrentGame(null);
    
    toast({
      title: "🎉 Game Completed!",
      description: `Great job! Your score: ${score}`,
    });
  };

  const handleCloseGame = () => {
    setCurrentGame(null);
  };

  const learningGames = [
    {
      id: 'bee-anatomy',
      title: 'Bee Anatomy Explorer',
      description: 'Interactive drag-and-drop game to learn bee body parts and their functions.',
      difficulty: 'Easy' as const,
      category: 'Bee Biology',
      icon: <Bug className="h-6 w-6" />,
      color: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50',
      progress: 0,
      isPlayable: true
    {
      id: 'pollination-quest',
      title: 'Pollination Quest',
      description: 'Guide a bee through a garden maze, collecting pollen and avoiding obstacles.',
      difficulty: 'Medium' as const,
      category: 'Pollination',
      icon: <Target className="h-6 w-6" />,
      color: 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'hive-builder',
      title: 'Hive Builder Challenge',
      description: 'Build the perfect hexagonal honeycomb using geometry and teamwork principles.',
      difficulty: 'Hard' as const,
      category: 'Bee Architecture',
      icon: <Puzzle className="h-6 w-6" />,
      color: 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'flower-match',
      title: 'Flower Matching Memory',
      description: 'Memory game to learn which flowers attract different types of bees.',
      difficulty: 'Easy' as const,
      category: 'Flower Recognition',
      icon: <Star className="h-6 w-6" />,
      color: 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'bee-dance',
      title: 'Bee Dance Decoder',
      description: 'Learn to interpret the waggle dance and find hidden flower locations.',
      difficulty: 'Medium' as const,
      category: 'Bee Communication',
      icon: <Trophy className="h-6 w-6" />,
      color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'lifecycle-lab',
      title: 'Bee Lifecycle Lab',
      description: 'Interactive timeline showing bee development from egg to adult.',
      difficulty: 'Easy' as const,
      category: 'Life Sciences',
      icon: <FlaskConical className="h-6 w-6" />,
      color: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'garden-planner',
      title: 'Bee-Friendly Garden Planner',
      description: 'Design a garden that provides food and shelter for local bee species.',
      difficulty: 'Hard' as const,
      category: 'Garden Design',
      icon: <Leaf className="h-6 w-6" />,
      color: 'border-teal-200 bg-gradient-to-br from-teal-50 to-green-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'species-spotter',
      title: 'Bee Species Spotter',
      description: 'Photo identification game to distinguish different bee species.',
      difficulty: 'Medium' as const,
      category: 'Species Identification',
      icon: <Camera className="h-6 w-6" />,
      color: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'micro-world',
      title: 'Microscopic Bee World',
      description: 'Explore bee vision and how they see flowers in ultraviolet light.',
      difficulty: 'Hard' as const,
      category: 'Bee Vision',
      icon: <Microscope className="h-6 w-6" />,
      color: 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50',
      progress: 0,
      isPlayable: true
    },
    {
      id: 'bee-trivia',
      title: 'Buzzing Bee Trivia',
      description: 'Fast-paced quiz game with amazing bee facts and challenges.',
      difficulty: 'Easy' as const,
      category: 'General Knowledge',
      icon: <Brain className="h-6 w-6" />,
      color: 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50',
      progress: 0,
      isPlayable: true
    }
  ];

  // Show individual game if one is selected
  if (currentGame === 'flower-match') {
    return (
      <div className="space-y-6">
        <FlowerMemoryGame 
          onGameComplete={(score) => handleGameComplete('flower-match', score)}
          onClose={handleCloseGame}
        />
      </div>
    );
  }

  if (currentGame === 'bee-trivia') {
    return (
      <div className="space-y-6">
        <BeeTrivia 
          onGameComplete={(score) => handleGameComplete('bee-trivia', score)}
          onClose={handleCloseGame}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Gamepad2 className="h-8 w-8 text-purple-600" />
          Interactive Learning Games
          <span className="animate-bee-bounce">🎮</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          🎯 Learn about bees and gardens through fun, interactive games! Some games are playable now, others coming soon.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningGames.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            difficulty={game.difficulty}
            category={game.category}
            icon={game.icon}
            color={game.color}
            onPlay={() => playGame(game.id, game.title)}
            completed={completedGames.includes(game.id)}
            progress={gameScores[game.id] ? Math.min(100, (gameScores[game.id] / 150) * 100) : 0}
            isPlayable={game.isPlayable || false}
          />
        ))}
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Trophy className="h-5 w-5" />
            Your Gaming Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-700">{completedGames.length}</div>
              <div className="text-sm text-yellow-600">Games Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-700">{learningGames.filter(g => g.isPlayable).length}</div>
              <div className="text-sm text-orange-600">Playable Games</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-amber-700">
                {Object.values(gameScores).reduce((total, score) => total + score, 0)}
              </div>
              <div className="text-sm text-amber-600">Total Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="h-5 w-5" />
            Learning Game Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span>🎯</span>
              <div><strong>Try the playable games</strong> - Flower Memory and Bee Trivia are fully functional!</div>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <div><strong>Replay games</strong> - Each playthrough reinforces learning and improves scores</div>
            </li>
            <li className="flex items-start gap-2">
              <span>🏆</span>
              <div><strong>Beat your high score</strong> - Challenge yourself to improve each time</div>
            </li>
            <li className="flex items-start gap-2">
              <span>🤝</span>
              <div><strong>Ask for help</strong> - Chat with Mochi if you get stuck on any game</div>
            </li>
            <li className="flex items-start gap-2">
              <span>📱</span>
              <div><strong>Mobile-friendly</strong> - All games work great on phones and tablets</div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
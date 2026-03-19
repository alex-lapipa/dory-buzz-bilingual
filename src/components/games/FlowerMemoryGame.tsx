import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Trophy, Star, Timer } from '@/components/icons/lucide-compat';

interface GameCard {
  id: string;
  flower: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

interface FlowerMemoryGameProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

export const FlowerMemoryGame: React.FC<FlowerMemoryGameProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const flowers = [
    { name: 'Sunflower', emoji: '🌻' },
    { name: 'Rose', emoji: '🌹' },
    { name: 'Tulip', emoji: '🌷' },
    { name: 'Daisy', emoji: '🌼' },
    { name: 'Lavender', emoji: '💜' },
    { name: 'Cherry Blossom', emoji: '🌸' },
    { name: 'Hibiscus', emoji: '🌺' },
    { name: 'Lotus', emoji: '🪷' }
  ];

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    flowers.forEach((flower) => {
      // Create two cards for each flower
      gameCards.push({
        id: `${flower.name}-1`,
        flower: flower.name,
        emoji: flower.emoji,
        flipped: false,
        matched: false
      });
      gameCards.push({
        id: `${flower.name}-2`,
        flower: flower.name,
        emoji: flower.emoji,
        flipped: false,
        matched: false
      });
    });
    
    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatches(0);
    setMoves(0);
    setTimeLeft(60);
    setFlippedCards([]);
    setGameCompleted(false);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: string) => {
    if (!gameStarted || gameCompleted) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.flower === secondCard.flower) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          toast({
            title: "🌸 Perfect Match!",
            description: `You matched ${firstCard.flower}s!`,
          });
        }, 500);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameCompleted(true);
          setGameStarted(false);
          const score = Math.max(0, matches * 100 - moves * 5);
          onGameComplete(score);
          toast({
            title: "⏰ Time's Up!",
            description: `Game over! You matched ${matches} pairs.`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, matches, moves, onGameComplete, toast]);

  // Check for game completion
  useEffect(() => {
    if (matches === flowers.length && gameStarted) {
      setGameCompleted(true);
      setGameStarted(false);
      const timeBonus = timeLeft * 10;
      const score = matches * 100 - moves * 5 + timeBonus;
      onGameComplete(score);
      toast({
        title: "🏆 Congratulations!",
        description: `You completed the game! Score: ${score}`,
      });
    }
  }, [matches, flowers.length, gameStarted, timeLeft, moves, onGameComplete, toast]);

  const progress = (matches / flowers.length) * 100;

  if (!gameStarted && !gameCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-pink-500" />
            Flower Memory Match
            <Star className="h-6 w-6 text-pink-500" />
          </CardTitle>
          <p className="text-muted-foreground">
            Match pairs of flowers to test your memory! Find all 8 pairs before time runs out.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Click cards to flip them over</li>
              <li>• Find matching pairs of flowers</li>
              <li>• Complete all 8 pairs to win</li>
              <li>• Faster completion = higher score</li>
              <li>• You have 60 seconds!</li>
            </ul>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={initializeGame} className="px-8">
              <Star className="mr-2 h-4 w-4" />
              Start Game
            </Button>
            <Button variant="outline" onClick={onClose}>
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-pink-500" />
            Flower Memory Match
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {timeLeft}s
            </Badge>
            <Badge variant="outline">Moves: {moves}</Badge>
            <Badge variant="outline">Matches: {matches}/{flowers.length}</Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300
                flex items-center justify-center text-3xl font-bold
                ${card.matched 
                  ? 'bg-green-100 border-green-300 text-green-700' 
                  : card.flipped 
                    ? 'bg-white border-pink-300 shadow-lg transform scale-105' 
                    : 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-200 hover:scale-105 hover:shadow-md'
                }
                ${!card.matched && !card.flipped ? 'hover:from-pink-200 hover:to-purple-200' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              {card.flipped || card.matched ? card.emoji : '🌸'}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={initializeGame}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          <Button variant="outline" onClick={onClose}>
            Back to Games
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
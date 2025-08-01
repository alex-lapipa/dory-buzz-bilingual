import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle, X, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface BeeTrivaProps {
  onGameComplete: (score: number) => void;
  onClose: () => void;
}

export const BeeTrivia: React.FC<BeeTrivaProps> = ({ onGameComplete, onClose }) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "How many eyes do bees have?",
      options: ["2", "4", "5", "6"],
      correct: 2,
      explanation: "Bees have 5 eyes: 2 large compound eyes and 3 simple eyes (ocelli) on top of their head.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "What is the primary purpose of the waggle dance?",
      options: ["Mating ritual", "Territorial display", "Communication about food sources", "Defense mechanism"],
      correct: 2,
      explanation: "The waggle dance communicates the location, distance, and quality of food sources to other bees.",
      difficulty: "Medium"
    },
    {
      id: 3,
      question: "How many wings do bees have?",
      options: ["2", "4", "6", "8"],
      correct: 1,
      explanation: "Bees have 4 wings - 2 forewings and 2 hindwings that hook together during flight.",
      difficulty: "Easy"
    },
    {
      id: 4,
      question: "What percentage of the world's food crops depend on bee pollination?",
      options: ["About 15%", "About 35%", "About 55%", "About 75%"],
      correct: 1,
      explanation: "Approximately 35% of global food production depends on pollinators, with bees being the most important.",
      difficulty: "Hard"
    },
    {
      id: 5,
      question: "How fast can a honeybee fly?",
      options: ["5 mph", "15 mph", "25 mph", "35 mph"],
      correct: 1,
      explanation: "Honeybees can fly at speeds of up to 15 mph (24 km/h).",
      difficulty: "Medium"
    },
    {
      id: 6,
      question: "What is royal jelly?",
      options: ["Bee honey", "Nutritious secretion for larvae", "Bee wax", "Flower nectar"],
      correct: 1,
      explanation: "Royal jelly is a nutritious secretion produced by worker bees to feed larvae and the queen.",
      difficulty: "Medium"
    },
    {
      id: 7,
      question: "How many flowers must bees visit to make one pound of honey?",
      options: ["About 200", "About 2,000", "About 20,000", "About 2 million"],
      correct: 3,
      explanation: "Bees must visit approximately 2 million flowers to make just one pound of honey!",
      difficulty: "Hard"
    },
    {
      id: 8,
      question: "What shape are honeycomb cells?",
      options: ["Square", "Circular", "Triangular", "Hexagonal"],
      correct: 3,
      explanation: "Honeycomb cells are hexagonal because this shape uses the least amount of wax while providing maximum storage space.",
      difficulty: "Easy"
    },
    {
      id: 9,
      question: "How long does a worker bee live during peak season?",
      options: ["2-3 days", "2-3 weeks", "4-6 weeks", "2-3 months"],
      correct: 2,
      explanation: "During busy summer months, worker bees live only 4-6 weeks due to their intensive work schedule.",
      difficulty: "Medium"
    },
    {
      id: 10,
      question: "What happens to male bees (drones) in winter?",
      options: ["They hibernate", "They migrate south", "They are expelled from the hive", "They become workers"],
      correct: 2,
      explanation: "Drones are expelled from the hive before winter since they consume resources without contributing to winter survival.",
      difficulty: "Hard"
    }
  ];

  const initializeGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameStarted(true);
    setGameCompleted(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !gameStarted) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      const points = currentQuestion.difficulty === 'Easy' ? 10 : currentQuestion.difficulty === 'Medium' ? 15 : 20;
      setScore(prev => prev + points);
      toast({
        title: "🎉 Correct!",
        description: `+${points} points`,
      });
    } else {
      toast({
        title: "❌ Incorrect",
        description: "Better luck on the next question!",
      });
    }

    // Mark question as answered
    setAnsweredQuestions(prev => {
      const newAnswered = [...prev];
      newAnswered[currentQuestionIndex] = true;
      return newAnswered;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      setGameStarted(false);
      onGameComplete(score);
      toast({
        title: "🏆 Quiz Complete!",
        description: `Final Score: ${score} points`,
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  if (!gameStarted && !gameCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-purple-500" />
            Buzzing Bee Trivia
            <Brain className="h-6 w-6 text-purple-500" />
          </CardTitle>
          <p className="text-muted-foreground">
            Test your knowledge about these amazing creatures! Answer 10 questions about bee biology and behavior.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Scoring System:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>🟢 Easy questions: 10 points</li>
              <li>🟡 Medium questions: 15 points</li>
              <li>🔴 Hard questions: 20 points</li>
              <li>🏆 Perfect score: 150 points</li>
            </ul>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={initializeGame} className="px-8">
              <Brain className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
            <Button variant="outline" onClick={onClose}>
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    const percentage = (score / 150) * 100;
    let performance = "";
    if (percentage >= 90) performance = "🏆 Bee Expert!";
    else if (percentage >= 70) performance = "🐝 Bee Enthusiast!";
    else if (percentage >= 50) performance = "🌸 Budding Bee Lover!";
    else performance = "🌱 Keep Learning!";

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Results
            <Trophy className="h-6 w-6 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <div className="text-4xl font-bold text-yellow-700 mb-2">{score}/150</div>
            <div className="text-xl font-semibold text-orange-700 mb-2">{performance}</div>
            <div className="text-muted-foreground">You scored {Math.round(percentage)}%</div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={initializeGame}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Bee Trivia Quiz
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline" className={
              currentQuestion.difficulty === 'Easy' ? 'border-green-300 text-green-700' :
              currentQuestion.difficulty === 'Medium' ? 'border-yellow-300 text-yellow-700' :
              'border-red-300 text-red-700'
            }>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg font-semibold leading-relaxed">
          {currentQuestion.question}
        </div>
        
        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`
                justify-start h-auto p-4 text-left transition-all
                ${selectedAnswer === index 
                  ? index === currentQuestion.correct
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-red-100 border-red-300 text-red-700'
                  : showResult && index === currentQuestion.correct
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'hover:bg-muted'
                }
                ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}
              `}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <span className="flex-grow">{option}</span>
              </div>
            </Button>
          ))}
        </div>
        
        {showResult && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">Explanation:</div>
            <div className="text-blue-700">{currentQuestion.explanation}</div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Back to Games
          </Button>
          
          {showResult && (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
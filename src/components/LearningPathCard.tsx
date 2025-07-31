import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Target, 
  Award, 
  ChevronRight,
  BookOpen,
  Users,
  Star
} from 'lucide-react';

interface LearningPathCardProps {
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  tags: string[];
  href: string;
  gradient: string;
  featured?: boolean;
  onStart: () => void;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  description,
  icon,
  difficulty,
  estimatedTime,
  progress,
  totalLessons,
  completedLessons,
  tags,
  href,
  gradient,
  featured = false,
  onStart
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card 
      className={`h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 ${gradient} ${featured ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''} group relative overflow-hidden`}
      onClick={onStart}
    >
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                  <Target className="h-3 w-3 mr-1" />
                  {difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <BookOpen className="h-3 w-3" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-3 w-3" />
            <span>All ages</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Award className="h-3 w-3" />
            <span>{completedLessons} completed</span>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-800">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-white/70 text-gray-700 border-white/50"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-white/70 text-gray-700 border-white/50">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Action Button */}
        <div className="pt-2">
          <Button 
            className="w-full group-hover:bg-white/90 transition-colors"
            variant={progress > 0 ? "default" : "secondary"}
          >
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
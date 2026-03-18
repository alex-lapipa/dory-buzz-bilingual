import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryProgress {
  label: string;
  value: number; // 0-100
  color: string;
}

interface LearningProgressChartProps {
  overallPercent?: number;
  categories?: CategoryProgress[];
  streak?: number;
  badges?: string[];
}

export const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  overallPercent = 0,
  categories = [
    { label: 'Bee Basics', value: 30, color: 'hsl(59 100% 50%)' },
    { label: 'Garden Basics', value: 15, color: 'hsl(120 40% 50%)' },
    { label: 'Ecology', value: 5, color: 'hsl(200 60% 50%)' },
  ],
  streak = 0,
  badges = [],
}) => {
  const { language } = useLanguage();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-2">
        <CardTitle className="text-responsive-base">
          {language === 'es' ? '📊 Tu Progreso' : '📊 Your Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress Ring */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{overallPercent}%</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {language === 'es' ? 'completo' : 'complete'}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span className="text-sm font-semibold">
                  {streak} {language === 'es' ? 'días seguidos' : 'day streak'}
                </span>
              </div>
            )}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {badges.map((b, i) => (
                  <span key={i} className="text-lg" title={b}>{b}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Bars */}
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-normal">
                <span>{cat.label}</span>
                <span className="text-muted-foreground">{cat.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

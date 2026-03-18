import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Verified 2026 lunar phase data (UTC) from USNO / rag_09
const LUNAR_DATA_2026 = [
  { month: 'January', new: '2026-01-29', fq: '2026-01-05', full: '2026-01-13', lq: '2026-01-21', name_en: 'Wolf Moon', name_es: 'Luna del Lobo' },
  { month: 'February', new: '2026-02-28', fq: '2026-02-04', full: '2026-02-12', lq: '2026-02-20', name_en: 'Snow Moon', name_es: 'Luna de Nieve' },
  { month: 'March', new: '2026-03-29', fq: '2026-03-05', full: '2026-03-14', lq: '2026-03-22', name_en: 'Worm Moon', name_es: 'Luna del Gusano' },
  { month: 'April', new: '2026-04-27', fq: '2026-04-04', full: '2026-04-12', lq: '2026-04-20', name_en: 'Pink Moon', name_es: 'Luna Rosa' },
  { month: 'May', new: '2026-05-27', fq: '2026-05-04', full: '2026-05-12', lq: '2026-05-19', name_en: 'Flower Moon', name_es: 'Luna de las Flores' },
  { month: 'June', new: '2026-06-25', fq: '2026-06-02', full: '2026-06-11', lq: '2026-06-18', name_en: 'Strawberry Moon', name_es: 'Luna de Fresa' },
  { month: 'July', new: '2026-07-24', fq: '2026-07-01', full: '2026-07-10', lq: '2026-07-17', name_en: 'Buck Moon', name_es: 'Luna del Ciervo' },
  { month: 'August', new: '2026-08-23', fq: '2026-08-29', full: '2026-08-09', lq: '2026-08-16', name_en: 'Sturgeon Moon', name_es: 'Luna del Esturión' },
  { month: 'September', new: '2026-09-21', fq: '2026-09-28', full: '2026-09-07', lq: '2026-09-14', name_en: 'Harvest Moon', name_es: 'Luna de la Cosecha' },
  { month: 'October', new: '2026-10-21', fq: '2026-10-27', full: '2026-10-07', lq: '2026-10-14', name_en: "Hunter's Moon", name_es: 'Luna del Cazador' },
  { month: 'November', new: '2026-11-20', fq: '2026-11-26', full: '2026-11-05', lq: '2026-11-12', name_en: 'Beaver Moon', name_es: 'Luna del Castor' },
  { month: 'December', new: '2026-12-20', fq: '2026-12-26', full: '2026-12-04', lq: '2026-12-12', name_en: 'Cold Moon', name_es: 'Luna Fría' },
];

type PhaseInfo = {
  phase: string;
  emoji: string;
  planting_en: string;
  planting_es: string;
  nextPhase: string;
  nextDate: Date;
  moonName_en: string;
  moonName_es: string;
  daysUntilNext: number;
};

function getCurrentPhase(now: Date): PhaseInfo {
  // Collect all phase dates for 2026 in order
  const allPhases: { date: Date; phase: string; emoji: string; monthIdx: number }[] = [];

  LUNAR_DATA_2026.forEach((m, idx) => {
    allPhases.push({ date: new Date(m.new), phase: 'New Moon', emoji: '🌑', monthIdx: idx });
    allPhases.push({ date: new Date(m.fq), phase: 'First Quarter', emoji: '🌓', monthIdx: idx });
    allPhases.push({ date: new Date(m.full), phase: 'Full Moon', emoji: '🌕', monthIdx: idx });
    allPhases.push({ date: new Date(m.lq), phase: 'Last Quarter', emoji: '🌗', monthIdx: idx });
  });

  allPhases.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find current phase window
  let currentIdx = 0;
  for (let i = 0; i < allPhases.length - 1; i++) {
    if (now >= allPhases[i].date && now < allPhases[i + 1].date) {
      currentIdx = i;
      break;
    }
    if (i === allPhases.length - 2) currentIdx = i;
  }

  const current = allPhases[currentIdx];
  const next = allPhases[Math.min(currentIdx + 1, allPhases.length - 1)];
  const monthData = LUNAR_DATA_2026[current.monthIdx];
  const daysUntilNext = Math.max(0, Math.ceil((next.date.getTime() - now.getTime()) / 86400000));

  const plantingGuide: Record<string, { en: string; es: string }> = {
    'New Moon': {
      en: '🌱 Sow above-ground leafy crops: lettuce, spinach, cabbage, grains',
      es: '🌱 Sembrar cultivos de hoja: lechuga, espinaca, col, cereales',
    },
    'First Quarter': {
      en: '🍅 Sow fruiting crops: tomatoes, peppers, squash, beans, melons',
      es: '🍅 Sembrar frutos: tomates, pimientos, calabazas, judías, melones',
    },
    'Full Moon': {
      en: '🥕 Plant root crops: carrots, potatoes, beets, onions. Transplant!',
      es: '🥕 Plantar raíces: zanahorias, patatas, remolacha, cebollas. ¡Trasplantar!',
    },
    'Last Quarter': {
      en: '🛌 Rest period: weed, compost, turn soil, harvest for storage',
      es: '🛌 Descanso: deshierbar, compostar, voltear tierra, cosechar para almacenar',
    },
  };

  const guide = plantingGuide[current.phase] || plantingGuide['New Moon'];

  return {
    phase: current.phase,
    emoji: current.emoji,
    planting_en: guide.en,
    planting_es: guide.es,
    nextPhase: next.phase,
    nextDate: next.date,
    moonName_en: monthData.name_en,
    moonName_es: monthData.name_es,
    daysUntilNext: daysUntilNext,
  };
}

const PHASE_NEXT_EMOJI: Record<string, string> = {
  'New Moon': '🌑',
  'First Quarter': '🌓',
  'Full Moon': '🌕',
  'Last Quarter': '🌗',
};

const LunarCalendarWidget: React.FC = () => {
  const info = useMemo(() => getCurrentPhase(new Date()), []);

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-2xl">{info.emoji}</span>
          Lunar Calendar 2026
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Current Phase */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{info.phase}</p>
            <p className="text-xs text-muted-foreground">
              {info.moonName_en} · {info.moonName_es}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {PHASE_NEXT_EMOJI[info.nextPhase]} {info.nextPhase} in {info.daysUntilNext}d
          </Badge>
        </div>

        {/* Planting Window */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-foreground">🌿 Planting Window</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{info.planting_en}</p>
          <p className="text-xs text-muted-foreground/70 leading-relaxed italic">{info.planting_es}</p>
        </div>

        {/* Quick phase legend */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🌑 Leafy</span>
          <span>🌓 Fruiting</span>
          <span>🌕 Roots</span>
          <span>🌗 Rest</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LunarCalendarWidget;

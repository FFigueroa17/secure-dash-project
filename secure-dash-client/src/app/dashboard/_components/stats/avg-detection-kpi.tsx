'use client';

import { Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AvgDetectionKpiProps {
  value: number;
}

export function AvgDetectionKpi({ value }: AvgDetectionKpiProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [hasIncreased, setHasIncreased] = useState<boolean | null>(null);

  useEffect(() => {
    if (prevValue !== value) {
      setHasIncreased(value > prevValue);
      setPrevValue(value);

      // Reset the animation state after animation completes
      const timer = setTimeout(() => {
        setHasIncreased(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  // Determine if detection time is good, medium or slow
  const getPerformanceLevel = (time: number) => {
    if (time <= 2) return 'good';
    if (time <= 4) return 'medium';
    return 'slow';
  };

  const performanceLevel = getPerformanceLevel(value);

  // Performance level colors based on design system
  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'good':
        return 'var(--primary)';
      case 'medium':
        return 'var(--chart-4)';
      case 'slow':
        return 'var(--destructive)';
      default:
        return 'var(--primary)';
    }
  };

  const performanceColor = getPerformanceColor(performanceLevel);

  const performanceLabel =
    performanceLevel === 'good'
      ? 'Fast Response'
      : performanceLevel === 'medium'
        ? 'Normal Response'
        : 'Slow Response';

  return (
    <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Timer className="h-4 w-4" />
            Avg. Detection to Ban Time
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1">
        <div
          className={`text-6xl font-bold relative
            ${hasIncreased === true ? 'text-destructive animate-bounce-once' : ''} 
            ${hasIncreased === false ? 'text-primary animate-bounce-down-once' : ''}`}
          style={{ color: performanceColor }}
        >
          {value.toFixed(1)}
          <span className="text-xl ml-1">s</span>

          {hasIncreased !== null && (
            <span
              className={`absolute -right-6 top-0 text-lg
                ${hasIncreased ? 'text-destructive' : 'text-primary'}`}
            >
              {hasIncreased ? '↑' : '↓'}
            </span>
          )}
        </div>
        <div className="mt-4 text-center">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${performanceColor} 15%, transparent)`,
              color: performanceColor,
              border: `1px solid ${performanceColor}40`,
            }}
          >
            {performanceLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

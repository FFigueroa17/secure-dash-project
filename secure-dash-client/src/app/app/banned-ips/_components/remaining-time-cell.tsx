'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

import {
  calculateRemainingBanTime,
  formatRemainingTime,
  getRemainingTimeConfig,
} from '@/app/app/banned-ips/_lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Separate component for remaining time cell with client-side only rendering and real-time updates
export const RemainingTimeCell = ({
  banTime,
  banDuration,
}: {
  banTime: string;
  banDuration: string;
}) => {
  const [timeData, setTimeData] = React.useState<{
    remainingMs: number;
    progressPercentage: number;
    isExpired: boolean;
  } | null>(null);

  React.useEffect(() => {
    // Calculate remaining time only on client side
    const calculateAndSet = () => {
      const data = calculateRemainingBanTime(banTime, banDuration);
      setTimeData(data);
    };

    // Initial calculation
    calculateAndSet();

    // Set up real-time updates every second
    const interval = setInterval(calculateAndSet, 1000);

    return () => clearInterval(interval);
  }, [banTime, banDuration]);

  // Show loading state during hydration
  if (!timeData) {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1 py-0.5 px-2 text-xs w-24 justify-center border-muted/20 bg-muted/10 text-muted-foreground"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          Calculando
        </Badge>
        <div className="w-16">
          <Progress value={0} className="h-1.5 w-16" />
        </div>
      </div>
    );
  }

  const { remainingMs, progressPercentage, isExpired } = timeData;
  const { badgeClass, label } = getRemainingTimeConfig(progressPercentage);
  const formattedTime = formatRemainingTime(remainingMs);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={cn(
          'gap-1 py-0.5 px-2 text-xs w-12 justify-center',
          badgeClass,
        )}
      >
        {formattedTime}
      </Badge>
      <Tooltip defaultOpen={false}>
        <TooltipProvider>
          <TooltipTrigger asChild>
            <div className="w-16">
              <Progress value={progressPercentage} className="h-1.5 w-24" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Estado: {label}</p>
            <p className="text-xs text-foreground">
              {isExpired
                ? 'El bloqueo ha expirado'
                : `Restante: ${formattedTime}`}
            </p>
          </TooltipContent>
        </TooltipProvider>
      </Tooltip>
    </div>
  );
};

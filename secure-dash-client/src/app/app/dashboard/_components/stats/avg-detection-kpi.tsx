'use client';

import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AvgDetectionKpiProps {
  value: number;
  previousValue?: number;
  className?: string;
}

export function AvgDetectionKpi({
  value,
  previousValue,
  className,
}: AvgDetectionKpiProps) {
  const status = useMemo(() => {
    if (value === 0)
      return { label: 'Instantáneo', color: 'text-chart-2', progress: 0 };
    if (value < 5)
      return { label: 'Excelente', color: 'text-chart-2', progress: 20 };
    if (value < 15)
      return { label: 'Bueno', color: 'text-chart-1', progress: 50 };
    if (value < 30)
      return { label: 'Regular', color: 'text-warning', progress: 75 };
    return { label: 'Lento', color: 'text-error', progress: 100 };
  }, [value]);

  const trend = useMemo(() => {
    if (previousValue === undefined || previousValue === value) return null;
    return previousValue > value ? 'improved' : 'worsened';
  }, [value, previousValue]);

  const formatValue = (seconds: number) => {
    if (seconds === 0) return 'Instantáneo';
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className={cn('shadow-sm', className)}>
        <CardHeader className="space-y-0">
          <div className="flex items-center gap-2">
            <motion.div
              className="p-1.5 rounded-md bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Clock className="h-4 w-4 text-primary" />
            </motion.div>
            <CardTitle className="text-base font-medium">
              Tiempo de detección
            </CardTitle>
            {trend && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                {trend === 'improved' ? 'Mejor' : 'Peor'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <motion.span
                className="text-xl font-medium"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {formatValue(value)}
              </motion.span>
              <p className="text-xs text-muted-foreground">
                Valor anterior: {status.label}
              </p>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            >
              <Progress value={status.progress} className="h-2" />
            </motion.div>
          </motion.div>

          <motion.div
            className="text-xs text-muted-foreground text-center py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Promedio hasta bloqueo
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

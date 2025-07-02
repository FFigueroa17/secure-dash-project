'use client';

import { Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { TrendPoint } from '@/app/app/dashboard/_lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ActivityTrendChartProps {
  data: TrendPoint[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.t * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      events: item.events,
    }));
  }, [data]);

  const totalEvents = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.events, 0);
  }, [chartData]);

  const chartConfig = {
    events: {
      label: 'Eventos',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="shadow-sm">
        <CardHeader className="space-y-0">
          <div className="flex flex-row justify-start items-center gap-2">
            <motion.div
              className="p-1.5 rounded-md bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Activity className="h-4 w-4 text-primary" />
            </motion.div>
            <CardTitle className="text-base font-medium">
              Actividad de eventos ·
            </CardTitle>
            <Badge variant="outline" className="text-xs px-2 py-1">
              <span className="font-bold text-primary">{totalEvents}</span>{' '}
              eventos detectados
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pl-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ChartContainer
              config={chartConfig}
              className="min-h-[290px] lg:max-h-[290px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="activityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={true}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: 'var(--muted-foreground)',
                    }}
                  />
                  <YAxis
                    axisLine={true}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: 'var(--muted-foreground)',
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideIndicator />}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="url(#activityGradient)"
                    strokeWidth={2.5}
                    fill="url(#activityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

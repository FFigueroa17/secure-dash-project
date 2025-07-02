'use client';

import { BarChart3, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface BanUnbanChartProps {
  data: Array<{ time: string; banRate: number; unbanRate: number }>;
  avgDetectionTime?: number;
}

// Custom tooltip content that filters out placeholder values
interface TooltipPayload {
  dataKey: string;
  value: number;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltipContent({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  // Filter out placeholder data entries by checking the actual data values
  const filteredPayload = payload.filter((entry: TooltipPayload) => {
    const dataKey = entry.dataKey;
    if (dataKey === 'banRateDisplay') {
      // Only show if the original banRate was > 0
      return entry.value > 0.05; // Our placeholder value is 0.05
    }
    if (dataKey === 'unbanRateDisplay') {
      // Only show if the original unbanRate was > 0
      return entry.value > 0.05; // Our placeholder value is 0.05
    }
    return entry.value > 0;
  });

  if (filteredPayload.length === 0) {
    return null;
  }

  return (
    <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{label}</div>
      <div className="grid gap-1.5">
        {filteredPayload.map((item: TooltipPayload) => {
          const isUnban = item.dataKey === 'unbanRateDisplay';
          const color = isUnban ? 'var(--primary)' : 'var(--destructive)';
          const label = isUnban ? 'Desbloqueos' : 'Bloqueos';

          return (
            <div
              key={item.dataKey}
              className="flex w-full flex-wrap items-center gap-2"
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-1 justify-between leading-none items-center">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground font-mono font-medium tabular-nums">
                  {Math.floor(item.value).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BanUnbanChart({
  data,
  avgDetectionTime = 0,
}: BanUnbanChartProps) {
  const chartConfig = {
    banRate: {
      label: 'Bloqueos',
      color: 'var(--destructive)',
    },
    unbanRate: {
      label: 'Desbloqueos',
      color: 'var(--primary)',
    },
    banRatePlaceholder: {
      label: 'Placeholder',
      color: 'rgb(156 163 175)',
    },
    unbanRatePlaceholder: {
      label: 'Placeholder',
      color: 'rgb(156 163 175)',
    },
  };

  // Transform data to include placeholder bars for empty values
  const transformedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      // Use the actual values or a small placeholder if zero
      banRateDisplay: item.banRate > 0 ? item.banRate : 0.05,
      unbanRateDisplay: item.unbanRate > 0 ? item.unbanRate : 0.05,
      // Track if values are placeholders for styling
      isBanPlaceholder: item.banRate === 0,
      isUnbanPlaceholder: item.unbanRate === 0,
    }));
  }, [data]);

  const stats = useMemo(() => {
    const totalBans = data.reduce((sum, item) => sum + item.banRate, 0);
    const totalUnbans = data.reduce((sum, item) => sum + item.unbanRate, 0);

    return { totalBans, totalUnbans };
  }, [data]);

  const formatDetectionTime = (seconds: number) => {
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
      <Card className="shadow-sm h-[430px] overflow-hidden">
        <CardHeader className="space-y-2">
          <div className="flex flex-row justify-start items-center gap-2">
            <motion.div
              className="p-1.5 rounded-md bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <BarChart3 className="h-4 w-4 text-primary" />
            </motion.div>
            <CardTitle className="text-base font-medium">
              Actividad de bloqueos
            </CardTitle>

            {/* Minimalist KPI Detection Time */}
            <motion.div
              className="flex ml-auto items-center justify-between px-1 py-2 rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Tiempo de detección
                </span>
                <Badge
                  className={`text-emerald-700 border-emerald-200 bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-900`}
                >
                  {formatDetectionTime(avgDetectionTime)}
                </Badge>
              </div>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pl-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ChartContainer config={chartConfig} className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transformedData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  barCategoryGap="20%"
                  barGap={16}
                >
                  <defs>
                    {/* Ban Rate Gradient */}
                    <linearGradient
                      id="banGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--destructive)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="50%"
                        stopColor="var(--destructive)"
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--destructive)"
                        stopOpacity={0.3}
                      />
                    </linearGradient>

                    {/* Unban Rate Gradient */}
                    <linearGradient
                      id="unbanGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="50%"
                        stopColor="var(--primary)"
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0.3}
                      />
                    </linearGradient>

                    {/* Gray Placeholder Gradient */}
                    <linearGradient
                      id="placeholderGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgb(156 163 175)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="rgb(107 114 128)"
                        stopOpacity={0.1}
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
                    tickFormatter={(value) => {
                      return value.toLocaleString();
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

                  {/* Use custom tooltip content */}
                  <ChartTooltip content={<CustomTooltipContent />} />

                  {/* Ban rate bars - will use placeholder styling when value is 0 */}
                  <Bar
                    dataKey="banRateDisplay"
                    radius={[3, 3, 0, 0]}
                    opacity={1}
                  >
                    {transformedData.map((entry, index) => (
                      <Cell
                        key={`ban-${index}`}
                        fill={
                          entry.isBanPlaceholder
                            ? 'url(#placeholderGradient)'
                            : 'url(#banGradient)'
                        }
                      />
                    ))}
                  </Bar>

                  {/* Unban rate bars - will use placeholder styling when value is 0 */}
                  <Bar
                    dataKey="unbanRateDisplay"
                    radius={[3, 3, 0, 0]}
                    opacity={1}
                  >
                    {transformedData.map((entry, index) => (
                      <Cell
                        key={`unban-${index}`}
                        fill={
                          entry.isUnbanPlaceholder
                            ? 'url(#placeholderGradient)'
                            : 'url(#unbanGradient)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4 text-sm px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-b from-destructive to-destructive/70" />
              <span className="text-muted-foreground">
                {stats.totalBans} bloqueos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-b from-primary to-primary/70" />
              <span className="text-muted-foreground">
                {stats.totalUnbans} desbloqueos
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

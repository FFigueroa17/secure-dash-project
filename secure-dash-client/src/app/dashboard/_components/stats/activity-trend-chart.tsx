'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { TrendPoint } from '@/app/dashboard/_lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ActivityTrendChartProps {
  data: TrendPoint[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.t * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    events: item.events,
  }));

  const chartConfig = {
    events: {
      label: 'Events',
      color: 'var(--color-primary)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Activity Trend
            </CardTitle>
            <CardDescription>Event frequency over time.</CardDescription>
          </div>
          <div className="w-fit rounded-2xl bg-muted/20 border border-border/30 flex flex-row items-center justify-center gap-4 p-3">
            <div className="flex items-center justify-center text-xs font-medium text-primary">
              Live Data
            </div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 0,
              right: 24,
            }}
          >
            <defs>
              <linearGradient id="banRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0.4}
                />
              </linearGradient>
              <linearGradient
                id="unbanRateGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.4}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="bg-primary text-foreground"
                  labelClassName="text-white!"
                />
              }
            />
            <Line
              dataKey="events"
              type="natural"
              stroke="url(#banRateGradient)"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

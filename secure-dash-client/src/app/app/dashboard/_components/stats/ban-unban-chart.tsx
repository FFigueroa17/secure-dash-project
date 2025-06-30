'use client';

import { Lock, Unlock } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface BanUnbanChartProps {
  data: Array<{ time: string; banRate: number; unbanRate: number }>;
}

export function BanUnbanChart({ data }: BanUnbanChartProps) {
  const chartConfig = {
    banRate: {
      label: 'Ban Rate',
      color: 'var(--primary)',
      icon: Lock,
    },
    unbanRate: {
      label: 'Unban Rate',
      color: 'var(--chart-3)',
      icon: Unlock,
    },
  };

  // Calculate total bans and unbans
  const totalBans = data.reduce((sum, item) => sum + item.banRate, 0);
  const totalUnbans = data.reduce((sum, item) => sum + item.unbanRate, 0);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Ban/Unban Rates
            </CardTitle>
            <CardDescription>Ban and unban rates per minute</CardDescription>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 flex gap-2 py-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <div className="flex flex-col">
                <span className="text-xs text-primary/70">Total Bans</span>
                <span className="font-medium">{totalBans}</span>
              </div>
            </Badge>
            <Badge
              variant="outline"
              className="bg-chart-3/10 text-chart-3 border-chart-3/20 flex gap-2 py-1.5"
            >
              <Unlock className="h-3.5 w-3.5" />
              <div className="flex flex-col">
                <span className="text-xs text-chart-3/70">Total Unbans</span>
                <span className="font-medium">{totalUnbans}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="var(--muted-foreground)"
            />
            <YAxis stroke="var(--muted-foreground)" tickLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'var(--muted)/0.1' }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="banRate"
              fill="url(#banRateGradient)"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={750}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="unbanRate"
              fill="url(#unbanRateGradient)"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={750}
              animationEasing="ease-out"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

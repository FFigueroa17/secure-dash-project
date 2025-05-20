import { ArrowUpRight } from 'lucide-react';

import { getFail2BanLogsOverview } from '@/app/_lib/queries';
import { formatTitle, getIcon } from '@/app/_lib/utils';
import { cn } from '@/lib/utils';
import { StatValue } from '@/schemas/log';

interface StatsCardProps {
  title: string;
  value: StatValue;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  const isPositive = value.deltaPct !== null && value.deltaPct > 0;
  const trendColor = isPositive ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        <ArrowUpRight
          className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
          size={20}
          aria-hidden="true"
        />
        {/* Icon */}
        <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500">
          {icon}
        </div>
        {/* Content */}
        <div>
          <a
            href="#"
            className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0"
          >
            {title}
          </a>
          <div className="text-2xl font-semibold mb-2">{value.value}</div>
          <div className="text-xs text-muted-foreground/60">
            <span className={cn('font-medium', trendColor)}>
              {isPositive ? '↗' : '↘'} {value.deltaPct ?? 0}%
            </span>{' '}
            vs last week
          </div>
        </div>
      </div>
    </div>
  );
}

export async function StatsGrid() {
  const stats = await getFail2BanLogsOverview();

  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {Object.entries(stats.overview).map(([key, value]) => (
        <StatsCard
          key={key}
          title={formatTitle(key)}
          value={value}
          icon={getIcon(key)}
        />
      ))}
    </div>
  );
}

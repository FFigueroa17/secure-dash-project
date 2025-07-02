import { getFail2BanLogsOverview } from '@/app/app/_lib/queries';
import { formatTitle, getIcon } from '@/app/app/_lib/utils';
import { StatsCard } from '@/components/stats/stats-cards';

export async function StatsGrid() {
  const stats = await getFail2BanLogsOverview();

  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {Object.entries(stats).map(([key, value]) => (
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

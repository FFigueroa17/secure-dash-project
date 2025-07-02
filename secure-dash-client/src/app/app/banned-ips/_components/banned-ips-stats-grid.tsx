import { Shield, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import React from 'react';

import { StatsCard } from '@/app/app/_components/stats-grid';
import { getBannedIPsOverview } from '@/app/app/banned-ips/_lib/queries';

export async function BannedIPsStatsGrid() {
  const overview = await getBannedIPsOverview();

  const stats = [
    {
      title: 'Duración (min)',
      value: overview.summary.ban_duration.toLocaleString(),
      icon: <Shield />,
      description: 'Duración promedio de los bloqueos (min)',
    },
    {
      title: 'Duración (s)',
      value: overview.summary.ban_duration_seconds.toLocaleString(),
      icon: <Users />,
      description: 'Duración promedio de los bloqueos (s)',
    },
    {
      title: 'Jails',
      value: overview.summary.jail_name.toLocaleString(),
      icon: <ShieldAlert />,
      description: 'Jails con IPs bloqueadas',
    },
    {
      title: 'IPs bloqueadas',
      value: overview.summary.total_banned_ips.toLocaleString(),
      icon: <TrendingUp />,
      description: 'IPs bloqueadas',
    },
  ];

  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

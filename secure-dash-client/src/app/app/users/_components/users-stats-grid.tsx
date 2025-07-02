import { Crown, User, Users } from 'lucide-react';
import * as React from 'react';

import { getUsersOverview } from '@/app/app/users/_lib/queries';
import { StatsCard } from '@/components/stats/stats-cards';

export async function UsersStatsGrid() {
  const { totalUsers, adminUsers, regularUsers } = await getUsersOverview();

  const stats = [
    {
      title: 'Total de Usuarios',
      value: totalUsers,
      icon: <Users />,
      description: 'Usuarios registrados en el sistema',
    },
    {
      title: 'Administradores',
      value: adminUsers,
      icon: <Crown />,
      description: 'Usuarios con permisos de administrador',
    },
    {
      title: 'Usuarios Regulares',
      value: regularUsers,
      icon: <User />,
      description: 'Usuarios con permisos básicos',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
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

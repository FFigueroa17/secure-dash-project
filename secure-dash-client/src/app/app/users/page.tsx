import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Dash | Gestión de Usuarios',
  description:
    'Administra usuarios del sistema. Crea, edita y elimina usuarios, asigna roles y gestiona permisos de manera efectiva.',
};

import React from 'react';

import { UsersStatsGrid } from '@/app/app/users/_components/users-stats-grid';
import UsersTable from '@/app/app/users/_components/users-table';
import { getUsers } from '@/app/app/users/_lib/queries';
import { usersSearchParamsCache } from '@/app/app/users/_lib/validations';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import StatsGridSkeleton from '@/components/stats-grid-skeleton';
import { SearchParams } from '@/types';

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams;
  const filterParams = usersSearchParamsCache.parse(searchParams);

  const users = getUsers({
    ...filterParams,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6 md:h-full md:min-h-0">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4 md:flex-shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Administra usuarios del sistema. Crea, edita y elimina usuarios,
            asigna roles y gestiona permisos de manera efectiva.
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="md:flex-shrink-0">
        <React.Suspense fallback={<StatsGridSkeleton />}>
          <UsersStatsGrid />
        </React.Suspense>
      </div>
      {/* Table */}
      <div className="md:flex-1 md:min-h-0">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                '10rem',
                '16rem',
                '18rem',
                '8rem',
                '10rem',
                '12rem',
                '8rem',
              ]}
              shrinkZero
            />
          }
        >
          <UsersTable promises={users} />
        </React.Suspense>
      </div>
    </div>
  );
}

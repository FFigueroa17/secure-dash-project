import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Dash | Fail2BanLogs',
  description:
    'Revisa los registros y estadísticas más recientes de Fail2Ban. Monitorea y gestiona los bloqueos de manera efectiva.',
};

import React from 'react';

import LogsTable from '@/app/app/_components/logs-table';
import { StatsGrid } from '@/app/app/_components/stats-grid';
import { getFail2BanLogs } from '@/app/app/_lib/queries';
import { searchParamsCache } from '@/app/app/_lib/validations';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import StatsGridSkeleton from '@/components/stats/stats-grid-skeleton';
import { SearchParams } from '@/types';

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const fail2BanLogs = getFail2BanLogs({
    ...search,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6 md:h-full md:min-h-0">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4 md:flex-shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Logs de Fail2Ban</h1>
          <p className="text-sm text-muted-foreground">
            Revisa los registros y estadísticas más recientes de Fail2Ban.
            Monitorea y gestiona los bloqueos de manera efectiva.
          </p>
        </div>
      </div>
      {/* Numbers */}
      <div className="md:flex-shrink-0">
        <React.Suspense fallback={<StatsGridSkeleton />}>
          <StatsGrid />
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
                '30rem',
                '10rem',
                '10rem',
                '6rem',
                '6rem',
                '6rem',
              ]}
              shrinkZero
            />
          }
        >
          <LogsTable promises={fail2BanLogs} />
        </React.Suspense>
      </div>
    </div>
  );
}

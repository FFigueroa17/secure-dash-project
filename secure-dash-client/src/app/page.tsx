import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experimento 01 - Crafted.is',
};

import React from 'react';

import LogsTable from '@/app/_components/logs-table';
import { StatsGrid } from '@/app/_components/stats-grid';
import StatsGridSkeleton from '@/app/_components/stats-grid-skeleton';
import { getFail2BanLogs } from '@/app/_lib/queries';
import { searchParamsCache } from '@/app/_lib/validations';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
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
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            Resumen de Logs de Fail2Ban
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa los registros y estadísticas más recientes de Fail2Ban.
            Monitorea y gestiona los bloqueos de manera efectiva.
          </p>
        </div>
      </div>
      {/* Numbers */}
      <React.Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </React.Suspense>
      {/* Table */}
      <div className="min-h-[100vh] flex-1 md:min-h-min">
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

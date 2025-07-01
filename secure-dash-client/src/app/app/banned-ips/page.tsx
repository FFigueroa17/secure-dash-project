import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Dash | Lista de IPs Bloqueadas',
  description:
    'Revisa las IPs bloqueadas y su información de amenaza. Monitorea reincidentes y gestiona bloqueos de manera efectiva.',
};

import React from 'react';

import { BannedIPsStatsGrid } from '@/app/app/banned-ips/_components/banned-ips-stats-grid';
import BannedIPsTable from '@/app/app/banned-ips/_components/banned-ips-table';
import { getBannedIPs } from '@/app/app/banned-ips/_lib/queries';
import { bannedIPsSearchParamsCache } from '@/app/app/banned-ips/_lib/validations';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import StatsGridSkeleton from '@/components/stats-grid-skeleton';
import { SearchParams } from '@/types';

interface BannedIPsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BannedIPsPage(props: BannedIPsPageProps) {
  const searchParams = await props.searchParams;
  const search = bannedIPsSearchParamsCache.parse(searchParams);

  const bannedIPs = getBannedIPs({
    ...search,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6 md:h-full md:min-h-0">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4 md:flex-shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Lista de IPs</h1>
          <p className="text-sm text-muted-foreground">
            Revisa las IPs bloqueadas y su información de amenaza. Monitorea
            reincidentes y gestiona bloqueos de manera efectiva.
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="md:flex-shrink-0">
        <React.Suspense fallback={<StatsGridSkeleton />}>
          <BannedIPsStatsGrid />
        </React.Suspense>
      </div>
      {/* Table */}
      <div className="md:flex-1 md:min-h-0">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={9}
              filterCount={3}
              cellWidths={[
                '10rem',
                '16rem',
                '18rem',
                '8rem',
                '10rem',
                '16rem',
                '10rem',
                '8rem',
                '8rem',
              ]}
              shrinkZero
            />
          }
        >
          <BannedIPsTable promises={bannedIPs} />
        </React.Suspense>
      </div>
    </div>
  );
}

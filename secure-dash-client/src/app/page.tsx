import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiment 01 - Crafted.is',
};

import { Ban, Circle, Shield, XCircle } from 'lucide-react';
import React from 'react';

import LogsTable from '@/app/_components/logs-table';
import { getFail2BanLogs } from '@/app/_lib/queries';
import { searchParamsCache } from '@/app/_lib/validations';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { StatsGrid } from '@/components/stats-grid';
import { getValidFilters } from '@/lib/data-table';
import { SearchParams } from '@/types';
interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const fail2BanLogs = getFail2BanLogs({
    ...search,
    filters: validFilters,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Fail2Ban Logs Overview</h1>
          <p className="text-sm text-muted-foreground">
            Review the latest logs and statistics from Fail2Ban. Monitor and
            manage bans effectively.
          </p>
        </div>
        {/* <Button className="px-3">Add Contact</Button> */}
      </div>
      {/* Numbers */}
      <StatsGrid
        stats={[
          {
            title: 'Total Failures',
            value: '427,296',
            change: {
              value: '+12%',
              trend: 'up',
            },
            icon: <XCircle size={20} aria-hidden="true" />,
          },
          {
            title: 'Total Bans',
            value: '37,429',
            change: {
              value: '+42%',
              trend: 'up',
            },
            icon: <Ban size={20} aria-hidden="true" />,
          },
          {
            title: 'Total IPs',
            value: '1,234',
            change: {
              value: '+37%',
              trend: 'up',
            },
            icon: <Circle size={20} aria-hidden="true" />,
          },
          {
            title: 'Total Jails',
            value: '1,497',
            change: {
              value: '-17%',
              trend: 'down',
            },
            icon: <Shield size={20} aria-hidden="true" />,
          },
        ]}
      />
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

'use client';

import { Download } from 'lucide-react';
import React, { useTransition } from 'react';

import { BannedIPsTableActionBar } from '@/app/app/banned-ips/_components/banned-ips-table-action-bar';
import { getBannedIPsTableColumns } from '@/app/app/banned-ips/_components/banned-ips-table-columns';
import { getBannedIPs } from '@/app/app/banned-ips/_lib/queries';
import AnimatedLoading from '@/components/animated-loading';
import DataTable from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { exportTableToCSV } from '@/lib/export';

interface BannedIPsTableProps {
  /**
   * Promise resolving to the paginated banned IPs API response.
   */
  promises: Promise<Awaited<ReturnType<typeof getBannedIPs>>>;
}

/**
 * BannedIPsTable component for displaying banned IPs in a paginated, filterable, and exportable table.
 *
 * This component leverages a generic DataTable and DataTableToolbar to provide:
 *  - Column-based filtering (text, date range, select)
 *  - Pagination and server-side data fetching
 *  - CSV export of selected rows
 *  - Banned IP details sheet for viewing individual banned IP entries
 *
 * Props:
 *   - promises: A Promise resolving to the paginated banned IPs API response.
 *
 * Usage:
 *   <BannedIPsTable promises={getBannedIPs(...)} />
 */

const BannedIPsTable = ({ promises }: BannedIPsTableProps) => {
  // Await the banned IPs data from the provided promise.
  const data = React.use(promises);
  const [isPending, startTransition] = useTransition();

  // Memoize the columns definition for the table.
  const columns = React.useMemo(
    () => getBannedIPsTableColumns({ setRowAction: () => {} }),
    [],
  );

  // Initialize the data table instance with data, columns, and config.
  const { table } = useDataTable({
    data: data.values,
    columns,
    pageCount: data.totalPages,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  return (
    <>
      <AnimatedLoading isLoading={isPending} />
      <DataTable
        table={table}
        columns={columns}
        actionBar={<BannedIPsTableActionBar table={table} />}
        isPending={isPending}
      >
        {/* DataTableToolbar provides filtering and export actions */}
        <DataTableToolbar table={table} filters={[]}>
          <>
            {/* Export button: enabled only if at least one row is selected */}
            <Button
              variant="filter"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              onClick={() =>
                exportTableToCSV(table, {
                  filename: 'banned-ips',
                  excludeColumns: ['select', 'actions'],
                  onlySelected: true,
                })
              }
            >
              <Download strokeWidth={1.5} />
              Exportar
            </Button>
          </>
        </DataTableToolbar>
      </DataTable>
    </>
  );
};

export default BannedIPsTable;

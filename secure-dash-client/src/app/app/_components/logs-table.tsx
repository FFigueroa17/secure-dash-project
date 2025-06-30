'use client';

import { Download } from 'lucide-react';
import React, { useTransition } from 'react';

import { LogsTableActionBar } from '@/app/app/_components/logs-table-action-bar';
import { getLogsTableColumns } from '@/app/app/_components/logs-table-columns';
import { getFail2BanLogs } from '@/app/app/_lib/queries';
import { getLogLevelConfig } from '@/app/app/_lib/utils';
import AnimatedLoading from '@/components/animated-loading';
import DataTable from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { exportTableToCSV } from '@/lib/export';

interface LogsTableProps {
  /**
   * Promise resolving to the paginated logs API response.
   */
  promises: Promise<Awaited<ReturnType<typeof getFail2BanLogs>>>;
}

/**
 * LogsTable component for displaying Fail2Ban logs in a paginated, filterable, and exportable table.
 *
 * This component leverages a generic DataTable and DataTableToolbar to provide:
 *  - Column-based filtering (text, date range, select)
 *  - Pagination and server-side data fetching
 *  - CSV export of selected rows
 *  - Log details sheet for viewing individual log entries
 *
 * Props:
 *   - promises: A Promise resolving to the paginated Fail2Ban logs API response.
 *
 * Usage:
 *   <LogsTable promises={getFail2BanLogs(...)} />
 */

const LogsTable = ({ promises }: LogsTableProps) => {
  // Await the logs data from the provided promise.
  const data = React.use(promises);
  const [isPending, startTransition] = useTransition();

  // Memoize the columns definition for the table.
  const columns = React.useMemo(
    () => getLogsTableColumns({ setRowAction: () => {} }),
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
        actionBar={<LogsTableActionBar table={table} />}
        isPending={isPending}
      >
        {/* DataTableToolbar provides filtering and export actions */}
        <DataTableToolbar
          table={table}
          filters={[
            {
              column: table.getColumn('message')!, // Text filter for message column
              label: 'Mensaje',
              filterType: 'text',
              placeholder: 'Buscar por mensaje',
            },
            {
              column: table.getColumn('timestamp')!, // Date range filter for timestamp
              label: 'Fecha',
              filterType: 'dateRange',
              placeholder: 'Buscar por fecha',
              position: 'left',
              disableFutureDates: true,
            },
            {
              column: table.getColumn('level')!, // Select filter for log level
              label: 'Nivel',
              filterType: 'select',
              placeholder: 'Buscar por nivel',
              position: 'left',
              options: [
                {
                  label: 'INFO',
                  value: 'INFO',
                  icon: getLogLevelConfig('INFO').icon,
                },
                {
                  label: 'DEBUG',
                  value: 'DEBUG',
                  icon: getLogLevelConfig('DEBUG').icon,
                },
                {
                  label: 'NOTICE',
                  value: 'NOTICE',
                  icon: getLogLevelConfig('NOTICE').icon,
                },
                {
                  label: 'ERROR',
                  value: 'ERROR',
                  icon: getLogLevelConfig('ERROR').icon,
                },
                {
                  label: 'WARNING',
                  value: 'WARNING',
                  icon: getLogLevelConfig('WARNING').icon,
                },
              ],
            },
          ]}
        >
          <>
            {/* Export button: enabled only if at least one row is selected */}
            <Button
              variant="filter"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              onClick={() =>
                exportTableToCSV(table, {
                  filename: 'fail2ban-logs',
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

export default LogsTable;

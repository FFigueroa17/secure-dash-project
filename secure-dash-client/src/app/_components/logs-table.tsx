'use client';

/**
 * LogsTable component for displaying Fail2Ban logs in a paginated, filterable, and exportable table.
 *
 * This component leverages a generic DataTable and DataTableToolbar to provide:
 *  - Column-based filtering (text, date range, select)
 *  - Pagination and server-side data fetching
 *  - CSV export of selected rows
 *
 * Props:
 *   - promises: A Promise resolving to the paginated Fail2Ban logs API response.
 *
 * Usage:
 *   <LogsTable promises={getFail2BanLogs(...)} />
 */

import { Download, Info } from 'lucide-react';
import React from 'react';

import { getLogsTableColumns } from '@/app/_components/logs-table-columns';
import { getFail2BanLogs } from '@/app/_lib/queries';
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
 * LogsTable displays Fail2Ban logs with filtering and export capabilities.
 */
const LogsTable = ({ promises }: LogsTableProps) => {
  // Await the logs data from the provided promise.
  const data = React.use(promises);

  // Memoize the columns definition for the table.
  // setRowAction is a no-op here, but could be used for row actions in the future.
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
  });

  return (
    <DataTable table={table} columns={columns} actionBar={<></>}>
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
              { label: 'INFO', value: 'INFO', icon: Info },
              { label: 'DEBUG', value: 'DEBUG', icon: Info },
              { label: 'NOTICE', value: 'NOTICE', icon: Info },
              { label: 'ERROR', value: 'ERROR', icon: Info },
              { label: 'WARNING', value: 'WARNING', icon: Info },
            ],
          },
        ]}
      >
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
      </DataTableToolbar>
    </DataTable>
  );
};

export default LogsTable;

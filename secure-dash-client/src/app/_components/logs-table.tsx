'use client';

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
  promises: Promise<Awaited<ReturnType<typeof getFail2BanLogs>>>;
}

const LogsTable = ({ promises }: LogsTableProps) => {
  const data = React.use(promises);

  const columns = React.useMemo(
    () => getLogsTableColumns({ setRowAction: () => {} }),
    [],
  );

  const { table } = useDataTable({
    data: data.values,
    columns,
    pageCount: data.totalPages,
    getRowId: (originalRow) => originalRow.message,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} columns={columns} actionBar={<></>}>
      <DataTableToolbar
        table={table}
        filters={[
          {
            column: table.getColumn('message')!, // Table.getColumn() returns  the actual Column object
            label: 'Mensaje',
            filterType: 'text',
            placeholder: 'Buscar por mensaje',
          },
          {
            column: table.getColumn('timestamp')!,
            label: 'Fecha',
            filterType: 'dateRange',
            placeholder: 'Buscar por fecha',
            position: 'left',
            disableFutureDates: true,
          },
          {
            column: table.getColumn('level')!,
            label: 'Nivel',
            filterType: 'select',
            placeholder: 'Buscar por nivel',
            position: 'left',
            options: [
              { label: 'INFO', value: 'INFO', icon: Info },
              { label: 'DEBUG', value: 'DEBUG', icon: Info },
              { label: 'ERROR', value: 'ERROR', icon: Info },
              { label: 'NOTICE', value: 'NOTICE', icon: Info },
              { label: 'UNKNOWN', value: 'UNKNOWN', icon: Info },
            ],
          },
        ]}
      >
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

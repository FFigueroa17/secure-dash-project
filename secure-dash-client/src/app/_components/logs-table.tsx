'use client';

import React from 'react';

import { getLogsTableColumns } from '@/app/_components/logs-table-columns';
import { getFail2BanLogs } from '@/app/_lib/queries';
import DataTable from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

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
            position: 'right',
          },
          {
            column: table.getColumn('level')!,
            label: 'Nivel',
            filterType: 'select',
            placeholder: 'Buscar por nivel',
            options: [
              { label: 'INFO', value: 'INFO' },
              { label: 'DEBUG', value: 'DEBUG' },
              { label: 'ERROR', value: 'ERROR' },
              { label: 'NOTICE', value: 'NOTICE' },
              { label: 'UNKNOWN', value: 'UNKNOWN' },
            ],
            position: 'right',
          },
        ]}
      />
    </DataTable>
  );
};

export default LogsTable;

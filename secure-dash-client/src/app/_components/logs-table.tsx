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
    data: data.data,
    columns,
    pageCount: data.pageCount,
    initialState: {
      sorting: [{ id: 'timestamp', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.rawMessage,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} columns={columns} actionBar={<></>}>
      <DataTableToolbar table={table} filters={[]} />
    </DataTable>
  );
};

export default LogsTable;

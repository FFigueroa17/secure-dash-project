'use client';

import { Download } from 'lucide-react';
import * as React from 'react';

import { UsersTableActionBar } from '@/app/app/users/_components/users-table-action-bar';
import { getUsersTableColumns } from '@/app/app/users/_components/users-table-columns';
import AnimatedLoading from '@/components/animated-loading';
import DataTable from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { exportTableToCSV } from '@/lib/export';
import { APIResponse } from '@/schemas/log';
import { User } from '@/schemas/user';

interface UsersTableProps {
  promises: Promise<APIResponse<User>>;
}

export default function UsersTable({ promises }: UsersTableProps) {
  // Await the banned IPs data from the provided promise.
  const data = React.use(promises);
  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns definition for the table.
  const columns = React.useMemo(
    () => getUsersTableColumns({ setRowAction: () => {} }),
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
        actionBar={<UsersTableActionBar table={table} />}
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
                  filename: 'users.csv',
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
}

'use client';

import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import * as React from 'react';

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar';
import { Separator } from '@/components/ui/separator';
import { exportTableToCSV } from '@/lib/export';
import { User } from '@/schemas/user';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = ['download'] as const;
type Action = (typeof actions)[number];

interface UsersTableActionBarProps {
  table: Table<User>;
}

export function UsersTableActionBar({ table }: UsersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onDownload = React.useCallback(() => {
    setCurrentAction('download');
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
        filename: 'users.csv',
      });
    });
  }, [table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Descargar"
          isPending={getIsActionPending('download')}
          onClick={onDownload}
        >
          <Download />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}

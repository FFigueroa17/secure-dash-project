'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Check, CircleAlert, Ellipsis } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ParsedFail2BanLog } from '@/schemas/log';
import type { DataTableRowAction } from '@/types/data-table';

interface GetLogsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ParsedFail2BanLog> | null>
  >;
}

export function getLogsTableColumns(
  {
    // setRowAction,
  }: GetLogsTableColumnsProps,
): ColumnDef<ParsedFail2BanLog>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Date',
      accessorKey: 'timestamp',
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        const formattedDate = formatDate(timestamp, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground font-medium">
                {formattedDate}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Full timestamp: {new Date(timestamp).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 180,
    },
    {
      header: 'Service',
      accessorKey: 'service',
      cell: ({ row }) => (
        <span className="text-muted-foreground capitalize">
          {row.getValue('service')}
        </span>
      ),
    },
    {
      header: 'PID',
      accessorKey: 'pid',
      cell: ({ row }) => {
        const pid = row.getValue('pid') as string | null;
        return (
          <Badge variant="secondary" className="font-mono">
            {pid}
          </Badge>
        );
      },
    },
    {
      header: 'Event Type',
      accessorKey: 'eventType',
      cell: ({ row }) => {
        const eventType = row.getValue('eventType') as string | null;
        return (
          <Badge variant="secondary" className="font-mono">
            {eventType}
          </Badge>
        );
      },
    },
    {
      header: 'Total Failures',
      accessorKey: 'totalFailures',
      cell: ({ row }) => {
        const totalFailures = row.getValue('totalFailures') as number | null;
        return (
          <Badge variant="secondary" className="font-mono">
            {totalFailures}
          </Badge>
        );
      },
    },
    {
      header: 'IP Details',
      accessorKey: 'ip',
      cell: ({ row }) => {
        const ip = row.getValue('ip') as string | null;
        return (
          <div className="flex flex-col gap-1">
            <Badge
              variant="outline"
              className="font-mono text-xs whitespace-nowrap"
            >
              {ip}
            </Badge>
          </div>
        );
      },
    },
    {
      header: 'Level',
      accessorKey: 'level',
      cell: ({ row }) => (
        <div className="flex items-center h-full">
          <Badge
            variant="outline"
            className={cn(
              'gap-1 py-0.5 px-2 text-sm',
              row.original.level === 'info'
                ? 'text-muted-foreground'
                : 'text-primary-foreground',
            )}
          >
            {row.original.level === 'info' && (
              <Check
                className="text-emerald-500"
                size={14}
                aria-hidden="true"
              />
            )}
            {row.original.level === 'warn' && (
              <CircleAlert
                className="text-yellow-500"
                size={14}
                aria-hidden="true"
              />
            )}
            {row.original.level === 'error' && (
              <CircleAlert
                className="text-red-500"
                size={14}
                aria-hidden="true"
              />
            )}
            {row.original.level}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Message',
      accessorKey: 'rawMessage',
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground line-clamp-1">
              {row.getValue('rawMessage')}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            {row.getValue('rawMessage')}
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: () => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shadow-none text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                  aria-label="Row actions"
                >
                  <Ellipsis className="size-5" size={20} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                // onClick={() => setRowAction({ row: row, variant: 'update' })}
                >
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                // onClick={() => setRowAction({ row: row, variant: 'delete' })}
                >
                  Delete log
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 60,
      enableHiding: false,
    },
  ];
}

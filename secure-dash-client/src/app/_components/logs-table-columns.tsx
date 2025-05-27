'use client';

import type { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import { LogDetailsSheet } from '@/app/_components/log-details-sheet';
import { getLogLevelConfig } from '@/app/_lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Fail2BanLog } from '@/schemas/log';
import type { DataTableRowAction } from '@/types/data-table';

interface GetLogsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Fail2BanLog> | null>
  >;
}

export function getLogsTableColumns(
  {
    // setRowAction,
  }: GetLogsTableColumnsProps,
): ColumnDef<Fail2BanLog>[] {
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
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'timestamp',
      header: 'Fecha',
      accessorKey: 'timestamp',
      enableColumnFilter: true,
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
              <p>
                Fecha y hora completa: {new Date(timestamp).toLocaleString()}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 180,
    },
    {
      header: 'Servicio',
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
      header: 'Tipo de Evento',
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
      header: 'Detalles IP',
      accessorKey: 'ip',
      cell: ({ row }) => {
        const ip = row.getValue('ip') as string | null;

        if (!ip)
          return (
            <Badge variant="outline" className="font-mono text-xs opacity-75">
              {'Sin detalles de IP'}
            </Badge>
          );

        return (
          <div className="flex gap-2 items-center flex-row justify-start">
            <Badge
              variant="outline"
              className="font-mono text-xs whitespace-nowrap"
            >
              {ip}
            </Badge>
            <CopyButton value={ip} tooltipMessage={`Copiar IP: ${ip}`} />
          </div>
        );
      },
    },
    {
      id: 'level',
      header: 'Nivel',
      accessorKey: 'level',
      enableColumnFilter: true,
      cell: ({ row }) => {
        const level = row.getValue('level') as string;
        const { icon, badgeClass } = getLogLevelConfig(level);

        return (
          <div className="flex items-center h-full">
            <Badge
              variant="outline"
              className={cn('gap-1 py-0.5 px-2 text-sm', badgeClass)}
            >
              {icon}
              {level}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'message',
      header: 'Mensaje',
      accessorKey: 'message',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground line-clamp-1">
              {row.getValue('message')}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            {row.getValue('message')}
          </TooltipContent>
        </Tooltip>
      ),
      size: 200,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        return <LogDetailsSheet log={row.original || null} />;
        // return (
        //   <div className="flex justify-end">
        //     <DropdownMenu>
        //       <DropdownMenuTrigger asChild>
        //         <Button
        //           size="icon"
        //           variant="ghost"
        //           className="shadow-none text-muted-foreground/60 hover:bg-muted hover:text-foreground"
        //           aria-label="Acciones de fila"
        //         >
        //           <Ellipsis className="size-5" size={20} aria-hidden="true" />
        //         </Button>
        //       </DropdownMenuTrigger>
        //       <DropdownMenuContent align="end">
        //         <DropdownMenuItem asChild>
        //           {/* Log Details Sheet */}
        //           <LogDetailsSheet log={row.original || null} />
        //         </DropdownMenuItem>
        //       </DropdownMenuContent>
        //     </DropdownMenu>
        //   </div>
        // );
      },
      size: 80,
      enableHiding: false,
    },
  ];
}

'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  CircleAlert,
  Ellipsis,
  FileText,
  Info,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
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
import { Fail2BanLog } from '@/schemas/log';
import type { DataTableRowAction } from '@/types/data-table';

interface GetLogsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Fail2BanLog> | null>
  >;
}

// Helper function to get log level styling and icon
const getLogLevelConfig = (level: string) => {
  switch (level) {
    case 'INFO':
      return {
        icon: <FileText className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'DEBUG':
      return {
        icon: <Info className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'NOTICE':
      return {
        icon: <Info className="text-warning" size={14} aria-hidden="true" />,
        badgeClass: 'border-warning/20 text-warning',
      };
    case 'WARNING':
      return {
        icon: (
          <AlertTriangle
            className="text-amber-500"
            size={14}
            aria-hidden="true"
          />
        ),
        badgeClass: 'border-amber-100 text-amber-700',
      };
    case 'ERROR':
      return {
        icon: (
          <CircleAlert className="text-error" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-error/20 text-error',
      };
    default:
      return {
        icon: (
          <CircleAlert className="text-info" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-info/20 text-info',
      };
  }
};

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
      cell: () => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shadow-none text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                  aria-label="Acciones de fila"
                >
                  <Ellipsis className="size-5" size={20} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                // onClick={() => setRowAction({ row: row, variant: 'update' })}
                >
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem
                // onClick={() => setRowAction({ row: row, variant: 'delete' })}
                >
                  Eliminar log
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

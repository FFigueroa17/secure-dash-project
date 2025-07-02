'use client';

import type { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import { BannedIPDetailsSheet } from '@/app/app/banned-ips/_components/banned-ip-details-sheet';
import {
  formatThreatScore,
  getAttackFrequencyConfig,
  getThreatLevelConfig,
} from '@/app/app/banned-ips/_lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BannedIP } from '@/schemas/log';
import type { DataTableRowAction } from '@/types/data-table';

interface GetBannedIPsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<BannedIP> | null>
  >;
}

export function getBannedIPsTableColumns(
  {
    // setRowAction,
  }: GetBannedIPsTableColumnsProps,
): ColumnDef<BannedIP>[] {
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
      id: 'ip',
      header: 'IP',
      accessorKey: 'ip',
      enableColumnFilter: true,
      cell: ({ row }) => {
        const ip = row.getValue('ip') as string;

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
      size: 100,
    },
    {
      id: 'ban_time',
      header: 'Fecha de bloqueo',
      accessorKey: 'ban_time',
      enableColumnFilter: true,
      cell: ({ row }) => {
        const banTime = row.getValue('ban_time') as string;
        const date = new Date(banTime);
        const formattedDate = date.toLocaleString('es-MX', {
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
              <p>Fecha y hora completa: {date.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 100,
    },
    {
      header: 'Jail',
      accessorKey: 'jail',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.getValue('jail')}
        </Badge>
      ),
      size: 80,
    },
    {
      header: 'Duración',
      accessorKey: 'ban_duration_time',
      cell: ({ row }) => {
        const duration = row.getValue('ban_duration_time') as string;
        return (
          <Badge variant="outline" className="text-xs">
            {duration}
          </Badge>
        );
      },
      size: 80,
    },
    {
      header: 'Nivel de amenaza',
      accessorKey: 'threat_level',
      cell: ({ row }) => {
        const threatLevel = row.original.threat_level;
        const { icon, badgeClass, label } = getThreatLevelConfig(
          threatLevel.level,
        );

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('gap-1 py-0.5 px-2 text-xs', badgeClass)}
            >
              {icon}
              {label}
            </Badge>
            <Tooltip defaultOpen={false}>
              <TooltipProvider>
                <TooltipTrigger asChild>
                  <div className="w-16">
                    <Progress
                      value={(threatLevel.score / threatLevel.max_score) * 100}
                      className="h-1.5"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Puntuación:{' '}
                    {formatThreatScore(
                      threatLevel.score,
                      threatLevel.max_score,
                    )}
                  </p>
                </TooltipContent>
              </TooltipProvider>
            </Tooltip>
          </div>
        );
      },
      size: 110,
    },
    {
      header: 'Frecuencia',
      accessorKey: 'reputation',
      cell: ({ row }) => {
        const reputation = row.original.reputation;
        const { badgeClass, label } = getAttackFrequencyConfig(
          reputation.attack_frequency,
        );

        return (
          <Badge
            variant="outline"
            className={cn('uppercase gap-1 py-0.5 px-2 text-sm', badgeClass)}
          >
            {label}
          </Badge>
        );
      },
      size: 110,
    },
    {
      header: 'Reincidente',
      accessorKey: 'is_repeat_offender',
      cell: ({ row }) => {
        const isRepeat = row.original.reputation.is_repeat_offender;
        return (
          <Badge
            variant={isRepeat ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {isRepeat ? 'Sí' : 'No'}
          </Badge>
        );
      },
      size: 80,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return <BannedIPDetailsSheet bannedIP={row.original || null} />;
      },
      size: 80,
      enableHiding: false,
    },
  ];
}

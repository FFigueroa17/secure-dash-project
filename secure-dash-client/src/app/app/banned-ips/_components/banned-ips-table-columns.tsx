'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, LockOpen } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { BannedIPDetailsSheet } from '@/app/app/banned-ips/_components/banned-ip-details-sheet';
import { unbanIp } from '@/app/app/banned-ips/_lib/actions';
import {
  formatThreatScore,
  getAttackFrequencyConfig,
  getThreatLevelConfig,
} from '@/app/app/banned-ips/_lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { tryCatch } from '@/types/try-catch';

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
      size: 140,
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
      size: 180,
    },
    {
      header: 'Jail',
      accessorKey: 'jail',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.getValue('jail')}
        </Badge>
      ),
      size: 60,
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
      size: 100,
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
      size: 140,
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
      size: 140,
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
      size: 110,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <BannedIPDetailsSheet bannedIP={row.original || null} />
            <UnbanIPButton ip={row.original.ip} />
          </div>
        );
      },
      size: 80,
      enableHiding: false,
      enableSorting: false,
    },
  ];
}

const UnbanIPButton = ({ ip }: { ip: string }) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const handleUnbanIp = async () => {
    startTransition(async () => {
      toast.promise(tryCatch(unbanIp(ip)), {
        loading: 'Desbloqueando IP...',
        success: 'IP desbloqueada correctamente',
        error: 'Error al desbloquear IP',
      });
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipProvider>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LockOpen className="size-4" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Desbloquear IP {ip}</TooltipContent>
        </TooltipProvider>
      </Tooltip>
      <PopoverContent className="w-fit" align="end">
        <div className="space-y-4 max-w-72">
          <div className="space-y-2">
            <h4 className="font-medium text-destructive">Cuidado!</h4>
            <p className="text-xs text-muted-foreground">
              Estás a punto de desbloquear la IP <strong>{ip}</strong>. Esta
              acción eliminará todas las reglas de bloqueo asociadas y permitirá
              que esta IP acceda nuevamente al sistema.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleUnbanIp}
              disabled={isPending}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Desbloqueando...
                </>
              ) : (
                'Confirmar desbloqueo'
              )}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              size="sm"
              disabled={isPending}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

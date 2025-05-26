'use client';

import {
  AlertTriangle,
  Calendar,
  CircleAlert,
  Eye,
  FileText,
  Hash,
  Info,
  MessageSquare,
  Network,
  Server,
  Tag,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Fail2BanLog } from '@/schemas/log';

interface LogDetailsSheetProps {
  /**
   * The log entry to display details for
   */
  log: Fail2BanLog | null;
}

// Helper function to get log level styling and icon (same as in columns)
const getLogLevelConfig = (level: string) => {
  switch (level) {
    case 'INFO':
      return {
        icon: <FileText className="text-info" size={16} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'DEBUG':
      return {
        icon: <Info className="text-info" size={16} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'NOTICE':
      return {
        icon: <Info className="text-warning" size={16} aria-hidden="true" />,
        badgeClass: 'border-warning/20 text-warning',
      };
    case 'WARNING':
      return {
        icon: (
          <AlertTriangle
            className="text-amber-500"
            size={16}
            aria-hidden="true"
          />
        ),
        badgeClass: 'border-amber-100 text-amber-700',
      };
    case 'ERROR':
      return {
        icon: (
          <CircleAlert className="text-error" size={16} aria-hidden="true" />
        ),
        badgeClass: 'border-error/20 text-error',
      };
    default:
      return {
        icon: (
          <CircleAlert className="text-info" size={16} aria-hidden="true" />
        ),
        badgeClass: 'border-info/20 text-info',
      };
  }
};

// Helper function to get event type styling
const getEventTypeConfig = (eventType: string) => {
  switch (eventType) {
    case 'Ban':
      return {
        badgeClass: 'border-error/20 text-error bg-error/5',
      };
    case 'Unban':
      return {
        badgeClass:
          'border-green-500/20 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/50',
      };
    case 'Found':
      return {
        badgeClass: 'border-warning/20 text-warning bg-warning/5',
      };
    default:
      return {
        badgeClass: 'border-muted text-muted-foreground',
      };
  }
};

/**
 * LogDetailsSheet displays detailed information about a selected log entry
 * in a slide-out sheet from the left side.
 */
export function LogDetailsSheet({ log }: LogDetailsSheetProps) {
  if (!log) return null;

  const { icon: levelIcon, badgeClass: levelBadgeClass } = getLogLevelConfig(
    log.level,
  );
  const { badgeClass: eventTypeBadgeClass } = getEventTypeConfig(log.eventType);

  const formattedDate = formatDate(log.timestamp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const fullDateTime = new Date(log.timestamp).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    timeZoneName: 'short',
  });

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" size={'icon'}>
              <Eye strokeWidth={1.5} className="size-4 " />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Ver detalles</TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="w-full sm:max-w-lg p-6 rounded-xl">
        <SheetHeader className="px-0">
          <SheetTitle>Detalles del Log</SheetTitle>
          <SheetDescription>
            Información detallada del registro de Fail2Ban seleccionado.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Timestamp Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Fecha y Hora</h3>
            </div>
            <div className="pl-6 space-y-2">
              <p className="text-sm font-medium">{formattedDate}</p>
              <p className="text-xs text-muted-foreground">{fullDateTime}</p>
            </div>
          </div>

          <Separator />

          {/* Service and PID Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Server className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Servicio y Proceso</h3>
            </div>
            <div className="pl-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Servicio:</span>
                <Badge variant="secondary" className="capitalize">
                  {log.service}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">PID:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {log.pid || 'N/A'}
                  </Badge>
                  {log.pid && (
                    <CopyButton
                      value={log.pid.toString()}
                      tooltipMessage={`Copiar PID: ${log.pid}`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Level and Event Type Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Clasificación</h3>
            </div>
            <div className="pl-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nivel:</span>
                <Badge
                  variant="outline"
                  className={cn('gap-1.5 py-1 px-2', levelBadgeClass)}
                >
                  {levelIcon}
                  {log.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tipo de Evento:
                </span>
                <Badge
                  variant="outline"
                  className={cn('py-1 px-2', eventTypeBadgeClass)}
                >
                  {log.eventType}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* IP Address Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Network className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Dirección IP</h3>
            </div>
            <div className="pl-6">
              {log.ip ? (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-sm whitespace-nowrap"
                  >
                    {log.ip}
                  </Badge>
                  <CopyButton
                    value={log.ip}
                    tooltipMessage={`Copiar IP: ${log.ip}`}
                  />
                </div>
              ) : (
                <Badge
                  variant="outline"
                  className="font-mono text-xs opacity-75"
                >
                  Sin detalles de IP
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Message Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Mensaje</h3>
            </div>
            <div className="pl-6">
              <div className="relative">
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {log.message}
                </p>
                <div className="absolute top-0 right-0">
                  <CopyButton
                    value={log.message}
                    tooltipMessage="Copiar mensaje completo"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Raw Data Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Datos Técnicos</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium">Timestamp ISO:</span>{' '}
                  {log.timestamp}
                </p>
                <p>
                  <span className="font-medium">Timestamp Unix:</span>{' '}
                  {Math.floor(new Date(log.timestamp).getTime() / 1000)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

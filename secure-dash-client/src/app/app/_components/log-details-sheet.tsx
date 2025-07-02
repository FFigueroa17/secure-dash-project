'use client';

import { Copy, Eye, Network, Server, X } from 'lucide-react';
import * as React from 'react';

import { getLogLevelConfig } from '@/app/app/_lib/utils';
import { ActionButton } from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { formatDate } from '@/lib/format';
import { cn, copyToClipboard } from '@/lib/utils';
import { Fail2BanLog } from '@/schemas/log';

interface LogDetailsSheetProps {
  /**
   * The log entry to display details for
   */
  log: Fail2BanLog;
}

// Section component for consistent spacing and icons
const Section = ({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('space-y-4 w-full', className)}>
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// Info item component for consistent key-value pairs
const InfoItem = ({
  label,
  value,
  className,
  copyable = false,
}: {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
  copyable?: boolean;
}) => (
  <div className={cn('space-y-2', className)}>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </p>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{value}</span>
      {copyable && typeof value === 'string' && (
        <CopyButton value={value} tooltipMessage={`Copiar: ${value}`} />
      )}
    </div>
  </div>
);

/**
 * LogDetailsSheet displays detailed information about a selected log entry
 * in a slide-out drawer from the right side.
 */
export function LogDetailsSheet({ log }: LogDetailsSheetProps) {
  const { icon: levelIcon } = getLogLevelConfig(log.level);

  const logDate = new Date(log.timestamp);
  const formattedLogDate = formatDate(log.timestamp, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedLogTime = logDate.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullDateTime = new Date(log.timestamp).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    timeZoneName: 'short',
  });

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only">Ver detalles del log</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className="px-5 pt-6 pb-0">
          <DrawerTitle className="text-xl font-bold text-left flex items-center gap-2">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            Ver detalles del log
          </DrawerTitle>
          <DrawerDescription className="text-base text-muted-foreground text-left">
            Información detallada del registro de Fail2Ban seleccionado
          </DrawerDescription>
        </DrawerHeader>

        {/* Content */}
        <div className="flex flex-col items-start justify-start gap-10 p-5 pt-8 h-full">
          {/* Service and Timestamp Information */}
          <Section
            icon={<Server className="h-4 w-4 text-muted-foreground" />}
            title="Información del Servicio"
          >
            <div className="grid grid-cols-2 gap-x-0 gap-4 w-full">
              <InfoItem label="PID" value={log.pid || 'N/A'} />
              <InfoItem label="Servicio" value={log.service} />
              <InfoItem
                label="Fecha"
                value={
                  <div>
                    <div className="font-medium">{formattedLogDate}</div>
                    <div className="text-sm text-foreground">
                      {formattedLogTime}
                    </div>
                  </div>
                }
              />
              <InfoItem label="Timestamp Completo" value={fullDateTime} />

              <InfoItem label="Tipo de evento" value={log.eventType} />

              <InfoItem
                label="Nivel"
                value={
                  <Badge
                    variant="outline"
                    className={cn('gap-2 py-0.5 px-2 text-xs font-medium')}
                  >
                    {levelIcon}
                    {log.level}
                  </Badge>
                }
              />
            </div>
          </Section>

          {/* IP Address Section */}
          <Section
            icon={<Network className="h-4 w-4 text-muted-foreground" />}
            title="Dirección IP"
          >
            <div className="space-y-4">
              {log.ip ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">
                    {log.ip}
                  </span>
                  <ActionButton
                    icon={Copy}
                    onAction={() => copyToClipboard(log.ip || 'N/A')}
                    tooltipMessage="Copiar IP"
                    iconSize={12}
                  />
                </div>
              ) : (
                <InfoItem label="Dirección IP" value="Sin detalles de IP" />
              )}

              <div className="space-y-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed text-muted-foreground bg-muted/30 rounded-lg p-4 max-h-64 overflow-y-auto border flex justify-between">
                  {log.message}
                  <CopyButton
                    value={log.message}
                    tooltipMessage="Copiar mensaje completo"
                  />
                </pre>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <DrawerFooter className="flex flex-row gap-3 p-0 mt-auto w-full">
            <DrawerClose asChild>
              <Button variant="secondary" className="w-full">
                <X className="h-3.5 w-3.5" />
                Cerrar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

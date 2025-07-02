'use client';

import { Calendar, Clock, Eye, MapPin, Shield } from 'lucide-react';
import React from 'react';

import {
  formatThreatScore,
  getAttackFrequencyConfig,
  getThreatLevelConfig,
} from '@/app/app/banned-ips/_lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { BannedIP } from '@/schemas/log';

interface BannedIPDetailsSheetProps {
  bannedIP: BannedIP | null;
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
  <div className={cn('space-y-4', className)}>
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
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
  <div className={cn('space-y-1', className)}>
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

// Stats card component for metric display
const StatCard = ({
  value,
  label,
  variant = 'default',
}: {
  value: string | number;
  label: string;
  variant?: 'default' | 'destructive' | 'success';
}) => {
  const valueClasses = {
    default: 'text-primary',
    destructive: 'text-destructive',
    success: 'text-primary',
  };

  return (
    <Card className="p-3 text-center">
      <div
        className={cn('text-2xl font-mono font-bold', valueClasses[variant])}
      >
        {value}
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
    </Card>
  );
};

export function BannedIPDetailsSheet({ bannedIP }: BannedIPDetailsSheetProps) {
  if (!bannedIP) {
    return null;
  }

  const {
    icon: threatIcon,
    badgeClass: threatBadgeClass,
    label: threatLabel,
  } = getThreatLevelConfig(bannedIP.threat_level.level);
  const { label: frequencyLabel } = getAttackFrequencyConfig(
    bannedIP.reputation.attack_frequency,
  );

  const banDate = new Date(bannedIP.ban_time);
  const formattedBanDate = formatDate(bannedIP.ban_time, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedBanTime = banDate.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const firstSeenDate = formatDate(bannedIP.reputation.first_seen, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const lastBanDate = bannedIP.reputation.last_ban_before
    ? formatDate(bannedIP.reputation.last_ban_before, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only">Ver detalles de IP bloqueada</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-7xl mx-auto flex flex-col h-[65vh]">
        {/* Header */}
        <DrawerHeader className="px-8 py-3.5">
          <DrawerTitle className="text-2xl font-bold text-left">
            IP bloqueada
          </DrawerTitle>
          <DrawerDescription className="text-base text-muted-foreground text-left">
            Información completa sobre la IP bloqueada y su historial de
            amenazas
          </DrawerDescription>
        </DrawerHeader>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-4 gap-16 p-8">
          {/* Left Column */}
          {/* IP Information */}
          <Section
            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            title="Información de la IP"
          >
            <div className="">
              {/* Primary IP Display */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Dirección IP
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold">
                      {bannedIP.ip}
                    </span>
                    <CopyButton
                      value={bannedIP.ip}
                      tooltipMessage={`Copiar IP: ${bannedIP.ip}`}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Intentos Fallidos
                  </p>
                  <p className="text-3xl font-bold text-destructive">
                    {bannedIP.failed_attempts}
                  </p>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Secondary Info Grid */}
              <div className="grid grid-cols-3 gap-4">
                <InfoItem label="Jail" value={bannedIP.jail} />
                <InfoItem
                  label="Fecha"
                  value={
                    <div>
                      <div className="font-medium">{formattedBanDate}</div>
                      <div className="text-xs text-muted-foreground">
                        {formattedBanTime}
                      </div>
                    </div>
                  }
                />
                <InfoItem label="Duración" value={bannedIP.ban_duration_time} />
                <InfoItem
                  label="Reincidente"
                  value={bannedIP.reputation.is_repeat_offender ? 'Sí' : 'No'}
                />
                <InfoItem label="Frecuencia" value={frequencyLabel} />
              </div>
            </div>
          </Section>

          {/* Right Column - Threat Level  */}
          <Section
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
            title="Nivel de Amenaza"
          >
            <div className="space-y-4">
              <Badge
                variant="outline"
                className={cn(
                  'gap-2 py-2 px-3 text-sm font-semibold',
                  threatBadgeClass,
                )}
              >
                {threatIcon}
                {threatLabel}
              </Badge>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font text-muted-foreground">
                    Puntuación de Amenaza
                  </span>
                  <span className="font-bold">
                    {formatThreatScore(
                      bannedIP.threat_level.score,
                      bannedIP.threat_level.max_score,
                    )}
                  </span>
                </div>
                <Progress
                  value={
                    (bannedIP.threat_level.score /
                      bannedIP.threat_level.max_score) *
                    100
                  }
                  className="h-3"
                />
              </div>

              <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-muted-foreground bg-muted/30 rounded-lg p-4 max-h-64 overflow-y-auto border flex justify-between ">
                {bannedIP.raw_log}
                <CopyButton
                  value={bannedIP.raw_log}
                  tooltipMessage="Copiar log completo"
                />
              </pre>
            </div>
          </Section>

          {/* Reputation & History */}
          <Section
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
            title="Reputación e Historial"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard
                value={bannedIP.reputation.previous_bans_count}
                label="Bloqueos Previos"
                variant="default"
              />
              <StatCard
                value={bannedIP.reputation.total_bans_ever}
                label="Total Bloqueos"
                variant="default"
              />
            </div>
          </Section>

          <Section
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            title="Historial de Fechas"
          >
            {/* Date Information */}
            <div className="space-y-4">
              <InfoItem
                label="Primera Vez Visto"
                value={
                  <div>
                    <div className="font-medium">{firstSeenDate}</div>
                    <div className="text-xs text-muted-foreground">
                      Hace {bannedIP.reputation.days_since_first_seen} días
                    </div>
                  </div>
                }
              />

              {lastBanDate && (
                <InfoItem
                  label="Último Bloqueo"
                  value={
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{lastBanDate}</span>
                    </div>
                  }
                />
              )}
            </div>
          </Section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

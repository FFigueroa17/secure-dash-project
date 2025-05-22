'use client';

import { LucideShieldAlert } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Alert } from '@/app/realtime-logs/_lib/types';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';

interface AlertsToastProps {
  alerts: Alert[];
}

export function AlertsToast({ alerts }: AlertsToastProps) {
  useEffect(() => {
    alerts.forEach((alert) => {
      toast.error('Alerta de seguridad', {
        duration: 10000,
        position: 'bottom-right',
        className: 'gap-6!',
        description: (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex flex-row flex-wrap gap-x-2 gap-y-1 items-center justify-start">
                IP:
                <div className="flex items-center justify-center gap-2 w-fit">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs whitespace-nowrap"
                  >
                    {alert.ip}
                  </Badge>{' '}
                  <CopyButton
                    value={alert.ip}
                    tooltipMessage={`Copy IP: ${alert.ip}`}
                  />
                </div>
                posee {alert.bansLastHour} ban(s) en la última hora.
              </span>
            </div>
          </div>
        ),
        icon: <AlertIcon />,
      });
    });
  }, [alerts]);

  return null; // This component only triggers toasts, it doesn't render anything
}

const AlertIcon = () => {
  return (
    <div className="relative">
      <LucideShieldAlert className="size-6 text-destructive" />
      <span className="absolute -top-1 -right-1 flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-destructive"></span>
      </span>
    </div>
  );
};

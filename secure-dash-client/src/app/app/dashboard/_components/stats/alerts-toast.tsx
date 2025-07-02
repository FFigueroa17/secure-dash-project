'use client';

import { LucideShieldAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Alert } from '@/app/app/dashboard/_lib/types';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';

interface AlertsToastProps {
  alerts: Alert[];
}

export function AlertsToast({ alerts }: AlertsToastProps) {
  // Keep track of alerts we've already shown to prevent duplicates
  const shownAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    alerts.forEach((alert) => {
      // Create unique key for each alert to prevent duplicates
      const alertKey = `${alert.ip}-${alert.bansLastHour}`;

      // Only show if we haven't shown this exact alert before
      if (!shownAlertsRef.current.has(alertKey)) {
        shownAlertsRef.current.add(alertKey);

        toast.error('Security Alert', {
          duration: 15000, // Extended duration for security alerts
          position: 'bottom-right',
          className: 'gap-6!',
          description: (
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground flex flex-row flex-wrap gap-x-2 gap-y-1 items-center justify-start">
                  High-risk IP detected:
                  <div className="flex items-center justify-center gap-2 w-fit">
                    <Badge
                      variant="destructive"
                      className="font-mono text-xs whitespace-nowrap"
                    >
                      {alert.ip}
                    </Badge>
                    <CopyButton
                      value={alert.ip}
                      tooltipMessage={`Copy IP: ${alert.ip}`}
                    />
                  </div>
                </span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 border">
                <strong>{alert.bansLastHour}</strong> ban
                {alert.bansLastHour !== 1 ? 's' : ''} detected in the last hour
              </div>
              <div className="text-xs text-amber-600 bg-amber-50 rounded-md p-2 border border-amber-200">
                Consider adding this IP to your permanent blocklist
              </div>
            </div>
          ),
          icon: <AlertIcon />,
        });
      }
    });

    // Clean up old alerts from memory (keep only last 100 to prevent memory leaks)
    if (shownAlertsRef.current.size > 100) {
      const alertsArray = Array.from(shownAlertsRef.current);
      shownAlertsRef.current = new Set(alertsArray.slice(-50));
    }
  }, [alerts]);

  // Clear shown alerts when component unmounts or alerts change significantly
  useEffect(() => {
    return () => {
      shownAlertsRef.current.clear();
    };
  }, []);

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

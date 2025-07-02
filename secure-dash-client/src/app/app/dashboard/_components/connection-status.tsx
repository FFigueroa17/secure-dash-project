'use client';

import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  RotateCcw,
  WifiOff,
} from 'lucide-react';

import { ConnectionStatus } from '@/app/app/dashboard/_lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  error?: string | null;
  lastUpdate?: Date | null;
  onReconnect?: () => void;
  className?: string;
}

export function ConnectionStatusIndicator({
  status,
  error,
  lastUpdate,
  onReconnect,
  className,
}: ConnectionStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          label: 'Connected',
          variant: 'default' as const,
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900',
          iconClassName: 'text-emerald-600 dark:text-emerald-400',
          indicatorColor: 'bg-emerald-500',
        };
      case 'connecting':
        return {
          icon: Loader2,
          label: 'Connecting...',
          variant: 'secondary' as const,
          className:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
          iconClassName: 'text-blue-600 animate-spin dark:text-blue-400',
          indicatorColor: 'bg-blue-500',
        };
      case 'reconnecting':
        return {
          icon: RotateCcw,
          label: 'Reconnecting...',
          variant: 'secondary' as const,
          className:
            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
          iconClassName: 'text-amber-600 animate-spin dark:text-amber-400',
          indicatorColor: 'bg-amber-500',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          label: 'Connection Error',
          variant: 'destructive' as const,
          className:
            'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900',
          iconClassName: 'text-red-600 dark:text-red-400',
          indicatorColor: 'bg-red-500',
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          label: 'Disconnected',
          variant: 'outline' as const,
          className:
            'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-900',
          iconClassName: 'text-gray-600 dark:text-gray-400',
          indicatorColor: 'bg-gray-500',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const showReconnectButton =
    (status === 'error' || status === 'disconnected') && onReconnect;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Badge
        variant={config.variant}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-300',
          config.className,
        )}
      >
        <div className="relative">
          <Icon className={cn('h-3.5 w-3.5', config.iconClassName)} />
          {status === 'connected' && (
            <div
              className={cn(
                'absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-pulse',
                config.indicatorColor,
              )}
            />
          )}
        </div>
        <span>{config.label}</span>
      </Badge>

      {lastUpdate && status === 'connected' && (
        <div className="hidden sm:flex items-center text-xs text-muted-foreground">
          <span>
            Last update:{' '}
            {lastUpdate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      )}

      {showReconnectButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReconnect}
          className="h-7 px-2 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}

      {error && (
        <div className="hidden md:flex items-center text-xs text-destructive">
          <span className="max-w-[200px] truncate" title={error}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

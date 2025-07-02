import { cn } from '@/lib/utils';

interface HealthCheckProps {
  isHealthy: boolean;
}

export const HealthCheck = ({ isHealthy }: HealthCheckProps) => {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-fit rounded-2xl bg-muted/20 border border-border/30 flex flex-row items-center justify-center gap-4 p-3">
      <div
        className={cn(
          'h-2 w-2 rounded-full animate-pulse',
          isHealthy
            ? 'bg-primary shadow-[0_0_8px_var(--primary)]'
            : 'bg-destructive shadow-[0_0_8px_var(--destructive)]',
        )}
      />
      <div
        className={cn(
          'flex items-center justify-center text-xs',
          isHealthy ? 'text-primary' : 'text-destructive',
        )}
      >
        {isHealthy ? 'All services are online' : 'Services are offline'}
      </div>
    </div>
  );
};

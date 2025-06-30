import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardSkeletonProps {
  showIcon?: boolean;
}

const StatsCardSkeleton = ({ showIcon = true }: StatsCardSkeletonProps) => {
  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        {/* Icon skeleton */}
        {showIcon && (
          <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center">
            <Skeleton className="size-5 rounded-md" />
          </div>
        )}
        {/* Content skeleton */}
        <div className="flex-1">
          {/* Title skeleton */}
          <Skeleton className="h-3 w-20 mb-2" />
          {/* Value skeleton */}
          <Skeleton className="h-8 w-16 mb-2" />
          {/* Trend text skeleton */}
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};

const StatsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default StatsGridSkeleton;

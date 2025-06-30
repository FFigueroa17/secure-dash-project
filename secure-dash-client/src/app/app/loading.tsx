import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

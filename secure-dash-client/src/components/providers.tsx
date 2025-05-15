'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={120}>
      <NuqsAdapter>{children}</NuqsAdapter>
    </TooltipProvider>
  );
}

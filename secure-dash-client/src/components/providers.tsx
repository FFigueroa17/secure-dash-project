'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Toaster richColors closeButton />
      <NuqsAdapter>{children}</NuqsAdapter>
    </TooltipProvider>
  );
}

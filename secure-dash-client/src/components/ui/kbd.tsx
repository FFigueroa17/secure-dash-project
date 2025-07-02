import * as React from 'react';

import { cn } from '@/lib/utils';

function Kbd({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-5 items-center gap-0.5 whitespace-nowrap rounded bg-muted px-1.5 text-subheading-xs text-muted-foreground ring-1 ring-inset ring-muted',
        className,
      )}
      {...rest}
    />
  );
}

export { Kbd as Root };

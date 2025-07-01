'use client';

import { Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const HeaderBreadcrumb = () => {
  const pathname = usePathname();

  const formattedPathname = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    // Remove 'app' from segments
    const filteredSegments = segments.filter((segment) => segment !== 'app');

    // If the pathname is just '/app' (no other segments), show 'Fail2ban Logs'
    if (filteredSegments.length === 0) {
      return 'Fail2ban Logs';
    }

    // Otherwise, format the remaining segments
    return filteredSegments
      .map((segment) => {
        // Replace dashes with spaces and capitalize each word
        return segment
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      })
      .join(' ');
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">
            <Shield strokeWidth={1.5} size={20} aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{formattedPathname}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

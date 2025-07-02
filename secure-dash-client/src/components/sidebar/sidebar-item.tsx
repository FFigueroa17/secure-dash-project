'use client';

import { LucideIcon } from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const SidebarNavItem = ({
  item,
}: {
  item: { title: string; url: string; icon: LucideIcon };
}) => {
  const pathname = usePathname();
  const { pending } = useLinkStatus();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
        isActive={pathname === item.url}
      >
        <Link href={item.url} prefetch>
          {item.icon && (
            <item.icon
              className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
              size={22}
              aria-hidden="true"
            />
          )}
          <span className={cn(pending && 'animate-pulse opacity-70')}>
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

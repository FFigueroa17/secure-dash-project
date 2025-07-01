'use client';

import {
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Shield,
  Users,
} from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { logout } from '@/actions/auth';
import { AppLogo } from '@/components/app-logo';
import { SearchForm } from '@/components/search-form';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const data = {
  navMain: [
    {
      title: 'Secciones',
      items: [
        {
          title: 'Dashboard',
          url: '/app/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Lista de IPs',
          url: '/app/banned-ips',
          icon: Shield,
        },
        {
          title: 'Fail2Ban Logs',
          url: '/app',
          icon: Users,
        },
      ],
    },
    // {
    //   title: 'Other',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Settings',
    //       url: '#',
    //       icon: Cog,
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '#',
    //       icon: Leaf,
    //     },
    //   ],
    // },
  ],
};

function SidebarNavItem({
  item,
}: {
  item: { title: string; url: string; icon: LucideIcon };
}) {
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <AppLogo />
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm className="mt-3" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarNavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await logout();
              }}
              className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
            >
              <LogOut
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

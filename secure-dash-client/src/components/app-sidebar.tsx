'use client';

import {
  ChartNetwork,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from 'lucide-react';
import * as React from 'react';

import { logout } from '@/actions/auth';
import { AppLogo } from '@/components/app-logo';
import { SearchForm } from '@/components/search-form';
import { SidebarNavItem } from '@/components/sidebar/sidebar-item';
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
import { SessionPayload } from '@/lib/session';

const data = {
  navMain: [
    {
      title: 'Secciones',
      roles: ['USER', 'ADMIN'],
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
          icon: ChartNetwork,
        },
      ],
    },
    {
      title: 'Administración',
      roles: ['ADMIN'],
      items: [
        {
          title: 'Usuarios',
          url: '/app/users',
          icon: Users,
        },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: SessionPayload }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <AppLogo />
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain
          .filter((group) =>
            user.roles.some((userRole) => group.roles.includes(userRole)),
          )
          .map((item) => (
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

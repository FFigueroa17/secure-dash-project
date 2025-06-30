import Image from 'next/image';
import * as React from 'react';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const AppLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
              <Image
                src="/secure-dash-logo.svg"
                width={443.86}
                height={503.04}
                className="w-auto h-7 object-cover object-center"
                alt="SecureDash"
              />
            </div>
            <div className="grid flex-1 text-left text-base leading-tight">
              <span className="truncate font-medium">SecureDash</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

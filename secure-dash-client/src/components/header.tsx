import { redirect } from 'next/navigation';

import { HeaderBreadcrumb } from '@/components/header-breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getUser } from '@/lib/dal';

const Header = async () => {
  const session = await getUser();
  if (!session) {
    redirect('/');
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ms-4" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <HeaderBreadcrumb />
      </div>
      <div className="flex gap-3 ml-auto">
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent cursor-auto"
        >
          <span className="text-sm font-medium mr-2">
            Welcome, {session.username}
          </span>
          <Avatar className="size-8">
            <AvatarImage
              src="https://images.unsplash.com/photo-1750535135451-7c20e24b60c1?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={32}
              height={32}
              alt="Profile image"
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};

export default Header;

import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/lib/dal';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) return redirect('/');

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8 flex flex-col md:h-screen">
        <Header />
        <div className="md:flex-1 md:min-h-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

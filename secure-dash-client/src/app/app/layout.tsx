import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

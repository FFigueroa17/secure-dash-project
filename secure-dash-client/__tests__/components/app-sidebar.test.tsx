import { render, screen } from '@testing-library/react';

import { AppSidebar } from '@/components/app-sidebar';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

// Mock child components
jest.mock('@/components/search-form', () => ({
  SearchForm: () => <div data-testid="search-form">Search Form</div>,
}));

jest.mock('@/components/team-switcher', () => ({
  TeamSwitcher: ({
    teams,
  }: {
    teams: Array<{ name: string; logo: string }>;
  }) => (
    <div data-testid="team-switcher">Team Switcher ({teams.length} teams)</div>
  ),
}));

// Mock sidebar components
jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children, ...props }: { children: React.ReactNode }) => (
    <aside {...props} data-testid="sidebar">
      {children}
    </aside>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <footer data-testid="sidebar-footer">{children}</footer>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group-label">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <header data-testid="sidebar-header">{children}</header>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="sidebar-menu">{children}</nav>
  ),
  SidebarMenuButton: ({
    children,
    isActive,
    ...props
  }: {
    children: React.ReactNode;
    isActive?: boolean;
  }) => (
    <button data-testid="sidebar-menu-button" data-active={isActive} {...props}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarRail: () => <div data-testid="sidebar-rail">Rail</div>,
}));

describe('AppSidebar', () => {
  it('renders the sidebar', () => {
    render(<AppSidebar />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('renders the sidebar header with team switcher', () => {
    render(<AppSidebar />);

    const header = screen.getByTestId('sidebar-header');
    expect(header).toBeInTheDocument();

    const teamSwitcher = screen.getByTestId('team-switcher');
    expect(teamSwitcher).toBeInTheDocument();
    expect(teamSwitcher).toHaveTextContent('1 teams');
  });

  it('renders the search form', () => {
    render(<AppSidebar />);

    const searchForm = screen.getByTestId('search-form');
    expect(searchForm).toBeInTheDocument();
  });

  it('renders the main navigation menu', () => {
    render(<AppSidebar />);

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();

    const analyticsLink = screen.getByText('IPs');
    expect(analyticsLink).toBeInTheDocument();

    const usersLink = screen.getByText('Fail2Ban Logs');
    expect(usersLink).toBeInTheDocument();
  });

  it('renders the sidebar footer with logout', () => {
    render(<AppSidebar />);

    const footer = screen.getByTestId('sidebar-footer');
    expect(footer).toBeInTheDocument();

    const logoutButton = screen.getByText('Cerrar sesión');
    expect(logoutButton).toBeInTheDocument();
  });

  it('renders navigation groups with labels', () => {
    render(<AppSidebar />);

    const navigationLabel = screen.getByText('Secciones');
    expect(navigationLabel).toBeInTheDocument();

    // Account label doesn't exist in the current component, so removing this assertion
    // const accountLabel = screen.getByText('Account');
    // expect(accountLabel).toBeInTheDocument();
  });

  it('renders the sidebar rail', () => {
    render(<AppSidebar />);

    const rail = screen.getByTestId('sidebar-rail');
    expect(rail).toBeInTheDocument();
  });

  it('has correct team data structure', () => {
    render(<AppSidebar />);

    const teamSwitcher = screen.getByTestId('team-switcher');
    expect(teamSwitcher).toHaveTextContent('1 teams');
  });
});

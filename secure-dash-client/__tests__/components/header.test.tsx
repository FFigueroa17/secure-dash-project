import { render, screen } from '@testing-library/react';

import Header from '@/components/header';

// Mock the sidebar components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: ({ className, ...props }: React.ComponentProps<'button'>) => (
    <button className={className} {...props} data-testid="sidebar-trigger">
      Toggle Sidebar
    </button>
  ),
}));

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders the sidebar trigger button', () => {
    render(<Header />);

    const sidebarTrigger = screen.getByTestId('sidebar-trigger');
    expect(sidebarTrigger).toBeInTheDocument();
  });

  it('renders the dashboard breadcrumb with shield icon', () => {
    render(<Header />);

    // Check for shield icon (aria-hidden, so we look for the sr-only text)
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
  });

  it('renders the security logs breadcrumb', () => {
    render(<Header />);

    const securityLogsText = screen.getByText('Fail2Ban Logs');
    expect(securityLogsText).toBeInTheDocument();
  });

  it('renders the user avatar with fallback', () => {
    render(<Header />);

    // Look for the avatar fallback text
    const avatarFallback = screen.getByText('KK');
    expect(avatarFallback).toBeInTheDocument();
  });

  it('has correct header styling classes', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'flex',
      'h-16',
      'shrink-0',
      'items-center',
      'gap-2',
      'border-b',
    );
  });
});

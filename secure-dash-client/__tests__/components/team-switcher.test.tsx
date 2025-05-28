import { render, screen, within } from '@testing-library/react';

import { TeamSwitcher } from '@/components/team-switcher';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: React.ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the UI components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div role="menu">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuShortcut: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <nav>{children}</nav>
  ),
  SidebarMenuButton: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => (
    <button data-testid="sidebar-menu-button" {...props}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
}));

const mockTeams = [
  { name: 'Security Team Alpha', logo: '/team-alpha.png' },
  { name: 'Security Team Beta', logo: '/team-beta.png' },
  { name: 'Security Team Gamma', logo: '/team-gamma.png' },
];

describe('TeamSwitcher', () => {
  it('renders the team switcher', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders the active team name', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    // Find the active team name within the button using the testid
    const button = screen.getByTestId('sidebar-menu-button');
    const activeTeamName = within(button).getByText('Security Team Alpha');
    expect(activeTeamName).toBeInTheDocument();
  });

  it('renders the team logo', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    // Get all images and find the one in the button (not in dropdown)
    const teamLogos = screen.getAllByAltText('Security Team Alpha');
    expect(teamLogos.length).toBeGreaterThan(0);
    expect(teamLogos[0]).toHaveAttribute('src', '/team-alpha.png');
  });

  it('renders the dropdown trigger button', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    const triggerButton = screen.getByTestId('sidebar-menu-button');
    expect(triggerButton).toBeInTheDocument();
  });

  it('handles empty teams array gracefully', () => {
    render(<TeamSwitcher teams={[]} />);

    // When teams array is empty, component returns null, so no elements should be rendered
    const nav = screen.queryByRole('navigation');
    expect(nav).not.toBeInTheDocument();
  });

  it('initializes with first team as active', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    // Should show the first team by default - find within the button
    const button = screen.getByTestId('sidebar-menu-button');
    const firstTeamElement = within(button).getByText('Security Team Alpha');
    expect(firstTeamElement).toBeInTheDocument();
  });

  it('renders chevron icon', () => {
    render(<TeamSwitcher teams={mockTeams} />);

    // The chevron icon should be present in the trigger button
    const button = screen.getByTestId('sidebar-menu-button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchForm } from '@/components/search-form';

// Mock the sidebar components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarInput: ({ className, ...props }: React.ComponentProps<'input'>) => (
    <input className={className} {...props} />
  ),
  SidebarGroup: ({
    className,
    children,
    ...props
  }: React.ComponentProps<'div'>) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  SidebarGroupContent: ({
    className,
    children,
    ...props
  }: React.ComponentProps<'div'>) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('SearchForm', () => {
  it('renders the search form', () => {
    render(<SearchForm />);

    const form = screen.getByRole('textbox');
    expect(form).toBeInTheDocument();
  });

  it('renders the search input with correct aria-label', () => {
    render(<SearchForm />);

    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('aria-label', 'Search');
  });

  it('allows typing in the search input', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const searchInput = screen.getByLabelText('Search');
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('renders the search icon', () => {
    render(<SearchForm />);

    // The search icon should be present (aria-hidden)
    const searchIcon = document.querySelector('svg[aria-hidden="true"]');
    expect(searchIcon).toBeInTheDocument();
  });

  it('renders the keyboard shortcut indicator', () => {
    render(<SearchForm />);

    const kbdElement = screen.getByText('/');
    expect(kbdElement).toBeInTheDocument();
    expect(kbdElement.tagName.toLowerCase()).toBe('kbd');
  });

  it('accepts custom form props', () => {
    const handleSubmit = jest.fn();
    render(<SearchForm onSubmit={handleSubmit} data-testid="search-form" />);

    const form = screen.getByTestId('search-form');
    expect(form).toBeInTheDocument();
  });

  it('has correct input styling classes', () => {
    render(<SearchForm />);

    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toHaveClass('ps-9', 'pe-9');
  });
});

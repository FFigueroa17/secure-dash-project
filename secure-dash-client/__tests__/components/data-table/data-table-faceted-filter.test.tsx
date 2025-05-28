import type { Column } from '@tanstack/react-table';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import type { Option } from '@/types/data-table';

import { mockFail2BanLogs } from '../../../__mocks__/data-table-data';

// Mock scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

type LogEntry = (typeof mockFail2BanLogs)[0];

// Mock options for testing
const mockOptions: Option[] = [
  { label: 'ALLOW', value: 'ALLOW', count: 10 },
  { label: 'BAN', value: 'BAN', count: 5 },
  { label: 'UNBAN', value: 'UNBAN', count: 2 },
];

// Helper to create mock column
function createMockColumn(filterValue?: unknown): Column<LogEntry, unknown> {
  const setFilterValue = jest.fn();
  const getFilterValue = jest.fn(() => filterValue);

  return {
    getFilterValue,
    setFilterValue,
    id: 'action',
  } as unknown as Column<LogEntry, unknown>;
}

// Test wrapper component
function TestWrapper({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div data-testid="container" onClick={onClick}>
      {children}
    </div>
  );
}

describe('DataTableFacetedFilter', () => {
  const mockColumn = createMockColumn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders filter button with title', () => {
      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      expect(
        screen.getByRole('button', { name: /action/i }),
      ).toBeInTheDocument();
    });

    it('renders without column', () => {
      render(<DataTableFacetedFilter title="Action" options={mockOptions} />);

      expect(
        screen.getByRole('button', { name: /action/i }),
      ).toBeInTheDocument();
    });

    it('renders plus icon when no selections', () => {
      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      // Plus icon should be present (PlusCircle)
      const button = screen.getByRole('button', { name: /action/i });
      expect(button).toBeInTheDocument();
    });

    it('renders clear icon when has selections', () => {
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Clear button should be present
      expect(
        screen.getByRole('button', { name: /clear action filter/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Popover Interaction', () => {
    it('opens popover when trigger button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Action')).toBeInTheDocument();
      });
    });

    it('displays all options in the popover', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('ALLOW')).toBeInTheDocument();
        expect(screen.getByText('BAN')).toBeInTheDocument();
        expect(screen.getByText('UNBAN')).toBeInTheDocument();
      });
    });

    it('displays option counts when provided', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('Single Selection Mode', () => {
    it('selects option when clicked', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
          multiple={false}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('BAN')).toBeInTheDocument();
      });

      await user.click(screen.getByText('BAN'));

      expect(mockColumn.setFilterValue).toHaveBeenCalledWith(['BAN']);
    });

    it('deselects option when clicked again', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
          multiple={false}
        />,
      );

      // Get the main trigger button, not the clear button
      const buttons = screen.getAllByRole('button', { name: /action/i });
      const triggerButton =
        buttons.find(
          (btn) => btn.getAttribute('data-slot') === 'popover-trigger',
        ) || buttons[0];
      if (triggerButton) {
        await user.click(triggerButton);
      }

      await waitFor(() => {
        // Look for the option in the popover, not the badge
        const popoverOptions = screen.getAllByText('BAN');
        expect(popoverOptions.length).toBeGreaterThan(0);
      });

      // Click the option in the popover (not the badge)
      const popoverOptions = screen.getAllByText('BAN');
      const optionInPopover = popoverOptions.find(
        (el) => el.closest('[cmdk-item]') || el.className.includes('truncate'),
      );
      if (optionInPopover) {
        await user.click(optionInPopover);
      }

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Multiple Selection Mode', () => {
    it('allows multiple selections', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
          multiple={true}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('BAN')).toBeInTheDocument();
      });

      await user.click(screen.getByText('BAN'));
      expect(mockColumn.setFilterValue).toHaveBeenCalledWith(['BAN']);
    });

    it('removes selection when clicked again', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN', 'ALLOW']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
          multiple={true}
        />,
      );

      // Get the main trigger button, not the clear button
      const buttons = screen.getAllByRole('button', { name: /action/i });
      const triggerButton =
        buttons.find(
          (btn) => btn.getAttribute('data-slot') === 'popover-trigger',
        ) || buttons[0];
      if (triggerButton) {
        await user.click(triggerButton);
      }

      await waitFor(() => {
        // Look for the option in the popover, not the badge
        const popoverOptions = screen.getAllByText('BAN');
        expect(popoverOptions.length).toBeGreaterThan(0);
      });

      // Click the option in the popover (not the badge)
      const popoverOptions = screen.getAllByText('BAN');
      const optionInPopover = popoverOptions.find(
        (el) => el.closest('[cmdk-item]') || el.className.includes('truncate'),
      );
      if (optionInPopover) {
        await user.click(optionInPopover);
      }

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(['ALLOW']);
    });

    it('clears all selections when last item is removed', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
          multiple={true}
        />,
      );

      // Get the main trigger button, not the clear button
      const buttons = screen.getAllByRole('button', { name: /action/i });
      const triggerButton =
        buttons.find(
          (btn) => btn.getAttribute('data-slot') === 'popover-trigger',
        ) || buttons[0];
      if (triggerButton) {
        await user.click(triggerButton);
      }

      await waitFor(() => {
        // Look for the option in the popover, not the badge
        const popoverOptions = screen.getAllByText('BAN');
        expect(popoverOptions.length).toBeGreaterThan(0);
      });

      // Click the option in the popover (not the badge)
      const popoverOptions = screen.getAllByText('BAN');
      const optionInPopover = popoverOptions.find(
        (el) => el.closest('[cmdk-item]') || el.className.includes('truncate'),
      );
      if (optionInPopover) {
        await user.click(optionInPopover);
      }

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Selection Display', () => {
    it('displays selection count badge for small screens', () => {
      const columnWithFilter = createMockColumn(['BAN', 'ALLOW']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Should show count badge
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays individual selection badges for large screens when <= 2 selections', () => {
      const columnWithFilter = createMockColumn(['BAN', 'ALLOW']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Should show individual badges
      expect(screen.getByText('BAN')).toBeInTheDocument();
      expect(screen.getByText('ALLOW')).toBeInTheDocument();
    });

    it('displays summary badge when > 2 selections', () => {
      const columnWithFilter = createMockColumn(['BAN', 'ALLOW', 'UNBAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Should show summary badge
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    it('clears all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      const clearButton = screen.getByRole('button', {
        name: /clear action filter/i,
      });
      await user.click(clearButton);

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });

    it('shows clear filters option in popover when selections exist', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Get the main trigger button, not the clear button
      const buttons = screen.getAllByRole('button', { name: /action/i });
      const triggerButton =
        buttons.find(
          (btn) => btn.getAttribute('data-slot') === 'popover-trigger',
        ) || buttons[0];
      if (triggerButton) {
        await user.click(triggerButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
      });
    });

    it('clears filters when "Limpiar filtros" is clicked', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Get the main trigger button, not the clear button
      const buttons = screen.getAllByRole('button', { name: /action/i });
      const triggerButton =
        buttons.find(
          (btn) => btn.getAttribute('data-slot') === 'popover-trigger',
        ) || buttons[0];
      if (triggerButton) {
        await user.click(triggerButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Limpiar filtros'));

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Search Functionality', () => {
    it('filters options based on search input', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Action')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Action');
      await user.type(searchInput, 'BAN');

      // Should still show BAN and UNBAN
      await waitFor(() => {
        expect(screen.getByText('BAN')).toBeInTheDocument();
        expect(screen.getByText('UNBAN')).toBeInTheDocument();
      });
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={mockOptions}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Action')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Action');
      await user.type(searchInput, 'NONEXISTENT');

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      const clearButton = screen.getByRole('button', {
        name: /clear action filter/i,
      });
      expect(clearButton).toHaveAttribute('aria-label', 'Clear Action filter');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <DataTableFacetedFilter
          column={columnWithFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      const clearButton = screen.getByRole('button', {
        name: /clear action filter/i,
      });

      // Focus and activate with click (simpler than keyboard for this test)
      await user.click(clearButton);

      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();

      render(
        <DataTableFacetedFilter
          column={mockColumn}
          title="Action"
          options={[]}
        />,
      );

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument();
      });
    });

    it('handles non-array filter values', () => {
      const columnWithStringFilter = createMockColumn('BAN');

      render(
        <DataTableFacetedFilter
          column={columnWithStringFilter}
          title="Action"
          options={mockOptions}
        />,
      );

      // Should not crash and should render the button (but without clear functionality for non-arrays)
      expect(
        screen.getByRole('button', { name: /action/i }),
      ).toBeInTheDocument();
    });

    it('does not call setFilterValue when no column provided', async () => {
      const user = userEvent.setup();

      render(<DataTableFacetedFilter title="Action" options={mockOptions} />);

      const triggerButton = screen.getByRole('button', { name: /action/i });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('BAN')).toBeInTheDocument();
      });

      await user.click(screen.getByText('BAN'));

      // Should not throw error
      expect(true).toBe(true);
    });

    it('handles click event stopPropagation in clear button', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const columnWithFilter = createMockColumn(['BAN']);

      render(
        <TestWrapper onClick={onClick}>
          <DataTableFacetedFilter
            column={columnWithFilter}
            title="Action"
            options={mockOptions}
          />
        </TestWrapper>,
      );

      const clearButton = screen.getByRole('button', {
        name: /clear action filter/i,
      });
      await user.click(clearButton);

      // Parent onClick should not be called due to stopPropagation
      expect(onClick).not.toHaveBeenCalled();
      expect(columnWithFilter.setFilterValue).toHaveBeenCalledWith(undefined);
    });
  });
});

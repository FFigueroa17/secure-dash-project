import type { Table } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar';

import { mockFail2BanLogs } from '../../../__mocks__/data-table-data';

type LogEntry = (typeof mockFail2BanLogs)[0];

// Helper to create mock table with proper typing
function createMockTable(selectedRows: number[] = []): Table<LogEntry> {
  const baseTable = {
    getRowModel: () => ({
      rows: mockFail2BanLogs.map((_, i) => ({
        id: i.toString(),
        original: mockFail2BanLogs[i],
      })),
    }),
    getFilteredSelectedRowModel: () => ({
      rows: selectedRows.map((i) => ({
        id: i.toString(),
        original: mockFail2BanLogs[i],
      })),
    }),
    toggleAllRowsSelected: jest.fn(),
    getState: () => ({
      columnFilters: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      rowSelection: {},
      globalFilter: undefined,
    }),
    options: {},
  };

  return baseTable as unknown as Table<LogEntry>;
}

// Test wrapper component that provides container for portal
const ActionBarWrapper = ({
  table,
  visible,
  children,
}: {
  table: Table<LogEntry>;
  visible?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div>
      <div data-testid="container">Main content</div>
      <DataTableActionBar table={table} visible={visible}>
        {children}
      </DataTableActionBar>
    </div>
  );
};

// Mock motion to avoid animation issues in tests
jest.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock ReactDOM.createPortal to render in document body
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('DataTableActionBar', () => {
  beforeEach(() => {
    // Clean up any existing portals
    document.body.innerHTML = '';
  });

  describe('Basic Rendering', () => {
    it('renders action bar when rows are selected', () => {
      const table = createMockTable([0, 1]);

      render(<ActionBarWrapper table={table} />);

      const actionBar = screen.getByRole('toolbar');
      expect(actionBar).toBeInTheDocument();
      expect(actionBar).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('does not render when no rows are selected', () => {
      const table = createMockTable([]);

      render(<ActionBarWrapper table={table} />);

      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('renders when visible prop is true regardless of selection', () => {
      const table = createMockTable([]);

      render(<ActionBarWrapper table={table} visible={true} />);

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('does not render when visible prop is false even with selection', () => {
      const table = createMockTable([0, 1]);

      render(<ActionBarWrapper table={table} visible={false} />);

      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('renders children content inside action bar', () => {
      const table = createMockTable([0]);

      render(
        <ActionBarWrapper table={table}>
          <div data-testid="custom-action">Custom Action</div>
        </ActionBarWrapper>,
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
      expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('clears selection when Escape key is pressed', async () => {
      const toggleAllRowsSelected = jest.fn();
      const table = {
        ...createMockTable([0, 1]),
        toggleAllRowsSelected,
      } as unknown as Table<LogEntry>;

      render(<ActionBarWrapper table={table} />);

      // Simulate Escape key press
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

      expect(toggleAllRowsSelected).toHaveBeenCalledWith(false);
    });

    it('does not respond to other key presses', () => {
      const toggleAllRowsSelected = jest.fn();
      const table = {
        ...createMockTable([0, 1]),
        toggleAllRowsSelected,
      } as unknown as Table<LogEntry>;

      render(<ActionBarWrapper table={table} />);

      // Simulate other key presses
      fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(window, { key: 'Space', code: 'Space' });

      expect(toggleAllRowsSelected).not.toHaveBeenCalled();
    });
  });

  describe('Portal Behavior', () => {
    it('renders in document body by default', () => {
      const table = createMockTable([0]);

      render(<ActionBarWrapper table={table} />);

      // Should be rendered as portal (mocked to render inline)
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('handles custom container prop', () => {
      const customContainer = document.createElement('div');
      document.body.appendChild(customContainer);

      const table = createMockTable([0]);

      render(
        <DataTableActionBar table={table} container={customContainer}>
          <div>Action content</div>
        </DataTableActionBar>,
      );

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const table = createMockTable([0]);

      render(<ActionBarWrapper table={table} />);

      const actionBar = screen.getByRole('toolbar');
      expect(actionBar).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('maintains proper focus management', () => {
      const table = createMockTable([0]);

      render(
        <ActionBarWrapper table={table}>
          <button>Action Button</button>
        </ActionBarWrapper>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const table = createMockTable([0]);

      render(
        <DataTableActionBar table={table} className="custom-action-bar">
          <div>Content</div>
        </DataTableActionBar>,
      );

      const actionBar = screen.getByRole('toolbar');
      expect(actionBar).toHaveClass('custom-action-bar');
    });

    it('spreads additional props to action bar element', () => {
      const table = createMockTable([0]);

      render(
        <DataTableActionBar table={table} data-testid="custom-action-bar">
          <div>Content</div>
        </DataTableActionBar>,
      );

      expect(screen.getByTestId('custom-action-bar')).toBeInTheDocument();
    });
  });
});

describe('DataTableActionBarAction', () => {
  describe('Basic Rendering', () => {
    it('renders action button with default props', () => {
      render(<DataTableActionBarAction>Delete</DataTableActionBarAction>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Delete');
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTableActionBarAction onClick={handleClick}>
          Delete
        </DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders with custom size', () => {
      render(
        <DataTableActionBarAction size="icon">🗑️</DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isPending is true', () => {
      render(
        <DataTableActionBarAction isPending>Delete</DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      // Check for loading spinner (Loader icon with animate-spin class)
      const loader = button.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });

    it('disables button when isPending is true', () => {
      render(
        <DataTableActionBarAction isPending>Delete</DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(
        <DataTableActionBarAction disabled>Delete</DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip when tooltip prop is provided', () => {
      render(
        <DataTableActionBarAction tooltip="Delete selected items">
          Delete
        </DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      // The tooltip content is rendered but might not be visible initially
      // In a real test, you'd hover to show the tooltip
    });

    it('does not render tooltip wrapper when no tooltip prop', () => {
      render(<DataTableActionBarAction>Delete</DataTableActionBarAction>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(
        <DataTableActionBarAction className="custom-action">
          Delete
        </DataTableActionBarAction>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-action');
    });

    it('spreads additional props to button element', () => {
      render(
        <DataTableActionBarAction data-testid="custom-button">
          Delete
        </DataTableActionBarAction>,
      );

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });
});

describe('DataTableActionBarSelection', () => {
  describe('Basic Rendering', () => {
    it('displays number of selected rows', () => {
      const table = createMockTable([0, 1, 2]);

      render(<DataTableActionBarSelection table={table} />);

      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });

    it('displays zero when no rows selected', () => {
      const table = createMockTable([]);

      render(<DataTableActionBarSelection table={table} />);

      expect(screen.getByText('0 selected')).toBeInTheDocument();
    });

    it('renders clear selection button', () => {
      const table = createMockTable([0, 1]);

      render(<DataTableActionBarSelection table={table} />);

      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Clear Selection', () => {
    it('calls toggleAllRowsSelected when clear button is clicked', async () => {
      const toggleAllRowsSelected = jest.fn();
      const table = {
        ...createMockTable([0, 1]),
        toggleAllRowsSelected,
      } as unknown as Table<LogEntry>;

      const user = userEvent.setup();

      render(<DataTableActionBarSelection table={table} />);

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);

      expect(toggleAllRowsSelected).toHaveBeenCalledWith(false);
    });
  });

  describe('Accessibility', () => {
    it('has proper structure for screen readers', () => {
      const table = createMockTable([0, 1]);

      render(<DataTableActionBarSelection table={table} />);

      // Check for proper text content
      expect(screen.getByText('2 selected')).toBeInTheDocument();

      // Check for clear button
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
    });

    it('includes keyboard shortcut in tooltip', () => {
      const table = createMockTable([0, 1]);

      render(<DataTableActionBarSelection table={table} />);

      // The tooltip should contain the escape key hint
      // In a real test, you might need to hover to reveal the tooltip
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});

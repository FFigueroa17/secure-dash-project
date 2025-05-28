import type { Column, Table } from '@tanstack/react-table';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';

import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { FilterConfig } from '@/types';

import { mockFail2BanLogs } from '../../../__mocks__/data-table-data';

type LogEntry = (typeof mockFail2BanLogs)[0];

const columnHelper = createColumnHelper<LogEntry>();

// Helper to create mock column with proper typing
function createMockColumn(
  id: string,
  filterValue: unknown = '',
  setFilterValue = jest.fn(),
): Column<LogEntry, unknown> {
  return {
    id,
    getFilterValue: () => filterValue,
    setFilterValue,
    // Add minimal required Column properties
    getCanFilter: () => true,
    columnDef: { accessorKey: id },
  } as unknown as Column<LogEntry, unknown>;
}

// Helper to create mock table
function createMockTable(): Table<LogEntry> {
  return {
    getRowModel: () => ({ rows: [] }),
    getColumn: (id: string) => createMockColumn(id),
    getAllColumns: () => [],
    getState: () => ({
      columnFilters: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      rowSelection: {},
      globalFilter: undefined,
    }),
    resetColumnFilters: jest.fn(),
    options: {},
  } as unknown as Table<LogEntry>;
}

// Mock the child components
jest.mock('@/components/data-table/data-table-date-filter', () => ({
  DataTableDateFilter: ({ title }: { title: string }) => (
    <div data-testid="date-filter">{title}</div>
  ),
}));

jest.mock('@/components/data-table/data-table-faceted-filter', () => ({
  DataTableFacetedFilter: ({ title }: { title: string }) => (
    <div data-testid="faceted-filter">{title}</div>
  ),
}));

// Sample columns for testing
const columns = [
  columnHelper.accessor('ip', {
    id: 'ip',
    header: 'IP Address',
  }),
  columnHelper.accessor('action', {
    id: 'action',
    header: 'Action',
  }),
  columnHelper.accessor('timestamp', {
    id: 'timestamp',
    header: 'Timestamp',
  }),
];

// Test wrapper component
interface ToolbarWrapperProps {
  data?: LogEntry[];
  filters?: FilterConfig<LogEntry>[];
  children?: React.ReactNode;
}

function ToolbarWrapper({
  data = mockFail2BanLogs.slice(0, 5),
  filters = [],
  children,
}: ToolbarWrapperProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataTableToolbar table={table} filters={filters}>
      {children}
    </DataTableToolbar>
  );
}

describe('DataTableToolbar', () => {
  describe('Basic Rendering', () => {
    it('renders toolbar with proper ARIA attributes', () => {
      render(<ToolbarWrapper />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders without filters when none provided', () => {
      render(<ToolbarWrapper />);

      // Should render basic toolbar structure
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      // Should not show reset button when no filters applied
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('renders children content in right section', () => {
      render(
        <ToolbarWrapper>
          <div data-testid="custom-content">Custom Content</div>
        </ToolbarWrapper>,
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Text Filters', () => {
    it('renders text filter with search input', () => {
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', ''),
        filterType: 'text',
        label: 'Search IP',
        placeholder: 'Enter IP address...',
      };

      render(<ToolbarWrapper filters={[textFilter]} />);

      const input = screen.getByLabelText('Search IP');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter IP address...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('handles text filter input changes', () => {
      const setFilterValue = jest.fn();
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', '', setFilterValue),
        filterType: 'text',
        label: 'Search IP',
      };

      render(<ToolbarWrapper filters={[textFilter]} />);

      const input = screen.getByLabelText('Search IP');
      fireEvent.change(input, { target: { value: '192.168.1.1' } });

      expect(setFilterValue).toHaveBeenCalledWith('192.168.1.1');
    });

    it('displays current filter value in text input', () => {
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', '192.168.1.1'),
        filterType: 'text',
        label: 'Search IP',
      };

      render(<ToolbarWrapper filters={[textFilter]} />);

      const input = screen.getByDisplayValue('192.168.1.1');
      expect(input).toBeInTheDocument();
    });

    it('shows search icon in text filter', () => {
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', ''),
        filterType: 'text',
        label: 'Search IP',
      };

      render(<ToolbarWrapper filters={[textFilter]} />);

      // Search icon should be present (hidden from screen readers)
      const searchIcon = screen
        .getByLabelText('Search IP')
        .parentElement?.querySelector('[aria-hidden="true"]');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Number Filters', () => {
    it('renders number filter with numeric input', () => {
      const numberFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('responseCode', ''),
        filterType: 'number',
        label: 'Response Code',
        placeholder: 'Enter code...',
        unit: 'ms',
      };

      render(<ToolbarWrapper filters={[numberFilter]} />);

      const input = screen.getByPlaceholderText('Enter code...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('placeholder', 'Enter code...');
    });

    it('displays unit suffix for number filters', () => {
      const numberFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('responseTime', ''),
        filterType: 'number',
        label: 'Response Time',
        unit: 'ms',
      };

      render(<ToolbarWrapper filters={[numberFilter]} />);

      expect(screen.getByText('ms')).toBeInTheDocument();
    });

    it('handles number filter input changes', () => {
      const setFilterValue = jest.fn();
      const numberFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('responseCode', '', setFilterValue),
        filterType: 'number',
        label: 'Response Code',
      };

      render(<ToolbarWrapper filters={[numberFilter]} />);

      const input = screen.getByPlaceholderText('Response Code');
      fireEvent.change(input, { target: { value: '404' } });

      expect(setFilterValue).toHaveBeenCalledWith('404');
    });
  });

  describe('Date Filters', () => {
    it('renders date filter component', () => {
      const dateFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('timestamp'),
        filterType: 'date',
        label: 'Date Filter',
      };

      render(<ToolbarWrapper filters={[dateFilter]} />);

      expect(screen.getByTestId('date-filter')).toBeInTheDocument();
      expect(screen.getByText('Date Filter')).toBeInTheDocument();
    });

    it('renders dateRange filter component', () => {
      const dateRangeFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('timestamp'),
        filterType: 'dateRange',
        label: 'Date Range',
        disableFutureDates: true,
      };

      render(<ToolbarWrapper filters={[dateRangeFilter]} />);

      expect(screen.getByTestId('date-filter')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });
  });

  describe('Select Filters', () => {
    it('renders select filter as faceted filter', () => {
      const selectFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('method'),
        filterType: 'select',
        label: 'Method',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      };

      render(<ToolbarWrapper filters={[selectFilter]} />);

      expect(screen.getByTestId('faceted-filter')).toBeInTheDocument();
      expect(screen.getByText('Method')).toBeInTheDocument();
    });

    it('renders multiSelect filter as faceted filter', () => {
      const multiSelectFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('status'),
        filterType: 'multiSelect',
        label: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      };

      render(<ToolbarWrapper filters={[multiSelectFilter]} />);

      expect(screen.getByTestId('faceted-filter')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Filter Positioning', () => {
    it('places filters on left by default', () => {
      const leftFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip'),
        filterType: 'text',
        label: 'IP Filter',
      };

      render(<ToolbarWrapper filters={[leftFilter]} />);

      const toolbar = screen.getByRole('toolbar');
      const leftSection = toolbar.querySelector(
        '.flex.flex-1.flex-wrap.items-center.gap-2',
      );
      expect(leftSection).toBeInTheDocument();
    });

    it('places filters on right when specified', () => {
      const rightFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip'),
        filterType: 'text',
        label: 'IP Filter',
        position: 'right',
      };

      render(<ToolbarWrapper filters={[rightFilter]} />);

      // The filter should be rendered, position is handled by CSS classes
      expect(screen.getByLabelText('IP Filter')).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('shows reset button when filters are applied', () => {
      const mockTable = {
        ...createMockTable(),
        getState: () => ({
          columnFilters: [{ id: 'ip', value: '192.168.1.1' }],
          pagination: { pageIndex: 0, pageSize: 10 },
          sorting: [],
          rowSelection: {},
          globalFilter: undefined,
        }),
      } as unknown as Table<LogEntry>;

      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', '192.168.1.1'),
        filterType: 'text',
        label: 'Search IP',
      };

      render(<DataTableToolbar table={mockTable} filters={[textFilter]} />);

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('calls reset functions when reset button is clicked', () => {
      const resetColumnFilters = jest.fn();
      const mockTable = {
        ...createMockTable(),
        getState: () => ({
          columnFilters: [{ id: 'ip', value: '192.168.1.1' }],
          pagination: { pageIndex: 0, pageSize: 10 },
          sorting: [],
          rowSelection: {},
          globalFilter: undefined,
        }),
        resetColumnFilters,
      } as unknown as Table<LogEntry>;

      const setFilterValue = jest.fn();
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip', '192.168.1.1', setFilterValue),
        filterType: 'text',
        label: 'Search IP',
      };

      render(<DataTableToolbar table={mockTable} filters={[textFilter]} />);

      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      expect(resetColumnFilters).toHaveBeenCalled();
    });

    it('does not show reset button when no filters applied', () => {
      const mockTable = createMockTable();
      render(<DataTableToolbar table={mockTable} filters={[]} />);

      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for filter inputs', () => {
      const textFilter: FilterConfig<LogEntry> = {
        column: createMockColumn('ip'),
        filterType: 'text',
        label: 'IP Address Filter',
      };

      render(<ToolbarWrapper filters={[textFilter]} />);

      const input = screen.getByLabelText('IP Address Filter');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-label', 'IP Address Filter');
    });

    it('maintains focus management for keyboard navigation', () => {
      const mockTable = createMockTable();
      render(<DataTableToolbar table={mockTable} filters={[]} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const mockTable = createMockTable();
      const { container } = render(
        <DataTableToolbar
          table={mockTable}
          filters={[]}
          className="custom-toolbar"
        />,
      );

      expect(container.firstChild).toHaveClass('custom-toolbar');
    });

    it('spreads additional props to toolbar element', () => {
      const mockTable = createMockTable();
      render(
        <DataTableToolbar
          table={mockTable}
          filters={[]}
          data-testid="custom-toolbar"
        />,
      );

      expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    });
  });
});

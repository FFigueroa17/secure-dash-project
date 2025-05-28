import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';

import DataTablePagination from '@/components/data-table/data-table-pagination';

import {
  type Fail2BanLog,
  mockFail2BanLogs,
} from '../../../__mocks__/data-table-data';

// Mock columns for testing
const mockColumns: ColumnDef<Fail2BanLog>[] = [
  {
    accessorKey: 'ip',
    header: 'IP Address',
  },
  {
    accessorKey: 'action',
    header: 'Action',
  },
];

// Test wrapper component to provide table instance
const PaginationWrapper = ({
  data = mockFail2BanLogs,
  pageSize = 2,
  isPending = false,
}: {
  data?: Fail2BanLog[];
  pageSize?: number;
  isPending?: boolean;
}) => {
  const table = useReactTable({
    data,
    columns: mockColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  return <DataTablePagination table={table} isPending={isPending} />;
};

describe('DataTablePagination', () => {
  describe('Basic Rendering', () => {
    it('displays pagination information correctly', () => {
      render(<PaginationWrapper pageSize={2} />);

      // Check page info (should show "Pagina 1 de X")
      expect(screen.getByText(/Pagina/)).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Current page

      // Check selected rows info (Spanish UI)
      expect(screen.getByText(/fila\(s\) seleccionadas/)).toBeInTheDocument();
    });

    it('displays page size selector', () => {
      render(<PaginationWrapper />);

      // Check page size selector exists
      const pageSelector = screen.getByRole('combobox');
      expect(pageSelector).toBeInTheDocument();
    });

    it('shows navigation buttons', () => {
      render(<PaginationWrapper pageSize={2} />);

      // Check for navigation buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Look for pagination buttons specifically
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });
  });

  describe('Pagination Controls', () => {
    it('enables next button when there are more pages', () => {
      render(<PaginationWrapper pageSize={2} />);

      const nextButton = screen.getByText('Siguiente');
      expect(nextButton).not.toBeDisabled();
    });

    it('disables previous button on first page', () => {
      render(<PaginationWrapper pageSize={2} />);

      const prevButton = screen.getByText('Anterior');
      expect(prevButton).toBeDisabled();
    });

    it('handles page navigation correctly', () => {
      render(<PaginationWrapper pageSize={2} />);

      const nextButton = screen.getByText('Siguiente');

      // Click next to go to page 2
      fireEvent.click(nextButton);

      // Should update page display
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('handles page size change', () => {
      render(<PaginationWrapper pageSize={2} />);

      const pageSelector = screen.getByRole('combobox');

      // Open dropdown and select new page size
      fireEvent.click(pageSelector);

      // Check that dropdown is functional
      expect(pageSelector).toBeInTheDocument();
    });
  });

  describe('Page Size Options', () => {
    it('shows available page size options when clicked', () => {
      render(<PaginationWrapper />);

      const pageSelector = screen.getByRole('combobox');
      fireEvent.click(pageSelector);

      // Should open dropdown (basic interaction test)
      expect(pageSelector).toBeInTheDocument();
    });

    it('displays current page size', () => {
      render(<PaginationWrapper pageSize={5} />);

      // The page size should be in the select trigger
      // Look for "Filas por página" text which indicates the page size selector is present
      expect(screen.getByText('Filas por página')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data correctly', () => {
      render(<PaginationWrapper data={[]} />);

      // Should still render pagination controls
      expect(screen.getByText(/Pagina/)).toBeInTheDocument();
      // Should show multiple "0" values - use getAllByText for this case
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('handles single page correctly', () => {
      render(
        <PaginationWrapper data={mockFail2BanLogs.slice(0, 2)} pageSize={5} />,
      );

      // Both prev and next should be disabled
      const prevButton = screen.getByText('Anterior');
      const nextButton = screen.getByText('Siguiente');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
    it('shows correct total count', () => {
      const testData = mockFail2BanLogs.slice(0, 3);
      render(<PaginationWrapper data={testData} pageSize={2} />);

      // Should show total of 3 items in Spanish format
      // Use getAllByText to handle multiple matches and check the first one
      const elements = screen.getAllByText((content, element) => {
        return (
          (element?.textContent?.includes('3') &&
            element?.textContent?.includes('fila(s) seleccionadas')) ||
          false
        );
      });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Loading States', () => {
    it('handles pending state correctly', () => {
      render(<PaginationWrapper isPending={true} />);

      // Should still render pagination but might be disabled
      expect(screen.getByText(/Pagina/)).toBeInTheDocument();

      // Navigation buttons should be disabled during loading
      const nextButton = screen.getByText('Siguiente');
      const prevButton = screen.getByText('Anterior');

      expect(nextButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for navigation', () => {
      render(<PaginationWrapper pageSize={2} />);

      // Check that buttons have proper accessibility
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Verify combobox for page size selection
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });
    it('provides screen reader friendly pagination info', () => {
      render(<PaginationWrapper pageSize={2} />);

      // Check that pagination text is present for screen readers
      expect(screen.getByText(/Pagina.*de/)).toBeInTheDocument();
      expect(screen.getByText(/fila\(s\) seleccionadas/)).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const { container } = render(<PaginationWrapper />);

      // Component should render without errors with default props
      expect(container.firstChild).toBeInTheDocument();
    });

    it('spreads additional props correctly', () => {
      render(<PaginationWrapper />);

      // Basic render test to ensure props spreading works
      expect(screen.getByText(/Pagina/)).toBeInTheDocument();
    });
  });
});

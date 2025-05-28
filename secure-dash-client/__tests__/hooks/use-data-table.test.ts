import { createColumnHelper } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';

import { useDataTable } from '@/hooks/use-data-table';

// Mock nuqs
jest.mock('nuqs', () => ({
  useQueryState: jest.fn(),
  useQueryStates: jest.fn(),
  parseAsInteger: {
    withOptions: jest.fn().mockReturnThis(),
    withDefault: jest.fn().mockReturnThis(),
  },
  parseAsArrayOf: jest.fn(() => ({
    withOptions: jest.fn().mockReturnThis(),
    withDefault: jest.fn().mockReturnThis(),
  })),
  parseAsString: {
    withOptions: jest.fn().mockReturnThis(),
    withDefault: jest.fn().mockReturnThis(),
  },
}));

// Mock the parsers
jest.mock('@/lib/parsers', () => ({
  getSortingStateParser: jest.fn(() => ({
    withOptions: jest.fn().mockReturnThis(),
    withDefault: jest.fn().mockReturnThis(),
  })),
  getFiltersStateParser: jest.fn(() => ({
    withOptions: jest.fn().mockReturnThis(),
    withDefault: jest.fn().mockReturnThis(),
  })),
}));

// Mock the debounced callback hook
jest.mock('@/hooks/use-debounced-callback', () => ({
  useDebouncedCallback: jest.fn((callback) => callback),
}));

interface TestData {
  id: string;
  name: string;
  email: string;
}

const columnHelper = createColumnHelper<TestData>();

const mockColumns = [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Name',
    enableColumnFilter: true,
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    enableColumnFilter: true,
  }),
];

const mockData: TestData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

describe('useDataTable', () => {
  const mockSetPage = jest.fn();
  const mockSetPerPage = jest.fn();
  const mockSetSorting = jest.fn();
  const mockSetFilters = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks for nuqs hooks - keep them simple
    const { useQueryState, useQueryStates } = jest.requireMock('nuqs');

    // Each test will call useQueryState multiple times, so we need to reset and setup fresh returns
    useQueryState.mockImplementation((key: string) => {
      if (key === 'page') return [1, mockSetPage];
      if (key === 'perPage') return [10, mockSetPerPage];
      if (key === 'sort') return [[], mockSetSorting];
      return [null, jest.fn()];
    });

    useQueryStates.mockReturnValue([{}, mockSetFilters]); // filters
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
      }),
    );

    expect(result.current.table).toBeDefined();
    expect(result.current.table.getState().pagination.pageIndex).toBe(0); // 1-based page converted to 0-based
    expect(result.current.table.getState().pagination.pageSize).toBe(10);
  });

  it('should handle pagination changes correctly', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 5,
      }),
    );

    act(() => {
      result.current.table.setPageIndex(2);
    });

    expect(mockSetPage).toHaveBeenCalledWith(3); // Convert 0-based to 1-based
  });

  it('should handle page size changes correctly', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 5,
      }),
    );

    act(() => {
      result.current.table.setPageSize(25);
    });

    expect(mockSetPerPage).toHaveBeenCalledWith(25);
  });

  it('should handle sorting changes correctly', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
      }),
    );

    act(() => {
      result.current.table.setSorting([{ id: 'name', desc: false }]);
    });

    expect(mockSetSorting).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
        initialState: {
          pagination: { pageIndex: 0, pageSize: 20 },
          rowSelection: { '1': true },
          columnVisibility: { email: false },
        },
      }),
    );

    const state = result.current.table.getState();
    expect(state.rowSelection).toEqual({ '1': true });
    expect(state.columnVisibility).toEqual({ email: false });
  });

  it('should handle row selection changes', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
      }),
    );

    act(() => {
      result.current.table.setRowSelection({ '1': true, '2': true });
    });

    expect(result.current.table.getState().rowSelection).toEqual({
      '1': true,
      '2': true,
    });
  });

  it('should handle column visibility changes', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
      }),
    );

    act(() => {
      result.current.table.setColumnVisibility({ email: false });
    });

    expect(result.current.table.getState().columnVisibility).toEqual({
      email: false,
    });
  });

  it('should use custom query state options', () => {
    const mockStartTransition = jest.fn();

    renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
        history: 'push',
        debounceMs: 500,
        throttleMs: 100,
        clearOnDefault: true,
        scroll: true,
        shallow: false,
        startTransition: mockStartTransition,
      }),
    );

    const { parseAsInteger } = jest.requireMock('nuqs');
    expect(parseAsInteger.withOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        history: 'push',
        debounceMs: 500,
        throttleMs: 100,
        clearOnDefault: true,
        scroll: true,
        shallow: false,
        startTransition: mockStartTransition,
      }),
    );
  });

  it('should filter columns for filterable columns', () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        pageCount: 1,
      }),
    );

    // Check that the table is properly initialized with filterable columns
    // The 'id' column doesn't have enableColumnFilter, so only 'name' and 'email' should be filterable
    const columns = result.current.table.getAllColumns();
    const filterableColumns = columns.filter((col) => col.getCanFilter());

    expect(filterableColumns.length).toBe(2); // name and email
  });

  it('should handle data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) =>
        useDataTable({
          data,
          columns: mockColumns,
          pageCount: 1,
        }),
      {
        initialProps: { data: mockData },
      },
    );

    const newData = [
      ...mockData,
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    rerender({ data: newData });

    expect(result.current.table.getRowModel().rows).toHaveLength(3);
  });

  it('should handle pageCount changes', () => {
    const { result, rerender } = renderHook(
      ({ pageCount }) =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount,
        }),
      {
        initialProps: { pageCount: 1 },
      },
    );

    rerender({ pageCount: 5 });

    expect(result.current.table.getPageCount()).toBe(5);
  });
});

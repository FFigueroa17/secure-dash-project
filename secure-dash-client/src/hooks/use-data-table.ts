'use client';

/**
 * useDataTable
 *
 * A comprehensive React hook for managing advanced data table state and behavior,
 * including pagination, sorting, filtering, column visibility, and row selection.
 * Integrates with URL query parameters for state persistence and sharing, and
 * supports debounced and throttled updates for optimal UX and performance.
 *
 * This hook is designed to work with TanStack Table (React Table v8) and nuqs for
 * query state management.
 *
 * @template TData - The type of the table's row data.
 * @param {UseDataTableProps<TData>} props - Configuration and options for the data table.
 * @returns {object} - An object containing the TanStack table instance and config values.
 */

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  type Parser,
  useQueryState,
  type UseQueryStateOptions,
  useQueryStates,
} from 'nuqs';
import * as React from 'react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getSortingStateParser } from '@/lib/parsers';
import type { ExtendedColumnSort, Option } from '@/types/data-table';

// Query parameter keys for pagination and sorting
const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'perPage';
const SORT_KEY = 'sort';

// Separator for array values in query params
const ARRAY_SEPARATOR = ',';

// Default debounce and throttle timings (ms)
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

/**
 * Props for useDataTable hook.
 * - Extends TableOptions, but omits internal state and manual flags.
 * - Requires pageCount for server-side pagination.
 * - Supports initial state, query/history options, and transition control.
 */
interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  history?: 'push' | 'replace';
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  startTransition?: React.TransitionStartFunction;
}

/**
 * useDataTable
 *
 * Main hook implementation.
 */
export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  // Destructure and set defaults for all props
  const {
    columns,
    pageCount = -1,
    initialState,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;

  /**
   * Memoized options for nuqs query state hooks.
   * Controls how query state is synced with the URL/history.
   */
  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ],
  );

  /**
   * Row selection state.
   * - Controls which rows are selected in the table.
   * - Not persisted to query string.
   */
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );

  /**
   * Column visibility state.
   * - Controls which columns are visible.
   * - Not persisted to query string.
   */
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  /**
   * Pagination state (page and perPage) synced with query string.
   * - `page` is 1-based for the UI, but TanStack Table expects 0-based.
   * - `perPage` is the number of rows per page.
   */
  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1),
  );
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10),
  );

  /**
   * Compose TanStack Table's PaginationState from query state.
   * - Converts 1-based page to 0-based pageIndex.
   */
  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index for TanStack Table
      pageSize: perPage,
    };
  }, [page, perPage]);

  /**
   * Pagination change handler.
   * - Updates both page and perPage in the query string.
   * - Accepts either a new value or an updater function.
   */
  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1); // convert to 1-based
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  /**
   * Memoized set of all column IDs.
   * - Used for sorting and filtering state parsing.
   */
  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[],
    );
  }, [columns]);

  /**
   * Sorting state synced with query string.
   * - Uses a custom parser to support multi-column and direction.
   */
  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  );

  /**
   * Sorting change handler.
   * - Accepts either a new value or an updater function.
   * - Updates the query string.
   */
  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting],
  );

  /**
   * Memoized list of columns that are filterable.
   * - Used to build filter state and parsers.
   */
  const filterableColumns = React.useMemo(() => {
    return columns.filter((column) => column.enableColumnFilter);
  }, [columns]);

  /**
   * Build a map of filter parsers for each filterable column.
   * - If the column has options, use an array parser (for multi-select).
   * - Otherwise, use a string parser.
   * - All parsers are configured with query state options.
   */
  const filterParsers = React.useMemo(() => {
    return filterableColumns.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, column) => {
      if ((column.meta as { options?: Option[] })?.options) {
        // Multi-select filter: parse as array of strings
        acc[column.id ?? ''] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR,
        ).withOptions(queryStateOptions);
      } else {
        // Single value filter: parse as string
        acc[column.id ?? ''] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions]);

  /**
   * Filter values state, synced with query string for each filterable column.
   * - Each key is a column ID, value is string or string[] or null.
   */
  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  /**
   * Debounced setter for filter values.
   * - Resets to page 1 when filters change.
   * - Debounce prevents excessive updates when typing.
   */
  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      void setPage(1); // Reset to first page on filter change
      void setFilterValues(values);
    },
    debounceMs,
  );

  /**
   * Compose initial column filters state from filterValues.
   * - Converts query string values into TanStack Table's ColumnFiltersState.
   * - Handles splitting string values with non-alphanumeric separators.
   */
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          // If value is an array, use as-is.
          // If value is a string with non-alphanumeric chars, split into array.
          // Otherwise, wrap in array.
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
              ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
              : [value];

          filters.push({
            id: key,
            value: processedValue,
          });
        }
        return filters;
      },
      [],
    );
  }, [filterValues]);

  /**
   * Column filters state for TanStack Table.
   * - Controls which filters are applied to which columns.
   * - Not directly synced to query string, but updates filterValues when changed.
   */
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  /**
   * Handler for column filters change.
   * - Updates local state and also updates query string via debouncedSetFilterValues.
   * - Ensures only filterable columns are updated.
   * - Removes filters from query string if they are removed from state.
   */
  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        // Compute next state
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue;

        // Build update object for query string
        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        // Remove filters that were present before but are now gone
        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        // Debounced update to query string
        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns],
  );

  /**
   * Create the TanStack Table instance.
   * - Passes all state and handlers.
   * - Enables manual mode for server-side pagination, sorting, and filtering.
   * - Sets up all row/column models and faceting helpers.
   */
  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false, // Disable column filter by default
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true, // Server-side pagination
    manualSorting: true, // Server-side sorting
    manualFiltering: true, // Server-side filtering
  });

  // Return the table instance and config values for consumers
  return { table, shallow, debounceMs, throttleMs };
}

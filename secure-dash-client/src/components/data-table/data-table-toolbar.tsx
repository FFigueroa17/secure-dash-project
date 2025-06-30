'use client';

import type { Table } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import * as React from 'react';

import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FilterConfig } from '@/types';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  filters: FilterConfig<TData>[];
  rowActions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  // Separate filters by position
  // Memoize leftFilters and rightFilters to avoid unnecessary recalculations
  const leftFilters = React.useMemo(
    () => filters.filter((filter) => filter.position !== 'right'),
    [filters],
  );
  const rightFilters = React.useMemo(
    () => filters.filter((filter) => filter.position === 'right'),
    [filters],
  );

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Left-positioned filters */}
        {leftFilters.map((filter) => (
          <DataTableToolbarFilter key={filter.column.id} filter={filter} />
        ))}

        {/* Reset filters button */}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="default"
            size="sm"
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Right-positioned filters */}
        {rightFilters.map((filter) => (
          <DataTableToolbarFilter key={filter.column.id} filter={filter} />
        ))}
        {children}
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  filter: FilterConfig<TData>;
}

function DataTableToolbarFilter<TData>({
  filter,
}: DataTableToolbarFilterProps<TData>) {
  const onFilterRender = React.useCallback(() => {
    switch (filter.filterType) {
      case 'text':
        return (
          <div className="relative">
            <Input
              id={`${filter.column.id}-input`}
              className={cn(
                'peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent h-9',
              )}
              value={(filter.column.getFilterValue() ?? '') as string}
              onChange={(e) => filter.column.setFilterValue(e.target.value)}
              placeholder={filter.placeholder ?? filter.label}
              type="text"
              aria-label={filter.label}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <Search size={20} aria-hidden="true" />
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={filter.placeholder ?? filter.label}
              value={(filter.column.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                filter.column.setFilterValue(event.target.value)
              }
              className={cn('h-8 w-[120px]', filter.unit && 'pr-8')}
            />
            {filter.unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {filter.unit}
              </span>
            )}
          </div>
        );

      case 'date':
      case 'dateRange':
        return (
          <DataTableDateFilter
            column={filter.column}
            title={filter.label ?? filter.column.id}
            multiple={filter.filterType === 'dateRange'}
            disableFutureDates={filter.disableFutureDates}
          />
        );

      case 'select':
      case 'multiSelect':
        return (
          <DataTableFacetedFilter
            column={filter.column}
            title={filter.label ?? filter.column.id}
            options={filter.options ?? []}
            multiple={filter.filterType === 'multiSelect'}
          />
        );

      default:
        return null;
    }
  }, [filter]);

  return onFilterRender();
}

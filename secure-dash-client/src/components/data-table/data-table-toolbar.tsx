'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
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
        {filters.map((filter) => (
          <DataTableToolbarFilter key={filter.column.id} filter={filter} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
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
          <Input
            placeholder={filter.placeholder ?? filter.label}
            value={(filter.column.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              filter.column.setFilterValue(event.target.value)
            }
            className="h-8 w-40 lg:w-56"
          />
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

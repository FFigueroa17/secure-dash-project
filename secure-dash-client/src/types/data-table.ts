import type { ColumnSort, Row } from '@tanstack/react-table';
import { JSX } from 'react';

import { FilterItemSchema } from '@/lib/parsers';

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: JSX.Element;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'view' | 'update' | 'delete';
}

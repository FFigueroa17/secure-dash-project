import { Column } from '@tanstack/react-table';

import { Option } from '@/types/data-table';

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type EmptyProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  keyof React.ComponentProps<T>
>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface FilterConfig<TData> {
  column: Column<TData>;
  label: string;
  filterType:
    | 'text'
    | 'number'
    | 'date'
    | 'dateRange'
    | 'select'
    | 'multiSelect';
  disableFutureDates?: boolean; // For dateRange filter
  placeholder?: string;
  options?: Array<Option>; // For select/multiSelect
  unit?: string; // For number fields
  position?: 'left' | 'right'; // Choose where the filter should be placed
}

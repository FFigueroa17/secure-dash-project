import { Column } from '@tanstack/react-table';

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
  placeholder?: string;
  options?: Array<{ label: string; value: string }>; // For select/multiSelect
  unit?: string; // For number fields
}

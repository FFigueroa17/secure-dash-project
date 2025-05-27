import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  isPending?: boolean;
}

const DataTablePagination = <TData,>({
  table,
  className,
  isPending,
  ...props
}: DataTablePaginationProps<TData>) => {
  return (
    <div
      className={cn('flex items-center justify-between gap-3', className)}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        Pagina{' '}
        <span className="font-medium text-foreground">
          {table.getState().pagination.pageIndex + 1}
        </span>{' '}
        de{' '}
        <span className="font-medium text-foreground">
          {table.getPageCount()}
        </span>{' '}
        |{' '}
        <span className="font-medium text-foreground">
          {table.getFilteredSelectedRowModel().rows.length}
        </span>{' '}
        de{' '}
        <span className="font-medium text-foreground">
          {table.getFilteredRowModel().rows.length}
        </span>{' '}
        fila(s) seleccionadas
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap font-medium text-sm">
            Filas por página
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Pagination className="w-auto">
        <PaginationContent className="gap-3">
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:animate-pulse"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isPending}
              aria-label="Ir a la página anterior"
            >
              Anterior
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:animate-pulse"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isPending}
              aria-label="Ir a la página siguiente"
            >
              Siguiente
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DataTablePagination;

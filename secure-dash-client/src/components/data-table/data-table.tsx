import {
  ColumnDef,
  flexRender,
  type Table as TanstackTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';

import DataTablePagination from '@/components/data-table/data-table-pagination';
import { BlurFade } from '@/components/ui/blur-fade';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData>[];
  actionBar: React.ReactNode;
  isPending?: boolean;
}

const DataTable = <TData,>({
  table,
  columns,
  children,
  actionBar,
  isPending,
}: DataTableProps<TData>) => {
  // Single table implementation
  const tableContent = (
    <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                  className="relative h-11 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <div
                      className={cn(
                        header.column.getCanSort() &&
                          'flex h-full cursor-pointer select-none items-center gap-2',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        // Enhanced keyboard handling for sorting
                        if (
                          header.column.getCanSort() &&
                          (e.key === 'Enter' || e.key === ' ')
                        ) {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e);
                        }
                      }}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: (
                          <ArrowUp
                            className="shrink-0 opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        ),
                        desc: (
                          <ArrowDown
                            className="shrink-0 opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <tbody aria-hidden="true" className="table-row h-1"></tbody>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-14 hover:bg-accent/50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <TableCell colSpan={columns.length} className="py-5 h-full">
              <BlurFade>
                <Image
                  src="/empty-table.png"
                  alt="Tabla vacía"
                  width={200}
                  height={200}
                  quality={100}
                  className="mx-auto object-cover object-center"
                  priority
                />
                <p className="text-center text-sm text-muted-foreground">
                  No hay registros para mostrar.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Intenta con diferentes filtros o busca en otra sección.
                </p>
              </BlurFade>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <tbody aria-hidden="true" className="table-row h-1"></tbody>
    </Table>
  );

  return (
    <div className="flex flex-col md:h-full md:min-h-0">
      {/* Actions */}
      <div className="flex-shrink-0 mb-4">{children}</div>

      {/* Table - Conditional wrapper */}
      <div className="md:flex-1 md:min-h-0 relative">
        {/* Mobile: Direct table */}
        <div className="md:hidden">{tableContent}</div>

        {/* Desktop: ScrollArea wrapper */}
        <ScrollArea className="hidden md:block h-full">
          <ScrollBar orientation="horizontal" />
          {tableContent}
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2.5 flex-shrink-0 pt-4 border-t border-t-accent">
        <DataTablePagination table={table} isPending={isPending} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
};

export default DataTable;

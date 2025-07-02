'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { UserDetailsSheet } from '@/app/app/users/_components/user-details-sheet';
import { deleteUser } from '@/app/app/users/_lib/actions';
import {
  getPrimaryRole,
  getRoleConfig,
  getUserInitials,
} from '@/app/app/users/_lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { User } from '@/schemas/user';
import type { DataTableRowAction } from '@/types/data-table';
import { tryCatch } from '@/types/try-catch';

interface GetUsersTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<User> | null>
  >;
}

export function getUsersTableColumns(
  {
    // setRowAction,
  }: GetUsersTableColumnsProps,
): ColumnDef<User>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'user',
      header: 'Usuario',
      accessorKey: 'username',
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex gap-3 items-center flex-row justify-start">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.username}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
      size: 150,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      enableSorting: false,
      cell: ({ row }) => {
        const email = row.getValue('email') as string;

        return (
          <div className="flex gap-2 items-center flex-row justify-start">
            <Badge
              variant="outline"
              className="font-mono gap-1 py-0.5 px-2 text-xs"
            >
              {email}
            </Badge>
            <CopyButton
              value={email}
              tooltipMessage={`Copiar email: ${email}`}
            />
          </div>
        );
      },
      size: 150,
    },
    {
      id: 'roles',
      header: 'Rol Principal',
      cell: ({ row }) => {
        const roles = row.original.roles;
        const primaryRole = getPrimaryRole(roles);
        const { icon, badgeClass, label } = getRoleConfig(primaryRole);

        return (
          <Badge
            variant="outline"
            className={cn('font-mono gap-1 py-0.5 px-2 text-sm', badgeClass)}
          >
            {icon}
            {label}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => {
        const id = row.getValue('id') as string;
        const shortId = id.slice(0, 18) + '...';

        return (
          <div className="flex gap-2 items-center">
            <Badge
              variant="secondary"
              className="font-mono py-1.5 px-2 text-xs flex items-center gap-3"
            >
              {shortId}
              <CopyButton
                value={id}
                tooltipMessage={`Copiar ID completo: ${id}`}
              />
            </Badge>
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <DeleteUserButton userId={user.id} username={user.username} />
            <UserDetailsSheet user={user} />
          </div>
        );
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

/**
 * Delete User Button Component
 *
 * This component provides a delete button with confirmation for removing users.
 * It includes loading states and proper error handling.
 */
const DeleteUserButton = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const handleDeleteUser = async () => {
    startTransition(async () => {
      const { error } = await tryCatch(deleteUser(userId));

      if (error) {
        toast.error('Error al eliminar usuario', {
          description: error.message,
        });
        return;
      }

      setOpen(false);
      toast.success('Usuario eliminado', {
        description: `El usuario ${username} ha sido eliminado exitosamente.`,
      });
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipProvider>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Eliminar usuario {username}</TooltipContent>
        </TooltipProvider>
      </Tooltip>
      <PopoverContent className="w-fit" align="end">
        <div className="space-y-4 max-w-60">
          <div className="space-y-2">
            <h4 className="font-medium text-destructive">Cuidado!</h4>
            <p className="text-xs text-muted-foreground">
              Estás a punto de eliminar el usuario <strong>{username}</strong>.
              Esta acción eliminará el usuario y todos sus datos asociados.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDeleteUser}
              disabled={isPending}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              size="sm"
              disabled={isPending}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

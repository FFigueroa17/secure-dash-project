'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Pencil, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateUser } from '@/app/app/users/_lib/actions';
import {
  UpdateUserFormData,
  updateUserSchema,
} from '@/app/app/users/_lib/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { User as UserType } from '@/schemas/user';
import { tryCatch } from '@/types/try-catch';

interface UserDetailsSheetProps {
  user: UserType;
}
const AVAILABLE_ROLES = [
  { id: 'USER', label: 'Usuario', description: 'Permisos básicos del sistema' },
  {
    id: 'ADMIN',
    label: 'Administrador',
    description: 'Acceso completo al sistema',
  },
];

export const UserDetailsSheet = ({ user }: UserDetailsSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const userForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: '',
      email: '',
      roles: [],
    },
    values: {
      username: user.username,
      email: user.email,
      roles: user.roles,
    },
  });

  // Handle form submission with confirmation
  const onSubmit = async (data: UpdateUserFormData) => {
    const {
      error,
      ok,
      data: result,
    } = await tryCatch(updateUser(user.id, data));

    if (error) {
      userForm.setError('root', {
        message: error.message,
      });
      return;
    }

    if (ok && result) {
      toast.success('Usuario actualizado correctamente');
      setIsOpen(false);
      userForm.reset();
    }
  };

  const isSubmitting = userForm.formState.isSubmitting;

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className="px-5 pt-6 pb-0">
          <DrawerTitle className="text-xl font-bold text-left flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Editar usuario
          </DrawerTitle>
          <DrawerDescription className="text-base text-muted-foreground text-left">
            Edita los detalles del usuario.
          </DrawerDescription>
        </DrawerHeader>

        {/* Content */}
        <div className="flex flex-col p-5 pt-8 h-full">
          <Form {...userForm}>
            <form
              id="user-form"
              onSubmit={userForm.handleSubmit(onSubmit)}
              className="space-y-6 flex-1"
            >
              {/* Root error message */}
              {userForm.formState.errors.root && (
                <div className="flex items-center justify-start bg-red-500/10 p-2.5 rounded-md border border-red-500/20 text-sm px-4">
                  <p className="text-red-400">
                    {userForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Username input field */}
              <FormField
                control={userForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nombre de usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="john_doe"
                        className="font-mono"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      El nombre de usuario debe ser único y no puede contener
                      espacios.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email input field */}
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="john@example.com"
                        className="font-mono"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      El email debe ser único y debe ser una dirección de correo
                      electrónico válida.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Roles input field */}
              <FormField
                control={userForm.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Selecciona los roles que tendrá el usuario. Debe tener al
                      menos un rol.
                    </FormDescription>
                    <div className="space-y-4 my-4">
                      {AVAILABLE_ROLES.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            checked={field.value?.includes(role.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([
                                  ...(field.value ?? []),
                                  role.id,
                                ]);
                              } else {
                                field.onChange(
                                  field.value?.filter((r) => r !== role.id),
                                );
                              }
                            }}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {role.label}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {field.value?.length && field.value.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                          Roles seleccionados:
                        </span>
                        <div className="flex flex-row gap-2">
                          {field.value?.map((roleId) => {
                            const role = AVAILABLE_ROLES.find(
                              (r) => r.id === roleId,
                            );
                            return (
                              <Badge key={roleId} variant="secondary">
                                {role?.label}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Separator className="my-4" />

          {/* Footer  */}
          <DrawerFooter className="flex flex-row gap-3 p-0 mt-auto">
            <DrawerClose asChild>
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              form="user-form"
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !userForm.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Guardar
                </>
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Ban, Loader2, Lock, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { banIp } from '@/app/app/banned-ips/_lib/actions';
import { BanIPFormData, banIPSchema } from '@/app/app/banned-ips/_lib/schemas';
import { Button } from '@/components/ui/button';
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
import { tryCatch } from '@/types/try-catch';

export const BanIPSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const banForm = useForm<BanIPFormData>({
    resolver: zodResolver(banIPSchema),
    defaultValues: {
      ip: '',
    },
  });

  // Handle form submission with confirmation
  const onSubmit = async (data: BanIPFormData) => {
    const result = await tryCatch(banIp(data.ip));

    if (result.error) {
      banForm.setError('root', {
        message: result.error.message,
      });
      return;
    }

    if (result.ok && result.data.alreadyBanned) {
      banForm.setError('root', {
        message: result.data.message,
      });
      return;
    }

    if (result.ok) {
      toast.success('IP bloqueada correctamente');
      setIsOpen(false);
      banForm.reset();
    }
  };

  const isSubmitting = banForm.formState.isSubmitting;

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">
          <Lock className="h-3.5 w-3.5" />
          <span>Bloquear IP</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className="px-5 pt-6 pb-0">
          <DrawerTitle className="text-xl font-bold text-left flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Bloquear IP
          </DrawerTitle>
          <DrawerDescription className="text-base text-muted-foreground text-left">
            Ingresa la dirección IP que deseas bloquear en el sistema.
          </DrawerDescription>
        </DrawerHeader>

        {/* Content */}
        <div className="flex flex-col p-5 pt-8 h-full">
          <Form {...banForm}>
            <form
              id="ban-ip-form"
              onSubmit={banForm.handleSubmit(onSubmit)}
              className="space-y-6 flex-1"
            >
              {/* Root error message */}
              {banForm.formState.errors.root && (
                <div className="flex items-center justify-start bg-red-500/10 p-2.5 rounded-md border border-red-500/20 text-sm px-4">
                  <p className="text-red-400">
                    {banForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* IP input field */}
              <FormField
                control={banForm.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Dirección IP a bloquear
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="192.168.1.1 o 2001:db8::1"
                        className="font-mono"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Soporta direcciones IPv4 (ej: 192.168.1.1) e IPv6 (ej:
                      2001:db8::1)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Warning section with better visual hierarchy */}
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-destructive">
                    Acción de seguridad crítica
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Esta acción bloqueará inmediatamente la dirección IP
                    especificada. La IP será agregada a la lista de direcciones
                    prohibidas y no podrá acceder a los servicios del servidor.
                  </p>
                </div>
              </div>
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
              form="ban-ip-form"
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={isSubmitting || !banForm.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Ban className="h-3.5 w-3.5" />
                  Bloquear IP
                </>
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

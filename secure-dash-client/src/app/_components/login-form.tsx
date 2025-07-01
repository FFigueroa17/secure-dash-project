'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/types/try-catch';

import { type LoginFormData, loginSchema } from '../_lib/auth-schemas';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('emailOrUsername', data.emailOrUsername);
    formData.append('password', data.password);
    formData.append('rememberMe', data.rememberMe?.toString() || 'false');

    const result = await tryCatch(signin(formData));

    if (result.error) {
      form.setError('root', {
        message:
          'Login failed, please try again. Error message: ' + result.error,
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-light text-foreground leading-tight">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your account and continue your journey with us
        </p>

        {form.formState.errors.root && (
          <div className="flex items-center justify-center bg-red-500/10 p-2.5 rounded-md border border-red-500/20 text-sm">
            <p className="text-red-400">{form.formState.errors.root.message}</p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="emailOrUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Email or username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your email or username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <span className="text-foreground/90">
                        Keep me signed in
                      </span>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        {/* Or continue with */}
        <div className="relative flex items-center justify-center py-4">
          <span className="w-full border-t border-border"></span>
          <span className="px-4 text-sm text-muted-foreground bg-background absolute">
            Or continue with
          </span>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground">
          New to our platform?{' '}
          <Button
            onClick={onSwitchToRegister}
            disabled={form.formState.isSubmitting}
            variant="link"
          >
            Create Account
          </Button>
        </p>
      </div>
    </div>
  );
}

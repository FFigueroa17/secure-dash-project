import { z } from 'zod/v4';

// Shared validation patterns
const emailSchema = z.email('Please enter a valid email address');

const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens',
  );

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

// Login schema - allows either username or email
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required')
    .refine(
      (value) => {
        // Check if it's a valid email or a valid username
        const isEmail = z.email().safeParse(value).success;
        const isUsername = usernameSchema.safeParse(value).success;
        return isEmail || isUsername;
      },
      {
        message: 'Please enter a valid email address or username',
      },
    ),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

// Register schema - requires all fields
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

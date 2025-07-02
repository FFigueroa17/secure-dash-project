import z from 'zod/v4';

/**
 * Zod validation schema for updating existing users.
 *
 * This schema validates user input for the user update functionality.
 * All fields are optional to allow partial updates.
 *
 * @example
 * ```typescript
 * // Valid partial update
 * updateUserSchema.parse({ email: "newemail@example.com" }); // ✓ Valid
 * ```
 */
export const updateUserSchema = z.object({
  /** Username - optional for updates */
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .optional(),
  /** Email address - optional for updates */
  email: z.email('Must be a valid email address').optional(),
  /** Array of user roles - optional for updates */
  roles: z
    .array(z.string())
    .min(1, 'At least one role must be assigned')
    .optional(),
});

// Pick only the roles field from the updateUserSchema
export const updateRolesSchema = updateUserSchema.pick({
  roles: true,
});

/**
 * TypeScript type derived from the updateUserSchema validation schema.
 *
 * This type represents the structure of validated form data for updating users.
 *
 * @example
 * ```typescript
 * const formData: UpdateUserFormData = {
 *   email: "newemail@example.com"
 * };
 * ```
 */
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdateRoles = z.infer<typeof updateRolesSchema>;

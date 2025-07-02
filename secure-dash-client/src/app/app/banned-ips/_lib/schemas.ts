import z from 'zod/v4';

/**
 * Zod validation schema for banning IP addresses.
 *
 * This schema validates IP address input for the manual IP banning functionality.
 * It ensures that the provided IP address is in a valid IPv4 or IPv6 format
 * before allowing the ban operation to proceed.
 *
 * Validation rules:
 * - ip: Must be a valid IPv4 address (e.g., "192.168.1.100") or IPv6 address (e.g., "2001:db8::1")
 *
 * @example
 * ```typescript
 * // Valid IPv4 address
 * banIPSchema.parse({ ip: "192.168.1.100" }); // ✓ Valid
 *
 * // Valid IPv6 address
 * banIPSchema.parse({ ip: "2001:db8::1" }); // ✓ Valid
 *
 * // Invalid IP address
 * banIPSchema.parse({ ip: "invalid-ip" }); // ✗ Throws validation error
 * ```
 */
export const banIPSchema = z.object({
  /** IP address to ban - must be valid IPv4 or IPv6 format */
  ip: z.union([z.ipv4(), z.ipv6()]),
});

/**
 * TypeScript type derived from the banIPSchema validation schema.
 *
 * This type represents the structure of validated form data for banning IP addresses.
 * It ensures type safety when working with IP ban form submissions throughout the application.
 *
 * @example
 * ```typescript
 * const formData: BanIPFormData = {
 *   ip: "192.168.1.100"
 * };
 * ```
 */
export type BanIPFormData = z.infer<typeof banIPSchema>;

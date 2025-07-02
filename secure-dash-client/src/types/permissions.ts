/**
 * Permission system type definitions for the application.
 * This file provides type safety for roles and permissions throughout the app.
 */

/**
 * Available permissions in the system.
 * Each permission represents a specific action that can be performed.
 */
export type Permission = 'view' | 'create' | 'update' | 'delete' | 'manage';

/**
 * Available roles in the system.
 * Each role has a specific set of permissions.
 */
export type Role = 'USER' | 'ADMIN';

/**
 * Permission check result.
 * - `true`: User has the permission
 * - `false`: User is authenticated but doesn't have the permission
 * - `null`: User is not authenticated
 */
export type PermissionResult = boolean | null;

/**
 * Mapping of roles to their permissions for type safety.
 */
export type RolePermissions = Record<Role, Permission[]>;

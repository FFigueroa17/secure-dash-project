/**
 * Data Access Layer (DAL) for authentication and user management.
 * This module provides server-side functions for session verification and user data retrieval
 * from the FastAPI backend. All functions are cached using React's cache mechanism for
 * optimal performance in server components.
 *
 * @fileoverview Authentication and user data access utilities for Next.js server components
 */

import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { decrypt, SessionPayload } from '@/lib/session';
import {
  Permission,
  PermissionResult,
  Role,
  RolePermissions,
} from '@/types/permissions';

/**
 * Interface defining the structure of a verified session.
 */
interface VerifiedSession {
  /** Indicates if the user is authenticated */
  isAuth: true;
  /** Unique identifier for the authenticated user */
  userId: string;
  /** JWT token for API authentication */
  token: string;
}

/**
 * Verifies the user's session by checking the session cookie and validating the JWT token.
 * This function is cached to prevent redundant session verification calls within the same request.
 * If the session is invalid or missing, the user is redirected to the login page.
 *
 * @returns Promise resolving to verified session data containing user ID and token
 * @throws Will redirect to '/' (login) if session is invalid or missing
 *
 * @example
 * ```typescript
 * // In a server component or API route
 * const session = await verifySession();
 * console.log('Authenticated user ID:', session.userId);
 * ```
 */
export const verifySession = cache(async (): Promise<VerifiedSession> => {
  // Retrieve the session cookie from the request
  const cookie = (await cookies()).get('session')?.value;

  // Decrypt and verify the session token
  const session = await decrypt(cookie);

  // Redirect to login if session is invalid or missing required fields
  if (!session?.token) {
    redirect('/');
  }

  return { isAuth: true, userId: session.userId, token: session.token };
});

/**
 * Fetches the current user's data from the FastAPI backend.
 * This function is cached to prevent redundant API calls within the same request.
 * Requires a valid session and uses the session token for authentication.
 *
 * @returns Promise resolving to User object or null if user cannot be fetched
 *
 * @example
 * ```typescript
 * // In a server component
 * const user = await getUser();
 * if (user) {
 *   console.log('Current user:', user.username);
 * } else {
 *   console.log('No user found or authentication failed');
 * }
 * ```
 */
export const getUser = cache(async (): Promise<SessionPayload | null> => {
  // Retrieve the session cookie from the request
  const cookie = (await cookies()).get('session')?.value;

  // Decrypt and verify the session token
  const session = await decrypt(cookie);

  // Return null if the session is invalid
  if (!session) {
    return null;
  }

  // Return the session payload
  return session;
});

/**
 * Permission configuration mapping roles to their allowed actions.
 * This can be extended or moved to a database for dynamic permissions.
 */
const ROLE_PERMISSIONS: RolePermissions = {
  USER: ['view'],
  ADMIN: ['view', 'create', 'update', 'delete', 'manage'],
} as const;

/**
 * Checks if the current authenticated user has a specific permission.
 * This function extracts roles from the session and verifies permissions.
 * Returns null if the user is not authenticated.
 *
 * @param permission - The permission to check (e.g., 'view', 'create', 'update', 'delete')
 * @returns Promise resolving to boolean indicating if user has permission, or null if not authenticated
 *
 * @example
 * ```typescript
 * // In a server component
 * const canDelete = await hasPermission('delete');
 * if (canDelete === true) {
 *   // User can delete
 * } else if (canDelete === false) {
 *   // User is authenticated but doesn't have permission
 * } else {
 *   // User is not authenticated (canDelete === null)
 * }
 * ```
 */
export const hasPermission = cache(
  async (permission: Permission): Promise<PermissionResult> => {
    // Get the current user session
    const session = await getUser();

    // Return null if user is not authenticated
    if (!session || !session.roles) {
      return null;
    }

    // Check if any of the user's roles have the required permission
    return session.roles.some((role) =>
      ROLE_PERMISSIONS[role as Role]?.includes(permission),
    );
  },
);

/**
 * Checks if the current authenticated user has any of the specified permissions.
 * Useful for checking multiple permissions where any one of them grants access.
 *
 * @param permissions - Array of permissions to check
 * @returns Promise resolving to boolean indicating if user has any of the permissions, or null if not authenticated
 *
 * @example
 * ```typescript
 * const canModify = await hasAnyPermission(['create', 'update', 'delete']);
 * ```
 */
export const hasAnyPermission = cache(
  async (permissions: Permission[]): Promise<PermissionResult> => {
    // Get the current user session
    const session = await getUser();

    // Return null if user is not authenticated
    if (!session || !session.roles) {
      return null;
    }

    // Check if user has any of the specified permissions
    return permissions.some((permission) =>
      session.roles.some((role) =>
        ROLE_PERMISSIONS[role as Role]?.includes(permission),
      ),
    );
  },
);

/**
 * Checks if the current authenticated user has all of the specified permissions.
 * Useful for operations that require multiple permissions.
 *
 * @param permissions - Array of permissions that are all required
 * @returns Promise resolving to boolean indicating if user has all permissions, or null if not authenticated
 *
 * @example
 * ```typescript
 * const canManageUsers = await hasAllPermissions(['create', 'update', 'delete']);
 * ```
 */
export const hasAllPermissions = cache(
  async (permissions: Permission[]): Promise<PermissionResult> => {
    // Get the current user session
    const session = await getUser();

    // Return null if user is not authenticated
    if (!session || !session.roles) {
      return null;
    }

    // Check if user has all of the specified permissions
    return permissions.every((permission) =>
      session.roles.some((role) =>
        ROLE_PERMISSIONS[role as Role]?.includes(permission),
      ),
    );
  },
);

/**
 * Checks if the current authenticated user has a specific role.
 *
 * @param role - The role to check for
 * @returns Promise resolving to boolean indicating if user has the role, or null if not authenticated
 *
 * @example
 * ```typescript
 * const isAdmin = await hasRole('ADMIN');
 * ```
 */
export const hasRole = cache(async (role: Role): Promise<PermissionResult> => {
  // Get the current user session
  const session = await getUser();

  // Return null if user is not authenticated
  if (!session || !session.roles) {
    return null;
  }

  // Check if user has the specified role
  return session.roles.includes(role);
});

/**
 * Gets all permissions for the current authenticated user based on their roles.
 *
 * @returns Promise resolving to array of permissions, or null if not authenticated
 *
 * @example
 * ```typescript
 * const userPermissions = await getUserPermissions();
 * if (userPermissions) {
 *   console.log('User can:', userPermissions);
 * }
 * ```
 */
export const getUserPermissions = cache(
  async (): Promise<Permission[] | null> => {
    // Get the current user session
    const session = await getUser();

    // Return null if user is not authenticated
    if (!session || !session.roles) {
      return null;
    }

    // Collect all unique permissions from user's roles
    const permissions = new Set<Permission>();
    session.roles.forEach((role) => {
      const rolePermissions = ROLE_PERMISSIONS[role as Role] || [];
      rolePermissions.forEach((permission) => permissions.add(permission));
    });

    return Array.from(permissions);
  },
);

/**
 * Requires the user to have a specific permission, redirecting to login if not authenticated
 * or throwing an error if permission is denied.
 *
 * @param permission - The required permission
 * @throws Will redirect to '/' if not authenticated or throw error if permission denied
 *
 * @example
 * ```typescript
 * // In a server component that requires delete permission
 * await requirePermission('delete');
 * // Code here will only run if user has delete permission
 * ```
 */
export const requirePermission = cache(
  async (permission: Permission): Promise<void> => {
    const hasAccess = await hasPermission(permission);

    if (hasAccess === null) {
      // User is not authenticated, redirect to login
      redirect('/');
    }

    if (hasAccess === false) {
      // User is authenticated but doesn't have permission
      throw new Error(`Access denied: ${permission} permission required`);
    }

    // Permission granted, continue execution
  },
);

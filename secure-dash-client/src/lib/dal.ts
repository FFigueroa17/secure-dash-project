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

/**
 * Session management utilities for secure JWT-based authentication.
 * This module provides functions to create, encrypt, decrypt, and manage user sessions
 * using JSON Web Tokens (JWT) stored in HTTP-only cookies.
 *
 * @fileoverview Session management for Next.js application with JWT authentication
 */

import 'server-only';

import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

/**
 * Interface defining the structure of session data stored in JWT payload.
 * Extends the standard JWT payload with application-specific user information.
 */
interface SessionPayload extends JWTPayload {
  /** Unique identifier for the user */
  userId: string;
  /** Username of the authenticated user */
  username: string;
  /** Role/permission level of the user (e.g., 'admin', 'user') */
  role: string;
  /**  JWT Token */
  token: string;
  /** Expiration date of the session */
  expiresAt: Date;
}

// Session secret key from environment variables
const secretKey = process.env.SESSION_SECRET;
// Encode the secret key for use with the jose library
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypts session payload into a signed JWT token.
 *
 * @param payload - The session data to encrypt containing user information
 * @returns Promise resolving to an encrypted JWT string
 *
 * @example
 * ```typescript
 * const token = await encrypt({
 *   userId: '123',
 *   username: 'john_doe',
 *   role: 'user',
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export const encrypt = async (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15min')
    .sign(encodedKey);
};

/**
 * Decrypts and verifies a JWT session token.
 *
 * @param session - The JWT session string to decrypt (optional, defaults to empty string)
 * @returns Promise resolving to the decrypted session payload or null if verification fails
 *
 * @example
 * ```typescript
 * const sessionData = await decrypt(sessionToken);
 * if (sessionData) {
 *   console.log('User ID:', sessionData.userId);
 * }
 * ```
 */
export const decrypt = async (session: string | undefined = '') => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log('[DEBUG] Failed to verify session', error);
    return null;
  }
};

/**
 * Creates a new user session by encrypting user data and setting it as an HTTP-only cookie.
 * The session expires after 15 minutes and the JWT token expires after 15 minutes.
 *
 * @param token - JWT token received from the authentication API
 *
 * @example
 * ```typescript
 * await createSession('jwt_token_here');
 * ```
 */
export const createSession = async (token: string) => {
  // Make direct API call to get user data using the provided token
  // This bypasses the session verification which would cause circular dependency
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  // Check if the request was successful
  if (!response.ok) {
    throw new Error('Failed to fetch user data when creating session');
  }

  const user = responseJson;

  // If the user is not found, throw an error
  if (!user) {
    throw new Error('User not found when creating session');
  }

  // Set session expiration to 15 minutes from now
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Encrypt the session payload
  const session = await encrypt({
    userId: user.id || '',
    username: user.username,
    role: user.role || '',
    token,
    expiresAt,
  });

  // Get cookie store instance
  const cookieStore = await cookies();

  // Set the session cookie with security options
  cookieStore.set('session', session, {
    httpOnly: true, // Prevent client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    expires: expiresAt, // Cookie expiration date
    sameSite: 'lax', // CSRF protection
    path: '/', // Available across the entire site
  });
};

/**
 * Deletes the current user session by removing the session cookie.
 * This effectively logs out the user.
 *
 * @example
 * ```typescript
 * await deleteSession(); // User is now logged out
 * ```
 */
export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
};

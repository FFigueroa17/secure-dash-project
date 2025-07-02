/**
 * Authentication server actions for user registration, login, and logout.
 * These functions handle form validation, API communication with the FastAPI backend,
 * and session management for the Next.js application.
 *
 * @fileoverview Server actions for authentication flows
 */

'use server';

import { redirect } from 'next/navigation';

import { loginSchema, registerSchema } from '@/app/_lib/auth-schemas';
import { createSession, deleteSession } from '@/lib/session';
import { tryCatch } from '@/types/try-catch';

/**
 * Handles user registration by validating form data and creating a new user account.
 *
 * @param formData - FormData object containing registration fields:
 *   - username: User's chosen username
 *   - email: User's email address
 *   - password: User's password
 *   - confirmPassword: Password confirmation
 *   - acceptTerms: Terms and conditions acceptance
 *
 * @returns Promise resolving to Result object with success/error status, or null
 *
 * @example
 * ```typescript
 * const result = await signup(formData);
 * if (result && !result.ok) {
 *   console.error('Signup failed:', result.error.message);
 * }
 * ```
 */
export const signup = async (formData: FormData) => {
  // Validate form fields using Zod schema
  const validatedFields = registerSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    acceptTerms: formData.get('acceptTerms') === 'true',
  });

  // If any form fields are invalid, return early with error
  if (!validatedFields.success) {
    throw new Error('Invalid form data ' + validatedFields.error.message);
  }

  // Destructure the validated fields
  const { username, email, password } = validatedFields.data;

  // Send registration request to FastAPI backend
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/register`;
  const requestBody = { username, email, password };

  // Send registration request to FastAPI backend
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  // Handle registration failure and return error message
  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.detail);
  }

  return {
    ok: true,
  };
};

/**
 * Handles user authentication by validating credentials and creating a session.
 *
 * @param formData - FormData object containing login credentials:
 *   - emailOrUsername: User's email address or username
 *   - password: User's password
 *   - rememberMe: Whether to remember the user (optional)
 *
 * @returns Promise resolving to Result object with success/error status, or null
 *
 * @example
 * ```typescript
 * const result = await signin(formData);
 * if (result && !result.ok) {
 *   console.error('Login failed:', result.error.message);
 * }
 * ```
 */
export const signin = async (formData: FormData) => {
  // Validate form fields using Zod schema
  const validatedFields = loginSchema.safeParse({
    emailOrUsername: formData.get('emailOrUsername'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'true',
  });

  // If any form fields are invalid, return early with error
  if (!validatedFields.success) {
    throw new Error('Invalid form data ' + validatedFields.error.message);
  }

  // Destructure the validated fields
  const { emailOrUsername, password } = validatedFields.data;

  // Send authentication request to FastAPI backend
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
  const requestBody = { username_or_email: emailOrUsername, password };

  // Send authentication request to FastAPI backend
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  // If the response is not ok or there is an error message, return early
  const responseJson = await response.json();
  if (!response.ok || responseJson.message) {
    throw new Error(`Failed to login: ${responseJson.message}`);
  }

  // Create encrypted session with JWT token from API response
  const result = await tryCatch(createSession(responseJson.access_token));

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    ok: true,
  };
};

/**
 * Handles user logout by destroying the current session and redirecting to home.
 * This function clears the session cookie and redirects the user to the public area.
 *
 * @example
 * ```typescript
 * await logout(); // User is logged out and redirected to home page
 * ```
 */
export const logout = async () => {
  // Remove the session cookie
  await deleteSession();

  // Redirect to home page
  redirect('/');
};

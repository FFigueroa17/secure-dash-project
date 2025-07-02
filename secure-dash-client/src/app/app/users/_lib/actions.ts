'use server';

import { revalidateTag } from 'next/cache';

import { verifySession } from '@/lib/dal';

import type { UpdateUserFormData } from './schemas';

/**
 * Updates an existing user using the backend API.
 *
 * This server action provides the ability to update users through
 * the backend API. It includes:
 *
 * 1. **Authentication validation**: Ensures the user has a valid session before
 *    allowing the update operation to proceed
 *
 * 2. **Direct API integration**: Communicates with the backend service
 *    to update the user
 *
 * 3. **Error handling**: Properly handles and reports API errors with detailed
 *    error messages from the backend
 *
 * 4. **Authorization**: Uses bearer token authentication to ensure secure
 *    communication with the API
 *
 * @param userId - The ID of the user to update
 * @param userData - The user data to update (partial update allowed)
 * @returns Promise resolving to success object or error object
 *
 * @throws {Error} When the API request fails or returns an error response
 *
 * @example
 * ```typescript
 * const result = await updateUser('user123', { email: 'newemail@example.com' });
 * if (result.error) {
 *   console.error('Failed to update user:', result.error);
 * } else {
 *   console.log('User updated successfully');
 * }
 * ```
 */
export async function updateUser(userId: string, userData: UpdateUserFormData) {
  // Verify user session and authorization
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };

  // Construct the API endpoint URL for updating the specific user
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;

  // Send PUT request to update the user
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(userData),
  });

  // Handle API errors and throw with detailed error message
  if (!res.ok) {
    const response = await res.json();
    throw new Error(
      `Failed to update user: ${response.message || response.error}`,
    );
  }

  // Revalidate the users cache
  revalidateTag('users');

  // Return success indicator
  return { ok: true };
}

/**
 * Deletes a user using the backend API.
 *
 * This server action provides the ability to delete users through
 * the backend API. It includes:
 *
 * 1. **Authentication validation**: Ensures the user has a valid session before
 *    allowing the delete operation to proceed
 *
 * 2. **Direct API integration**: Communicates with the backend service
 *    to delete the user
 *
 * 3. **Error handling**: Properly handles and reports API errors with detailed
 *    error messages from the backend
 *
 * 4. **Authorization**: Uses bearer token authentication to ensure secure
 *    communication with the API
 *
 * @param userId - The ID of the user to delete
 * @returns Promise resolving to success object or error object
 *
 * @throws {Error} When the API request fails or returns an error response
 *
 * @example
 * ```typescript
 * const result = await deleteUser('user123');
 * if (result.error) {
 *   console.error('Failed to delete user:', result.error);
 * } else {
 *   console.log('User deleted successfully');
 * }
 * ```
 */
export async function deleteUser(userId: string) {
  // Verify user session and authorization
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };

  // Construct the API endpoint URL for deleting the specific user
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`;

  // Send DELETE request to delete the user
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  });

  // Handle API errors and throw with detailed error message
  if (!res.ok) {
    const response = await res.json();
    throw new Error(
      `Failed to delete user: ${response.message || response.error}`,
    );
  }

  // Revalidate the users cache
  revalidateTag('users');
  revalidateTag('users-overview');

  // Return success indicator
  return { ok: true };
}

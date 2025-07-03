import 'server-only';

import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import { unstable_cache } from '@/lib/unstable-cache';
import { APIResponse } from '@/schemas/log';
import { User, UsersOverview } from '@/schemas/user';

import type { GetUsersSchema } from './validations';

/**
 * Builds search parameters for the users API endpoint.
 */
function buildUsersSearchParams(input: GetUsersSchema): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Add pagination parameters
  searchParams.set('page', input.page.toString());
  searchParams.set('page_size', input.perPage.toString());

  // Add more filters as needed
  return searchParams;
}

/**
 * Fetches users from the backend API with caching optimization.
 *
 * This function implements the same patterns as getBannedIPs:
 *
 * 1. **Server-side caching**: Uses Next.js unstable_cache to cache responses
 *    for 30 seconds, reducing API calls and improving performance
 *
 * 2. **Cache invalidation**: Uses tags for selective cache invalidation when
 *    new users are available or when manual refresh is needed
 *
 * 3. **Error resilience**: Returns a safe default structure if the API fails,
 *    preventing the UI from breaking due to network issues
 *
 * 4. **Cache key strategy**: Includes all input parameters in the cache key
 *    to ensure different queries are cached separately
 *
 * @param input - The validated input schema containing query parameters for fetching users
 * @returns Promise resolving to the API response containing users and pagination info
 */
export async function getUsers(
  input: GetUsersSchema,
): Promise<APIResponse<User>> {
  const session = await verifySession();
  if (!session) return redirect('/');

  return await unstable_cache(
    async () => {
      const searchParams = buildUsersSearchParams(input);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users?${searchParams.toString()}`;

      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          const response = await res.json();
          console.error('Failed to fetch users:', response);
          throw new Error(response.error);
        }

        const response = await res.json();
        return {
          values: response.users,
          totalPages: response.total_pages + 1,
          currentPage: response.current_page,
          hasNextPage: response.has_next_page,
          hasPreviousPage: response.has_previous_page,
          totalCount: response.total_count,
        };
      } catch (error) {
        console.warn('Error fetching users:', error);
        return {
          values: [],
          totalPages: 0,
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: 0,
        };
      }
    },
    // Cache key includes all parameters that affect the query result
    ['users', input.page.toString(), input.perPage.toString()],
    {
      revalidate: 10, // Cache for 10 seconds - balance between performance and data freshness
      tags: ['users'], // Allows for targeted cache invalidation
    },
  )();
}

/**
 * Fetches users statistics overview from the backend API.
 *
 * This function provides dashboard statistics for users and implements:
 *
 * 1. **Longer cache duration**: Statistics change less frequently than the list, so we cache for 10 seconds to reduce server load
 *
 * 2. **No cache key dependencies**: Statistics are global and don't depend
 *    on user input parameters, so we use an empty cache key array
 *
 * 3. **Separate cache tag**: Uses different tag from users list for independent cache invalidation strategies
 *
 *
 * @returns Promise resolving to users overview statistics
 */
export async function getUsersOverview(): Promise<UsersOverview> {
  const session = await verifySession();
  if (!session) return redirect('/');

  return await unstable_cache(
    async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users/admin/stats`;
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users stats');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        console.warn('Error fetching users stats:', error);
        return {
          summary: {
            total_users: 0,
            total_active_users: 0,
            total_inactive_users: 0,
          },
        };
      }
    },
    [], // No cache key dependencies - statistics are global
    {
      revalidate: 10, // Cache for 10 seconds
      tags: ['users-overview'], // Separate tag for independent cache management
    },
  )();
}

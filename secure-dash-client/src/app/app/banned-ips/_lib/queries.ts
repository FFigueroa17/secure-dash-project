import 'server-only';

import { verifySession } from '@/lib/dal';
import { unstable_cache } from '@/lib/unstable-cache';
import { APIResponse, BannedIP, BannedIPsOverview } from '@/schemas/log';

import type { GetBannedIPsSchema } from './validations';

/**
 * Builds search parameters for the banned IPs API endpoint.
 */
function buildBannedIPsSearchParams(
  input: GetBannedIPsSchema,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Add pagination parameters
  searchParams.set('page', (input.page - 1).toString());
  searchParams.set('size', input.size.toString());

  // Add time range parameter
  searchParams.set('hours', input.hours.toString() || '24');

  // Add jail parameter
  searchParams.set('jail', input.jail || 'sshd');

  return searchParams;
}

/**
 * Fetches banned IPs from the backend API with caching optimization.
 *
 * This function implements the same patterns as getFail2BanLogs:
 *
 * 1. **Server-side caching**: Uses Next.js unstable_cache to cache responses
 *    for 30 seconds, reducing API calls and improving performance
 *
 * 2. **Cache invalidation**: Uses tags for selective cache invalidation when
 *    new banned IPs are available or when manual refresh is needed
 *
 * 3. **Error resilience**: Returns a safe default structure if the API fails,
 *    preventing the UI from breaking due to network issues
 *
 * 4. **Cache key strategy**: Includes all input parameters in the cache key
 *    to ensure different queries are cached separately
 *
 * @param input - The validated input schema containing query parameters for fetching banned IPs
 * @returns Promise resolving to the API response containing banned IPs and pagination info
 */
export async function getBannedIPs(
  input: GetBannedIPsSchema,
): Promise<APIResponse<BannedIP>> {
  const session = await verifySession();
  if (!session) {
    return {
      totalCount: 0,
      totalPages: 0,
      currentPage: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      values: [],
    };
  }

  return await unstable_cache(
    async () => {
      const searchParams = buildBannedIPsSearchParams(input);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/banned-ips?${searchParams.toString()}`;

      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          const response = await res.json();
          console.error('Failed to fetch banned IPs:', response.error);
          throw new Error(response.error);
        }

        const response = await res.json();
        console.log('response', response);
        return response;
      } catch (error) {
        throw error;
      }
    },
    // Cache key includes all parameters that affect the query result
    [
      'banned-ips',
      input.page.toString(),
      input.size.toString(),
      input.hours.toString(),
      input.jail,
    ],
    {
      revalidate: 30, // Cache for 30 seconds - balance between performance and data freshness
      tags: ['banned-ips'], // Allows for targeted cache invalidation
    },
  )();
}

/**
 * Fetches banned IPs statistics overview from the backend API.
 *
 * This function provides dashboard statistics for banned IPs and implements:
 *
 * 1. **Longer cache duration**: Statistics change less frequently than the list,
 *    so we cache for 60 seconds to reduce server load
 *
 * 2. **No cache key dependencies**: Statistics are global and don't depend
 *    on user input parameters, so we use an empty cache key array
 *
 * 3. **Separate cache tag**: Uses different tag from banned IPs list for independent
 *    cache invalidation strategies
 *
 * 4. **Graceful degradation**: Returns zero values if API fails, allowing
 *    the dashboard to render without breaking
 *
 * @returns Promise resolving to banned IPs overview statistics
 */
export async function getBannedIPsOverview(): Promise<BannedIPsOverview> {
  const session = await verifySession();
  if (!session) {
    return {
      summary: {
        jail_name: 0,
        total_banned_ips: 0,
        ban_duration: 0,
        ban_duration_seconds: 0,
      },
    };
  }

  return await unstable_cache(
    async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/banned-ips-stats`;
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch banned IPs stats');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        console.error('Error fetching banned IPs stats:', error);
        throw error;
      }
    },
    [], // No cache key dependencies - statistics are global
    {
      revalidate: 30, // Cache for 30 seconds - statistics change less frequently
      tags: ['banned-ips-overview'], // Separate tag for independent cache management
    },
  )();
}

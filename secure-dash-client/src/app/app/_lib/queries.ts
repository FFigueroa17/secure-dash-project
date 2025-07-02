import 'server-only';

import { buildSearchParams } from '@/app/app/_lib/utils';
import { verifySession } from '@/lib/dal';
import { unstable_cache } from '@/lib/unstable-cache';
import { APIResponse, Fail2BanLog, Fail2BanOverview } from '@/schemas/log';

import type { GetLogsSchema } from './validations';

/**
 * Fetches Fail2Ban logs from the backend API with caching optimization.
 *
 * This function implements several important patterns:
 *
 * 1. **Server-side caching**: Uses Next.js unstable_cache to cache responses
 *    for 15 seconds, reducing API calls and improving performance
 *
 * 2. **Cache invalidation**: Uses tags for selective cache invalidation when
 *    new logs are available or when manual refresh is needed
 *
 * 3. **Error resilience**: Returns a safe default structure if the API fails,
 *    preventing the UI from breaking due to network issues
 *
 * 4. **Cache key strategy**: Includes all input parameters in the cache key
 *    to ensure different queries are cached separately
 *
 * @param input - The validated input schema containing query parameters for fetching logs
 * @returns Promise resolving to the API response containing Fail2Ban logs and pagination info
 */
export async function getFail2BanLogs(
  input: GetLogsSchema,
): Promise<APIResponse<Fail2BanLog>> {
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
      const searchParams = buildSearchParams(input);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/logs?${searchParams.toString()}`;

      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch logs:', res.status);
          throw new Error('Failed to fetch logs');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        throw error;
      }
    },
    // Cache key includes all parameters that affect the query result
    // This ensures different filter/pagination combinations are cached separately
    [
      'fail2ban-logs',
      input.page.toString(),
      input.perPage.toString(),
      input.message || '',
      input.level || '',
      input.timestamp?.join(',') || '',
      input.eventType || '',
    ],
    {
      revalidate: 5, // Cache for 15 seconds - balance between performance and data freshness
      tags: ['fail2ban-logs'], // Allows for targeted cache invalidation
    },
  )();
}

/**
 * Fetches Fail2Ban statistics overview from the backend API.
 *
 * This function provides dashboard statistics and implements:
 *
 * 1. **Longer cache duration**: Statistics change less frequently than logs,
 *    so we cache for 60 seconds to reduce server load
 *
 * 2. **No cache key dependencies**: Statistics are global and don't depend
 *    on user input parameters, so we use an empty cache key array
 *
 * 3. **Separate cache tag**: Uses different tag from logs for independent
 *    cache invalidation strategies
 *
 * 4. **Graceful degradation**: Returns zero values if API fails, allowing
 *    the dashboard to render without breaking
 *
 * The statistics include:
 * - logs_difference: Change in log count over time
 * - parse_rate: Success rate of log parsing
 * - ban_events: Number of IP bans triggered
 * - warn_error_logs: Count of warning and error level logs
 *
 * @returns Promise resolving to Fail2Ban overview statistics
 */
export async function getFail2BanLogsOverview(): Promise<Fail2BanOverview> {
  const session = await verifySession();
  if (!session) {
    return {
      logs_difference: 0,
      parse_rate: 0,
      ban_events: 0,
      warn_error_logs: 0,
    };
  }

  return await unstable_cache(
    async () => {
      // Build the URL with the API URL from the environment variables
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/stats`;
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch logs');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        throw error;
      }
    },
    [], // No cache key dependencies - statistics are global and don't vary by user input
    {
      revalidate: 30, // Cache for 30 seconds - statistics change less frequently than logs
      tags: ['fail2ban-logs-overview'], // Separate tag for independent cache management
    },
  )();
}

import 'server-only';

import { unstable_cache } from '@/lib/unstable-cache';
import { APIResponse, Fail2BanLog, Fail2BanOverview } from '@/schemas/log';

import type { GetLogsSchema } from './validations';

/**
 * Fetches Fail2Ban logs based on the provided input schema.
 * Utilizes caching to optimize repeated requests with the same input.
 *
 * @param {GetLogsSchema} input - The input schema containing query parameters for fetching logs.
 * @returns {Promise<APIResponse<Fail2BanLog>>} - A promise that resolves to the API response containing Fail2Ban logs.
 */
export async function getFail2BanLogs(
  input: GetLogsSchema,
): Promise<APIResponse<Fail2BanLog>> {
  return await unstable_cache(
    async () => {
      // Create URLSearchParams from the input object
      const searchParams = new URLSearchParams();

      // Add pagination parameters (map perPage to size as expected by API)
      searchParams.set('page', (input.page - 1).toString()); // API expects 0-based pagination
      searchParams.set('size', input.perPage.toString());

      // Add optional filter parameters if they exist
      if (input.message) {
        searchParams.set('filter_text', input.message);
      }

      if (input.level) {
        searchParams.set('level', input.level);
      }

      // Handle timestamp array for start and end parameters
      if (input.timestamp && input.timestamp.length > 0) {
        if (input.timestamp[0]) {
          searchParams.set('start', (input.timestamp[0] / 1000).toString());
        }
        if (input.timestamp[1]) {
          searchParams.set('end', (input.timestamp[1] / 1000).toString());
        }
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/logs?${searchParams.toString()}`;

      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch logs:', res.statusText);
          throw new Error('Failed to fetch logs');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        // Return a default response structure in case of an error
        return {
          totalCount: 0,
          totalPages: 0,
          currentPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          values: [],
        };
      }
    },
    [JSON.stringify(input)], // Cache key based on the input
    {
      revalidate: 3600, // Revalidate cache every 1 hour
      tags: ['fail2ban-logs'], // Tag for cache management
    },
  )();
}

/**
 * Fetches an overview of Fail2Ban statistics.
 * Utilizes caching to optimize repeated requests.
 *
 * @returns {Promise<Fail2BanOverview>} - A promise that resolves to the API response containing Fail2Ban overview statistics.
 */
export async function getFail2BanLogsOverview(): Promise<Fail2BanOverview> {
  return await unstable_cache(
    async () => {
      // Build the URL with the API URL from the environment variables
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fail2ban/stats`;
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch logs');
        }

        const response = await res.json();
        return response;
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        // Return a default response structure in case of an error
        return {
          logs_difference: 0,
          parse_rate: 0,
          ban_events: 0,
          warn_error_logs: 0,
        };
      }
    },
    [], // No cache key dependencies
    {
      revalidate: 3600, // Revalidate cache every 1 hour
      tags: ['fail2ban-logs-overview'], // Tag for cache management
    },
  )();
}

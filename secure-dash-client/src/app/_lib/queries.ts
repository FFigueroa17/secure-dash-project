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
  console.log('input', input); // Log the input for debugging purposes
  return await unstable_cache(
    async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/fail2ban/logs?${input.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!res.ok) {
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
      revalidate: 1, // Revalidate cache every 1 second
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
      try {
        const res = await fetch(`http://localhost:8000/fail2ban/stats`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch logs');
        }

        const response = await res.json();
        console.log('response', response); // Log the response for debugging purposes
        return response;
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        // Return a default response structure in case of an error
        return {
          overview: {
            stat: [],
          },
        };
      }
    },
    [], // No cache key dependencies
    {
      revalidate: 1, // Revalidate cache every 1 second
      tags: ['fail2ban-logs-overview'], // Tag for cache management
    },
  )();
}

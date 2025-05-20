import 'server-only';

import { unstable_cache } from '@/lib/unstable-cache';
import { APIResponse, Fail2BanLog, Fail2BanOverview } from '@/schemas/log';

import type { GetLogsSchema } from './validations';

export async function getFail2BanLogs(
  input: GetLogsSchema,
): Promise<APIResponse<Fail2BanLog>> {
  console.log('input', input);
  return await unstable_cache(
    async () => {
      try {
        const res = await fetch(
          `https://alertasfail2ban.xmakuno.com/fail2ban/logs?${input.toString()}`,
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
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ['fail2ban-logs'],
    },
  )();
}

export async function getFail2BanLogsOverview(): Promise<Fail2BanOverview> {
  return await unstable_cache(
    async () => {
      try {
        const res = await fetch(
          `https://alertasfail2ban.xmakuno.com/fail2ban/stats`,
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
        console.log('response', response);

        return response;
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        return {
          overview: {
            stat: [],
          },
        };
      }
    },
    [],
    {
      revalidate: 1,
      tags: ['fail2ban-logs-overview'],
    },
  )();
}

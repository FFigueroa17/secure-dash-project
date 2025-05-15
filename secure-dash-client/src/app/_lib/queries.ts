import 'server-only';

import { parseFail2BanLog } from '@/lib/parsers';
import { unstable_cache } from '@/lib/unstable-cache';
import { ParsedFail2BanLog } from '@/schemas/log';

import type { GetLogsSchema } from './validations';

export async function getFail2BanLogs(input: GetLogsSchema): Promise<{
  data: ParsedFail2BanLog[];
  pageCount: number;
}> {
  return await unstable_cache(
    async () => {
      try {
        // Make API request with query parameters
        const res = await fetch(
          // `https://alertasfail2ban.xmakuno.com/fail2ban/logs?${input.toString()}`,
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
        const parsed = response.map(parseFail2BanLog);

        return {
          data: parsed,
          pageCount: 50, // TODO: remove this
        };
      } catch (error) {
        console.error('Error fetching fail2ban logs:', error);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ['fail2ban-logs'],
    },
  )();
}

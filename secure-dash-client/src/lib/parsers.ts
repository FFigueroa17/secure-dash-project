import { createParser } from 'nuqs/server';
import { z } from 'zod';

import { dataTableConfig } from '@/config/data-table';
import { Fail2BanLog, ParsedFail2BanLog } from '@/schemas/log';
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from '@/types/data-table';

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc,
      ),
  });
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as unknown as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator,
      ),
  });
};

export function parseFail2BanLog(entry: Fail2BanLog): ParsedFail2BanLog {
  const { timestamp, service, message, level } = entry;

  // pull out the PID in [12345]
  const pidMatch = message.match(/\[(\d+)\]/);
  const pid = pidMatch ? parseInt(pidMatch[1] ?? '0', 10) : null;

  // common regexes
  const regexes = [
    {
      match: message.match(/Total # of detected failures:\s*(\d+)/),
      action: (match: RegExpMatchArray) => ({
        eventType: 'failure_aggregate' as const,
        totalFailures: parseInt(match[1] ?? '0', 10),
      }),
    },
    {
      match: message.match(
        /Observer: ban found\s+(\d+\.\d+\.\d+\.\d+),\s*(\d+)/,
      ),
      action: (match: RegExpMatchArray) => ({
        eventType: 'ban' as const,
        ip: match[1] ?? null,
        banDuration: parseInt(match[2] ?? '0', 10),
      }),
    },
    {
      match: message.match(/\[([^\]]+)\]\s+Ban\s+(\d+\.\d+\.\d+\.\d+)/),
      action: (match: RegExpMatchArray) => ({
        eventType: 'ban' as const,
        jail: match[1] ?? null,
        ip: match[2] ?? null,
      }),
    },
    {
      match: message.match(/\[([^\]]+)\]\s+Found\s+(\d+\.\d+\.\d+\.\d+)/),
      action: (match: RegExpMatchArray) => ({
        eventType: 'failure_detected' as const,
        jail: match[1] ?? null,
        ip: match[2] ?? null,
        count: 1,
      }),
    },
    {
      match: message.match(/Processing line.*ip:(\d+\.\d+\.\d+\.\d+)/),
      action: (match: RegExpMatchArray) => ({
        eventType: 'processing' as const,
        ip: match[1] ?? null,
      }),
    },
  ];

  let eventType: ParsedFail2BanLog['eventType'] = 'other';
  let jail: string | null = null;
  let ip: string | null = null;
  let count: number | null = null;
  let totalFailures: number | null = null;
  let banDuration: number | null = null;

  for (const { match, action } of regexes) {
    if (match) {
      ({ eventType, jail, ip, count, totalFailures, banDuration } = {
        ...{ eventType, jail, ip, count, totalFailures, banDuration },
        ...action(match),
      });
      break;
    }
  }

  // also pick up per-IP counts in the agg line (first IP only)
  if (regexes[0]?.match) {
    const ipCountMatch = message.match(/(\d+\.\d+\.\d+\.\d+):(\d+)/);
    if (ipCountMatch) {
      ip = ipCountMatch[1] ?? null;
      count = parseInt(ipCountMatch[2] ?? '0', 10);
    }
  }

  return {
    timestamp: new Date(timestamp).toISOString(),
    service,
    pid,
    level,
    jail,
    eventType,
    ip,
    count,
    totalFailures,
    banDuration,
    rawMessage: message,
  };
}

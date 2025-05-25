import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  // Filters
  message: parseAsString.withDefault(''),
  level: parseAsString.withDefault(''),
  timestamp: parseAsArrayOf(parseAsInteger, ',').withDefault([]),
});

export type GetLogsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;

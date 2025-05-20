import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  message: parseAsString.withDefault(''),
  level: parseAsString.withDefault(''),
});

export type GetLogsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;

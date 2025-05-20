import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

import { getFiltersStateParser } from '@/lib/parsers';

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  message: parseAsString.withDefault(''),
  level: parseAsString.withDefault(''),
  filters: getFiltersStateParser().withDefault([]),
});

export type GetLogsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;

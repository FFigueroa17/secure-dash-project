import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers';
import { Fail2BanLog } from '@/schemas/log';

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Fail2BanLog>().withDefault([
    { id: 'timestamp', desc: true },
  ]),
  message: parseAsString.withDefault(''),
  level: parseAsString.withDefault(''),
  filters: getFiltersStateParser().withDefault([]),
});

export type GetLogsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;

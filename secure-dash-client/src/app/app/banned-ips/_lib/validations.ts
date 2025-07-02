import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const bannedIPsSearchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),

  // Time range filter - hours backward (1-168 hours)
  hours: parseAsInteger.withDefault(24),

  // Jail filter - default to 'sshd'
  jail: parseAsString.withDefault('sshd'),
});

export type GetBannedIPsSchema = Awaited<
  ReturnType<typeof bannedIPsSearchParamsCache.parse>
>;

import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const bannedIPsSearchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  // Ban time filter - hours backward (1-168 hours)
  ban_time: parseAsInteger.withDefault(24),

  // Jail filter - default to 'sshd'
  jail: parseAsString.withDefault('sshd'),
});

export type GetBannedIPsSchema = Awaited<
  ReturnType<typeof bannedIPsSearchParamsCache.parse>
>;

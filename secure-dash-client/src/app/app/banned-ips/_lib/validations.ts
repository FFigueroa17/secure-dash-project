import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const bannedIPsSearchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10).withOptions({
    // Clamp size between 1 and 100 as per requirements
    validate: (value) => Math.min(Math.max(value, 1), 100),
  }),

  // Time range filter - hours backward (1-168 hours)
  hours: parseAsInteger.withDefault(24).withOptions({
    // Clamp hours between 1 and 168 (7 days) as per requirements
    validate: (value) => Math.min(Math.max(value, 1), 168),
  }),

  // Jail filter - default to 'sshd'
  jail: parseAsString.withDefault('sshd'),
});

export type GetBannedIPsSchema = Awaited<
  ReturnType<typeof bannedIPsSearchParamsCache.parse>
>;

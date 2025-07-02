import { createSearchParamsCache, parseAsInteger } from 'nuqs/server';

export const usersSearchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
});

export type GetUsersSchema = Awaited<
  ReturnType<typeof usersSearchParamsCache.parse>
>;

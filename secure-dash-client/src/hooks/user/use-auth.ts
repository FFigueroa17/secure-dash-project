import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  // const { current, setUser } = initUserStore(
  //   (s) => ({ current: s.current, setUser: s.setUser }),
  //   shallow,
  // );

  return useQuery({
    queryKey: ['user'],
    queryFn: () =>
      fetch('/api/user', { credentials: 'include' }).then((r) =>
        r.status === 401 ? null : r.json(),
      ),
    // placeholderData: current,
    staleTime: 10 * 60_000,
  });
};

import { unstable_cache } from '@/lib/unstable-cache';

// Mock Next.js cache and React cache
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn(),
}));

jest.mock('react', () => ({
  cache: jest.fn(),
}));

import { unstable_cache as next_unstable_cache } from 'next/cache';
import { cache } from 'react';

const mockNextUnstableCache = next_unstable_cache as jest.MockedFunction<
  typeof next_unstable_cache
>;
const mockReactCache = cache as jest.MockedFunction<typeof cache>;

describe('unstable_cache wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNextUnstableCache.mockImplementation((fn) => fn);
    mockReactCache.mockImplementation((fn) => fn);
  });

  it('should wrap next_unstable_cache with React cache', () => {
    const mockCallback = jest.fn().mockResolvedValue('test result');
    const keyParts = ['test', 'key'];

    unstable_cache(mockCallback, keyParts);

    expect(mockNextUnstableCache).toHaveBeenCalledWith(
      mockCallback,
      keyParts,
      undefined,
    );
    expect(mockReactCache).toHaveBeenCalledWith(mockCallback);
  });

  it('should pass through options to next_unstable_cache', () => {
    const mockCallback = jest.fn().mockResolvedValue('test result');
    const keyParts = ['test', 'key'];
    const options = { revalidate: 3600, tags: ['tag1', 'tag2'] };

    unstable_cache(mockCallback, keyParts, options);

    expect(mockNextUnstableCache).toHaveBeenCalledWith(
      mockCallback,
      keyParts,
      options,
    );
  });

  it('should handle revalidate: false option', () => {
    const mockCallback = jest.fn().mockResolvedValue('test result');
    const keyParts = ['test', 'key'];
    const options = { revalidate: false as const, tags: ['no-revalidate'] };

    unstable_cache(mockCallback, keyParts, options);

    expect(mockNextUnstableCache).toHaveBeenCalledWith(
      mockCallback,
      keyParts,
      options,
    );
  });
});

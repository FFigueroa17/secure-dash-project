import { createStore } from 'zustand/vanilla';

import { User } from '@/types/user';

/**
 * User store state interface defining the structure of the user store.
 */
interface UserStoreState {
  /** Currently authenticated user, null if not authenticated */
  current: User;
  /** Updates the current user */
  setUser: (user: User) => void;
  /** Clears the current user (logout) */
  clear: () => void;
}

/**
 * Initializes a new user store with the given initial user state.
 *
 * This creates a Zustand vanilla store for managing user authentication state
 * throughout the application. The store provides methods to set and clear
 * the current user.
 *
 * @param initial - The initial user state, typically from session data or null
 * @returns A Zustand store instance for managing user state
 *
 * @example
 * ```ts
 * // Initialize with no user
 * const userStore = initUserStore(null);
 *
 * // Initialize with existing user data
 * const userStore = initUserStore({
 *   id: '123',
 *   email: 'user@example.com',
 *   role: 'user'
 * });
 * ```
 */
export const initUserStore = (initial: User) =>
  createStore<UserStoreState>((set) => ({
    current: initial,
    setUser: (u) => set({ current: u }),
    clear: () => set({ current: null }),
  }));

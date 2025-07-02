/**
 * Represents a user in the system.
 */
export interface User {
  /** The unique identifier for the user */
  id: string;
  /** The user's username */
  username: string;
  /** The user's email address */
  email: string;
  /** Array of roles assigned to the user */
  roles: string[];
}

/**
 * Represents the overview statistics for users
 */
export interface UsersOverview {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

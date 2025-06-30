/**
 * Represents a user in the application.
 * Can be null when no user is authenticated.
 */
export type User = {
  /** Unique identifier for the user */
  id?: string;
  /** User's username */
  username: string;
  /** User's email address */
  email: string;
  /** User's role in the system (e.g., 'admin', 'user') */
  role?: string;
} | null;

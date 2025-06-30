/**
 * Represents a successful operation result.
 * @template T - The type of the successful data
 */
type Success<T> = {
  /** The successful data result */
  data: T;
  /** Always null for successful operations */
  error: null;
  /** Always true for successful operations */
  ok: true;
};

/**
 * Represents a failed operation result.
 * @template E - The type of the error
 */
type Failure<E> = {
  /** Always null for failed operations */
  data: null;
  /** The error that occurred */
  error: E;
  /** Always false for failed operations */
  ok: false;
};

/**
 * A discriminated union type representing either a successful or failed operation.
 * This enables type-safe error handling without throwing exceptions.
 * @template T - The type of the successful data
 * @template E - The type of the error (defaults to Error)
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps a Promise in a try-catch block and returns a Result object instead of throwing.
 * This utility enables functional error handling patterns and eliminates the need
 * for try-catch blocks at the call site.
 *
 * @template T - The type of the successful Promise resolution value
 * @template E - The type of the error (defaults to Error)
 * @param promise - The Promise to wrap with error handling
 * @returns A Promise that resolves to a Result object containing either data or error
 *
 * @example
 * ```typescript
 * // Instead of try-catch blocks:
 * const result = await tryCatch(fetchUserData(userId));
 * if (!result.ok) {
 *   console.error('Failed to fetch user:', result.error);
 *   return;
 * }
 * console.log('User data:', result.data);
 * ```
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    // Await the promise and return successful result
    const data = await promise;
    return { data, error: null, ok: true };
  } catch (error) {
    // Cast error to expected type and return failure result
    return { data: null, error: error as E, ok: false };
  }
}

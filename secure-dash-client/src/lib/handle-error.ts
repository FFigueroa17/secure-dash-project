import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  // Handle ZodError (which extends Error, so check this before Error)
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join('\n');
  }

  // Handle regular Error instances
  if (err instanceof Error) {
    // Check for redirect errors and rethrow them
    if (isRedirectError(err)) {
      throw err;
    }
    return err.message;
  }

  // For all other types (string, number, null, undefined, objects, arrays)
  // return the default error message
  return unknownError;
}

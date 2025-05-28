import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';

import { getErrorMessage } from '@/lib/handle-error';

// Mock the isRedirectError function
jest.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: jest.fn(),
}));

const mockIsRedirectError = isRedirectError as jest.MockedFunction<
  typeof isRedirectError
>;

describe('handle-error utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default return value for isRedirectError mock
    mockIsRedirectError.mockReturnValue(false);
  });

  describe('getErrorMessage', () => {
    it('should handle ZodError and return formatted error messages', () => {
      const zodSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email format'),
      });

      try {
        zodSchema.parse({ name: '', email: 'invalid-email' });
      } catch (err) {
        const message = getErrorMessage(err);
        expect(message).toContain('Name is required');
        expect(message).toContain('Invalid email format');
        expect(message).toContain('\n'); // Should join with newlines
      }
    });

    it('should handle ZodError with single issue', () => {
      const zodSchema = z.string().min(5, 'Minimum 5 characters required');

      try {
        zodSchema.parse('abc');
      } catch (err) {
        const message = getErrorMessage(err);
        expect(message).toBe('Minimum 5 characters required');
      }
    });

    it('should handle regular Error instances', () => {
      const error = new Error('Something went wrong');
      const message = getErrorMessage(error);

      expect(message).toBe('Something went wrong');
    });

    it('should handle Error instances with empty message', () => {
      const error = new Error('');
      const message = getErrorMessage(error);

      expect(message).toBe('');
    });

    it('should rethrow redirect errors', () => {
      const redirectError = new Error('Redirect error');
      mockIsRedirectError.mockReturnValue(true);

      expect(() => {
        getErrorMessage(redirectError);
      }).toThrow(redirectError);

      expect(mockIsRedirectError).toHaveBeenCalledWith(redirectError);
    });

    it('should return default message for string errors', () => {
      const message = getErrorMessage('string error');
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should return default message for number errors', () => {
      const message = getErrorMessage(404);
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should return default message for null', () => {
      const message = getErrorMessage(null);
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should return default message for undefined', () => {
      const message = getErrorMessage(undefined);
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should return default message for object errors', () => {
      const message = getErrorMessage({ error: 'custom error' });
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should return default message for array errors', () => {
      const message = getErrorMessage(['error1', 'error2']);
      expect(message).toBe('Something went wrong, please try again later.');
    });

    it('should handle custom Error subclasses', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error occurred');
      const message = getErrorMessage(customError);

      expect(message).toBe('Custom error occurred');
    });

    it('should handle Error with custom properties', () => {
      const error = new Error('Base error');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).customProperty = 'custom value';

      const message = getErrorMessage(error);
      expect(message).toBe('Base error');
    });

    it('should prioritize ZodError over regular Error', () => {
      // Create a ZodError that might also be an instance of Error
      const zodSchema = z.string().email('Invalid email');

      try {
        zodSchema.parse('not-an-email');
      } catch (zodError) {
        // ZodError extends Error, so this tests that we handle ZodError first
        expect(zodError instanceof Error).toBe(true);
        expect(zodError instanceof z.ZodError).toBe(true);

        const message = getErrorMessage(zodError);
        expect(message).toBe('Invalid email');
      }
    });

    it('should handle complex ZodError with nested issues', () => {
      const zodSchema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name is required'),
          age: z.number().min(18, 'Must be at least 18'),
        }),
        tags: z.array(z.string()).min(1, 'At least one tag required'),
      });

      try {
        zodSchema.parse({
          user: { name: '', age: 16 },
          tags: [],
        });
      } catch (err) {
        const message = getErrorMessage(err);
        expect(message).toContain('Name is required');
        expect(message).toContain('Must be at least 18');
        expect(message).toContain('At least one tag required');
      }
    });
  });
});

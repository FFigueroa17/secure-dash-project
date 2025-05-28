import { DateRange } from 'react-day-picker';

import {
  formatDate,
  getIsDateRange,
  parseAsDate,
  parseColumnFilterValue,
} from '@/lib/format';

describe('format utilities', () => {
  describe('formatDate', () => {
    // Mock locale to ensure consistent test results
    const originalDateTimeFormat = Intl.DateTimeFormat;

    beforeAll(() => {
      // Mock Intl.DateTimeFormat to return predictable results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.Intl as any).DateTimeFormat = jest
        .fn()
        .mockImplementation((locale, options) => ({
          format: jest.fn((date) => {
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            // Simple mock format for testing
            const month = d.toLocaleString('en', {
              month: options?.month || 'long',
            });
            const day = d.getDate();
            const year = d.getFullYear();

            return `${month} ${day}, ${year}`;
          }),
          supportedLocalesOf: jest.fn(),
        }));
    });

    afterAll(() => {
      global.Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('should format a Date object correctly', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const result = formatDate(date);

      expect(result).toBe('March 15, 2024');
    });

    it('should format a timestamp string correctly', () => {
      const timestamp = '1710505800000'; // March 15, 2024
      const result = formatDate(timestamp);

      expect(result).toBe('March 15, 2024');
    });

    it('should format a timestamp number correctly', () => {
      const timestamp = 1710505800000; // March 15, 2024
      const result = formatDate(timestamp);

      expect(result).toBe('March 15, 2024');
    });

    it('should return empty string for undefined input', () => {
      const result = formatDate(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for null input', () => {
      const result = formatDate(null as unknown as string);
      expect(result).toBe('');
    });

    it('should return empty string for empty string input', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });

    it('should handle custom format options', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const result = formatDate(date, { month: 'short', day: '2-digit' });

      expect(result).toBe('Mar 15, 2024');
    });

    it('should handle invalid date gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });

    it('should handle formatting error gracefully', () => {
      // Temporarily mock format to throw an error
      const mockFormat = jest.fn().mockImplementation(() => {
        throw new Error('Format error');
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.Intl as any).DateTimeFormat = jest
        .fn()
        .mockImplementation(() => ({
          format: mockFormat,
          supportedLocalesOf: jest.fn(),
        }));

      const result = formatDate(new Date());
      expect(result).toBe('');
    });
  });

  describe('getIsDateRange', () => {
    it('should return true for DateRange object', () => {
      const dateRange: DateRange = {
        from: new Date('2024-03-01'),
        to: new Date('2024-03-15'),
      };

      expect(getIsDateRange(dateRange)).toBe(true);
    });

    it('should return true for DateRange with only from date', () => {
      const dateRange: DateRange = {
        from: new Date('2024-03-01'),
      };

      expect(getIsDateRange(dateRange)).toBe(true);
    });

    it('should return false for Date array', () => {
      const dateArray: Date[] = [
        new Date('2024-03-01'),
        new Date('2024-03-15'),
      ];

      expect(getIsDateRange(dateArray)).toBe(false);
    });

    it('should return false for empty array', () => {
      const emptyArray: Date[] = [];
      expect(getIsDateRange(emptyArray)).toBe(false);
    });

    it('should return false for null', () => {
      expect(getIsDateRange(null as unknown as DateRange)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(getIsDateRange(undefined as unknown as DateRange)).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(getIsDateRange('string' as unknown as DateRange)).toBe(false);
      expect(getIsDateRange(123 as unknown as DateRange)).toBe(false);
      expect(getIsDateRange(true as unknown as DateRange)).toBe(false);
    });
  });

  describe('parseAsDate', () => {
    it('should parse a valid timestamp number', () => {
      const timestamp = 1710505800000; // March 15, 2024
      const result = parseAsDate(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(timestamp);
    });

    it('should parse a valid timestamp string', () => {
      const timestamp = '1710505800000';
      const result = parseAsDate(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(1710505800000);
    });

    it('should return undefined for undefined input', () => {
      const result = parseAsDate(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = parseAsDate('');
      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid string', () => {
      const result = parseAsDate('invalid-timestamp');
      expect(result).toBeUndefined();
    });

    it('should return undefined for NaN number', () => {
      const result = parseAsDate(NaN);
      expect(result).toBeUndefined();
    });

    it('should handle zero timestamp', () => {
      const result = parseAsDate(0);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(0);
    });

    it('should handle negative timestamp', () => {
      const timestamp = -1000;
      const result = parseAsDate(timestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(timestamp);
    });
  });

  describe('parseColumnFilterValue', () => {
    it('should return empty array for null', () => {
      const result = parseColumnFilterValue(null);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined', () => {
      const result = parseColumnFilterValue(undefined);
      expect(result).toEqual([]);
    });

    it('should return array as-is for valid array', () => {
      const input = ['value1', 'value2', 123];
      const result = parseColumnFilterValue(input);
      expect(result).toEqual(['value1', 'value2', 123]);
    });

    it('should replace invalid items in array with undefined', () => {
      const input = ['valid', 123, null, undefined, {}, true];
      const result = parseColumnFilterValue(input);
      expect(result).toEqual([
        'valid',
        123,
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('should wrap single string in array', () => {
      const result = parseColumnFilterValue('single-value');
      expect(result).toEqual(['single-value']);
    });

    it('should wrap single number in array', () => {
      const result = parseColumnFilterValue(42);
      expect(result).toEqual([42]);
    });

    it('should return empty array for boolean', () => {
      const result = parseColumnFilterValue(true);
      expect(result).toEqual([]);
    });

    it('should return empty array for object', () => {
      const result = parseColumnFilterValue({ key: 'value' });
      expect(result).toEqual([]);
    });

    it('should return empty array for function', () => {
      const result = parseColumnFilterValue(() => 'function');
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = parseColumnFilterValue([]);
      expect(result).toEqual([]);
    });

    it('should handle array with mixed valid types', () => {
      const input = ['string', 42, 'another-string', 0];
      const result = parseColumnFilterValue(input);
      expect(result).toEqual(['string', 42, 'another-string', 0]);
    });
  });
});

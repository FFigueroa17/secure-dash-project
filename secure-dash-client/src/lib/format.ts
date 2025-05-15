import { DateRange } from 'react-day-picker';

/**
 * Type alias for date selection that can be either an array of dates or a date range
 */
export type DateSelection = Date[] | DateRange;

/**
 * Formats a date value into a localized string representation
 * @param date - The date to format. Can be a Date object, timestamp string, or number
 * @param opts - Optional Intl.DateTimeFormatOptions for customizing the output format
 * @returns A formatted date string, or empty string if date is invalid/undefined
 * @example
 * formatDate(new Date(), { month: 'short' }) // Returns e.g. "Mar 15, 2024"
 */
export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    // Return empty string if date parsing or formatting fails
    return '';
  }
}

/**
 * Type guard to check if a DateSelection value is specifically a DateRange
 * @param value - The value to check
 * @returns True if the value is a DateRange object, false otherwise
 */
export function getIsDateRange(value: DateSelection): value is DateRange {
  return value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Safely parses a timestamp into a Date object
 * @param timestamp - The timestamp to parse (number or string)
 * @returns A valid Date object, or undefined if parsing fails
 * @example
 * parseAsDate('1678900000000') // Returns Date object
 * parseAsDate('invalid') // Returns undefined
 */
export function parseAsDate(
  timestamp: number | string | undefined,
): Date | undefined {
  if (!timestamp) return undefined;

  // Convert string timestamps to numbers
  const numericTimestamp =
    typeof timestamp === 'string' ? Number(timestamp) : timestamp;

  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

/**
 * Parses and normalizes column filter values into an array format
 * @param value - The filter value to parse (can be any type)
 * @returns An array of string or number values, or empty array if input is invalid
 * @example
 * parseColumnFilterValue(['a', 'b']) // Returns ['a', 'b']
 * parseColumnFilterValue('single') // Returns ['single']
 * parseColumnFilterValue(null) // Returns []
 */
export function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
}

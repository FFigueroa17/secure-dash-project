import { dataTableConfig } from '@/config/data-table';
import { getValidFilters } from '@/lib/data-table';
import { ExtendedColumnFilter } from '@/types/data-table';

// Mock data type for testing
interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

type OperatorType = (typeof dataTableConfig.operators)[number];

describe('data-table utilities', () => {
  describe('getValidFilters', () => {
    const createFilter = (
      id: keyof TestData,
      operator: OperatorType,
      value: string | string[] | number | boolean | null | undefined,
    ): ExtendedColumnFilter<TestData> => ({
      id,
      operator,
      value: value as string | string[],
      variant: 'text',
      filterId: `filter-${id}`,
    });

    it('should include filters with isEmpty operator', () => {
      const filters = [
        createFilter('name', 'isEmpty', ''),
        createFilter('email', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(filters[0]);
      expect(result[1]).toEqual(filters[1]);
    });

    it('should include filters with isNotEmpty operator', () => {
      const filters = [
        createFilter('name', 'isNotEmpty', ''),
        createFilter('email', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(filters[0]);
      expect(result[1]).toEqual(filters[1]);
    });

    it('should exclude filters with empty string values', () => {
      const filters = [
        createFilter('name', 'iLike', ''),
        createFilter('email', 'iLike', 'test'),
        createFilter('status', 'eq', ''),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(filters[1]);
    });

    it('should exclude filters with null values', () => {
      const filters = [
        createFilter('name', 'iLike', null),
        createFilter('email', 'iLike', 'test'),
        createFilter('status', 'eq', null),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(filters[1]);
    });

    it('should exclude filters with undefined values', () => {
      const filters = [
        createFilter('name', 'iLike', undefined),
        createFilter('email', 'iLike', 'test'),
        createFilter('status', 'eq', undefined),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(filters[1]);
    });

    it('should include filters with non-empty array values', () => {
      const filters = [
        createFilter('status', 'inArray', ['active', 'pending']),
        createFilter('name', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result).toEqual(filters);
    });

    it('should exclude filters with empty array values', () => {
      const filters = [
        createFilter('status', 'inArray', []),
        createFilter('name', 'iLike', 'test'),
        createFilter('email', 'notInArray', []),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(filters[1]);
    });

    it('should include filters with numeric values', () => {
      const filters = [
        createFilter('id', 'eq', 123),
        createFilter('name', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result).toEqual(filters);
    });

    it('should include filters with zero numeric values', () => {
      const filters = [
        createFilter('id', 'eq', 0),
        createFilter('name', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result).toEqual(filters);
    });

    it('should include filters with boolean values', () => {
      const filters = [
        createFilter('status', 'eq', false),
        createFilter('name', 'iLike', 'test'),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(2);
      expect(result).toEqual(filters);
    });

    it('should handle mixed valid and invalid filters', () => {
      const filters = [
        createFilter('name', 'iLike', ''), // invalid
        createFilter('email', 'iLike', 'test@example.com'), // valid
        createFilter('status', 'inArray', []), // invalid
        createFilter('id', 'eq', 123), // valid
        createFilter('name', 'isEmpty', ''), // valid (isEmpty operator)
        createFilter('email', 'isNotEmpty', null), // valid (isNotEmpty operator)
        createFilter('status', 'eq', null), // invalid
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual(filters[1]); // email iLike
      expect(result[1]).toEqual(filters[3]); // id eq
      expect(result[2]).toEqual(filters[4]); // name isEmpty
      expect(result[3]).toEqual(filters[5]); // email isNotEmpty
    });

    it('should return empty array when all filters are invalid', () => {
      const filters = [
        createFilter('name', 'iLike', ''),
        createFilter('email', 'eq', null),
        createFilter('status', 'inArray', []),
        createFilter('id', 'eq', undefined),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should return all filters when all are valid', () => {
      const filters = [
        createFilter('name', 'iLike', 'john'),
        createFilter('email', 'eq', 'test@example.com'),
        createFilter('status', 'inArray', ['active', 'pending']),
        createFilter('id', 'eq', 123),
        createFilter('name', 'isEmpty', ''),
        createFilter('email', 'isNotEmpty', null),
      ];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(6);
      expect(result).toEqual(filters);
    });

    it('should handle empty filters array', () => {
      const filters: ExtendedColumnFilter<TestData>[] = [];

      const result = getValidFilters(filters);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});

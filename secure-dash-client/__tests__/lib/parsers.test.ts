// Mock nuqs/server module to avoid ESM issues
jest.mock('nuqs/server', () => ({
  createParser: jest.fn().mockImplementation((config) => config),
}));

import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers';

describe('parsers utilities', () => {
  describe('getSortingStateParser', () => {
    it('should parse valid sorting data correctly', () => {
      const parser = getSortingStateParser();
      const validSort = JSON.stringify([
        { id: 'name', desc: false },
        { id: 'email', desc: true },
      ]);

      const parsed = parser.parse(validSort);

      expect(parsed).toEqual([
        { id: 'name', desc: false },
        { id: 'email', desc: true },
      ]);
    });

    it('should reject invalid JSON', () => {
      const parser = getSortingStateParser();
      const result = parser.parse('invalid-json');

      expect(result).toBeNull();
    });

    it('should reject non-array data', () => {
      const parser = getSortingStateParser();
      const result = parser.parse('{"id": "name", "desc": false}');

      expect(result).toBeNull();
    });

    it('should reject items with missing required fields', () => {
      const parser = getSortingStateParser();
      const invalidSort = JSON.stringify([
        { id: 'name' }, // missing desc
        { desc: true }, // missing id
      ]);

      const result = parser.parse(invalidSort);
      expect(result).toBeNull();
    });

    it('should reject items with wrong types', () => {
      const parser = getSortingStateParser();
      const invalidSort = JSON.stringify([
        { id: 123, desc: false }, // id should be string
        { id: 'name', desc: 'true' }, // desc should be boolean
      ]);

      const result = parser.parse(invalidSort);
      expect(result).toBeNull();
    });

    it('should validate column IDs when provided as array', () => {
      const validColumns = ['name', 'email', 'age'];
      const parser = getSortingStateParser(validColumns);

      const validSort = JSON.stringify([
        { id: 'name', desc: false },
        { id: 'email', desc: true },
      ]);

      const invalidSort = JSON.stringify([
        { id: 'invalidColumn', desc: false },
      ]);

      expect(parser.parse(validSort)).toEqual([
        { id: 'name', desc: false },
        { id: 'email', desc: true },
      ]);
      expect(parser.parse(invalidSort)).toBeNull();
    });

    it('should validate column IDs when provided as Set', () => {
      const validColumns = new Set(['name', 'email', 'age']);
      const parser = getSortingStateParser(validColumns);

      const validSort = JSON.stringify([{ id: 'name', desc: false }]);
      const invalidSort = JSON.stringify([
        { id: 'invalidColumn', desc: false },
      ]);

      expect(parser.parse(validSort)).toEqual([{ id: 'name', desc: false }]);
      expect(parser.parse(invalidSort)).toBeNull();
    });

    it('should handle empty array', () => {
      const parser = getSortingStateParser();
      const emptySort = JSON.stringify([]);

      const result = parser.parse(emptySort);
      expect(result).toEqual([]);
    });
  });

  describe('getFiltersStateParser', () => {
    it('should parse valid filter data correctly', () => {
      const parser = getFiltersStateParser();
      const validFilters = JSON.stringify([
        {
          id: 'name',
          value: 'John',
          variant: 'text',
          operator: 'iLike',
          filterId: 'filter-1',
        },
        {
          id: 'status',
          value: ['active', 'pending'],
          variant: 'select',
          operator: 'eq',
          filterId: 'filter-2',
        },
      ]);

      const parsed = parser.parse(validFilters);

      expect(parsed).toEqual([
        {
          id: 'name',
          value: 'John',
          variant: 'text',
          operator: 'iLike',
          filterId: 'filter-1',
        },
        {
          id: 'status',
          value: ['active', 'pending'],
          variant: 'select',
          operator: 'eq',
          filterId: 'filter-2',
        },
      ]);
    });

    it('should reject invalid JSON', () => {
      const parser = getFiltersStateParser();
      const result = parser.parse('invalid-json');

      expect(result).toBeNull();
    });

    it('should reject non-array data', () => {
      const parser = getFiltersStateParser();
      const result = parser.parse('{"id": "name", "value": "test"}');

      expect(result).toBeNull();
    });

    it('should reject items with missing required fields', () => {
      const parser = getFiltersStateParser();
      const invalidFilter = JSON.stringify([
        {
          id: 'name',
          // missing value, variant, operator, filterId
        },
      ]);

      const result = parser.parse(invalidFilter);
      expect(result).toBeNull();
    });

    it('should reject items with invalid variant', () => {
      const parser = getFiltersStateParser();
      const invalidFilter = JSON.stringify([
        {
          id: 'name',
          value: 'test',
          variant: 'invalidVariant',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      const result = parser.parse(invalidFilter);
      expect(result).toBeNull();
    });

    it('should reject items with invalid operator', () => {
      const parser = getFiltersStateParser();
      const invalidFilter = JSON.stringify([
        {
          id: 'name',
          value: 'test',
          variant: 'text',
          operator: 'invalidOperator',
          filterId: 'filter-1',
        },
      ]);

      const result = parser.parse(invalidFilter);
      expect(result).toBeNull();
    });

    it('should accept string or array values', () => {
      const parser = getFiltersStateParser();

      const stringValueFilter = JSON.stringify([
        {
          id: 'name',
          value: 'John',
          variant: 'text',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      const arrayValueFilter = JSON.stringify([
        {
          id: 'status',
          value: ['active', 'pending'],
          variant: 'select',
          operator: 'eq',
          filterId: 'filter-2',
        },
      ]);

      expect(parser.parse(stringValueFilter)).toBeTruthy();
      expect(parser.parse(arrayValueFilter)).toBeTruthy();
    });

    it('should validate column IDs when provided as array', () => {
      const validColumns = ['name', 'email', 'status'];
      const parser = getFiltersStateParser(validColumns);

      const validFilter = JSON.stringify([
        {
          id: 'name',
          value: 'test',
          variant: 'text',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      const invalidFilter = JSON.stringify([
        {
          id: 'invalidColumn',
          value: 'test',
          variant: 'text',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      expect(parser.parse(validFilter)).toBeTruthy();
      expect(parser.parse(invalidFilter)).toBeNull();
    });

    it('should validate column IDs when provided as Set', () => {
      const validColumns = new Set(['name', 'email', 'status']);
      const parser = getFiltersStateParser(validColumns);

      const validFilter = JSON.stringify([
        {
          id: 'name',
          value: 'test',
          variant: 'text',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      const invalidFilter = JSON.stringify([
        {
          id: 'invalidColumn',
          value: 'test',
          variant: 'text',
          operator: 'eq',
          filterId: 'filter-1',
        },
      ]);

      expect(parser.parse(validFilter)).toBeTruthy();
      expect(parser.parse(invalidFilter)).toBeNull();
    });

    it('should handle empty array', () => {
      const parser = getFiltersStateParser();
      const emptyFilters = JSON.stringify([]);

      const result = parser.parse(emptyFilters);
      expect(result).toEqual([]);
    });
  });
});

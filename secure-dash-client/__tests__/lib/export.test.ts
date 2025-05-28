import type { Table } from '@tanstack/react-table';

import { exportTableToCSV } from '@/lib/export';

// Mock data for testing
interface TestData {
  id: string;
  name: string;
  email: string;
  status: string;
}

const mockTableData: TestData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Bob "Quote" Wilson',
    email: 'bob@example.com',
    status: 'pending',
  },
];

// Mock DOM methods
const mockLink = {
  setAttribute: jest.fn(),
  click: jest.fn(),
  style: { visibility: '' },
};
const mockBlob = jest.fn();
const mockCreateObjectURL = jest.fn().mockReturnValue('mock-url');

beforeAll(() => {
  global.document.createElement = jest.fn().mockReturnValue(mockLink);
  global.document.body.appendChild = jest.fn();
  global.document.body.removeChild = jest.fn();
  global.Blob = mockBlob;
  global.URL = {
    createObjectURL: mockCreateObjectURL,
  } as unknown as typeof URL;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockLink.style.visibility = '';
});

// Simple mock table helper
const createMockTable = (
  data: TestData[],
  selectedRows: TestData[] = [],
): Table<TestData> => {
  const columns = [
    { id: 'id' },
    { id: 'name' },
    { id: 'email' },
    { id: 'status' },
    { id: 'select' },
    { id: 'actions' },
  ];

  return {
    getAllLeafColumns: () => columns,
    getRowModel: () => ({
      rows: data.map((item) => ({
        id: item.id,
        getValue: (columnId: string) => item[columnId as keyof TestData] ?? '',
      })),
    }),
    getFilteredSelectedRowModel: () => ({
      rows: selectedRows.map((item) => ({
        id: item.id,
        getValue: (columnId: string) => item[columnId as keyof TestData] ?? '',
      })),
    }),
    _features: [],
  } as unknown as Table<TestData>;
};

describe('export utilities', () => {
  describe('exportTableToCSV', () => {
    it('should export table data to CSV with default options', () => {
      const table = createMockTable(mockTableData);
      exportTableToCSV(table);

      const expectedCSV =
        'id,name,email,status,select,actions\n"1","John Doe","john@example.com","active","",""\n"2","Jane Smith","jane@example.com","inactive","",""\n"3","Bob ""Quote"" Wilson","bob@example.com","pending","",""';

      expect(mockBlob).toHaveBeenCalledWith([expectedCSV], {
        type: 'text/csv;charset=utf-8;',
      });
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'table.csv',
      );
    });

    it('should use custom filename', () => {
      const table = createMockTable(mockTableData);
      exportTableToCSV(table, { filename: 'custom-export' });

      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'custom-export.csv',
      );
    });

    it('should exclude specified columns', () => {
      const table = createMockTable(mockTableData);
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions', 'email'],
      });

      const expectedCSV =
        'id,name,status\n"1","John Doe","active"\n"2","Jane Smith","inactive"\n"3","Bob ""Quote"" Wilson","pending"';
      expect(mockBlob).toHaveBeenCalledWith([expectedCSV], {
        type: 'text/csv;charset=utf-8;',
      });
    });

    it('should export only selected rows', () => {
      const selectedData = [mockTableData[0]!, mockTableData[2]!];
      const table = createMockTable(mockTableData, selectedData);
      exportTableToCSV(table, { onlySelected: true });

      const expectedCSV =
        'id,name,email,status,select,actions\n"1","John Doe","john@example.com","active","",""\n"3","Bob ""Quote"" Wilson","bob@example.com","pending","",""';
      expect(mockBlob).toHaveBeenCalledWith([expectedCSV], {
        type: 'text/csv;charset=utf-8;',
      });
    });

    it('should handle empty data', () => {
      const table = createMockTable([]);
      exportTableToCSV(table);

      expect(mockBlob).toHaveBeenCalledWith(
        ['id,name,email,status,select,actions'],
        { type: 'text/csv;charset=utf-8;' },
      );
    });
  });
});

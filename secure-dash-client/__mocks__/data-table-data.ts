// Mock data for Fail2Ban logs testing

export interface Fail2BanLog {
  id: string;
  timestamp: string;
  ip: string;
  action: 'BANNED' | 'UNBANNED';
  jail: string;
  country: string;
  attempts: number;
  duration: number;
}

export interface TableColumn {
  id: string;
  label: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptions {
  actions: FilterOption[];
  jails: FilterOption[];
  countries: FilterOption[];
}

export const mockFail2BanLog: Fail2BanLog = {
  id: '1',
  timestamp: '2024-01-15T10:30:00Z',
  ip: '192.168.1.100',
  action: 'BANNED',
  jail: 'sshd',
  country: 'US',
  attempts: 5,
  duration: 3600,
};

export const mockFail2BanLogs: Fail2BanLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    ip: '192.168.1.100',
    action: 'BANNED',
    jail: 'sshd',
    country: 'US',
    attempts: 5,
    duration: 3600,
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:25:00Z',
    ip: '10.0.0.50',
    action: 'UNBANNED',
    jail: 'apache',
    country: 'CA',
    attempts: 3,
    duration: 1800,
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:20:00Z',
    ip: '172.16.0.25',
    action: 'BANNED',
    jail: 'nginx',
    country: 'UK',
    attempts: 7,
    duration: 7200,
  },
  {
    id: '4',
    timestamp: '2024-01-15T10:15:00Z',
    ip: '203.0.113.45',
    action: 'BANNED',
    jail: 'sshd',
    country: 'DE',
    attempts: 4,
    duration: 3600,
  },
  {
    id: '5',
    timestamp: '2024-01-15T10:10:00Z',
    ip: '198.51.100.78',
    action: 'UNBANNED',
    jail: 'postfix',
    country: 'FR',
    attempts: 2,
    duration: 900,
  },
];

export const mockEmptyData: Fail2BanLog[] = [];

export const mockLargeDataset: Fail2BanLog[] = Array.from(
  { length: 100 },
  (_, index) => ({
    id: `${index + 1}`,
    timestamp: new Date(Date.now() - index * 60000).toISOString(),
    ip: `192.168.1.${(index % 254) + 1}`,
    action: (index % 3 === 0 ? 'BANNED' : 'UNBANNED') as 'BANNED' | 'UNBANNED',
    jail: ['sshd', 'apache', 'nginx', 'postfix'][index % 4] as string,
    country: ['US', 'CA', 'UK', 'DE', 'FR'][index % 5] as string,
    attempts: Math.floor(Math.random() * 10) + 1,
    duration: [900, 1800, 3600, 7200][index % 4] as number,
  }),
);

export const mockTableColumns: TableColumn[] = [
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'ip', label: 'IP Address' },
  { id: 'action', label: 'Action' },
  { id: 'jail', label: 'Jail' },
  { id: 'country', label: 'Country' },
  { id: 'attempts', label: 'Attempts' },
  { id: 'duration', label: 'Duration' },
];

export const mockFilterOptions: FilterOptions = {
  actions: [
    { label: 'Banned', value: 'BANNED' },
    { label: 'Unbanned', value: 'UNBANNED' },
  ],
  jails: [
    { label: 'SSH', value: 'sshd' },
    { label: 'Apache', value: 'apache' },
    { label: 'Nginx', value: 'nginx' },
    { label: 'Postfix', value: 'postfix' },
  ],
  countries: [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
  ],
};

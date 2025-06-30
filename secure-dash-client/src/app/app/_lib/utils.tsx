import {
  AlertTriangle,
  BarChart3,
  CircleAlert,
  FileText,
  Info,
  Shield,
  TrendingDown,
} from 'lucide-react';
import { JSX } from 'react';

import { GetLogsSchema } from '@/app/app/_lib/validations';

/**
 * Returns the appropriate icon component for a given statistic key
 * @param key - The statistic key identifier
 * @returns JSX element representing the icon, or undefined if key doesn't match
 */
export function getIcon(key: string) {
  switch (key) {
    case 'logs_difference':
      return <TrendingDown size={20} aria-hidden="true" />;
    case 'parse_rate':
      return <BarChart3 size={20} aria-hidden="true" />;
    case 'ban_events':
      return <Shield size={20} aria-hidden="true" />;
    case 'warn_error_logs':
      return <AlertTriangle size={20} aria-hidden="true" />;
  }
}

/**
 * Formats a statistic key into a human-readable title
 * @param key - The statistic key identifier
 * @returns Formatted title string in Spanish
 */
export function formatTitle(key: string) {
  switch (key) {
    case 'logs_difference':
      return 'Diferencia de Logs';
    case 'parse_rate':
      return 'Tasa de Análisis';
    case 'ban_events':
      return 'Eventos de Bloqueo';
    case 'warn_error_logs':
      return 'Logs de Advertencia y Error';
    default:
      // Fallback: capitalize each word separated by underscores
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}

/**
 * Configuration object for log level styling and icons
 */
interface LogLevelConfig {
  /** Icon component for the log level */
  icon: JSX.Element;
  /** CSS classes for badge styling */
  badgeClass: string;
}

/**
 * Returns styling configuration and icon for different log levels
 * Used to consistently style log entries across the application
 *
 * @param level - The log level string (INFO, DEBUG, NOTICE, WARNING, ERROR, UNKNOWN)
 * @returns Object containing icon component and CSS classes for styling
 */
export const getLogLevelConfig = (level: string): LogLevelConfig => {
  switch (level) {
    case 'INFO':
      return {
        icon: <FileText className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'DEBUG':
      return {
        icon: <Info className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'NOTICE':
      return {
        icon: <Info className="text-warning" size={14} aria-hidden="true" />,
        badgeClass: 'border-warning/20 text-warning',
      };
    case 'WARNING':
      return {
        icon: (
          <AlertTriangle
            className="text-amber-500"
            size={14}
            aria-hidden="true"
          />
        ),
        badgeClass: 'border-amber-100 text-amber-700',
      };
    case 'ERROR':
      return {
        icon: (
          <CircleAlert className="text-error" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-error/20 text-error',
      };
    case 'UNKNOWN':
      return {
        icon: (
          <CircleAlert className="text-gray-500" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-gray-500/20 text-gray-500',
      };
    default:
      // Fallback for unrecognized log levels
      return {
        icon: (
          <CircleAlert className="text-info" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-info/20 text-info',
      };
  }
};

/**
 * Builds URL search parameters for the Fail2Ban logs API endpoint.
 *
 * This function transforms the validated input schema into URL search parameters
 * that the backend API expects. It handles:
 * - Pagination: Converts 1-based page numbers to 0-based for the API
 * - Filtering: Only includes non-empty filter values to avoid unnecessary parameters
 * - Timestamps: Converts millisecond timestamps to seconds (Unix timestamp format)
 *
 * @param input - Validated search parameters from the client
 * @returns URLSearchParams object ready to be appended to the API URL
 */
export const buildSearchParams = (input: GetLogsSchema): URLSearchParams => {
  const searchParams = new URLSearchParams();

  // Always add pagination - convert from 1-based (UI) to 0-based (API)
  searchParams.set('page', (input.page - 1).toString());
  searchParams.set('size', input.perPage.toString());

  // Add filters only if they have meaningful values to avoid cluttering the URL
  // and prevent the API from processing empty filter parameters
  const filters = [
    { key: 'filter_text', value: input.message?.trim() },
    { key: 'level', value: input.level?.trim() },
  ];

  filters.forEach(({ key, value }) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  // Handle timestamps - convert from milliseconds (JS Date) to seconds (Unix timestamp)
  // The API expects Unix timestamps in seconds, but JavaScript Date objects use milliseconds
  const [start, end] = input.timestamp || [];
  if (start && start > 0) {
    searchParams.set('start', (start / 1000).toString());
  }
  if (end && end > 0) {
    searchParams.set('end', (end / 1000).toString());
  }

  return searchParams;
};

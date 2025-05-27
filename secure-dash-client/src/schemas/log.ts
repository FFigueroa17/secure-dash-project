/**
 * Represents a parsed and structured log entry from Fail2Ban.
 */
export interface Fail2BanLog {
  /** The timestamp of the log entry in ISO 8601 format. */
  timestamp: string;
  /** The service that generated the log entry, e.g., "fail2ban". */
  service: string;
  /** The process ID associated with the log entry, if available. */
  pid: number | null;
  /** The severity level of the log entry, e.g., DEBUG, INFO, NOTICE. */
  level: string;
  /** The type of event described by the log entry. */
  eventType: 'Ban' | 'Found' | 'Unban' | 'Unknown';
  /** The IP address involved in the log entry, if available. */
  ip: string | null;
  /** The raw message content of the log entry. */
  message: string;
}

/**
 * Represents the structure of an API response containing Fail2Ban logs.
 */
export interface APIResponse<TData> {
  /** The total number of log entries available. */
  totalCount: number;
  /** The total number of pages available. */
  totalPages: number;
  /** The current page number in the paginated response. */
  currentPage: number;
  /** Indicates if there is a next page available. */
  hasNextPage: boolean;
  /** Indicates if there is a previous page available. */
  hasPreviousPage: boolean;
  /** The list of parsed Fail2Ban log entries for the current page. */
  values: TData[];
}

/**
 * Represents the overview statistics from Fail2Ban
 */
export interface Fail2BanOverview {
  logs_difference: number;
  parse_rate: number;
  ban_events: number;
  warn_error_logs: number;
}

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
  /** The list of parsed TData entries for the current page. */
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

/**
 * Represents the reputation information for a banned IP.
 */
export interface BannedIPReputation {
  /** Number of previous bans for this IP */
  previous_bans_count: number;
  /** Total number of bans ever for this IP */
  total_bans_ever: number;
  /** First time this IP was seen */
  first_seen: string;
  /** Last ban before the current one */
  last_ban_before: string;
  /** Whether this IP is a repeat offender */
  is_repeat_offender: boolean;
  /** Attack frequency level */
  attack_frequency: 'baja' | 'media' | 'alta';
  /** Days since first seen */
  days_since_first_seen: number;
}

/**
 * Represents the threat level assessment for a banned IP.
 */
export interface BannedIPThreatLevel {
  /** Threat score (0-10) */
  score: number;
  /** Maximum possible score */
  max_score: number;
  /** Threat level category */
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  /** Reasons for the threat level */
  reasons: string[];
  /** Recommended action for this IP */
  recommended_action: string;
}

/**
 * Represents a banned IP with detailed information.
 */
export interface BannedIP {
  /** The banned IP address */
  ip: string;
  /** The jail that banned this IP */
  jail: string;
  /** When the IP was banned */
  ban_time: string;
  /** Duration of the ban */
  ban_duration_time: string;
  /** Number of failed attempts */
  failed_attempts: number;
  /** Raw log entry */
  raw_log: string;
  /** Reputation information */
  reputation: BannedIPReputation;
  /** Threat level assessment */
  threat_level: BannedIPThreatLevel;
}

/**
 * Represents the overview statistics for banned IPs
 */
export interface BannedIPsOverview {
  summary: {
    jail_name: number;
    total_banned_ips: number;
    ban_duration: number;
    ban_duration_seconds: number;
  };
}

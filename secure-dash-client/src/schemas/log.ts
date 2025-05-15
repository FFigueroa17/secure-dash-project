export interface Fail2BanLog {
  timestamp: string;
  service: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
}

export interface ParsedFail2BanLog {
  timestamp: string; // ISO string
  service: string; // e.g. "fail2ban"
  pid: number | null; // process ID
  level: string; // DEBUG, INFO, NOTICE…
  jail: string | null; // e.g. "sshd"
  eventType:
    | 'failure_detected'
    | 'failure_aggregate'
    | 'ban'
    | 'processing'
    | 'other';
  ip: string | null;
  count: number | null; // per-IP failure count (if given)
  totalFailures: number | null; // aggregate total (if given)
  banDuration: number | null; // seconds (if given)
  rawMessage: string;
}

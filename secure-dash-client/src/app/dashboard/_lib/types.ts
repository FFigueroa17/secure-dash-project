export interface TopIP {
  ip: string;
  bans: number;
}

export interface TrendPoint {
  t: number; // timestamp (epoch)
  events: number;
}

export interface Alert {
  ip: string;
  bansLastHour: number;
}

export interface RealtimeStats {
  t: string; // ISO timestamp
  banRate: number;
  unbanRate: number;
  topIPs: TopIP[];
  avgDetectToBan: number;
  trend: TrendPoint[];
  alerts: Alert[];
}

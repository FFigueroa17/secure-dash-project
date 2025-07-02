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

export interface BanUnbanDataPoint {
  minute: string;
  ban: number;
  unban: number;
}

export interface DetectionDataPoint {
  minute: string;
  count: number;
}

export interface TopIPDetection {
  ip: string;
  detections: number;
}

export interface WebSocketData {
  ban_unban_per_minute: BanUnbanDataPoint[];
  detections_per_minute: DetectionDataPoint[];
  top_ips: TopIPDetection[];
  avg_detect_to_ban_sec: number;
  alerts: Alert[];
}

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'reconnecting';

export interface WebSocketState {
  data: WebSocketData | null;
  status: ConnectionStatus;
  error: string | null;
  lastUpdate: Date | null;
}

import { TopIP, TrendPoint, WebSocketData } from './types';

/**
 * Transform WebSocket ban_unban_per_minute data to format expected by BanUnbanChart
 */
export function transformBanUnbanData(
  data: WebSocketData['ban_unban_per_minute'],
) {
  if (!data || data.length === 0) return [];

  return data.map((item) => ({
    time: item.minute,
    banRate: item.ban,
    unbanRate: item.unban,
  }));
}

/**
 * Transform WebSocket top_ips data to format expected by TopIPsTable
 */
export function transformTopIPsData(data: WebSocketData['top_ips']): TopIP[] {
  if (!data || data.length === 0) return [];

  return data.map((item) => ({
    ip: item.ip,
    bans: item.detections, // Map detections to bans for consistency with existing component
  }));
}

/**
 * Transform WebSocket detections_per_minute data to format expected by ActivityTrendChart
 */
export function transformActivityTrendData(
  data: WebSocketData['detections_per_minute'],
): TrendPoint[] {
  if (!data || data.length === 0) return [];

  const now = new Date();

  return data.map((item) => {
    // Create timestamps based on minute offsets from current time
    const [hours, minutes] = item.minute.split(':').map(Number);
    const timestamp = new Date(now);
    timestamp.setHours(hours ?? 0, minutes ?? 0, 0, 0);

    return {
      t: Math.floor(timestamp.getTime() / 1000),
      events: item.count,
    };
  });
}

/**
 * Format connection status for display
 */
export function getConnectionStatusMessage(
  status: string,
  error?: string | null,
  lastUpdate?: Date | null,
): string {
  switch (status) {
    case 'connected':
      return lastUpdate
        ? `Connected - Last update: ${lastUpdate.toLocaleTimeString()}`
        : 'Connected';
    case 'connecting':
      return 'Connecting to real-time feed...';
    case 'reconnecting':
      return 'Reconnecting...';
    case 'error':
      return error ? `Error: ${error}` : 'Connection error';
    case 'disconnected':
    default:
      return 'Disconnected from real-time feed';
  }
}

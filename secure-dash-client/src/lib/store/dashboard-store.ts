import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import {
  Alert,
  BanUnbanDataPoint,
  DetectionDataPoint,
  TopIPDetection,
  WebSocketData,
} from '@/app/app/dashboard/_lib/types';

export interface DashboardState {
  // WebSocket connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  lastUpdate: Date | null;

  // Raw WebSocket data
  rawData: WebSocketData | null;

  // Processed data for components
  banUnbanHistory: Array<{ time: string; banRate: number; unbanRate: number }>;
  topIPs: Array<{
    ip: string;
    bans: number;
    country?: string;
    lastSeen?: string;
  }>;
  activityTrend: Array<{ t: number; events: number }>;
  avgDetectToBan: number;
  alerts: Alert[];

  // UI state
  isUpdating: boolean;
  updateQueue: number;
  lastProcessedUpdate: Date | null;

  // Actions
  setConnectionState: (state: {
    isConnected: boolean;
    isConnecting: boolean;
    error?: string | null;
  }) => void;
  updateData: (data: WebSocketData) => void;
  processUpdateQueue: () => void;
  clearAlerts: () => void;
  markAsUpdated: () => void;
}

// Transform functions
const transformBanUnbanData = (data: BanUnbanDataPoint[]) => {
  return data
    .filter((item) => item.minute && !isNaN(item.ban) && !isNaN(item.unban)) // Filter out invalid data
    .map((item) => {
      // Parse the minute string to create a proper time format
      // Assuming minute is either a timestamp or time string
      let timeStr: string;

      // If minute is a number (timestamp), convert it
      if (!isNaN(Number(item.minute))) {
        const date = new Date(Number(item.minute) * 1000);
        if (isNaN(date.getTime())) {
          console.warn('Invalid timestamp:', item.minute);
          return null;
        }
        timeStr = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        // If minute is already a time string, use it directly
        timeStr = item.minute;
      }

      return {
        time: timeStr,
        banRate: item.ban || 0,
        unbanRate: item.unban || 0,
      };
    })
    .filter(
      (item): item is { time: string; banRate: number; unbanRate: number } =>
        item !== null,
    );
};

const transformTopIPsData = (data: TopIPDetection[]) => {
  return data
    .filter((item) => item.ip && typeof item.detections === 'number')
    .map((item) => ({
      ip: item.ip,
      bans: item.detections || 0, // Map detections to bans for consistency
      country: 'Unknown', // Could be enhanced with GeoIP
      lastSeen: 'Active',
    }));
};

const transformActivityTrendData = (data: DetectionDataPoint[]) => {
  return data
    .filter((item) => item.minute && typeof item.count === 'number') // Filter out invalid data
    .map((item, index) => {
      // Create a synthetic timestamp if minute is not a valid timestamp
      let timestamp: number;

      if (!isNaN(Number(item.minute))) {
        timestamp = Number(item.minute);
      } else {
        // Create synthetic timestamps based on current time and index
        const now = Date.now() / 1000;
        timestamp = now - (data.length - index) * 60; // Assume 1-minute intervals
      }

      return {
        t: timestamp,
        events: item.count || 0,
      };
    })
    .filter((item): item is { t: number; events: number } => item !== null);
};

// Transform WebSocket alerts to expected Alert format
const transformAlertsData = (
  data: Array<{ ip: string; attempts: number }>,
): Alert[] => {
  // Handle empty arrays safely - most of the time alerts will be empty
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Transform the API response to match our Alert interface
  return data
    .filter((alert) => alert.ip && typeof alert.attempts === 'number')
    .map((alert) => ({
      ip: alert.ip,
      attempts: alert.attempts,
    }));
};

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    lastUpdate: null,

    rawData: null,
    banUnbanHistory: [],
    topIPs: [],
    activityTrend: [],
    avgDetectToBan: 0,
    alerts: [],

    isUpdating: false,
    updateQueue: 0,
    lastProcessedUpdate: null,

    // Actions
    setConnectionState: (connectionState) => {
      set({
        isConnected: connectionState.isConnected,
        isConnecting: connectionState.isConnecting,
        connectionError: connectionState.error ?? null,
      });
    },

    updateData: (data) => {
      const now = new Date();
      console.warn('🏪 Store updateData called with:', data);

      set((state) => ({
        rawData: data,
        lastUpdate: now,
        updateQueue: state.updateQueue + 1,
        isUpdating: true,
      }));

      // Schedule processing with debounce
      const currentQueue = get().updateQueue;
      console.warn('⏱️ Scheduling data processing with queue:', currentQueue);

      setTimeout(() => {
        if (get().updateQueue === currentQueue) {
          console.warn('✅ Processing queue:', currentQueue);
          get().processUpdateQueue();
        } else {
          console.warn(
            '⏭️ Skipping queue processing (newer data available):',
            currentQueue,
          );
        }
      }, 300); // 300ms debounce for processing
    },

    processUpdateQueue: () => {
      const state = get();
      if (!state.rawData) {
        console.warn('⚠️ No raw data available for processing');
        return;
      }

      console.warn('🔄 Processing raw data:', state.rawData);

      const transformedBanUnban = transformBanUnbanData(
        state.rawData.ban_unban_per_minute,
      );
      const transformedTopIPs = transformTopIPsData(state.rawData.top_ips);
      const transformedActivity = transformActivityTrendData(
        state.rawData.detections_per_minute,
      );
      const transformedAlerts = transformAlertsData(state.rawData.alerts || []);

      console.warn('📊 Transformed data:', {
        banUnban: transformedBanUnban,
        topIPs: transformedTopIPs,
        activity: transformedActivity,
        alerts: transformedAlerts,
        avgDetectToBan: state.rawData.avg_detect_to_ban_sec,
      });

      set({
        banUnbanHistory: transformedBanUnban,
        topIPs: transformedTopIPs,
        activityTrend: transformedActivity,
        avgDetectToBan: state.rawData.avg_detect_to_ban_sec,
        alerts: transformedAlerts,
        isUpdating: false,
        lastProcessedUpdate: new Date(),
        updateQueue: 0,
      });

      console.warn('✅ Store updated successfully');
    },

    clearAlerts: () => {
      set({
        alerts: [],
      });
    },

    markAsUpdated: () => {
      set({
        isUpdating: false,
        updateQueue: 0,
      });
    },
  })),
);

// Selectors for components with stable references
export const useConnectionStatus = () => {
  const isConnected = useDashboardStore((state) => state.isConnected);
  const isConnecting = useDashboardStore((state) => state.isConnecting);
  const error = useDashboardStore((state) => state.connectionError);
  const lastUpdate = useDashboardStore((state) => state.lastUpdate);

  return { isConnected, isConnecting, error, lastUpdate };
};

export const useBanUnbanData = () => {
  const data = useDashboardStore((state) => state.banUnbanHistory);
  const isUpdating = useDashboardStore(
    (state) => state.isUpdating && state.updateQueue > 0,
  );
  const lastUpdate = useDashboardStore((state) => state.lastProcessedUpdate);

  return { data, isUpdating, lastUpdate };
};

export const useTopIPsData = () => {
  const data = useDashboardStore((state) => state.topIPs);
  const isUpdating = useDashboardStore(
    (state) => state.isUpdating && state.updateQueue > 0,
  );
  const lastUpdate = useDashboardStore((state) => state.lastProcessedUpdate);

  return { data, isUpdating, lastUpdate };
};

export const useActivityTrendData = () => {
  const data = useDashboardStore((state) => state.activityTrend);
  const isUpdating = useDashboardStore(
    (state) => state.isUpdating && state.updateQueue > 0,
  );
  const lastUpdate = useDashboardStore((state) => state.lastProcessedUpdate);

  return { data, isUpdating, lastUpdate };
};

export const useAvgDetectionData = () => {
  const value = useDashboardStore((state) => state.avgDetectToBan);
  const isUpdating = useDashboardStore(
    (state) => state.isUpdating && state.updateQueue > 0,
  );
  const lastUpdate = useDashboardStore((state) => state.lastProcessedUpdate);

  return { value, isUpdating, lastUpdate };
};

export const useAlertsData = () => {
  const alerts = useDashboardStore((state) => state.alerts);
  const clearAlerts = useDashboardStore((state) => state.clearAlerts);

  return { alerts, clearAlerts };
};

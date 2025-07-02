import { useCallback, useEffect, useRef } from 'react';

import { useDashboardStore, WebSocketData } from '@/lib/store/dashboard-store';

interface UseDashboardWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useDashboardWebSocket({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseDashboardWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { setConnectionState, updateData } = useDashboardStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      console.log('🔌 Connecting to WebSocket:', url);
      setConnectionState({ isConnected: false, isConnecting: true });

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Dashboard WebSocket connected successfully');
        reconnectAttemptsRef.current = 0;
        setConnectionState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      };

      ws.onmessage = (event) => {
        try {
          console.log('📦 WebSocket message received:', event.data);
          const data: WebSocketData = JSON.parse(event.data);
          console.log('📊 Parsed WebSocket data:', data);

          // Validate data structure
          if (data && typeof data === 'object') {
            console.log('✅ Data validation passed, updating store');
            updateData(data);
          } else {
            console.warn('⚠️ Invalid data structure received:', data);
          }
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
          console.error('📝 Raw message data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log(
          '🔌 Dashboard WebSocket disconnected:',
          event.code,
          event.reason,
        );
        setConnectionState({ isConnected: false, isConnecting: false });

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `🔄 Reconnecting... attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`,
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Max reconnection attempts reached');
          setConnectionState({
            isConnected: false,
            isConnecting: false,
            error: 'Max reconnection attempts reached',
          });
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Dashboard WebSocket error:', error);
        setConnectionState({
          isConnected: false,
          isConnecting: false,
          error: 'Connection failed',
        });
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        error: 'Failed to connect',
      });
    }
  }, [
    url,
    reconnectInterval,
    maxReconnectAttempts,
    setConnectionState,
    updateData,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log('🔌 Disconnecting WebSocket');
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionState({ isConnected: false, isConnecting: false });
  }, [setConnectionState]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnect triggered');
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    reconnect,
  };
}

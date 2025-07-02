'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ConnectionStatus,
  WebSocketData,
  WebSocketState,
} from '@/app/app/dashboard/_lib/types';

interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (data: WebSocketData) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) {
  const [state, setState] = useState<WebSocketState>({
    data: null,
    status: 'disconnected',
    error: null,
    lastUpdate: null,
  });

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isManuallyClosedRef = useRef(false);

  const updateStatus = useCallback(
    (status: ConnectionStatus, error: string | null = null) => {
      setState((prev) => ({ ...prev, status, error }));
    },
    [],
  );

  const updateData = useCallback(
    (data: WebSocketData) => {
      setState((prev) => ({
        ...prev,
        data,
        lastUpdate: new Date(),
        error: null,
      }));
      onMessage?.(data);
    },
    [onMessage],
  );

  const connect = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    updateStatus('connecting');

    try {
      // Construct full WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const fullUrl =
        url.startsWith('ws://') || url.startsWith('wss://')
          ? url
          : `${protocol}//${host}${url}`;

      websocketRef.current = new WebSocket(fullUrl);

      websocketRef.current.onopen = () => {
        updateStatus('connected');
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketData;
          updateData(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          updateStatus('error', 'Failed to parse server message');
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      websocketRef.current.onclose = (_) => {
        websocketRef.current = null;

        if (isManuallyClosedRef.current) {
          updateStatus('disconnected');
          onDisconnect?.();
          return;
        }

        // Attempt reconnection if not manually closed
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          updateStatus('reconnecting');
          reconnectAttemptsRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          updateStatus(
            'error',
            `Failed to reconnect after ${maxReconnectAttempts} attempts`,
          );
          onDisconnect?.();
        }
      };

      websocketRef.current.onerror = (error) => {
        updateStatus('error', 'WebSocket connection error');
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      updateStatus('error', 'Failed to create WebSocket connection');
    }
  }, [
    url,
    maxReconnectAttempts,
    reconnectInterval,
    updateStatus,
    updateData,
    onConnect,
    onDisconnect,
    onError,
  ]);

  const disconnect = useCallback(() => {
    isManuallyClosedRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    updateStatus('disconnected');
  }, [updateStatus]);

  const reconnect = useCallback(() => {
    disconnect();
    isManuallyClosedRef.current = false;
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  // Auto-connect on mount and cleanup on unmount
  useEffect(() => {
    isManuallyClosedRef.current = false;
    connect();

    return () => {
      isManuallyClosedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
    isConnected: state.status === 'connected',
    isConnecting:
      state.status === 'connecting' || state.status === 'reconnecting',
  };
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { WebSocketData } from '@/app/app/dashboard/_lib/types';

import { useWebSocket } from './use-websocket';

interface UseDebouncedWebSocketOptions {
  url: string;
  debounceMs?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (data: WebSocketData) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useDebouncedWebSocket({
  url,
  debounceMs = 1000, // Default 1 second debounce
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
}: UseDebouncedWebSocketOptions) {
  const [debouncedData, setDebouncedData] = useState<WebSocketData | null>(
    null,
  );
  const [isDataStale, setIsDataStale] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef<WebSocketData | null>(null);

  // Use the original WebSocket hook
  const websocketState = useWebSocket({
    url,
    reconnectInterval,
    maxReconnectAttempts,
    onMessage: useCallback(
      (data: WebSocketData) => {
        latestDataRef.current = data;
        setIsDataStale(true);

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for debounced update
        debounceTimeoutRef.current = setTimeout(() => {
          setDebouncedData(data);
          setIsDataStale(false);
          onMessage?.(data);
        }, debounceMs);
      },
      [debounceMs, onMessage],
    ),
    onError,
    onConnect,
    onDisconnect,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Force update function for immediate data updates when needed
  const forceUpdate = useCallback(() => {
    if (latestDataRef.current) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      setDebouncedData(latestDataRef.current);
      setIsDataStale(false);
      onMessage?.(latestDataRef.current);
    }
  }, [onMessage]);

  return {
    ...websocketState,
    data: debouncedData,
    isDataStale,
    forceUpdate,
    rawData: websocketState.data, // Access to non-debounced data if needed
  };
}

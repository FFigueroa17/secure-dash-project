'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  connectToFail2BanWebSocket,
  Fail2BanWebSocketLog,
} from '../_lib/queries';

export function RealtimeLogToast() {
  const [logQueue, setLogQueue] = useState<Fail2BanWebSocketLog[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true); // To track component mount status

  const showToast = useCallback((log: Fail2BanWebSocketLog) => {
    let toastType: 'success' | 'info' | 'warning' | 'error' = 'info';
    if (log.importance === 'high') {
      toastType = 'error';
    } else if (log.importance === 'medium') {
      toastType = 'warning';
    }

    toast[toastType](`New ${log.service} Log (${log.level})`, {
      description: `${log.message.substring(0, 100)}${log.message.length > 100 ? '...' : ''}`,
      duration: 8000, // Keep toast visible for 8 seconds
      action: {
        label: 'Detalles',
        onClick: () => console.warn('Log details:', log),
      },
      style: {
        animation: 'fadeIn 0.5s ease-out',
      },
    });
  }, []);

  // Effect to process the log queue
  useEffect(() => {
    if (logQueue.length > 0 && !isProcessing) {
      const logToShow = logQueue[0];
      if (logToShow) {
        setIsProcessing(true);
        showToast(logToShow);

        // Remove the shown log and schedule the next one
        toastTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setLogQueue((prevQueue) => prevQueue.slice(1));
            setIsProcessing(false);
          }
        }, 10000); // 20-second delay
      }
    }

    return () => {
      // Clear timeout if component unmounts or queue/processing state changes
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [logQueue, isProcessing, showToast]);

  // Effect for WebSocket connection
  useEffect(() => {
    isMountedRef.current = true;

    const handleNewLog = (log: Fail2BanWebSocketLog) => {
      if (isMountedRef.current) {
        setLogQueue((prevQueue) => [...prevQueue, log]);
      }
    };

    const handleError = (error: Event) => {
      console.error('WebSocket connection error:', error);
      if (isMountedRef.current) {
        toast.error(
          'Real-time log connection error. Attempting to reconnect...',
        );
      }
    };

    const closeWebSocket = connectToFail2BanWebSocket(
      handleNewLog,
      handleError,
    );

    return () => {
      isMountedRef.current = false;
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      closeWebSocket();
      // console.log(
      //   'RealtimeLogToast unmounted, WebSocket closed and timer cleared.',
      // );
    };
  }, []); // Empty dependency array to run only on mount and unmount

  return null; // This component only manages toasts
}

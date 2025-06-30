/**
 * Defines the structure of a Fail2Ban log message received via WebSocket.
 */
export interface Fail2BanWebSocketLog {
  timestamp: string;
  service: string;
  message: string;
  level: string;
  importance: string;
}

/**
 * Establishes a WebSocket connection to receive real-time Fail2Ban logs.
 *
 * @param {(log: Fail2BanWebSocketLog) => void} onMessageCallback - Callback function to execute when a new log message is received.
 * @param {(error: Event) => void} onErrorCallback - Callback function to execute when a WebSocket error occurs.
 * @returns {() => void} - A function to close the WebSocket connection.
 */
export function connectToFail2BanWebSocket(
  onMessageCallback: (log: Fail2BanWebSocketLog) => void,
  onErrorCallback: (error: Event) => void,
): () => void {
  const wsUrl = 'wss://alertasfail2ban.xmakuno.com/ws/fail2ban-logs';
  let ws: WebSocket | null = null;

  const connect = () => {
    ws = new WebSocket(wsUrl);

    // ws.onopen = () => {
    //   console.log('WebSocket connection established for Fail2Ban logs.');
    // };

    ws.onmessage = (event) => {
      try {
        const logData = JSON.parse(
          event.data as string,
        ) as Fail2BanWebSocketLog;
        onMessageCallback(logData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        // Optionally call onErrorCallback or handle differently
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error for Fail2Ban logs:', error);
      onErrorCallback(error);
      // Attempt to reconnect after a delay
      setTimeout(connect, 5000); // Reconnect after 5 seconds
    };

    ws.onclose = (event) => {
      // console.log(
      //   'WebSocket connection closed for Fail2Ban logs. Code:',
      //   event.code,
      //   'Reason:',
      //   event.reason,
      // );
      // Optionally attempt to reconnect if the closure was unexpected
      if (!event.wasClean) {
        // console.log(
        //   'WebSocket connection closed unexpectedly. Attempting to reconnect...',
        // );
        setTimeout(connect, 5000); // Reconnect after 5 seconds
      }
    };
  };

  connect(); // Initial connection attempt

  // Return a function to manually close the WebSocket
  return () => {
    if (ws) {
      ws.close(1000, 'Client initiated disconnect'); // 1000 indicates a normal closure
      // console.log('Fail2Ban logs WebSocket connection manually closed.');
    }
  };
}

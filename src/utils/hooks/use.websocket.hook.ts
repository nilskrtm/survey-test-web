import { useEffect } from 'react';
import WebSocketClient from '../websocket/WebSocketClient';
import WebSocketClientWrapper from '../websocket/WebSocketClientWrapper';

export let globalWebSocketClient: WebSocketClient;

const useWebSocket = (
  callback: (webSocketClientWrapper: WebSocketClientWrapper) => void | (() => void)
) => {
  useEffect(() => {
    if (!globalWebSocketClient) {
      globalWebSocketClient = new WebSocketClient();
    }

    new WebSocketClientWrapper(globalWebSocketClient, callback);
  }, []);
};

export default useWebSocket;

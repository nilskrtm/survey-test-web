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

    const webSocketClientWrapper = new WebSocketClientWrapper(globalWebSocketClient, callback);

    return () => webSocketClientWrapper.subscriptions().unsubscribeAll();
  }, []);
};

export default useWebSocket;

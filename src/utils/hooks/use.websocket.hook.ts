import { useEffect } from 'react';
import WebSocketClient from '../websocket/WebSocketClient';
import WebSocketClientWrapper from '../websocket/WebSocketClientWrapper';
import { useAppSelector } from '../../store/hooks';
import { selectLoggedIn } from '../../store/features/authentication.slice';

export let globalWebSocketClient: WebSocketClient;

const useWebSocket = (
  callback: (webSocketClientWrapper: WebSocketClientWrapper) => void | (() => void)
) => {
  const isLoggedIn = useAppSelector(selectLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      if (!globalWebSocketClient) {
        globalWebSocketClient = new WebSocketClient();
      }

      const webSocketClientWrapper = new WebSocketClientWrapper(globalWebSocketClient, callback);

      return () => webSocketClientWrapper.subscriptions().unsubscribeAll();
    }
  }, []);
};

export default useWebSocket;

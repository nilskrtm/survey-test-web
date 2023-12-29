import { useAppSelector } from '../../store/hooks';
import { selectAccessToken } from '../../store/features/user.slice';
import WebSocketClient from '../websocket/WebSocketClient';
import WebSocketFactory from '../websocket/WebSocketFactory';

export let creating = false;
export let globalWebSocketClient: WebSocketClient | null = null;

const useWebSocket = (callback: (webSocketClient: WebSocketClient, error: boolean) => void) => {
  const accessToken = useAppSelector(selectAccessToken);

  if (globalWebSocketClient) {
    callback(globalWebSocketClient as WebSocketClient, false);
  } else {
    if (creating) {
      let times = 0;
      const interval = setInterval(() => {
        times = times + 100;

        if (times > 5000) {
          clearInterval(interval);
          callback(globalWebSocketClient as WebSocketClient, false);
        } else {
          if (globalWebSocketClient) {
            clearInterval(interval);
            callback(globalWebSocketClient as WebSocketClient, true);
          }
        }
      }, 100);
    } else {
      creating = true;

      new WebSocketFactory()
        .create(accessToken)
        .then((webSocket) => {
          globalWebSocketClient = new WebSocketClient(webSocket);
          creating = false;

          callback(globalWebSocketClient, false);
        })
        .catch(() => callback(null as unknown as WebSocketClient, true));
    }
  }

  return null;
};

export default useWebSocket;

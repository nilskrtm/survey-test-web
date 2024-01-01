import newWebSocketClient from './WebSocketClient';
import WebSocketClient from './WebSocketClient';
import { WebSocketData } from '../interfaces/websocket.data.interface';

class WebSocketClientWrapper {
  private readonly webSocketClient: WebSocketClient;
  private readonly hookCallback: (
    webSocketClientWrapper: WebSocketClientWrapper
  ) => void | (() => void);
  private hookCleanup?: () => void;
  private callCleanup = false;

  constructor(
    webSocketClient: newWebSocketClient,
    hookCallback: (webSocketClientWrapper: WebSocketClientWrapper) => void
  ) {
    this.webSocketClient = webSocketClient;
    this.hookCallback = hookCallback;

    this.setup();
  }

  private setup() {
    if (this.webSocketClient.isConnected()) {
      this.callHook();
    }

    this.webSocketClient.onConnect(() => {
      this.callHook();
    });

    this.webSocketClient.onClose(() => {
      if (this.callCleanup && this.hookCleanup) {
        this.hookCleanup();
        this.callCleanup = false;
      }
    });

    this.webSocketClient.onMessage((data) => {
      console.log(data);
    });
  }

  private callHook() {
    const returnFunction = this.hookCallback(this);

    if (returnFunction && typeof returnFunction === 'function') {
      this.hookCleanup = returnFunction;
      this.callCleanup = true;
    }
  }

  public sendRaw<T = any>(data: WebSocketData<T>) {
    this.webSocketClient.sendMessage(JSON.stringify(data));
  }
}

export default WebSocketClientWrapper;

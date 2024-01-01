import newWebSocketClient from './WebSocketClient';
import WebSocketClient from './WebSocketClient';
import { WebSocketData } from '../interfaces/websocket.data.interface';
import SubscriptionManager from './subscriptions/SubscriptionManager';

class WebSocketClientWrapper {
  private readonly webSocketClient: WebSocketClient;
  private readonly subscripitonManager: SubscriptionManager;

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
    this.subscripitonManager = new SubscriptionManager(this);
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
      this.subscripitonManager.unsubscribeAll();

      if (this.callCleanup && this.hookCleanup) {
        this.hookCleanup();
        this.callCleanup = false;
      }
    });
  }

  private callHook() {
    const returnFunction = this.hookCallback(this);

    if (returnFunction && typeof returnFunction === 'function') {
      this.hookCleanup = returnFunction;
      this.callCleanup = true;
    }
  }

  public getClient() {
    return this.webSocketClient;
  }

  public listen() {
    // use in useWebSocket to listen to incoming data, should be filtered before to only let through the messages that should (valid WebSocketData, no subscription data, etc.)
  }

  public send<T = any>(data: WebSocketData<T>) {
    this.webSocketClient.sendMessage(JSON.stringify(data));
  }

  public subscriptions() {
    return this.subscripitonManager;
  }
}

export default WebSocketClientWrapper;

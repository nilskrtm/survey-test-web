import { WebSocketData } from '../interfaces/websocket.data.interface';
import { store } from '../../store/store';

const baseUrl: string = process.env.REACT_APP_WS_ENDPOINT || 'ws://127.0.0.1:5000';
const reconnectTimeout: number = parseInt(process.env.REACT_APP_WS_RECONNECT_TIMEOUT || '3000');

class WebSocketClient {
  private webSocket: WebSocket | null = null;
  private connecting = false;
  private reconnecting = false;
  private connected = false;

  private readonly onConnectCallbacks: ((event: Event) => void)[] = [];
  private readonly onCloseCallbacks: ((event: CloseEvent) => void)[] = [];
  private readonly onErrorCallbacks: ((event: Event) => void)[] = [];
  private readonly onMessageCallbacks: ((data: any) => void)[] = [];

  constructor() {
    this.connect.bind(this);
    this.reconnect.bind(this);
    this.internalOnConnect.bind(this);
    this.internalOnClose.bind(this);
    this.internalOnError.bind(this);
    this.internalOnMessage.bind(this);
    this.isConnected.bind(this);

    this.connect();
  }

  private connect() {
    this.webSocket = null;
    this.connecting = true;
    this.connected = false;
    this.webSocket = new WebSocket(this.getWebSocketUrl());

    this.webSocket.addEventListener('open', (event) => {
      this.internalOnConnect(event);
    });
    this.webSocket.addEventListener('close', (event) => {
      this.internalOnClose(event);
    });
    this.webSocket.addEventListener('error', (event) => {
      this.internalOnError(event);
    });
    this.webSocket.addEventListener('message', (event) => {
      this.internalOnMessage(event);
    });
  }

  private reconnect() {
    this.reconnecting = true;

    setTimeout(() => {
      this.reconnecting = false;
      this.connect();
    }, reconnectTimeout);
  }

  private internalOnConnect(event: Event) {
    this.connected = true;
    this.connecting = false;

    this.onConnectCallbacks.forEach((callback) => callback(event));
  }

  private internalOnClose(event: CloseEvent) {
    this.onCloseCallbacks.forEach((callback) => callback(event));

    if (!this.reconnecting) {
      this.reconnect();
    }
  }

  private internalOnError(event: Event) {
    if (this.connecting) {
      this.connecting = false;

      this.reconnect();
    } else {
      this.onErrorCallbacks.forEach((callback) => callback(event));
    }
  }

  private internalOnMessage(event: MessageEvent) {
    const data: WebSocketData = JSON.parse(event.data.toString());

    this.onMessageCallbacks.forEach((callback) => callback(data));
  }

  public onConnect(callback: (event: Event) => void) {
    this.onConnectCallbacks.push(callback);
  }

  public onClose(callback: (event: CloseEvent) => void) {
    this.onCloseCallbacks.push(callback);
  }

  public onError(callback: (event: Event) => void) {
    this.onErrorCallbacks.push(callback);
  }

  public onMessage(callback: (data: any) => void) {
    this.onMessageCallbacks.push(callback);
  }

  public sendMessage(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (this.isConnected() && this.webSocket) {
      this.webSocket.send(data);
    }
  }

  public isConnected() {
    return this.connected && this.webSocket?.readyState === 1;
  }

  private getWebSocketUrl() {
    return baseUrl + '/' + store.getState().authentication.accessToken;
  }
}

export default WebSocketClient;

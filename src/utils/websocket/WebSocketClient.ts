import { WebSocketData } from '../interfaces/websocket.data.interface';

class WebSocketClient {
  private readonly ws: WebSocket;

  constructor(webSocket: WebSocket) {
    this.ws = webSocket;

    this.setup();
  }

  private setup() {
    if (this.ws) {
      this.ws.addEventListener('error', (event: Event) => {
        console.debug(event);
      });
      this.ws.addEventListener('close', (event: CloseEvent) => {
        console.debug(event);
      });
      this.ws.addEventListener('message', (event: MessageEvent) => {
        const webSocketData: WebSocketData = JSON.parse(event.data.toString());

        console.log(webSocketData);
      });
    }
  }

  public send(data: WebSocketData) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default WebSocketClient;

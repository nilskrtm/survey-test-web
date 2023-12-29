const baseUrl: string = process.env.REACT_APP_WS_ENDPOINT || '127.0.0.1:12345';

class WebSocketFactory {
  private ws: WebSocket | null = null;
  create: (accessToken: string) => Promise<WebSocket> = (accessToken: string) => {
    const url = 'ws://' + baseUrl + '?accessToken=' + accessToken;

    return new Promise<WebSocket>((resolve, reject) => {
      let done = false;
      const rejectHandler = () => {
        if (!done) {
          done = true;

          this.ws?.removeEventListener('error', rejectHandler);

          reject();
        }
      };

      this.ws = new WebSocket(url);

      this.ws.addEventListener('open', () => {
        done = true;

        resolve(this.ws as WebSocket);
      });
      this.ws.addEventListener('error', rejectHandler);
    });
  };
}

export default WebSocketFactory;

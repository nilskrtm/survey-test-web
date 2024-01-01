import WebSocketClientWrapper from '../WebSocketClientWrapper';
import { v4 as uuid } from 'uuid';
import {
  SubscriptionData,
  SubscriptionType,
  WebSocketData,
  WebSocketDataType
} from '../../interfaces/websocket.data.interface';

type SubscriptionCallback<T = any> = (payload: T) => void;

interface AwaitingSubscription {
  id: string;
  timeout: ReturnType<typeof setTimeout>;
  callback: SubscriptionCallback;
}

class SubscriptionManager {
  private readonly subscriberId: string;
  private readonly webSocketClientWrapper: WebSocketClientWrapper;

  private readonly awaitingSubscriptions: Map<string, AwaitingSubscription> = new Map<
    string,
    AwaitingSubscription
  >();
  private readonly subscriptions: Map<string, SubscriptionCallback> = new Map<
    string,
    SubscriptionCallback
  >();

  constructor(webSocketClientWrapper: WebSocketClientWrapper) {
    this.subscriberId = uuid();
    this.webSocketClientWrapper = webSocketClientWrapper;

    this.setup();
  }

  private setup() {
    this.webSocketClientWrapper.getClient().onMessage((data: WebSocketData) => {
      if (data.type === WebSocketDataType.SUBSCRIPTION_CONFIRMATION && this.isResponsible(data)) {
        const parsedData = data as WebSocketData<SubscriptionData>;
        const { subscriptionId } = parsedData.data;

        if (this.awaitingSubscriptions.has(subscriptionId)) {
          const awaitingSubscription = this.awaitingSubscriptions.get(
            subscriptionId
          ) as AwaitingSubscription;

          clearTimeout(awaitingSubscription.timeout);
          this.subscriptions.set(subscriptionId, awaitingSubscription.callback);
        }
      } else if (data.type === WebSocketDataType.SUBSCRIPTION_PAYLOAD && this.isResponsible(data)) {
        const parsedData = data as WebSocketData<SubscriptionData>;
        const { subscriptionId, payload } = parsedData.data;

        if (this.subscriptions.has(subscriptionId)) {
          const subscriptionCallback = this.subscriptions.get(
            subscriptionId
          ) as SubscriptionCallback;

          subscriptionCallback(payload);
        }
      }
    });
  }

  private isResponsible(data: WebSocketData) {
    const parsedData = data as WebSocketData<SubscriptionData>;

    return parsedData.data.subscriberId === this.subscriberId;
  }

  public subscribe<T = any>(type: SubscriptionType, callback: SubscriptionCallback<T>) {
    const subscriptionId: string = uuid();
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.unsubscribe(subscriptionId);
    }, 3000);
    const awaitingSubscription: AwaitingSubscription = {
      id: subscriptionId,
      timeout: timeout,
      callback: callback
    };
    const subscribeData: WebSocketData<SubscriptionData> = {
      type: WebSocketDataType.SUBSCRIPTION_REQUEST,
      data: {
        subscriberId: this.subscriberId,
        subscriptionId: subscriptionId,
        subscriptionType: type
      }
    };

    this.awaitingSubscriptions.set(subscriptionId, awaitingSubscription);
    this.webSocketClientWrapper.send(subscribeData);

    return subscriptionId;
  }

  public unsubscribe(subscriptionId: string) {
    if (this.awaitingSubscriptions.has(subscriptionId)) {
      this.awaitingSubscriptions.delete(subscriptionId);

      // send even not registered to prevent that it does not get registered in close future
      if (this.webSocketClientWrapper.getClient().isConnected()) {
        const unsubscribeData: WebSocketData<SubscriptionData> = {
          type: WebSocketDataType.SUBSCRIPTION_REMOVE,
          data: { subscriberId: this.subscriberId, subscriptionId: subscriptionId }
        };

        this.webSocketClientWrapper.send(unsubscribeData);
      }
    }

    if (this.subscriptions.has(subscriptionId)) {
      this.subscriptions.delete(subscriptionId);

      if (this.webSocketClientWrapper.getClient().isConnected()) {
        const unsubscribeData: WebSocketData<SubscriptionData> = {
          type: WebSocketDataType.SUBSCRIPTION_REMOVE,
          data: { subscriberId: this.subscriberId, subscriptionId: subscriptionId }
        };

        this.webSocketClientWrapper.send(unsubscribeData);
      }
    }
  }

  public unsubscribeAll() {
    const subscriptionIds = Array.from(this.subscriptions.keys());
    const awaitingSubscriptionIds = Array.from(this.awaitingSubscriptions.keys());

    subscriptionIds.forEach((subscriptionId) => this.unsubscribe(subscriptionId));
    awaitingSubscriptionIds.forEach((subscriptionId) => this.unsubscribe(subscriptionId));
  }
}

export default SubscriptionManager;

export enum WebSocketDataType {
  SUBSCRIPTION_REQUEST = 'SUBSCRIPTION_REQUEST',
  SUBSCRIPTION_CONFIRMATION = 'SUBSCRIPTION_CONFIRMATION',
  SUBSCRIPTION_REMOVE = 'SUBSCRIPTION_REMOVE',
  SUBSCRIPTION_PAYLOAD = 'SUBSCRIPTION_PAYLOAD'
}

export enum SubscriptionType {
  DASHBOARD_METRICS = 'DASHBOARD_METRICS'
}

export interface SubscriptionData<D = any> {
  subscriberId: string;
  subscriptionId: string;
  subscriptionType?: SubscriptionType;
  payload?: D;
}

export interface WebSocketData<T = any> {
  type: WebSocketDataType;
  data: T;
}

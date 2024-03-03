export enum SubscriptionType {
  USER_DATA = 'USER_DATA',
  DASHBOARD_METRICS = 'DASHBOARD_METRICS',
  SURVEY_CREATED = 'SURVEY_CREATED'
}

export interface SubscriptionData<D = any> {
  subscriberId: string;
  subscriptionId: string;
  subscriptionType?: SubscriptionType;
  payload?: D;
}

export enum WebSocketDataType {
  SUBSCRIPTION_REQUEST = 'SUBSCRIPTION_REQUEST',
  SUBSCRIPTION_CONFIRMATION = 'SUBSCRIPTION_CONFIRMATION',
  SUBSCRIPTION_REMOVE = 'SUBSCRIPTION_REMOVE',
  SUBSCRIPTION_PAYLOAD = 'SUBSCRIPTION_PAYLOAD'
}

export interface WebSocketData<T = any> {
  type: WebSocketDataType;
  data: T;
}

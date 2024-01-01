import React, { PropsWithChildren } from 'react';
import useWebSocket from '../../utils/hooks/use.websocket.hook';
import { SubscriptionType } from '../../utils/interfaces/websocket.data.interface';

const LiveUserDataProvider: (props: PropsWithChildren) => React.JSX.Element = (
  props: PropsWithChildren
) => {
  useWebSocket((socket) => {
    socket.subscriptions().subscribe(SubscriptionType.USER_DATA, () => {
      alert('user data changed');
    });
  });

  return <>{props.children}</>;
};

export default LiveUserDataProvider;

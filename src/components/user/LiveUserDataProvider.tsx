import React, { PropsWithChildren } from 'react';
import useWebSocket from '../../utils/hooks/use.websocket.hook';
import { SubscriptionType } from '../../utils/interfaces/websocket.data.interface';
import { UserDataWSPayload } from '../../utils/websocket/interfaces/user.data.ws.payload';
import { useAppDispatch } from '../../store/hooks';
import { setPermissionLevel } from '../../store/features/authentication.slice';
import { setUserData } from '../../store/features/user.slice';

const LiveUserDataProvider: (props: PropsWithChildren) => React.JSX.Element = (
  props: PropsWithChildren
) => {
  const dispatch = useAppDispatch();

  useWebSocket((socket) => {
    socket.subscriptions().subscribe<UserDataWSPayload>(SubscriptionType.USER_DATA, (data) => {
      dispatch(
        setPermissionLevel({
          permissionLevel: data.permissionLevel
        })
      );
      dispatch(
        setUserData({
          username: data.username,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname
        })
      );
    });
  });

  return <>{props.children}</>;
};

export default LiveUserDataProvider;

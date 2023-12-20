import { Navigate, useLocation } from 'react-router-dom';
import React, { PropsWithChildren } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectLoggedIn, selectPermissionLevel } from '../../store/features/user.slice';

type ProtectedRouteProps = {
  redirectPath: string;
  requiresAdmin?: boolean;
};

const ProtectedRoute: (props: PropsWithChildren<ProtectedRouteProps>) => React.JSX.Element = (
  props: PropsWithChildren<ProtectedRouteProps>
) => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const permissionLevel = useAppSelector(selectPermissionLevel);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={props.redirectPath} state={{ from: location }} replace />;
  }

  if ('requiresAdmin' in props && props.requiresAdmin && permissionLevel !== 1) {
    return <Navigate to={props.redirectPath} state={{ from: location }} replace />;
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;

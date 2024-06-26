import { Navigate, useLocation } from 'react-router-dom';
import React, { PropsWithChildren } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectLoggedIn, selectPermissionLevel } from '../../store/features/authentication.slice';
import { PermissionLevel } from '../../utils/enums/permissionlevel.enum';

type ProtectedRouteProps = {
  redirectPath?: string;
  requiresAdmin?: boolean;
};

const ProtectedRoute: (props: PropsWithChildren<ProtectedRouteProps>) => React.JSX.Element = (
  props
) => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const permissionLevel: PermissionLevel = useAppSelector(selectPermissionLevel);
  const redirectPath = props.redirectPath || '/';
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (
    'requiresAdmin' in props &&
    props.requiresAdmin &&
    permissionLevel !== PermissionLevel.ADMIN
  ) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return props.children ? (props.children as React.JSX.Element) : <></>;
};

export default ProtectedRoute;

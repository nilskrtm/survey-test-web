import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';

type NoMatchRouteProps = {
  redirectPath: string;
};

const NoMatchRoute: (props: NoMatchRouteProps) => React.JSX.Element = (
  props: NoMatchRouteProps
) => {
  const location = useLocation();

  return <Navigate to={props.redirectPath} state={{ from: location }} replace />;
};

export default NoMatchRoute;

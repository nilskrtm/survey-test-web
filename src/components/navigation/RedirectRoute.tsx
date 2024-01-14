import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';

type RedirectRouteProps = {
  redirectPath: string;
};

const RedirectRoute: (props: RedirectRouteProps) => React.JSX.Element = (props) => {
  const location = useLocation();

  return <Navigate to={props.redirectPath} state={{ from: location }} replace />;
};

export default RedirectRoute;

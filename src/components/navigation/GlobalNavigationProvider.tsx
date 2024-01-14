import React, { PropsWithChildren } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export let globalNavigate: NavigateFunction;

const GlobalNavigationProvider: (props: PropsWithChildren) => React.JSX.Element = (props) => {
  globalNavigate = useNavigate();

  return <>{props.children}</>;
};

export default GlobalNavigationProvider;

import { NavigateFunction, useNavigate } from 'react-router-dom';
import React, { PropsWithChildren } from 'react';

export let globalNavigate: NavigateFunction;

export const GlobalNavigationProvider: (props: PropsWithChildren) => React.JSX.Element = (
  props: PropsWithChildren
) => {
  globalNavigate = useNavigate();

  return <>{props.children}</>;
};

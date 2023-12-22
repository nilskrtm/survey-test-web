import { NavigateFunction, useNavigate } from 'react-router-dom';

export let globalNavigate: NavigateFunction;

export const GlobalNavigation = () => {
  globalNavigate = useNavigate();

  return null;
};

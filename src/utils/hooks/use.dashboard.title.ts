import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setDashboardTitle } from '../../store/features/passthrough.slice';

const useDashboardTitle: (title: string) => (newTitle: string) => void = (title: string) => {
  const dispatch = useAppDispatch();

  const setDashboardTitleInternal: (newTitle: string) => void = (newTitle: string) => {
    dispatch(setDashboardTitle({ dashboardTitle: newTitle }));
  };

  useEffect(() => {
    setDashboardTitleInternal(title);
  });

  return setDashboardTitleInternal;
};

export default useDashboardTitle;

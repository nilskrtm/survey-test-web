import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setDashboardTitle } from '../../store/features/passthrough.slice';

const useDashboardTitle: (title: string) => (newTitle: string) => void = (title) => {
  const dispatch = useAppDispatch();

  const setDashboardTitleInternal: (newTitle: string) => void = (newTitle) => {
    dispatch(setDashboardTitle({ dashboardTitle: newTitle }));
  };

  useEffect(() => {
    setDashboardTitleInternal(title);
  }, []);

  return setDashboardTitleInternal;
};

export default useDashboardTitle;

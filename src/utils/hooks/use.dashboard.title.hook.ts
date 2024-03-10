import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setDashboardTitle } from '../../store/features/passthrough.slice';

type SetDashboardTitleFunction = (newTitle: string) => void;

const useDashboardTitle: (title: string) => SetDashboardTitleFunction = (title) => {
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

import React, { useEffect, useState } from 'react';
import DashboardMetricBox from '../../components/dashboard/DashboardMetricBox';
import {
  faClipboard,
  faImage,
  faSquarePollVertical,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { DashboardMetrics } from '../../data/types/dashboard.types';
import DashboardService from '../../data/services/dashboard.service';
import useWebSocket from '../../utils/hooks/use.websocket.hook';
import { SubscriptionType } from '../../utils/interfaces/websocket.data.interface';
import { useAppSelector } from '../../store/hooks';
import { selectPermissionLevel } from '../../store/features/authentication.slice';
import { PermissionLevel } from '../../utils/enums/permissionlevel.enum';

const Dashboard: () => React.JSX.Element = () => {
  useDashboardTitle('Übersicht');

  const permissionLevel = useAppSelector(selectPermissionLevel);

  const metricsLoader = useLoader();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    surveyCount: 0,
    votingCount: 0,
    pictureCount: 0
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    metricsLoader.set(LoadingOption.LOADING);

    DashboardService.getMetrics().then((response) => {
      if (response.success) {
        setMetrics(response.data.metrics);
        metricsLoader.set(LoadingOption.RESET);
      } else {
        metricsLoader.set(LoadingOption.ERROR);
      }
    });
  };

  useWebSocket((socket) => {
    socket.subscriptions().subscribe(SubscriptionType.DASHBOARD_METRICS, () => loadMetrics());
  });

  return (
    <div className="w-full h-full grid auto-rows-min grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-6 overflow-y-auto">
      <DashboardMetricBox
        className=""
        icon={faClipboard}
        iconColor="text-purple-700"
        iconBackgroundColor="bg-purple-200"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.surveyCount}
        text={'Umfrage' + (metrics.surveyCount === 1 ? '' : 'n')}
      />
      <DashboardMetricBox
        className=""
        icon={faSquarePollVertical}
        iconColor="text-cyan-700"
        iconBackgroundColor="bg-cyan-100"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.votingCount}
        text={'Abstimmung' + (metrics.votingCount === 1 ? '' : 'en')}
      />
      <DashboardMetricBox
        className=""
        icon={faImage}
        iconColor="text-orange-700"
        iconBackgroundColor="bg-orange-200"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.pictureCount}
        text={'Bild' + (metrics.pictureCount === 1 ? '' : 'er')}
      />
      {permissionLevel === PermissionLevel.ADMIN && metrics.userCount && (
        <DashboardMetricBox
          className=""
          icon={faUserGroup}
          iconColor="text-green-700"
          iconBackgroundColor="bg-green-200"
          loading={metricsLoader.loading}
          metric={metricsLoader.error ? '?' : metrics.userCount}
          text="Nutzer"
        />
      )}
    </div>
  );
};

export default Dashboard;

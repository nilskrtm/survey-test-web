import React, { useEffect, useState } from 'react';
import DashboardMetricBox from '../../components/dashboard/DashboardMetricBox';
import { faClipboard, faImage, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader';
import { DashboardMetrics } from '../../data/types/dashboard.types';
import DashboardService from '../../data/services/dashboard.service';
import useWebSocket from '../../utils/hooks/use.websocket.hook';
import { SurveyCreatedWSPayload } from '../../utils/websocket/interfaces/survey.created.ws.payload';
import { SubscriptionType } from '../../utils/interfaces/websocket.data.interface';

const Dashboard: () => React.JSX.Element = () => {
  useDashboardTitle('Übersicht');

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
    socket
      .subscriptions()
      .subscribe(SubscriptionType.SURVEY_CREATED, (payload: SurveyCreatedWSPayload) => {
        alert(payload._id);
      });
  });

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 p-6">
      <DashboardMetricBox
        className=""
        icon={faClipboard}
        iconColor="text-purple-700"
        iconBackgroundColor="bg-purple-200"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.surveyCount}
        text="Umfragen gesamt"
      />
      <DashboardMetricBox
        className=""
        icon={faSquarePollVertical}
        iconColor="text-cyan-700"
        iconBackgroundColor="bg-cyan-100"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.votingCount}
        text="Abstimmungen"
      />
      <DashboardMetricBox
        className=""
        icon={faImage}
        iconColor="text-orange-700"
        iconBackgroundColor="bg-orange-200"
        loading={metricsLoader.loading}
        metric={metricsLoader.error ? '?' : metrics.pictureCount}
        text="Bilder für Anworten"
      />
    </div>
  );
};

export default Dashboard;

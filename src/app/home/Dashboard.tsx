import React, { useEffect, useState } from 'react';
import DashboardMetricBox from '../../components/dashboard/DashboardMetricBox';
import { faChartPie, faClipboard, faImage } from '@fortawesome/free-solid-svg-icons';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const Dashboard: () => React.JSX.Element = () => {
  useDashboardTitle('Übersicht');

  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [surveyCount, setSurveyCount] = useState<number>(0);
  const [votingCount, setVotingCount] = useState<number>(0);
  const [pictureCount, setPictureCount] = useState<number>(0);

  useEffect(() => {
    setMetricsLoading(true);
    setSurveyCount(0);
    setVotingCount(0);
    setPictureCount(0);
  }, []);

  return (
    <div className="w-full grid grid-cols-4 gap-12">
      <DashboardMetricBox
        className=""
        icon={faClipboard}
        iconColor="text-purple-700"
        iconBackgroundColor="bg-purple-200"
        loading={metricsLoading}
        metric={surveyCount}
        text="Umfragen gesamt"
      />
      <DashboardMetricBox
        className=""
        icon={faChartPie}
        iconColor="text-cyan-700"
        iconBackgroundColor="bg-cyan-100"
        loading={metricsLoading}
        metric={votingCount}
        text="Abstimmungen gesammelt"
      />
      <DashboardMetricBox
        className=""
        icon={faImage}
        iconColor="text-orange-700"
        iconBackgroundColor="bg-orange-200"
        loading={metricsLoading}
        metric={pictureCount}
        text="Bilder für Anworten"
      />
    </div>
  );
};

export default Dashboard;

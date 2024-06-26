type DashboardMetric = string | number;

type DashboardMetrics = {
  surveyCount: DashboardMetric;
  votingCount: DashboardMetric;
  pictureCount: DashboardMetric;
  userCount?: DashboardMetric;
};

export type { DashboardMetrics };

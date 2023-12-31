import API from '../api';
import { DashboardMetrics } from '../types/dashboard.types';

const getMetrics = () => {
  return API.get<{ metrics: DashboardMetrics }>('/dashboard/metrics');
};

export default { getMetrics };

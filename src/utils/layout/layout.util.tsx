import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const layoutRoute: (element: React.ReactNode) => React.JSX.Element = (element) => {
  return <DashboardLayout>{element}</DashboardLayout>;
};

export { layoutRoute };

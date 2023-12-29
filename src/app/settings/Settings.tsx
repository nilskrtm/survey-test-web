import React from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const Settings: () => React.JSX.Element = () => {
  useDashboardTitle('Einstellungen');

  return (
    <div className="w-full h-[500px] p-4 rounded-lg bg-white border border-gray-200">
      <p>Einstellungen</p>
    </div>
  );
};

export default Settings;

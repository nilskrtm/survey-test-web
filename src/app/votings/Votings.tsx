import React from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';

const Votings: () => React.JSX.Element = () => {
  useDashboardTitle('Abstimmungen');

  return (
    <div className="w-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-scroll">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 p-6">
        <p>Abstimmungen</p>
      </div>
    </div>
  );
};

export default Votings;

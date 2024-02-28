import React from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const Votings: () => React.JSX.Element = () => {
  useDashboardTitle('Abstimmungen');

  return (
    <div className="w-full h-full grid grid-cols-1 gap-12 p-6 overflow-y-scroll">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 py-10 px-10">
        <p>Abstimmungen</p>
      </div>
    </div>
  );
};

export default Votings;

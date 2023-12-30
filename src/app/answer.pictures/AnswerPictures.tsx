import React from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const AnswerPictures: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Bilder');

  return (
    <div className="w-full grid grid-cols-1 gap-12">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 py-10 px-10">
        <p>Bilder</p>
      </div>
    </div>
  );
};

export default AnswerPictures;

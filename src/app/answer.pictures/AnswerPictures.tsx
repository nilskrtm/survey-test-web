import React from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const AnswerPictures: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Bilder');

  return (
    <div className="w-full h-[500px] p-4 rounded-lg bg-white border border-gray-200">
      <p>Bilder</p>
    </div>
  );
};

export default AnswerPictures;

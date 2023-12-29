import React from 'react';

const Imprint: () => React.JSX.Element = () => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-purple-300 select-none">
      <div className="w-[420px] p-8 rounded-lg bg-white border-2 border-gray-400">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-bold text-purple-800">GBU-SmartData</p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-semibold">Impressum</span>
        </div>

        <div className="mt-6 lg:mt-10">
          <span>Impressum</span>
        </div>
      </div>
    </div>
  );
};

export default Imprint;

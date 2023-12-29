import React from 'react';

const Imprint: () => React.JSX.Element = () => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-[420px] p-8 rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            GBU-SmartData
          </p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Impressum</span>
        </div>

        <div className="mt-6 lg:mt-10">
          <span>Impressum</span>
        </div>
      </div>
    </div>
  );
};

export default Imprint;

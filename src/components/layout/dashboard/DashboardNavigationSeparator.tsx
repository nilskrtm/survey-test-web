import React from 'react';

type DashboardNavigationSeparatorProps = { name: string };

const DashboardNavigationSeparator: (
  props: DashboardNavigationSeparatorProps
) => React.JSX.Element = (props: DashboardNavigationSeparatorProps) => {
  return (
    <div className="w-full py-1">
      <p className="text-md font-bold text-gray-700 uppercase tracking-wide">{props.name}</p>
    </div>
  );
};

export default DashboardNavigationSeparator;

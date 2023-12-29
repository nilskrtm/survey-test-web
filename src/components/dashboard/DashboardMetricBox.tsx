import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DashboardMetricBoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  icon: IconProp;
  iconColor: string;
  iconBackgroundColor: string;
  loading?: boolean;
  metric: string | number;
  text: string;
};

const DashboardMetricBox: (props: DashboardMetricBoxProps) => React.JSX.Element = (
  props: DashboardMetricBoxProps
) => {
  return (
    <div
      className={`w-full flex flex-row rounded-lg bg-white border border-gray-200 py-10 px-10 select-none ${props.className}`}>
      <div className="w-1/3 flex items-center justify-center">
        <div className={`rounded-full p-5 ${props.iconBackgroundColor}`}>
          <FontAwesomeIcon
            icon={props.icon}
            size="2x"
            fixedWidth={true}
            className={`text-3xl ${props.iconColor}`}
          />
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-start justify-center">
        <span
          className={`font-bold text-black text-2xl tracking-tight ${
            props.loading ? 'loading-dots' : ''
          }`}>
          {props.loading ? '' : props.metric.toString()}
        </span>
        <span className="font-medium text-gray-600 text-lg">{props.text}</span>
      </div>
    </div>
  );
};

export default DashboardMetricBox;

import { matchPath, NavLink, PathPattern, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

type DashboardNavigationEntryProps = {
  icon: IconProp;
  metric?: number;
  metricError?: boolean;
  name: string;
  path: string;
  matchPathPattern?: PathPattern;
};

const DashboardNavigationEntry: (props: DashboardNavigationEntryProps) => React.JSX.Element = (
  props: DashboardNavigationEntryProps
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = !!matchPath(
    props.matchPathPattern ? props.matchPathPattern : props.path,
    location.pathname
  );

  return (
    <div className="w-full p-[6px] flex flex-row items-center justify-between rounded-md hover:ring-1 hover:ring-purple-800">
      <div className="relative pl-3 flex grow">
        <FontAwesomeIcon
          icon={props.icon}
          size="lg"
          className={`absolute top-1 pointer-events-none ${
            active ? 'text-purple-800' : 'text-gray-800'
          }`}
        />
        <NavLink
          className={`grow pl-8 text-lg font-medium ${
            active ? 'text-purple-800' : 'text-gray-800'
          }`}
          to={props.path}>
          {props.name}
        </NavLink>
      </div>
      {props.metric && !props.metricError && (
        <div className="cursor-pointer" onClick={() => navigate(props.path)}>
          <p className={`text-lg font-normal ${active ? 'text-purple-800' : 'text-gray-800'}`}>
            {props.metric}
          </p>
        </div>
      )}
      {props.metricError && (
        <FontAwesomeIcon
          icon={faExclamation}
          size="sm"
          className="text-red-500 cursor-pointer pointer-events-none"
        />
      )}
    </div>
  );
};

export default DashboardNavigationEntry;

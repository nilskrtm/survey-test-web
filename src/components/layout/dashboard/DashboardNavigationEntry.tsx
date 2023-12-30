import { matchPath, NavLink, PathPattern, useLocation } from 'react-router-dom';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DashboardNavigationEntryProps = {
  icon: IconProp;
  name: string;
  path: string;
  matchPathPattern?: PathPattern;
};

const DashboardNavigationEntry: (props: DashboardNavigationEntryProps) => React.JSX.Element = (
  props: DashboardNavigationEntryProps
) => {
  const location = useLocation();
  const active = !!matchPath(
    props.matchPathPattern ? props.matchPathPattern : props.path,
    location.pathname
  );

  return (
    <NavLink
      className={`relative w-full py-3 px-6 flex grow flex-row items-center justify-start rounded-lg text-gray-600 hover:text-purple-700 ${
        active ? 'cursor-default' : ''
      }`}
      to={props.path}>
      <FontAwesomeIcon
        icon={props.icon}
        size="lg"
        className={`pointer-events-none text-inherit ${active ? '!text-purple-700' : ''}`}
      />
      <span
        className={`absolute left-[74px] text-lg font-medium ${
          active ? '!text-black' : '!text-gray-600'
        }`}>
        {props.name}
      </span>
    </NavLink>
  );
};

export default DashboardNavigationEntry;

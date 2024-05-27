import { matchPath, NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum DashboardNavigationEntryType {
  MOBILE = 'mobile',
  DESKTOP = 'desktop'
}

type DashboardNavigationEntryProps = {
  icon: IconProp;
  matchPathPattern?: string[];
  name: string;
  path: string;
  type: DashboardNavigationEntryType;
};

const DashboardNavigationEntry: (props: DashboardNavigationEntryProps) => React.JSX.Element = (
  props
) => {
  const location = useLocation();
  const matchPatterns = Array.from(props.matchPathPattern || []);

  if (!matchPatterns.includes(props.path)) {
    matchPatterns.push(props.path);
  }

  const active =
    matchPatterns.filter((pattern) => !!matchPath(pattern, location.pathname)).length > 0;

  if (props.type === DashboardNavigationEntryType.MOBILE) {
    return (
      <NavLink
        className="relative w-full flex grow flex-row items-center justify-start py-2 text-lg group"
        to={props.path}>
        <div className="h-6 w-6 flex items-center justify-center">
          <FontAwesomeIcon
            icon={props.icon}
            size="1x"
            className={`pointer-events-none text-gray-600 group-hover:text-purple-700 ${active ? '!text-purple-700' : ''}`}
          />
        </div>
        <span
          className={`absolute left-[37px] text-lg text-gray-600 group-hover:text-black font-normal ${
            active ? '!text-black' : ''
          }`}>
          {props.name}
        </span>
      </NavLink>
    );
  }

  return (
    <NavLink
      className="relative w-full py-3 px-6 flex grow flex-row items-center justify-start rounded-lg group"
      to={props.path}>
      <FontAwesomeIcon
        icon={props.icon}
        size="1x"
        className={`pointer-events-none text-xl text-gray-600 group-hover:text-purple-700 ${active ? '!text-purple-700' : ''}`}
      />
      <span
        className={`absolute left-[74px] text-lg text-gray-600 group-hover:text-black font-medium ${
          active ? '!text-black' : ''
        }`}>
        {props.name}
      </span>
    </NavLink>
  );
};

export default DashboardNavigationEntry;

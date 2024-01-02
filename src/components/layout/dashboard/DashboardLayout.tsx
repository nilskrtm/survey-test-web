import React, { createRef, PropsWithChildren, useState } from 'react';
import DashboardNavigationEntry from './DashboardNavigationEntry';
import { useAppSelector } from '../../../store/hooks';
import { selectDashboardTitle } from '../../../store/features/passthrough.slice';
import { selectFullName } from '../../../store/features/user.slice';
import AuthenticationService from '../../../data/services/authentication.service';
import { faAndroid } from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';
import useClickOutside from '../../../utils/hooks/use.click.outside';
import {
  faChartPie,
  faChevronDown,
  faChevronUp,
  faClipboard,
  faGears,
  faImage,
  faPlus,
  faRightFromBracket,
  faSquarePollVertical
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DashboardLayoutProps = { todo?: string };

const DashboardLayout: (props: PropsWithChildren<DashboardLayoutProps>) => React.JSX.Element = (
  props: PropsWithChildren<DashboardLayoutProps>
) => {
  const dashboardTitle = useAppSelector(selectDashboardTitle);
  const fullName = useAppSelector(selectFullName);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = createRef<HTMLDivElement>();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useClickOutside(dropdownRef, () => {
    if (dropdownOpen) {
      toggleDropdown();
    }
  });

  const logout = () => {
    AuthenticationService.logout();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-[74px] flex flex-row select-none">
        <div className="w-72 flex items-center justify-center">
          <p className="text-3xl text-purple-700 font-medium tracking-tight">GBU-SmartData</p>
        </div>
        <div className="flex grow py-4 px-8 flex-row items-center justify-between">
          <p className="text-3xl text-black font-semibold">{dashboardTitle}</p>
          <div className="relative" ref={dropdownRef}>
            <button
              className={`flex items-center justify-between px-4 py-2 text-gray-600 font-medium hover:text-black ${
                dropdownOpen
                  ? 'rounded-t-lg border-l border-t border-r border-gray-600 hover:text-purple-700'
                  : 'rounded-lg border border-transparent hover:border-gray-600 hover:text-purple-700'
              }`}
              onClick={toggleDropdown}>
              <span className="!text-gray-600 hover:!text-black">{fullName}</span>
              <FontAwesomeIcon
                icon={!dropdownOpen ? faChevronDown : faChevronUp}
                size="sm"
                className="ml-3"
              />
            </button>
            {dropdownOpen && (
              <button
                className="absolute w-full flex items-center justify-between px-4 py-2 rounded-b-lg bg-white border border-gray-600 border-t-gray-400 text-gray-600 font-medium hover:text-purple-700"
                onClick={logout}>
                <span className="!text-gray-600 hover:!text-black">Abmelden</span>
                <FontAwesomeIcon icon={faRightFromBracket} size="sm" className="ml-3" />
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="w-full h-[calc(100%-74px)] flex flex-row">
        <nav className="w-72 h-full flex flex-col items-center justify-between bg-gray-50 select-none">
          <div className="w-full p-5 pt-8 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={undefined}
              className="flex items-center justify-between space-x-4 px-6 py-3 rounded-lg bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <span className="text-lg text-white font-medium">Neue Umfrage</span>
              <FontAwesomeIcon icon={faPlus} size="lg" className="text-white" />
            </button>
            <div className="w-full mt-8 flex flex-col items-center justify-center space-y-3">
              <DashboardNavigationEntry icon={faChartPie} name="Übersicht" path="/dashboard" />
              <DashboardNavigationEntry
                icon={faClipboard}
                name="Umfragen"
                path="/surveys"
                matchPathPattern={['/surveys', '/surveys/:surveyId']}
              />
              <DashboardNavigationEntry
                icon={faSquarePollVertical}
                name="Abstimmungen"
                path="/votings"
              />
              <DashboardNavigationEntry icon={faImage} name="Bilder" path="/answer-pictures" />
              <DashboardNavigationEntry icon={faGears} name="Einstellungen" path="/settings" />
            </div>
          </div>
          <NavLink
            className="flex flex-col items-center justify-center space-y-5 rounded-lg p-6 mb-10 bg-violet-200 border border-gray-300 group"
            target="_blank"
            rel="noopener noreferrer"
            to="/cdn/gbu-smartdata.apk">
            <span className="text-lg text-gray-700 font-semibold group-hover:text-black">
              App herunterladen
            </span>
            <FontAwesomeIcon
              icon={faAndroid}
              size="2x"
              className="w-12 py-2 text-black rounded-full bg-white group-hover:text-green-600"
            />
          </NavLink>
        </nav>
        <main className="w-full h-full block bg-gray-100">{props.children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React, { PropsWithChildren, useState } from 'react';
import DashboardNavigationEntry from './DashboardNavigationEntry';
import { useAppSelector } from '../../store/hooks';
import { selectFullName, selectPermissionLevel } from '../../store/features/user.slice';
import { getPermissionLevelName } from '../../utils/enums/permissionlevel.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faGears,
  faGrip,
  faImage,
  faRightFromBracket,
  faSquarePollVertical
} from '@fortawesome/free-solid-svg-icons';
import DashboardNavigationSeparator from './DashboardNavigationSeparator';
import AuthenticationService from '../../data/services/authentication.service';
import useWebSocket from '../../utils/hooks/use.websocket.hook';

type DashboardLayoutProps = { todo?: string };

const DashboardLayout: (props: PropsWithChildren<DashboardLayoutProps>) => React.JSX.Element = (
  props: PropsWithChildren<DashboardLayoutProps>
) => {
  const fullName = useAppSelector(selectFullName);
  const userGroup = getPermissionLevelName(useAppSelector(selectPermissionLevel));

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [surveyCount] = useState<number | undefined>(undefined);
  const [pictureCount] = useState<number | undefined>(undefined);

  useWebSocket((ws, error) => {
    if (!error) {
      ws.send({ type: 88888 });
    }
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () => {
    AuthenticationService.logout();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full flex flex-row select-none">
        <div className="w-72 flex items-center justify-center">
          <p className="text-3xl text-purple-700 font-medium tracking-tight">GBU-SmartData</p>
        </div>
        <div className="flex grow py-4 px-8 flex-row items-center justify-between">
          <p className="text-3xl text-black font-semibold tracking-wide">Übersicht</p>
          <div className="relative">
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
      <div className="h-full w-full flex flex-row">
        <nav className="w-72 h-full flex flex-col justify-between bg-gray-50 select-none">
          <div className="w-full p-5 flex flex-col items-center justify-center">
            <DashboardNavigationSeparator name="Allgemein" />
            <div className="w-full mt-1.5 flex flex-col space-y-[2px]">
              <DashboardNavigationEntry icon={faGrip} name="Übersicht" path="/dashboard" />
              <DashboardNavigationEntry
                icon={faSquarePollVertical}
                metric={surveyCount}
                metricError={!surveyCount}
                name="Umfragen"
                path="/surveys"
              />
              <DashboardNavigationEntry
                icon={faImage}
                metric={pictureCount}
                metricError={!pictureCount}
                name="Bilder"
                path="/answer-pictures"
              />
            </div>
            <div className="h-3" />
            <DashboardNavigationSeparator name="Account" />
            <div className="w-full mt-1.5 flex flex-col space-y-[2px]">
              <DashboardNavigationEntry icon={faGears} name="Einstellungen" path="/settings" />
            </div>
          </div>
          <div className="w-full flex flex-col">App Download</div>
        </nav>
        <main className="grow flex flex-col">
          <div className="w-full h-full px-6 overflow-y-scroll bg-gray-100">
            <div className="w-full h-6" />
            {props.children}
            <div className="w-full h-6" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

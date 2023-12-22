import React, { PropsWithChildren, useState } from 'react';
import DashboardNavigationEntry from './DashboardNavigationEntry';
import { useAppSelector } from '../../store/hooks';
import { selectFullName, selectPermissionLevel } from '../../store/features/user.slice';
import { getPermissionLevelName } from '../../utils/enums/permissionlevel.enum';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGears,
  faGrip,
  faImage,
  faRightFromBracket,
  faSquarePollVertical
} from '@fortawesome/free-solid-svg-icons';
import DashboardNavigationSeparator from './DashboardNavigationSeparator';

type DashboardLayoutProps = { todo?: string };

const DashboardLayout: (props: PropsWithChildren<DashboardLayoutProps>) => React.JSX.Element = (
  props: PropsWithChildren<DashboardLayoutProps>
) => {
  const navigate = useNavigate();

  const fullName = useAppSelector(selectFullName);
  const userGroup = getPermissionLevelName(useAppSelector(selectPermissionLevel));

  const [surveyCount] = useState<number | undefined>(undefined);
  const [pictureCount] = useState<number | undefined>(undefined);

  const logout = () => {
    navigate('/logout');
  };

  return (
    <div className="w-full h-full flex flex-row">
      <nav className="w-72 h-full flex flex-col justify-between bg-gray-100 select-none border-r-2 border-gray-400">
        <div className="w-full flex-col">
          <div className="w-full py-4 flex items-center justify-center bg-white">
            <p className="p-3 text-3xl font-semibold text-purple-800 tracking-wide">
              GBU-SmartData
            </p>
          </div>
          <div className="w-full p-5 flex flex-col items-center justify-center border-t-2 border-gray-400">
            <DashboardNavigationSeparator name="Allgemein" />
            <div className="w-full mt-1.5 flex flex-col space-y-[2px]">
              <DashboardNavigationEntry icon={faGrip} name="Übersicht" path="/dashboard" />
              <DashboardNavigationEntry
                icon={faSquarePollVertical}
                metric={surveyCount}
                metricError={surveyCount === undefined}
                name="Umfragen"
                path="/surveys"
              />
              <DashboardNavigationEntry
                icon={faImage}
                metric={pictureCount}
                metricError={pictureCount === undefined}
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
        </div>
        <div className="w-full flex flex-col">
          <p>Angemeldet als</p>
          <p>{fullName}</p>
          <p>{userGroup}</p>
          <div className="w-full relative">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size="lg"
              className="absolute text-black pointer-events-none"
            />
            <button className="" onClick={logout} type="button">
              Abmelden
            </button>
          </div>
        </div>
      </nav>
      <main className="grow">{props.children}</main>
    </div>
  );
};

export default DashboardLayout;

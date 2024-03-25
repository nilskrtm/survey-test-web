import React, { createRef, PropsWithChildren, useEffect, useState } from 'react';
import DashboardNavigationEntry, { DashboardNavigationEntryType } from './DashboardNavigationEntry';
import { useAppSelector } from '../../../store/hooks';
import { selectDashboardTitle } from '../../../store/features/passthrough.slice';
import { selectFullName } from '../../../store/features/user.slice';
import AuthenticationService from '../../../data/services/authentication.service';
import { faAndroid } from '@fortawesome/free-brands-svg-icons';
import { NavLink, useLocation } from 'react-router-dom';
import useClickOutside from '../../../utils/hooks/use.click.outside.hook';
import {
  faBars,
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
import CreateSurveyModal, { CreateSurveyModalRefAttributes } from '../../surveys/CreateSurveyModal';

type DashboardLayoutProps = {
  //
};

const DashboardLayout: (props: PropsWithChildren<DashboardLayoutProps>) => React.JSX.Element = (
  props
) => {
  const dashboardTitle = useAppSelector(selectDashboardTitle);
  const fullName = useAppSelector(selectFullName);

  const location = useLocation();

  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const mobileDropdownRef = createRef<HTMLDivElement>();
  const profileDropdownRef = createRef<HTMLDivElement>();

  const createSurveyModalRef = createRef<CreateSurveyModalRefAttributes>();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  useClickOutside(profileDropdownRef, () => {
    if (profileDropdownOpen) toggleProfileDropdown();
  });

  useClickOutside(mobileDropdownRef, () => {
    if (mobileDropdownOpen) toggleProfileDropdown();
  });

  useEffect(() => {
    if (mobileDropdownOpen) toggleMobileDropdown();
    if (profileDropdownOpen) toggleProfileDropdown();
  }, [location]);

  const logout = () => {
    AuthenticationService.logout();
  };

  const createSurvey = () => {
    createSurveyModalRef.current?.open();
  };

  return (
    <>
      <div className="w-full h-full flex max-lg:flex-col lg:flex-row bg-white">
        <div className="lg:h-full lg:w-[250px] max-lg:sticky max-lg:z-20 max-lg:top-0 max-lg:h-[56px] max-lg:flex max-lg:flex-col max-lg:bg-white select-none">
          <div className="w-full lg:h-[60px] max-lg:h-full flex flex-row max-lg:justify-between lg:justify-center items-center max-lg:px-6">
            <p className="lg:text-3xl max-lg:text-xl text-purple-700 font-medium tracking-tight">
              GBU-SmartData
            </p>
            <button
              className="lg:hidden max-lg:flex justify-center items-center text-xl"
              onClick={toggleMobileDropdown}>
              <FontAwesomeIcon
                icon={faBars}
                size="1x"
                className={`${mobileDropdownOpen ? 'text-black' : 'text-gray-600'}`}
              />
            </button>
          </div>
          {mobileDropdownOpen && (
            <div
              className="absolute top-[56px] w-full lg:hidden max-lg:flex flex-col justify-center items-center bg-white border-t-2 border-b-2 border-gray-300"
              ref={mobileDropdownRef}>
              <div className="w-full flex flex-col justify-center items-center px-6 py-1">
                <DashboardNavigationEntry
                  icon={faChartPie}
                  name="Übersicht"
                  path="/dashboard"
                  type={DashboardNavigationEntryType.MOBILE}
                />
                <DashboardNavigationEntry
                  icon={faClipboard}
                  matchPathPattern={['/surveys', '/surveys/:surveyId']}
                  name="Umfragen"
                  path="/surveys"
                  type={DashboardNavigationEntryType.MOBILE}
                />
                <DashboardNavigationEntry
                  icon={faSquarePollVertical}
                  name="Abstimmungen"
                  path="/votings"
                  type={DashboardNavigationEntryType.MOBILE}
                />
                <DashboardNavigationEntry
                  icon={faImage}
                  name="Bilder"
                  path="/answer-pictures"
                  type={DashboardNavigationEntryType.MOBILE}
                />
                <DashboardNavigationEntry
                  icon={faGears}
                  name="Einstellungen"
                  path="/settings"
                  type={DashboardNavigationEntryType.MOBILE}
                />
              </div>
              <div className="w-full flex flex-row items-center justify-between px-6 py-2 border-t-2 border-gray-300">
                <span className="text-gray-600 font-normal">{fullName}</span>
                <button
                  className="grow flex items-center justify-end px-4 py-2 text-gray-600 font-normal hover:text-purple-700 group"
                  onClick={logout}>
                  <span className="!text-gray-600 group-hover:!text-black">Abmelden</span>
                  <FontAwesomeIcon icon={faRightFromBracket} size="sm" className="ml-3" />
                </button>
              </div>
            </div>
          )}
          <nav className="h-[calc(100%-60px)] w-full lg:flex max-lg:hidden flex-col items-center justify-between bg-gray-50">
            <div className="w-full p-5 pt-8 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={createSurvey}
                className="flex items-center justify-between space-x-4 px-6 py-3 rounded-lg bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <span className="text-lg text-white font-medium">Neue Umfrage</span>
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-white" />
              </button>
              <div className="w-full mt-8 flex flex-col items-center justify-center space-y-3">
                <DashboardNavigationEntry
                  icon={faChartPie}
                  name="Übersicht"
                  path="/dashboard"
                  type={DashboardNavigationEntryType.DESKTOP}
                />
                <DashboardNavigationEntry
                  icon={faClipboard}
                  matchPathPattern={['/surveys', '/surveys/:surveyId']}
                  name="Umfragen"
                  path="/surveys"
                  type={DashboardNavigationEntryType.DESKTOP}
                />
                <DashboardNavigationEntry
                  icon={faSquarePollVertical}
                  name="Abstimmungen"
                  path="/votings"
                  type={DashboardNavigationEntryType.DESKTOP}
                />
                <DashboardNavigationEntry
                  icon={faImage}
                  name="Bilder"
                  path="/answer-pictures"
                  type={DashboardNavigationEntryType.DESKTOP}
                />
                <DashboardNavigationEntry
                  icon={faGears}
                  name="Einstellungen"
                  path="/settings"
                  type={DashboardNavigationEntryType.DESKTOP}
                />
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
        </div>
        <div className="lg:w-[calc(100%-250px)] max-lg:w-full max-lg:h-[calc(100%-56px)]">
          <header className="h-[60px] grow max-lg:hidden lg:flex flex-row items-center justify-between py-4 px-8 select-none">
            <p className="text-3xl text-black font-semibold">{dashboardTitle}</p>
            <div className="relative" ref={profileDropdownRef}>
              <button
                className={`flex items-center justify-between px-4 py-2 text-gray-600 font-medium hover:text-black ${
                  profileDropdownOpen
                    ? 'rounded-t-lg border-l border-t border-r border-gray-600 hover:text-purple-700'
                    : 'rounded-lg border border-transparent hover:border-gray-600 hover:text-purple-700'
                }`}
                onClick={toggleProfileDropdown}>
                <span className="!text-gray-600 hover:!text-black">{fullName}</span>
                <FontAwesomeIcon
                  icon={!profileDropdownOpen ? faChevronDown : faChevronUp}
                  size="sm"
                  className="ml-3"
                />
              </button>
              {profileDropdownOpen && (
                <button
                  className="absolute w-full flex items-center justify-between px-4 py-2 rounded-b-lg bg-white border border-gray-600 border-t-gray-400 text-gray-600 font-medium hover:text-purple-700"
                  onClick={logout}>
                  <span className="!text-gray-600 hover:!text-black">Abmelden</span>
                  <FontAwesomeIcon icon={faRightFromBracket} size="sm" className="ml-3" />
                </button>
              )}
            </div>
          </header>
          <main className="w-full max-lg:h-full lg:h-[calc(100%-60px)] block bg-gray-100">
            {props.children}
          </main>
        </div>
      </div>

      {/* create survey modal */}
      <CreateSurveyModal ref={createSurveyModalRef} />
    </>
  );
};

export default DashboardLayout;

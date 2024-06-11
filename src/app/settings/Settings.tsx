import React, { createRef, useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import UserService from '../../data/services/user.service';
import useToasts from '../../utils/hooks/use.toasts.hook';
import GenerateAccessKeyModal, {
  GenerateAccessKeyModalRefAttributes
} from '../../components/settings/GenerateAccessKeyModal';
import { UpdateUserValues, User } from '../../data/types/user.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUserId } from '../../store/features/authentication.slice';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { dummyUser } from '../../utils/users/users.util';
import { hasChanged } from '../../utils/data/update.util';
import { setUserData as setStoreUserData } from '../../store/features/user.slice';
import { APIError } from '../../data/types/common.types';
import ChangePasswordModal, {
  ChangePasswordModalRefAttributes
} from '../../components/settings/ChangePasswordModal';

const Settings: () => React.JSX.Element = () => {
  useDashboardTitle('Einstellungen');

  const userId = useAppSelector(selectUserId);

  const dispatch = useAppDispatch();
  const toaster = useToasts();

  const [showAccessKey, setShowAccessKey] = useState<boolean>(false);
  const [loadingAccessKey, setLoadingAccessKey] = useState<boolean>(false);
  const [generatingAccessKey, setGeneratingAccessKey] = useState<boolean>(false);

  const [accessKey, setAccessKey] = useState<string>('');

  const generateAccessKeyModalRef = createRef<GenerateAccessKeyModalRefAttributes>();

  const [userData, setUserData] = useState<User>(dummyUser());
  const [updatedUserData, setUpdatedUserData] = useState<User>(dummyUser());

  const userDataLoader = useLoader();
  const [updatingUserData, setUpdatingUserData] = useState<boolean>(false);
  const [userDataFieldErrors, setUserDataFieldErrors] = useState<{
    email?: string;
    firstname?: string;
    lastname?: string;
  }>({});

  const changePasswordModalRef = createRef<ChangePasswordModalRefAttributes>();

  useEffect(() => {
    userDataLoader.set(LoadingOption.LOADING);

    UserService.getUser(userId).then((response) => {
      if (response.success) {
        setUserData(response.data.user);
        setUpdatedUserData(response.data.user);
        userDataLoader.set(LoadingOption.RESET);
      } else {
        userDataLoader.set(LoadingOption.ERROR);
      }
    });
  }, []);

  const getAccessKey: () => void = () => {
    setLoadingAccessKey(true);
    setGeneratingAccessKey(false);

    UserService.getAccessKey()
      .then((response) => {
        if (response.success) {
          setAccessKey(response.data.accessKey);
          setShowAccessKey(true);
        } else {
          setAccessKey('');
          setShowAccessKey(false);
          toaster.sendToast('error', 'Der Zugangsschlüssel konnte nicht geladen werden.');
        }
      })
      .finally(() => {
        setLoadingAccessKey(false);
        setGeneratingAccessKey(false);
      });
  };

  const requestGenerateAccessKey: () => void = () => {
    generateAccessKeyModalRef.current?.open();
  };

  const generateAccessKey: () => void = () => {
    setLoadingAccessKey(false);
    setGeneratingAccessKey(true);

    UserService.generateAccessKey()
      .then((response) => {
        if (response.success) {
          setAccessKey(response.data.accessKey);
          setShowAccessKey(true);
        } else {
          setAccessKey('');
          setShowAccessKey(false);
          toaster.sendToast('error', 'Der Zugangsschlüssel konnte nicht neu generiert werden.');
        }
      })
      .finally(() => {
        setLoadingAccessKey(false);
        setGeneratingAccessKey(false);
      });
  };

  const updateUserData: () => void = () => {
    setUpdatingUserData(true);
    setUserDataFieldErrors({});

    const newUserData: UpdateUserValues = {
      email: updatedUserData.email.trim(),
      firstname: updatedUserData.firstname.trim(),
      lastname: updatedUserData.lastname.trim()
    };

    UserService.updateUser(userId, newUserData)
      .then((response) => {
        if (response.success) {
          setUserData(updatedUserData);

          dispatch(
            setStoreUserData({
              username: userData.username,
              email: updatedUserData.email,
              firstname: updatedUserData.firstname,
              lastname: updatedUserData.lastname
            })
          );

          toaster.sendToast('success', 'Ihre persönlichen Daten wurden erfolgreich aktualisiert.');
        } else {
          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            toaster.sendToast(
              'error',
              error.errorMessage || 'Fehler beim Ändern der persönlichen Daten.'
            );
          } else {
            setUserDataFieldErrors(error.fieldErrors);
          }
        }
      })
      .finally(() => {
        setUpdatingUserData(false);
      });
  };

  const userDataChanged: () => boolean = () => {
    return hasChanged(userData, updatedUserData);
  };

  const requestChangePassword: () => void = () => {
    changePasswordModalRef.current?.open();
  };

  return (
    <>
      <div className="w-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-auto">
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">
            Persönliche Daten
          </span>
          {userDataLoader.loading && !userDataLoader.error && (
            <div className="w-full flex flex-col items-center justify-center space-y-6">
              <BounceLoader color="rgb(126 34 206)" size={70} />
              <p className="text-medium font-medium text-gray-700">Laden der persönlichen Daten</p>
            </div>
          )}
          {!userDataLoader.loading && userDataLoader.error && (
            <div className="w-full flex flex-col items-center justify-center space-y-6">
              <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
              <p className="text-medium font-medium text-gray-700">
                Laden der persönlichen Daten fehlgeschlagen
              </p>
            </div>
          )}
          {!userDataLoader.loading && !userDataLoader.error && (
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col">
                <label htmlFor="userData-username" className="text-lg font-medium pb-2">
                  Nutzername
                </label>
                <input
                  type="text"
                  id="userData-username"
                  autoComplete="username"
                  disabled={true}
                  placeholder="Nutzername"
                  value={updatedUserData.username}
                  className="form-input w-full rounded-md font-normal text-base text-black opacity-60"
                />
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="userData-email" className="text-lg font-medium pb-2">
                  E-Mail Adresse
                </label>
                <input
                  type="email"
                  id="userData-email"
                  autoComplete="email"
                  disabled={updatingUserData}
                  placeholder="E-Mail"
                  value={updatedUserData.email}
                  onChange={(event) => {
                    setUpdatedUserData({ ...updatedUserData, email: event.target.value });
                  }}
                  className="form-input w-full rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
                {userDataFieldErrors.email && (
                  <span className="p-1 pt-2 text-sm text-red-500 font-medium">
                    {userDataFieldErrors.email}
                  </span>
                )}
              </div>
              <div className="w-full flex flex-row items-center justify-evenly gap-4">
                <div className="w-1/2 flex flex-col">
                  <label htmlFor="userData-firstname" className="text-lg font-medium pb-2">
                    Vorname
                  </label>
                  <input
                    type="text"
                    id="userData-firstname"
                    autoComplete="given-name"
                    disabled={updatingUserData}
                    placeholder="Vorname"
                    maxLength={35}
                    value={updatedUserData.firstname}
                    onChange={(event) => {
                      setUpdatedUserData({ ...updatedUserData, firstname: event.target.value });
                    }}
                    className="form-input w-full rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                  {userDataFieldErrors.firstname && (
                    <span className="p-1 pt-2 text-sm text-red-500 font-medium">
                      {userDataFieldErrors.firstname}
                    </span>
                  )}
                </div>
                <div className="w-1/2 flex flex-col">
                  <label htmlFor="userData-lastname" className="text-lg font-medium pb-2">
                    Nachname
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    disabled={updatingUserData}
                    id="userData-lastname"
                    placeholder="Nachname"
                    maxLength={35}
                    value={updatedUserData.lastname}
                    onChange={(event) => {
                      setUpdatedUserData({ ...updatedUserData, lastname: event.target.value });
                    }}
                    className="form-input w-full rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                  {userDataFieldErrors.lastname && (
                    <span className="p-1 pt-2 text-sm text-red-500 font-medium">
                      {userDataFieldErrors.lastname}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={updateUserData}
            className={`px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${updatingUserData ? 'loading-button' : ''}`}
            disabled={
              userDataLoader.loading ||
              userDataLoader.error ||
              updatingUserData ||
              !userDataChanged()
            }
            title="Änderung speichern">
            Speichern
          </button>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Passwort</span>
          <span className="text-base text-black font-normal whitespace-break-spaces text-ellipsis">
            Eine Änderung Ihres Passwortes hat keinen Einfluss auf die Authentifizierung ihrer
            Geräte mit dem Server. Dafür ist der extra Zugangsschlüssel verantwortlich.
          </span>
          <button
            onClick={requestChangePassword}
            className="px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Passwort ändern">
            Passwort ändern
          </button>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">
            App-Zugangsschlüssel
          </span>
          <span className="text-base text-black font-normal whitespace-break-spaces text-ellipsis">
            Durch das Neu-Generieren des Zugangsschlüssels wird es nötig, diesen ebenfalls in den
            Einstellungen in Ihren Geräten anzupassen.
          </span>
          <input
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            disabled={true}
            value={showAccessKey ? accessKey : '*****'}
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <button
              onClick={
                showAccessKey
                  ? () => {
                      setShowAccessKey(false);
                    }
                  : getAccessKey
              }
              className={`px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${loadingAccessKey ? 'loading-button' : ''}`}
              disabled={loadingAccessKey || generatingAccessKey}
              title="Zugangsschlüssel anzeigen">
              {showAccessKey ? 'Verbergen' : 'Anzeigen'}
            </button>
            <button
              onClick={requestGenerateAccessKey}
              className={`px-3 py-[8px] rounded-md bg-red-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed ${generatingAccessKey ? 'loading-button' : ''}`}
              disabled={loadingAccessKey || generatingAccessKey}
              title="Zugangsschlüssel neu generieren">
              Neu Generieren
            </button>
          </div>
        </div>
      </div>

      {/* change password modal */}
      <ChangePasswordModal ref={changePasswordModalRef} />

      {/* generate access-key modal */}
      <GenerateAccessKeyModal
        ref={generateAccessKeyModalRef}
        onConfirmGeneration={generateAccessKey}
      />
    </>
  );
};

export default Settings;

import React, { useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import UserService from '../../data/services/user.service';
import useToasts from '../../utils/hooks/use.toasts.hook';

const Settings: () => React.JSX.Element = () => {
  useDashboardTitle('Einstellungen');

  const toaster = useToasts();

  const [showAccessKey, setShowAccessKey] = useState<boolean>(false);
  const [loadingAccessKey, setLoadingAccessKey] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>('');

  useEffect(() => {
    setShowAccessKey(false);
  }, []);

  const getAccessKey: () => void = () => {
    setLoadingAccessKey(true);

    UserService.getAccessKey()
      .then((response) => {
        if (response.success) {
          setAccessKey(response.data.accessKey);
        } else {
          setAccessKey('');
          toaster.sendToast('error', 'Der Zugangsschlüssel konnte nicht geladen werden.');
        }
      })
      .finally(() => {
        setLoadingAccessKey(false);
      });
  };

  const generateAccessKey: () => void = () => {
    //
  };

  return (
    <div className="w-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-scroll">
      <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
        <span className="text-xl font-semibold whitespace-nowrap truncate">Begrüßung</span>
        <input
          className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
          disabled={!showAccessKey}
          value={showAccessKey ? accessKey : '*****'}
        />
      </div>
    </div>
  );
};

export default Settings;

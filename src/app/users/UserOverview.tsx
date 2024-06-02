import React, { useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { useNavigate, useParams } from 'react-router-dom';
import useToasts from '../../utils/hooks/use.toasts.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { User } from '../../data/types/user.types';
import { hasChanged } from '../../utils/data/update.util';
import { APIError } from '../../data/types/common.types';
import UserService from '../../data/services/user.service';
import { dummyUser } from '../../utils/users.util';

interface UserOverviewPathParams extends Record<string, string> {
  userId: string;
}

const UserOverview: () => React.JSX.Element = () => {
  const setDashboardTitle = useDashboardTitle('Nutzer');
  const navigate = useNavigate();
  const toaster = useToasts();

  const { userId } = useParams<UserOverviewPathParams>();
  const loader = useLoader();
  const [user, setUser] = useState<User>();

  // refs:

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updating, setUpdating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedUser, setUpdatedUser] = useState<User>(dummyUser());

  useEffect(() => {
    loadUser();
  }, [userId]);

  useEffect(() => {
    if (user?.username) {
      setDashboardTitle('Nutzer: ' + user.username);
    } else {
      setDashboardTitle('Nutzer');
    }
  }, [user]);

  const loadUser = () => {
    if (!userId) return;

    loader.set(LoadingOption.LOADING);

    UserService.getUser(userId).then((response) => {
      if (response.success) {
        setUser(response.data.user);
        setUpdatedUser(response.data.user);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);

        if (response.error?.status === 404) {
          navigate(-1);
        }
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateUserInternal: (values: Partial<User>) => void = (values) => {
    if (!updatedUser) return;

    setUpdatedUser({
      ...updatedUser,
      ...values
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateUser: (values: Partial<User>) => void = (values) => {
    if (!user || !hasChanged(user, values)) return;

    setUpdating(true);
    setUpdatingValues(Object.keys(values));

    UserService.updateUser(user._id, values)
      .then((response) => {
        if (response.success) {
          setUser({ ...user, ...values });
          setUpdatedUser({ ...user, ...values });
        } else {
          setUpdatedUser(user);

          const error = response.error as APIError;

          if (error.hasFieldErrors) {
            const errorMessages: string[] = [];

            for (const key of Object.keys(error.fieldErrors)) {
              errorMessages.push(error.fieldErrors[key]);
            }

            toaster.sendToast('error', errorMessages);
          } else {
            toaster.sendToast(
              'error',
              error.errorMessage ||
                'Ein unbekannter Fehler ist beim Bearbeiten des Nutzers aufgetreten.'
            );
          }
        }
      })
      .finally(() => {
        setUpdating(false);
        setUpdatingValues([]);
      });
  };

  return <div></div>;
};

export default UserOverview;

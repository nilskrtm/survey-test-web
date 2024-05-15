import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';
import UserService from '../../data/services/user.service';
import { useAppSelector } from '../../store/hooks';
import { selectUserId } from '../../store/features/authentication.slice';
import { APIError } from '../../data/types/common.types';
import useToasts from '../../utils/hooks/use.toasts.hook';

type ChangePasswordModalProps = {
  //
};

export type ChangePasswordModalRefAttributes = {
  open: () => void;
};

const ChangePasswordModal: ForwardRefRenderFunction<
  ChangePasswordModalRefAttributes,
  ChangePasswordModalProps
> = (props, ref) => {
  const userId = useAppSelector(selectUserId);

  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [updating, setUpdating] = useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState<string>('');

  useImperativeHandle<ChangePasswordModalRefAttributes, ChangePasswordModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setPasswordValidation('');
          setPassword('');
          setConfirmPassword('');
          setVisible(true);
          setUpdating(false);
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !updating) {
      setVisible(false);
      setPassword('');
      setConfirmPassword('');
      setPasswordValidation('');
    }
  };

  const changePassword: () => void = () => {
    setUpdating(true);
    setPasswordValidation('');

    UserService.updateUser(userId, { password: password })
      .then((response) => {
        if (response.success) {
          toaster.sendToast('success', 'Das Passwort wurde erfolgreich geändert.');
          onClose();
        } else {
          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            toaster.sendToast('error', error.errorMessage || 'Fehler beim Ändern des Passwortes.');
          } else {
            if ('password' in error.fieldErrors) {
              setPasswordValidation(error.fieldErrors.password);
            }
          }
        }
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const passwordsMatch: () => boolean = () => {
    return password.localeCompare(confirmPassword) === 0;
  };

  return (
    <Modal closeable={!updating} onRequestClose={onClose} title="Passwort ändern" visible={visible}>
      <div className="flex flex-col items-start justify-center gap-2">
        <span className="text-base font-normal truncate whitespace-break-spaces">
          Eine Änderung Ihres Passwortes hat keinen Einfluss auf die Authentifizierung ihrer Geräte
          mit dem Server. Dafür ist der extra Zugangsschlüssel verantwortlich.
        </span>
        <div className="w-full flex flex-col">
          <label htmlFor="password" className="text-lg font-medium pb-2">
            Neues Passwort
          </label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            disabled={updating}
            placeholder="Neues Passwort"
            maxLength={40}
            value={password}
            onChange={(event) => {
              setPasswordValidation('');
              setPassword(event.target.value.trim());
            }}
            className="form-input w-full rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
          />
          {passwordValidation && (
            <span className="p-1 pt-2 text-sm text-red-500 font-medium">{passwordValidation}</span>
          )}
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="password" className="text-lg font-medium pb-2">
            Neues Passwort Bestätigen
          </label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            disabled={updating}
            placeholder="Neues Passwort Bestätigen"
            maxLength={40}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            className="form-input w-full rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
          />
          {!passwordsMatch() && (
            <span className="p-1 pt-2 text-sm text-red-500 font-medium">
              Die beiden Passwörter stimmen nicht überein.
            </span>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-2">
          <button
            className={`px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${updating ? 'loading-button' : ''}`}
            onClick={changePassword}
            disabled={updating || !passwordsMatch()}
            title="Passwort ändern">
            Bestätigen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<ChangePasswordModalRefAttributes, ChangePasswordModalProps>(
  ChangePasswordModal
);

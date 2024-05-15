import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';
import { useNavigate } from 'react-router-dom';
import { APIError } from '../../data/types/common.types';
import UserService from '../../data/services/user.service';
import { CreateUserValues } from '../../data/types/user.types';

type CreateUserModalProps = {
  //
};

export type CreateUserModalRefAttributes = {
  open: () => void;
};

const CreateUserModal: ForwardRefRenderFunction<
  CreateUserModalRefAttributes,
  CreateUserModalProps
> = (_props, ref) => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState<boolean>(false);
  const [userValues, setUserValues] = useState<CreateUserValues>({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: ''
  });
  const [creating, setCreating] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  useImperativeHandle<CreateUserModalRefAttributes, CreateUserModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setUserValues({ username: '', email: '', firstname: '', lastname: '', password: '' });
          setCreating(false);
          setFieldErrors({});
          setErrorMessage('');
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible) {
      setUserValues({ username: '', email: '', firstname: '', lastname: '', password: '' });
      setCreating(false);
      setFieldErrors({});
      setErrorMessage('');
      setVisible(false);
    }
  };

  const createUser = () => {
    setCreating(true);
    setFieldErrors({});
    setErrorMessage('');

    UserService.createUser(userValues)
      .then((response) => {
        if (response.success) {
          const userId = response.data.id;

          setCreating(false);
          setFieldErrors({});
          setErrorMessage('');
          setUserValues({ username: '', email: '', firstname: '', lastname: '', password: '' });
          setVisible(false);

          navigate('/users/' + userId);
        } else {
          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            setErrorMessage(
              error.errorMessage ||
                'Beim erstellen des Nutzers ist ein unbekannter Fehler aufgetreten.'
            );
          } else {
            const newFieldErrors: {
              username?: string;
              email?: string;
              firstname?: string;
              lastname?: string;
              password?: string;
            } = {};

            if ('username' in error.fieldErrors) {
              newFieldErrors.username = error.fieldErrors.username;
            }
            if ('email' in error.fieldErrors) {
              newFieldErrors.email = error.fieldErrors.email;
            }
            if ('firstname' in error.fieldErrors) {
              newFieldErrors.firstname = error.fieldErrors.firstname;
            }
            if ('lastname' in error.fieldErrors) {
              newFieldErrors.lastname = error.fieldErrors.lastname;
            }
            if ('password' in error.fieldErrors) {
              newFieldErrors.password = error.fieldErrors.password;
            }

            setFieldErrors(newFieldErrors);
          }
        }
      })
      .finally(() => {
        setCreating(false);
      });
  };

  return (
    <Modal
      className="w-full"
      closeable={!creating}
      onRequestClose={onClose}
      title="Nutzer erstellen"
      visible={visible}>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-col">
          <label
            htmlFor="userData-username"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            Nutzername
          </label>
          <input
            autoFocus={true}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            disabled={creating}
            id="userData-username"
            onChange={(event) => {
              setErrorMessage('');
              setUserValues((prev) => ({ ...prev, username: event.target.value }));
            }}
            placeholder="Nutzername"
            value={userValues.username}
          />
          {fieldErrors.username && (
            <span className="p-1 pt-2 text-sm text-red-500 font-medium">
              {fieldErrors.username}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col">
          <label
            htmlFor="userData-email"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            E-Mail Adresse
          </label>
          <input
            autoFocus={false}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            disabled={creating}
            id="userData-email"
            onChange={(event) => {
              setErrorMessage('');
              setUserValues((prev) => ({ ...prev, email: event.target.value }));
            }}
            placeholder="E-Mail Adresse"
            value={userValues.email}
          />
          {fieldErrors.email && (
            <span className="p-1 pt-2 text-sm text-red-500 font-medium">{fieldErrors.email}</span>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-evenly gap-4">
          <div className="w-full flex flex-col">
            <label
              htmlFor="userData-firstname"
              className="py-2 text-lg font-medium"
              onClick={(event) => event.preventDefault()}>
              Vorname
            </label>
            <input
              autoFocus={false}
              className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
              disabled={creating}
              id="userData-firstname"
              onChange={(event) => {
                setErrorMessage('');
                setUserValues((prev) => ({ ...prev, firstname: event.target.value }));
              }}
              placeholder="Vorname"
              value={userValues.firstname}
            />
            {fieldErrors.firstname && (
              <span className="p-1 pt-2 text-sm text-red-500 font-medium">
                {fieldErrors.firstname}
              </span>
            )}
          </div>
          <div className="w-full flex flex-col">
            <label
              htmlFor="userData-lastname"
              className="py-2 text-lg font-medium"
              onClick={(event) => event.preventDefault()}>
              Nachname
            </label>
            <input
              autoFocus={false}
              className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
              disabled={creating}
              id="userData-lastname"
              onChange={(event) => {
                setErrorMessage('');
                setUserValues((prev) => ({ ...prev, lastname: event.target.value }));
              }}
              placeholder="Nachname"
              value={userValues.lastname}
            />
            {fieldErrors.lastname && (
              <span className="p-1 pt-2 text-sm text-red-500 font-medium">
                {fieldErrors.lastname}
              </span>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col">
          <label
            htmlFor="userData-password"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            Passwort
          </label>
          <input
            autoFocus={false}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            disabled={creating}
            id="userData-password"
            onChange={(event) => {
              setErrorMessage('');
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
              setUserValues((prev) => ({ ...prev, password: event.target.value }));
            }}
            type="password"
            placeholder="Passwort"
            value={userValues.password}
          />
          {fieldErrors.password && (
            <span className="p-1 pt-2 text-sm text-red-500 font-medium">
              {fieldErrors.password}
            </span>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:loading-button"
            disabled={creating}
            onClick={createUser}
            title="Nutzer erstellen">
            Erstellen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<CreateUserModalRefAttributes, CreateUserModalProps>(CreateUserModal);

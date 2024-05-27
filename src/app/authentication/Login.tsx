import React, { FormEvent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { selectLoggedIn, setAuthenticationData } from '../../store/features/authentication.slice';
import { setUserData } from '../../store/features/user.slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AuthenticationInput from '../../components/authentication/AuthenticationInput';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import AuthenticationButton from '../../components/authentication/AuthenticationButton';
import AuthenticationService from '../../data/services/authentication.service';
import { parseTokenData } from '../../utils/authentication/authentication.util';
import { AuthResponseData } from '../../data/types/authentication.types';
import { APIError } from '../../data/types/common.types';

const Login: () => React.JSX.Element = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  const [loggingIn, setLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [generalValidation, setGeneralValidation] = useState('');
  const [usernameValidation, setUsernameValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');

  const login = (event: FormEvent) => {
    event.preventDefault();

    setLoggingIn(true);
    setGeneralValidation('');
    setUsernameValidation('');
    setPasswordValidation('');

    AuthenticationService.login(username, password)
      .then((response) => {
        if (response.success) {
          const { accessToken, refreshToken, user } = response.data as AuthResponseData;
          const { payload } = parseTokenData(accessToken);

          dispatch(
            setAuthenticationData({
              userId: payload.userId,
              accessToken: accessToken,
              refreshToken: refreshToken,
              permissionLevel: payload.permissionLevel
            })
          );
          dispatch(
            setUserData({
              username: user.username,
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname
            })
          );

          setGeneralValidation('');
          setUsernameValidation('');
          setPasswordValidation('');

          navigate('/');
        } else {
          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            setGeneralValidation(error.errorMessage || 'Ein unbekannter Fehler ist aufgetreten.');
          } else {
            if ('username' in error.fieldErrors) {
              setUsernameValidation(error.fieldErrors.username);
            }
            if ('password' in error.fieldErrors) {
              setPasswordValidation(error.fieldErrors.password);
            }
          }
        }
      })
      .finally(() => setLoggingIn(false));
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setGeneralValidation('');
    setUsernameValidation('');
    setPasswordValidation('');
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-80 md:w-96 p-8 rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            {import.meta.env.VITE_HTML_TITLE || 'env.VITE_HTML_TITLE missing'}
          </p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Anmeldung</span>
        </div>

        <form onSubmit={login} className="mt-6 lg:mt-10">
          <AuthenticationInput
            autoComplete="username"
            autoFocus={true}
            icon={faUser}
            label="Nutzername oder E-Mail"
            onChange={(e) => {
              setUsername((e.target as HTMLInputElement).value);
              setGeneralValidation('');
              setUsernameValidation('');
            }}
            placeholder="Nutzername oder E-Mail"
            type="text"
            validationMessage={usernameValidation}
            value={username}
          />
          <AuthenticationInput
            autoComplete="off"
            icon={faKey}
            label="Passwort"
            onChange={(e) => {
              setPassword((e.target as HTMLInputElement).value);
              setGeneralValidation('');
              setPasswordValidation('');
            }}
            placeholder="Passwort"
            type="password"
            validationMessage={passwordValidation}
            value={password}
          />
          {generalValidation && (
            <div className="w-full mt-2 text-left">
              <p className="text-sm text-red-500 font-medium">{generalValidation}</p>
            </div>
          )}
          <div className="w-full mt-4 py-2 flex flex-row">
            <AuthenticationButton
              type="submit"
              containerClassName="w-3/6 pr-1"
              className="w-full"
              disabled={loggingIn}
              loading={loggingIn}>
              Anmelden
            </AuthenticationButton>
            <AuthenticationButton
              type="reset"
              containerClassName="w-3/6 pl-1"
              className="w-full"
              disabled={loggingIn}
              onClick={clearForm}>
              Leeren
            </AuthenticationButton>
          </div>
          <div className="w-full mt-4 text-center">
            <NavLink to="/reset-password" className="w-full text-center">
              <p className="py-1 text-sm font-medium text-gray-600 cursor-pointer focus:underline decoration-gray-600">
                Passwort vergessen?
              </p>
            </NavLink>
          </div>
          <div className="w-full mt-2 text-center">
            <NavLink to="/imprint" className="w-full text-center">
              <p className="py-1 text-sm font-medium text-gray-600 cursor-pointer focus:underline decoration-gray-600">
                Impressum
              </p>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

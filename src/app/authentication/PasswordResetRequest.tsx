import React, { FormEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthenticationButton from '../../components/authentication/AuthenticationButton';
import AuthenticationInput from '../../components/authentication/AuthenticationInput';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AuthenticationService from '../../data/services/authentication.service';
import { APIError } from '../../data/types/common.types';
import { selectLoggedIn } from '../../store/features/authentication.slice';

const PasswordResetRequest: () => React.JSX.Element = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/settings');
    }
  }, []);

  const [resetting, setResetting] = useState(false);
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const [generalValidation, setGeneralValidation] = useState('');
  const [emailValidation, setEmailValidation] = useState('');

  const resetPassword = (event: FormEvent) => {
    event.preventDefault();

    setGeneralValidation('');
    setEmailValidation('');
    setResetting(true);

    AuthenticationService.requestPasswordReset(email)
      .then((response) => {
        if (response.success) {
          setGeneralValidation('');
          setEmailValidation('');
          setReset(true);
        } else {
          setReset(false);

          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            setGeneralValidation(error.errorMessage || 'Ein unbekannter Fehler ist aufgetreten.');
          } else {
            if ('email' in error.fieldErrors) {
              setEmailValidation(error.fieldErrors.email);
            }
          }
        }
      })
      .finally(() => {
        setResetting(false);
      });
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-80 md:w-96 p-8 flex-col rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            {import.meta.env.HTML_TITLE || 'env.HTML_TITLE missing'}
          </p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Passwort zurücksetzen</span>
        </div>

        {!reset ? (
          <>
            <div className="text-left mt-2">
              <p className="font-light">
                Geben Sie Ihre E-Mail Adresse an. Wenn ein Konto unter dieser existiert, wird Ihnen
                ihr neues Passwort per E-Mail zugeschickt.
              </p>
            </div>

            <form id="loginForm" onSubmit={(e) => resetPassword(e)} className="mt-2 lg:mt-4">
              <AuthenticationInput
                autoComplete="email"
                icon={faEnvelope}
                label="E-Mail Adresse"
                onChange={(e) => {
                  setEmail((e.target as HTMLInputElement).value);
                  setGeneralValidation('');
                  setEmailValidation('');
                }}
                placeholder="E-Mail Adresse"
                type="email"
                validationMessage={emailValidation}
                value={email}
              />
              {generalValidation ? (
                <div className="w-full mt-2 text-left">
                  <p className="text-sm text-red-500 font-medium">{generalValidation}</p>
                </div>
              ) : (
                <></>
              )}
              <div className="w-full mt-4 py-2 flex flex-col space-y-2">
                <AuthenticationButton
                  type="submit"
                  containerClassName="w-full"
                  className="w-full"
                  disabled={resetting}
                  loading={resetting}>
                  Passwort Zurücksetzen
                </AuthenticationButton>
                <AuthenticationButton
                  type="button"
                  containerClassName="w-full"
                  className="w-full"
                  disabled={resetting}
                  onClick={() => navigate('/login')}>
                  Zurück zum Login
                </AuthenticationButton>
              </div>
            </form>
          </>
        ) : (
          <div className="text-left mt-2 lg:mt-4">
            <p className="font-light">
              Wenn ein Konto unter der E-Mail Adresse <span className="font-semibold">{email}</span>{' '}
              existiert, wird Ihnen nun eine E-Mail zum Setzen eines neuen Passwortes zugesendet.
            </p>
          </div>
        )}

        <div className="w-full mt-2 text-center">
          <NavLink to="/imprint" className="w-full text-center">
            <p className="py-1 text-sm font-medium text-gray-600 cursor-pointer focus:underline decoration-gray-600">
              Impressum
            </p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;

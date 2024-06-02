import React, { FormEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import AuthenticationButton from '../../components/authentication/AuthenticationButton';
import AuthenticationInput from '../../components/authentication/AuthenticationInput';
import { faEnvelope, faExclamation } from '@fortawesome/free-solid-svg-icons';
import AuthenticationService from '../../data/services/authentication.service';
import { APIError } from '../../data/types/common.types';
import { selectLoggedIn } from '../../store/features/authentication.slice';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useToasts from '../../utils/hooks/use.toasts.hook';

interface PasswordResetPathParams extends Record<string, string> {
  passwordRequestId: string;
}

const PasswordReset: () => React.JSX.Element = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const navigate = useNavigate();
  const toaster = useToasts();

  const { passwordRequestId } = useParams<PasswordResetPathParams>();

  const [validated, setValidated] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordValidation, setPasswordValidation] = useState<string>('');
  const [generalValidation, setGeneralValidation] = useState('');

  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/settings');
    }
  }, []);

  useEffect(() => {
    validateRequestPassword();
  }, [passwordRequestId]);

  const validateRequestPassword = () => {
    setValidated(false);
    setValidationError('');

    if (!passwordRequestId) {
      return navigate('/');
    }

    AuthenticationService.validatePasswordReset(passwordRequestId).then((response) => {
      if (response.success) {
        setValidated(true);
      } else {
        setValidationError(response.error?.errorMessage || 'Der Passwort-Link ist fehlerhaft.');
      }
    });
  };

  const submitPassword = (event: FormEvent) => {
    event.preventDefault();

    if (!passwordRequestId) return;

    setGeneralValidation('');
    setPasswordValidation('');
    setResetting(true);

    AuthenticationService.resetPassword(passwordRequestId, password)
      .then((response) => {
        if (response.success) {
          setGeneralValidation('');
          setPasswordValidation('');
          setSubmitted(true);

          toaster.sendToast('success', 'Ihr Passwort wurde erfolgreich geändert.');
          navigate('/login');
        } else {
          setSubmitted(false);

          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            setGeneralValidation(error.errorMessage || 'Ein unbekannter Fehler ist aufgetreten.');
          } else {
            if ('password' in error.fieldErrors) {
              setPasswordValidation(error.fieldErrors.password);
            }
          }
        }
      })
      .finally(() => {
        setResetting(false);
      });
  };

  const passwordsMatch: () => boolean = () => {
    return password.localeCompare(confirmPassword) === 0;
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

        {!validated || validationError ? (
          <div className="w-full flex flex-col items-center justify-center space-y-6 py-4 mt-4 lg:mt-6">
            {!validationError ? (
              <>
                <BounceLoader color="rgb(126 34 206)" size={70} />
                <p className="text-base font-medium text-gray-700">
                  Überprüfung des Passwort-Links
                </p>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
                <p className="text-base font-normal text-gray-700">{validationError}</p>
              </>
            )}
          </div>
        ) : (
          <>
            {!submitted ? (
              <>
                <div className="text-left mt-2">
                  <p className="font-light">Geben Sie ein neues Passwort ein.</p>
                </div>

                <form
                  id="resetPasswordForm"
                  onSubmit={(e) => submitPassword(e)}
                  className="mt-2 lg:mt-4">
                  <AuthenticationInput
                    autoComplete="new-password"
                    icon={faEnvelope}
                    label="Neues Passwort"
                    onChange={(e) => {
                      setPassword((e.target as HTMLInputElement).value.trim());
                      setGeneralValidation('');
                      setPasswordValidation('');
                    }}
                    placeholder="Neues Passwort"
                    type="password"
                    validationMessage={passwordValidation}
                    value={password}
                  />
                  <AuthenticationInput
                    autoComplete="new-password"
                    icon={faEnvelope}
                    label="Neues Passwort bestätigen"
                    onChange={(e) => {
                      setConfirmPassword((e.target as HTMLInputElement).value.trim());
                      setGeneralValidation('');
                    }}
                    placeholder="Neues Passwort bestätigen"
                    type="password"
                    validationMessage={
                      passwordsMatch() ? undefined : 'Die beiden Passwörter stimmen nicht überein.'
                    }
                    value={confirmPassword}
                  />
                  {generalValidation ? (
                    <div className="w-full mt-2 text-left">
                      <p className="text-sm text-red-500 font-medium">{generalValidation}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="w-full mt-4 py-2 flex flex-col">
                    <AuthenticationButton
                      type="submit"
                      containerClassName="w-full"
                      className="w-full"
                      disabled={resetting || !passwordsMatch()}
                      loading={resetting}>
                      Passwort Zurücksetzen
                    </AuthenticationButton>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-left mt-2 lg:mt-4">
                <p className="font-light">Ihr Passwort wurde erfolgreich geändert.</p>
              </div>
            )}
          </>
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

export default PasswordReset;

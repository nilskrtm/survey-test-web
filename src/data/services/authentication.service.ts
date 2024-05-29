import API, { defaultClient } from '../api';
import {
  AuthRequestData,
  AuthResponseData,
  PasswordResetRequestData,
  PasswordResetSubmitData,
  PasswordResetValidateData
} from '../types/authentication.types';
import { AxiosResponse } from 'axios';
import { APIResponse } from '../types/common.types';
import { globalNavigate } from '../../components/navigation/GlobalNavigationProvider';

const login: (
  username: string,
  password: string
) => Promise<APIResponse<AuthResponseData | undefined>> = (username, password) => {
  return new Promise((resolve) => {
    defaultClient
      .post<AuthResponseData, AxiosResponse<AuthResponseData>, AuthRequestData>('/auth', {
        username: username,
        password: password
      })
      .then((response) => {
        resolve(API.createSuccessResponse(response));
      })
      .catch((error) => {
        resolve(API.createErrorResponse(error));
      });
  });
};

const logout = () => {
  globalNavigate('/logout');
};

const requestPasswordReset: (email: string) => Promise<APIResponse<undefined>> = (email) => {
  return new Promise((resolve) => {
    defaultClient
      .post<undefined, AxiosResponse<undefined>, PasswordResetRequestData>('/auth/password-reset', {
        email: email
      })
      .then((response) => {
        resolve(API.createSuccessResponse(response));
      })
      .catch((error) => {
        resolve(API.createErrorResponse(error));
      });
  });
};

const validatePasswordReset: (passwordRequestId: string) => Promise<APIResponse<undefined>> = (
  passwordRequestId
) => {
  return new Promise((resolve) => {
    defaultClient
      .post<undefined, AxiosResponse<undefined>, PasswordResetValidateData>(
        '/auth/password-reset/validate',
        {
          passwordRequestId: passwordRequestId
        }
      )
      .then((response) => {
        resolve(API.createSuccessResponse(response));
      })
      .catch((error) => {
        resolve(API.createErrorResponse(error));
      });
  });
};

const resetPassword: (
  passwordRequestId: string,
  newPassword: string
) => Promise<APIResponse<undefined>> = (passwordRequestId, newPassword) => {
  return new Promise((resolve) => {
    defaultClient
      .post<undefined, AxiosResponse<undefined>, PasswordResetSubmitData>(
        '/auth/password-reset/submit',
        {
          passwordRequestId: passwordRequestId,
          password: newPassword
        }
      )
      .then((response) => {
        resolve(API.createSuccessResponse(response));
      })
      .catch((error) => {
        resolve(API.createErrorResponse(error));
      });
  });
};

export default { login, logout, requestPasswordReset, validatePasswordReset, resetPassword };

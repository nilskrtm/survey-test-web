import API, { defaultClient } from '../api';
import {
  AuthRequestData,
  AuthResponseData,
  PasswordResetRequestData
} from '../types/authentication.types';
import { AxiosResponse } from 'axios';
import { APIResponse } from '../types/common.types';
import { globalNavigate } from '../../components/navigation/GlobalNavigationProvider';

const login: (
  username: string,
  password: string
) => Promise<APIResponse<AuthResponseData | undefined>> = (username, password) => {
  return new Promise((resolve) => {
    const encodedPassword: string = btoa(password);

    defaultClient
      .post<AuthResponseData, AxiosResponse<AuthResponseData>, AuthRequestData>('/auth', {
        username: username,
        password: encodedPassword
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

const resetPassword: (email: string) => Promise<APIResponse<AuthResponseData | undefined>> = (
  email
) => {
  return new Promise((resolve) => {
    defaultClient
      .post<undefined, AxiosResponse<undefined>, PasswordResetRequestData>('/auth/reset-password', {
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

export default { login, logout, resetPassword };

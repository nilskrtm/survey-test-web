import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { parseTokenData } from '../utils/authentication/authentication.util';
import { store } from '../store/store';
import { clearTokens, setUserData } from '../store/features/user.slice';
import { APIError, APIResponse } from './types/common.types';
import { globalNavigate } from '../components/navigation/GlobalNavigationProvider';

const baseUrl: string = process.env.REACT_APP_API_ENDPOINT || 'http://127.0.0.1:5000';
const timeout: number = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');

export const defaultClient: AxiosInstance = axios.create({
  timeout: timeout,
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

class API {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: timeout,
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const accessToken: string = this.getAccessToken();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            const response = await defaultClient.post('/auth/refresh-token', {
              refreshToken: refreshToken
            });
            const { accessToken } = response.data;
            const payload = parseTokenData(response.data.accessToken).payload;

            store.dispatch(
              setUserData({
                userId: payload.userId,
                username: payload.username,
                email: payload.email,
                firstname: payload.firstname,
                lastname: payload.lastname,
                accessToken: accessToken,
                refreshToken: refreshToken,
                permissionLevel: payload.permissionLevel
              })
            );

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return this.client(originalRequest);
          } catch (error) {
            store.dispatch(clearTokens({}));
            globalNavigate('/');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public createSuccessResponse<T>(axiosResponse: AxiosResponse<T>) {
    const apiResponse: APIResponse<T> = {
      success: true,
      status: axiosResponse.status,
      data: axiosResponse.data
    };

    return apiResponse;
  }

  public createErrorResponse(error: unknown) {
    const apiError: APIError = {
      status: undefined,
      errorMessage: 'Ein unbekannter Fehler ist aufgetreten.',
      hasFieldErrors: false,
      fieldErrors: {}
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<unknown>;

      if (axiosError.response?.status) {
        apiError.status = axiosError.response.status;

        if (axiosError.response.status === 400) {
          if (axiosError.response?.data) {
            const errors = (
              error as AxiosError<
                | {
                    errors: { [field: string]: { msg: string } } | Array<string>;
                  }
                | undefined
              >
            ).response?.data?.errors;

            if (error) {
              if (typeof errors === 'object' && !Array.isArray(errors)) {
                for (const field in errors as {
                  [field: string]: { msg: string };
                }) {
                  const error = (errors as { [field: string]: { msg: string } })[field];

                  apiError.fieldErrors[field] = error.msg;

                  if (!apiError.hasFieldErrors) {
                    apiError.hasFieldErrors = true;
                  }
                }
              } else if (Array.isArray(errors)) {
                apiError.errorMessage = (errors as Array<string>)[0];
              }
            }
          }
        }
      }
    }

    const apiResponse: APIResponse<undefined> = {
      success: false,
      status: apiError.status || -1,
      data: undefined,
      error: apiError
    };

    return apiResponse;
  }

  private getAccessToken(): string {
    return store.getState().user.accessToken;
  }

  private getRefreshToken(): string {
    return store.getState().user.refreshToken;
  }

  public request<T>(config: AxiosRequestConfig): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .request<T, AxiosResponse<T>>(config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .get<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public options<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .options<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .delete<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public head<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .head<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public post<T, B>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .post<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public put<T, B>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .put<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }

  public patch<T, B>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T | undefined>> {
    return new Promise((resolve) => {
      this.client
        .patch<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse(error));
        });
    });
  }
}

const api = new API();

export default api;

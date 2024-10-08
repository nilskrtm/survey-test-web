import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { parseTokenData } from '../utils/authentication/authentication.util';
import { store } from '../store/store';
import { resetUserData, setUserData } from '../store/features/user.slice';
import { clearTokens, setAuthenticationData } from '../store/features/authentication.slice';
import { APIError, APIResponse } from './types/common.types';
import { globalNavigate } from '../components/navigation/GlobalNavigationProvider';

const baseUrl: string = import.meta.env.API_ENDPOINT || 'http://127.0.0.1:5000';
const timeout: number = import.meta.env.API_TIMEOUT || 5000;

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
            const { accessToken, user } = response.data;
            const payload = parseTokenData(response.data.accessToken).payload;

            store.dispatch(
              setAuthenticationData({
                userId: payload.userId,
                accessToken: accessToken,
                refreshToken: refreshToken,
                permissionLevel: payload.permissionLevel
              })
            );
            store.dispatch(
              setUserData({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
              })
            );

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return this.client(originalRequest);
          } catch (error) {
            store.dispatch(clearTokens({}));
            store.dispatch(resetUserData({}));
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

  public createErrorResponse<T>(error: unknown) {
    const apiError: APIError = {
      status: undefined,
      errorMessage: undefined,
      hasFieldErrors: false,
      fieldErrors: {}
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<unknown, any>;

      if (axiosError.response?.status) {
        apiError.status = axiosError.response.status;

        if (axiosError.response.status === 400) {
          if (axiosError.response?.data) {
            const errors = (
              error as AxiosError<
                | {
                    errors:
                      | { [field: string]: { msg: string } }
                      | Array<string>
                      | { error: string };
                  }
                | undefined
              >
            ).response?.data?.errors;

            if (error) {
              if (typeof errors === 'object' && !Array.isArray(errors)) {
                for (const field in errors as {
                  [field: string]: { msg: string };
                }) {
                  const fieldError = (errors as { [field: string]: { msg: string } })[field];

                  apiError.fieldErrors[field] = fieldError.msg;

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

    const apiResponse: APIResponse<T> = {
      success: false,
      status: apiError.status || -1,
      data: undefined as unknown as T,
      error: apiError
    };

    return apiResponse;
  }

  private getAccessToken(): string {
    return store.getState().authentication.accessToken;
  }

  private getRefreshToken(): string {
    return store.getState().authentication.refreshToken;
  }

  public request<T>(config: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .request<T, AxiosResponse<T>>(config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .get<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public options<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .options<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .delete<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public head<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .head<T, AxiosResponse<T>>(url, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public post<T, B>(url: string, data?: B, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .post<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public put<T, B>(url: string, data?: B, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .put<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }

  public patch<T, B>(url: string, data?: B, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      this.client
        .patch<T, AxiosResponse<T>, B>(url, data, config)
        .then((response) => {
          resolve(this.createSuccessResponse<T>(response));
        })
        .catch((error) => {
          resolve(this.createErrorResponse<T>(error));
        });
    });
  }
}

const api = new API();

export default api;

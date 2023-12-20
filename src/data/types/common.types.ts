type APIResponse<T> = {
  success: boolean;
  status: number;
  data?: T;
  error?: APIError;
};

type APIError = {
  status?: number;
  errorMessage: string;
  hasFieldErrors: boolean;
  fieldErrors: { [field: string]: string };
};

type Paging = {
  perPage: number;
  page: number;
  lastPage: number;
  count: number;
};

export type { APIResponse, APIError, Paging };

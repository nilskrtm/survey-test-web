type AuthRequestData = {
  username: string;
  password: string;
};

type AuthResponseData = {
  accessToken: string;
  refreshToken: string;
};

type PasswordResetRequestData = {
  email: string;
};

export type { AuthRequestData, AuthResponseData, PasswordResetRequestData };

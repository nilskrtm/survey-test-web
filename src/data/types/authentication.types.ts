import { User } from './user.types';

type AuthRequestData = {
  username: string;
  password: string;
};

type AuthResponseData = {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
};

type PasswordResetRequestData = {
  email: string;
};

export type { AuthRequestData, AuthResponseData, PasswordResetRequestData };

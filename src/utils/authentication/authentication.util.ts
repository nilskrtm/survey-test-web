import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import { UserState } from '../../store/features/user.slice';
import { AuthenticationState } from '../../store/features/authentication.slice';

export const parseTokenData = (token: string) => {
  const decodedHeader: JwtHeader = jwtDecode<JwtHeader>(token, { header: true });
  const decodedPayload: JwtPayload & AuthenticationState & UserState = jwtDecode<
    JwtPayload & AuthenticationState & UserState
  >(token);

  return {
    header: decodedHeader,
    payload: decodedPayload
  };
};

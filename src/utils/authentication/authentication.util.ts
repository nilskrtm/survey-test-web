import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import { AuthenticationState } from '../../store/features/authentication.slice';

export const parseTokenData = (token: string) => {
  const decodedHeader: JwtHeader = jwtDecode<JwtHeader>(token, { header: true });
  const decodedPayload: JwtPayload & AuthenticationState = jwtDecode<
    JwtPayload & AuthenticationState
  >(token);

  return {
    header: decodedHeader,
    payload: decodedPayload
  };
};

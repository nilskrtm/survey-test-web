import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import { AuthenticationState } from '../../store/features/authentication.slice';

type TokenData = {
  header: JwtHeader;
  payload: JwtPayload & AuthenticationState;
};

export const parseTokenData: (token: string) => TokenData = (token) => {
  const decodedHeader: JwtHeader = jwtDecode<JwtHeader>(token, { header: true });
  const decodedPayload: JwtPayload & AuthenticationState = jwtDecode<
    JwtPayload & AuthenticationState
  >(token);

  return {
    header: decodedHeader,
    payload: decodedPayload
  };
};

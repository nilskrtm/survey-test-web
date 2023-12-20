import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import { UserState } from '../../store/features/user.slice';

export const parseTokenData = (token: string) => {
  const decodedHeader: JwtHeader = jwtDecode<JwtHeader>(token, { header: true });
  const decodedPayload: JwtPayload & UserState = jwtDecode<JwtPayload & UserState>(token);

  return {
    header: decodedHeader,
    payload: decodedPayload
  };
};

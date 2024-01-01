import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AuthenticationState {
  userId: string;
  accessToken: string;
  refreshToken: string;
  permissionLevel: number;
}

const initialState: AuthenticationState = {
  userId: '',
  accessToken: '',
  refreshToken: '',
  permissionLevel: 0
};

export const authenticationSlice: Slice<AuthenticationState> = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    resetAuthenticationData: (state) => {
      state.userId = initialState.userId;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.permissionLevel = initialState.permissionLevel;
    },
    clearTokens: (state) => {
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
    },
    setAuthenticationData: (state, action: PayloadAction<AuthenticationState>) => {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.permissionLevel = action.payload.permissionLevel;
    },
    setPermissionLevel: (state, action: PayloadAction<AuthenticationState>) => {
      state.permissionLevel = action.payload.permissionLevel;
    }
  }
});

export const { resetAuthenticationData, clearTokens, setAuthenticationData, setPermissionLevel } =
  authenticationSlice.actions;

export const selectLoggedIn = (state: RootState) =>
  !!state.authentication.accessToken && !!state.authentication.refreshToken;
export const selectAccessToken = (state: RootState) => state.authentication.accessToken;
export const selectPermissionLevel = (state: RootState) => state.authentication.permissionLevel;

export default authenticationSlice.reducer;

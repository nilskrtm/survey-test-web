import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserState {
  userId: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  accessToken: string;
  refreshToken: string;
  permissionLevel: number;
}

const initialState: UserState = {
  userId: '',
  username: '',
  email: '',
  firstname: '',
  lastname: '',
  accessToken: '',
  refreshToken: '',
  permissionLevel: 0
};

export const userSlice: Slice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    resetUserData: (state) => {
      state.userId = initialState.userId;
      state.username = initialState.username;
      state.email = initialState.email;
      state.firstname = initialState.firstname;
      state.lastname = initialState.lastname;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.permissionLevel = initialState.permissionLevel;
    },
    clearTokens: (state) => {
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
    },
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.permissionLevel = action.payload.permissionLevel;
    }
  }
});

export const { resetUserData, clearTokens, setUserData } = userSlice.actions;

export const selectLoggedIn = (state: RootState) =>
  !!state.user.accessToken && !!state.user.refreshToken;
export const selectUsername = (state: RootState) => state.user.username;
export const selectEmail = (state: RootState) => state.user.email;
export const selectPermissionLevel = (state: RootState) => state.user.permissionLevel;

export default userSlice.reducer;

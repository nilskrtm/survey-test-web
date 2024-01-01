import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserState {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

const initialState: UserState = {
  username: '',
  email: '',
  firstname: '',
  lastname: ''
};

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    resetUserData: (state) => {
      state.username = initialState.username;
      state.email = initialState.email;
      state.firstname = initialState.firstname;
      state.lastname = initialState.lastname;
    },
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
    }
  }
});

export const { resetUserData, setUserData } = userSlice.actions;

export const selectUsername = (state: RootState) => state.user.username;
export const selectEmail = (state: RootState) => state.user.email;
export const selectFullName = (state: RootState) =>
  state.user.firstname + ' ' + state.user.lastname;

export default userSlice.reducer;

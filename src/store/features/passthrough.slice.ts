import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface PassthroughState {
  dashboardTitle: string;
}

const initialState: PassthroughState = {
  dashboardTitle: ''
};

export const passthroughSlice: Slice<PassthroughState> = createSlice({
  name: 'passthrough',
  initialState: initialState,
  reducers: {
    setDashboardTitle: (state, action: PayloadAction<PassthroughState>) => {
      state.dashboardTitle = action.payload.dashboardTitle;
    }
  }
});

export const { setDashboardTitle } = passthroughSlice.actions;

export const selectDashboardTitle = (state: RootState) => state.passthrough.dashboardTitle;

export default passthroughSlice.reducer;

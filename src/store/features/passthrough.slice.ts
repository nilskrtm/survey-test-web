import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Toast } from '../../components/layout/toasts/ToastProvider';

export interface PassthroughState {
  dashboardTitle: string;
  toasts: Toast[];
}

const initialState: PassthroughState = {
  dashboardTitle: '',
  toasts: []
};

export const passthroughSlice: Slice<PassthroughState> = createSlice({
  name: 'passthrough',
  initialState: initialState,
  reducers: {
    // no reset needed, state is not persisted
    setDashboardTitle: (state, action: PayloadAction<PassthroughState>) => {
      state.dashboardTitle = action.payload.dashboardTitle;
    },
    addToast: (state, action: PayloadAction<{ toast: Toast }>) => {
      state.toasts.push(action.payload.toast);
    },
    removeToast: (state, action: PayloadAction<{ id: string }>) => {
      const toast = state.toasts.find((toast) => toast.id === action.payload.id);

      if (toast) {
        const index = state.toasts.indexOf(toast);

        state.toasts.splice(index, 1);
      }
    }
  }
});

export const { setDashboardTitle, addToast, removeToast } = passthroughSlice.actions;

export const selectDashboardTitle = (state: RootState) => state.passthrough.dashboardTitle;

export const selectToasts = (state: RootState) => state.passthrough.toasts;

export default passthroughSlice.reducer;

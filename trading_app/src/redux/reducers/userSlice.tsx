import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  user: {
    name?: string;
    userId?: string;
    email?: string;
    login_pin_exist?: string;
    phone_exist?: string;
    balance?: number;
  };
}

const initialState: UserState = {
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;

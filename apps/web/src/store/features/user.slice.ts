import { userApi } from '@/store/services/user.service'
import type { UserInitialState } from '@/types/redux'
import { createSlice } from '@reduxjs/toolkit'

const initialState: UserInitialState = {
  user: null,
  token: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    s: () => {},
  },
  extraReducers: (build) => {
    build.addMatcher(
      userApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
      }
    );
    build.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        if (payload?.role) {
          state.role = payload?.role ?? null;
          localStorage.setItem('role', payload?.role);
        }
      }
    );
  },
});

export const { s } = userSlice.actions;
export { userSlice };

import { createSlice } from '@reduxjs/toolkit';
import { User } from 'src/types/user';

interface AuthState {
  login: {
    result: User | null;
    loading: boolean;
    error: boolean;
  },
  logout: {
    loading: boolean;
    error: boolean;
  }
}

const initialState: AuthState = {
  login: {
    result: null,
    loading: false,
    error: false
  },
  logout: {
    loading: false,
    error: false
  }
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.loading = true;
    },
    loginSuccess: (state, action) => {
      state.login.loading = false;
      state.login.result = action.payload;
      state.login.error = false
    },
    loginFailed: (state, action) => {
      state.login.loading = false;
      state.login.result = action.payload;
      state.login.error = true;
    },
    logOutStart: (state) => {
      state.logout.loading = true;
    },
    logOutSuccess: (state) => {
      state.logout.loading = false;
      state.login.result = null;
      state.logout.error = false
    },
    logOutFailed: (state) => {
      state.logout.loading = false;
      state.logout.error = true;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed
} = authSlice.actions;

export default authSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { User } from 'src/shared/types/user';

interface AuthState {
    login: {
        result: User | null;
        loading: boolean;
        error: boolean;
    },
    logout: {
        loading: boolean;
        error: boolean;
    },
    register: {
        result: User | null;
        loading: boolean;
        error: boolean;
    },
    me: {
        result: User | null;
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
    },
    register: {
        result: null,
        loading: false,
        error: false
    },
    me: {
        result: null,
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
        },
        registerStart: (state) => {
            state.register.loading = true;
        },
        registerSuccess: (state, action) => {
            state.register.loading = false;
            state.register.result = action.payload;
            state.register.error = false
        },
        registerFailed: (state, action) => {
            state.register.loading = false;
            state.register.result = action.payload;
            state.register.error = true;
        },
        meStart: (state) => {
            state.me.loading = true;
        },
        meSuccess: (state, action) => {
            state.me.loading = false;
            state.me.result = action.payload;
            state.me.error = false
        },
        meFailed: (state, action) => {
            state.me.loading = false;
            state.me.result = action.payload;
            state.me.error = true;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    meStart,
    meSuccess,
    meFailed
} = authSlice.actions;

export default authSlice.reducer;
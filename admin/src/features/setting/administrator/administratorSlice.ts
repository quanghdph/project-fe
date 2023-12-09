import { createSlice } from '@reduxjs/toolkit';
import { User } from 'src/types/user';

interface AdministratorState {
    list: {
        result: {
            administrators: Array<User>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    delete: {
        result: User | null;
        loading: boolean;
        error: boolean;
    },
    update: {
        result: User | null;
        loading: boolean;
        error: boolean;
    },
    single: {
        result: User | null;
        loading: boolean;
        error: boolean;
    },
    create: {
        result: User | null,
        loading: boolean,
        error: boolean
    },
}

const initialState: AdministratorState = {
    create: {
        result: null,
        loading: false,
        error: false
    },
    list: {
        result: null,
        loading: false,
        error: false
    },
    delete: {
        result: null,
        loading: false,
        error: false
    },
    update: {
        result: null,
        loading: false,
        error: false
    },
    single: {
        result: null,
        loading: false,
        error: false
    }
} as AdministratorState;

export const administratorSlice = createSlice({
    name: 'administrator',
    initialState,
    reducers: {
        // ** Get administrators
        getListAdministratorStart: (state) => {
            state.list.loading = true;
        },
        getListAdministratorSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListAdministratorFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete administrator
        deleteAdministratorStart: (state) => {
            state.delete.loading = true;
        },
        deleteAdministratorSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteAdministratorFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get administrator
        getAdministratorStart: (state) => {
            state.single.loading = true;
        },
        getAdministratorSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getAdministratorFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create administrator
        createAdministratorStart: (state) => {
            state.create.loading = true;
        },
        createAdministratorSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createAdministratorFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update administrator
        updateAdministratorStart: (state) => {
            state.update.loading = true;
        },
        updateAdministratorSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateAdministratorFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListAdministratorStart,
    getListAdministratorSuccess,
    getListAdministratorFailed,
    deleteAdministratorStart,
    deleteAdministratorSuccess,
    deleteAdministratorFailed,
    getAdministratorStart,
    getAdministratorSuccess,
    getAdministratorFailed,
    createAdministratorStart,
    createAdministratorSuccess,
    createAdministratorFailed,
    updateAdministratorStart,
    updateAdministratorSuccess,
    updateAdministratorFailed
} = administratorSlice.actions;

export default administratorSlice.reducer;
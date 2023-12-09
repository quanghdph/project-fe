import { createSlice } from '@reduxjs/toolkit';
import { User } from 'src/types/user';

interface CustomerState {
    list: {
        result: {
            customers: Array<User>
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

const initialState: CustomerState = {
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
} as CustomerState;

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        // ** Get customers
        getListCustomerStart: (state) => {
            state.list.loading = true;
        },
        getListCustomerSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListCustomerFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete customer
        deleteCustomerStart: (state) => {
            state.delete.loading = true;
        },
        deleteCustomerSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteCustomerFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get customer
        getCustomerStart: (state) => {
            state.single.loading = true;
        },
        getCustomerSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getCustomerFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create customer
        createCustomerStart: (state) => {
            state.create.loading = true;
        },
        createCustomerSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createCustomerFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update customer
        updateCustomerStart: (state) => {
            state.update.loading = true;
        },
        updateCustomerSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateCustomerFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListCustomerStart,
    getListCustomerSuccess,
    getListCustomerFailed,
    deleteCustomerStart,
    deleteCustomerSuccess,
    deleteCustomerFailed,
    getCustomerStart,
    getCustomerSuccess,
    getCustomerFailed,
    createCustomerStart,
    createCustomerSuccess,
    createCustomerFailed,
    updateCustomerStart,
    updateCustomerSuccess,
    updateCustomerFailed
} = customerSlice.actions;

export default customerSlice.reducer;
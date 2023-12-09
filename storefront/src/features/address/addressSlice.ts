import { createSlice } from '@reduxjs/toolkit';
import { UserAddress } from 'src/shared/types';

interface AddressState {
    delete: {
        result: UserAddress | null;
        loading: boolean;
        error: boolean;
    },
    create: {
        result: UserAddress | null,
        loading: boolean,
        error: boolean
    },
    update: {
        result: UserAddress | null,
        loading: boolean,
        error: boolean
    },
    single: {
        result: UserAddress | null;
        loading: boolean;
        error: boolean;
    },
    setDefaultShipping: {
        result: UserAddress | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: AddressState = {
    delete: {
        result: null,
        loading: false,
        error: false
    },
    create: {
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
    },
    setDefaultShipping: {
        result: null,
        loading: false,
        error: false
    }
} as AddressState;

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        // ** Delete address
        deleteAddressStart: (state) => {
            state.delete.loading = true;
        },
        deleteAddressSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteAddressFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Create address
        createAddressStart: (state) => {
            state.create.loading = true;
        },
        createAddressSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createAddressFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update address
        updateAddressStart: (state) => {
            state.update.loading = true;
        },
        updateAddressSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateAddressFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
        // ** Get address
        getAddressStart: (state) => {
            state.single.loading = true;
        },
        getAddressSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getAddressFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Set default shipping address
        setDefaultShippingAddressStart: (state) => {
            state.setDefaultShipping.loading = true;
        },
        setDefaultShippingSuccess: (state, action) => {
            state.setDefaultShipping.loading = false;
            state.setDefaultShipping.result = action.payload;
            state.setDefaultShipping.error = false
        },
        setDefaultShippingFailed: (state, action) => {
            state.setDefaultShipping.loading = false;
            state.setDefaultShipping.result = action.payload;
            state.setDefaultShipping.error = true;
        },
    }
});

export const {
    deleteAddressStart,
    deleteAddressSuccess,
    deleteAddressFailed,
    createAddressStart,
    createAddressSuccess,
    createAddressFailed,
    updateAddressStart,
    updateAddressSuccess,
    updateAddressFailed,
    getAddressStart,
    getAddressSuccess,
    getAddressFailed,
    setDefaultShippingAddressStart,
    setDefaultShippingSuccess,
    setDefaultShippingFailed
} = addressSlice.actions;

export default addressSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    create: {
        result: null,
        loading: false,
        error: false
    },
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // ** Get checkout
        getCreateCheckoutStart: (state) => {
            state.create.loading = true;
        },
        getCreateCheckoutSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        getCreateCheckoutFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
       
    },
});

export const {
    getCreateCheckoutStart,
    getCreateCheckoutSuccess,
    getCreateCheckoutFailed,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
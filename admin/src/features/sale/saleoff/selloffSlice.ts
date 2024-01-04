import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    create: {
        result: null,
        loading: false,
        error: false
    },
    caculate: {
        result: null,
        loading: false,
        error: false
    }
};

export const selloffSlice = createSlice({
    name: 'selloff',
    initialState,
    reducers: {
        // ** Create selloff
        createSelloffStart: (state) => {
            state.create.loading = true;
        },
        createSelloffSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createSelloffFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
          // ** Caculate selloff
        caculateSelloffStart: (state) => {
            state.caculate.loading = true;
        },
        caculateSelloffSuccess: (state, action) => {
            state.caculate.loading = false;
            state.caculate.result = action.payload;
            state.caculate.error = false
        },
        caculateSelloffFailed: (state, action) => {
            state.caculate.loading = false;
            state.caculate.result = action.payload;
            state.caculate.error = true;
        },
       
    },
});

export const {
    createSelloffStart,
    createSelloffSuccess,
    createSelloffFailed,
    caculateSelloffStart,
    caculateSelloffSuccess,
    caculateSelloffFailed
} = selloffSlice.actions;

export default selloffSlice.reducer;
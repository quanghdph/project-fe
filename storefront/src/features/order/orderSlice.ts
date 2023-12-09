import { createSlice } from '@reduxjs/toolkit';
import { Order } from 'src/shared/types';

interface OrderState {
    list: {
        result: {
            orders: Array<Order>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    cancel: {
        result: Order | null,
        loading: boolean,
        error: boolean
    },
    refund: {
        result: Order | null,
        loading: boolean,
        error: boolean
    },
}

const initialState: OrderState = {
    list: {
        result: null,
        loading: false,
        error: false
    },
    cancel: {
        result: null,
        loading: false,
        error: false
    },
    refund: {
        result: null,
        loading: false,
        error: false
    },
} as OrderState;

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // Get list order
        getListOrderStart: (state) => {
            state.list.loading = true;
        },
        getListOrderSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListOrderFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Refund order
        refundOrderStart: (state) => {
            state.refund.loading = true;
        },
        refundOrderSuccess: (state, action) => {
            state.refund.loading = false;
            state.refund.result = action.payload;
            state.refund.error = false
        },
        refundOrderFailed: (state, action) => {
            state.refund.loading = false;
            state.refund.result = action.payload;
            state.refund.error = true;
        },
        // ** Cancel order
        cancelOrderStart: (state) => {
            state.cancel.loading = true;
        },
        cancelOrderSuccess: (state, action) => {
            state.cancel.loading = false;
            state.cancel.result = action.payload;
            state.cancel.error = false
        },
        cancelOrderFailed: (state, action) => {
            state.cancel.loading = false;
            state.cancel.result = action.payload;
            state.cancel.error = true;
        },
    },
});

export const {
    getListOrderStart,
    getListOrderSuccess,
    getListOrderFailed,
    cancelOrderStart,
    cancelOrderSuccess,
    cancelOrderFailed,
    refundOrderStart,
    refundOrderSuccess,
    refundOrderFailed
} = orderSlice.actions;

export default orderSlice.reducer;
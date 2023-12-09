import { createSlice } from '@reduxjs/toolkit';
import { Order } from 'src/types';

interface OrderState {
    delete: {
        result: Order | null;
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
    confirm: {
        result: Order | null,
        loading: boolean,
        error: boolean
    },
    shipped: {
        result: Order | null,
        loading: boolean,
        error: boolean
    },
    completed: {
        result: Order | null,
        loading: boolean,
        error: boolean
    },
    single: {
        result: Order | null;
        loading: boolean;
        error: boolean;
    },
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
}

const initialState: OrderState = {
    delete: {
        result: null,
        loading: false,
        error: false
    },
    cancel: {
        result: null,
        loading: false,
        error: false
    },
    confirm: {
        result: null,
        loading: false,
        error: false
    },
    shipped: {
        result: null,
        loading: false,
        error: false
    },
    completed: {
        result: null,
        loading: false,
        error: false
    },
    single: {
        result: null,
        loading: false,
        error: false
    },
    list: {
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
        // ** Delete order
        deleteOrderStart: (state) => {
            state.delete.loading = true;
        },
        deleteOrderSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteOrderFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
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
        // ** Get order
        getOrderStart: (state) => {
            state.single.loading = true;
        },
        getOrderSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getOrderFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Get list order
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
        // ** Confirm order
        confirmOrderStart: (state) => {
            state.confirm.loading = true;
        },
        confirmOrderSuccess: (state, action) => {
            state.confirm.loading = false;
            state.confirm.result = action.payload;
            state.confirm.error = false
        },
        confirmOrderFailed: (state, action) => {
            state.confirm.loading = false;
            state.confirm.result = action.payload;
            state.confirm.error = true;
        },
        // ** Shipped order
        shippedOrderStart: (state) => {
            state.shipped.loading = true;
        },
        shippedOrderSuccess: (state, action) => {
            state.shipped.loading = false;
            state.shipped.result = action.payload;
            state.shipped.error = false
        },
        shippedOrderFailed: (state, action) => {
            state.shipped.loading = false;
            state.shipped.result = action.payload;
            state.shipped.error = true;
        },
        // ** Completed order
        completedOrderStart: (state) => {
            state.completed.loading = true;
        },
        completedOrderSuccess: (state, action) => {
            state.completed.loading = false;
            state.completed.result = action.payload;
            state.completed.error = false
        },
        completedOrderFailed: (state, action) => {
            state.completed.loading = false;
            state.completed.result = action.payload;
            state.completed.error = true;
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
    }
});

export const {
    deleteOrderStart,
    deleteOrderSuccess,
    deleteOrderFailed,
    getOrderStart,
    getOrderSuccess,
    getOrderFailed,
    getListOrderStart,
    getListOrderSuccess,
    getListOrderFailed,
    cancelOrderStart,
    cancelOrderSuccess,
    cancelOrderFailed,
    confirmOrderStart,
    confirmOrderSuccess,
    confirmOrderFailed,
    shippedOrderStart,
    shippedOrderSuccess,
    shippedOrderFailed,
    completedOrderStart,
    completedOrderSuccess,
    completedOrderFailed,
    refundOrderStart,
    refundOrderSuccess,
    refundOrderFailed
} = orderSlice.actions;

export default orderSlice.reducer;
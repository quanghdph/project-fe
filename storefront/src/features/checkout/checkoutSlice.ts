import { createSlice } from '@reduxjs/toolkit';
import { Order, Promotion } from 'src/shared/types';

interface CheckoutState {
    promotion: {
        result: Promotion | null;
        loading: boolean;
        error: boolean;
    },
    createOrder: {
        result: Order | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: CheckoutState = {
    promotion: {
        result: null,
        loading: false,
        error: false
    },
    createOrder: {
        result: null,
        loading: false,
        error: false
    }
} as CheckoutState;

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // Check promotion
        checkPromotionStart: (state) => {
            state.promotion.loading = true;
        },
        checkPromotionSuccess: (state, action) => {
            state.promotion.loading = false;
            state.promotion.result = action.payload;
            state.promotion.error = false
        },
        checkPromotionFailed: (state, action) => {
            state.promotion.loading = false;
            state.promotion.result = action.payload;
            state.promotion.error = true;
        },
        // Rest promotion
        resetPromotion: (state) => {
            state.promotion.loading = false;
            state.promotion.result = null;
            state.promotion.error = false;
        },
        // Create order
        createOrderStart: (state) => {
            state.createOrder.loading = true;
        },
        createOrderSuccess: (state, action) => {
            state.createOrder.loading = false;
            state.createOrder.result = action.payload;
            state.createOrder.error = false
        },
        createOrderFailed: (state, action) => {
            state.createOrder.loading = false;
            state.createOrder.result = action.payload;
            state.createOrder.error = true;
        },
    },
});

export const {
    checkPromotionStart,
    checkPromotionSuccess,
    checkPromotionFailed,
    resetPromotion,
    createOrderStart,
    createOrderSuccess,
    createOrderFailed
} = checkoutSlice.actions;

export default checkoutSlice.reducer;